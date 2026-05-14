import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { pool } from "./db.js";
import pkg from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const { json } = pkg;

//Midd
app.use(cors());
app.use(express.json());

const JWT_SECRET = SECRET_KEY ; // Lembre-se de usar a mesma no seu middleware

//Rota de Login
app.post('/login', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        // Inicia a transação 
        await connection.beginTransaction();

        const { email, password } = req.body;

        // 1. Busca o usuário pelo e-mail
        const [rows] = await connection.query(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            [email]
        );

        // Verifica se o usuário existe
        if (rows.length === 0) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        const user = rows[0];

        // 2. Comparação de senha em texto puro
        if (password !== user.password) {
            return res.status(401).json({ erro: "Senha incorreta" });
        }

        // 3. Geração do Token JWT para o Pinia
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        await connection.commit();

        // Retorna os dados para o front-end alimentar o Store
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (e) {
        console.error(e);
        await connection.rollback();
        res.status(500).json({ erro: "Falha ao realizar login" });
    } finally {
        //Libera a conexão de volta para o pool
        connection.release();
    }
});

// Rota para o auth.checkToken() do front-end
// No seu arquivo de rotas do Node.js
app.get('/login/verify', async (req, res) => { // Mudamos de /auth/check-token para /login/verify
    const connection = await pool.getConnection();
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ valid: false });

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Opcional: buscar no banco para confirmar se o usuário ainda existe
        const [rows] = await connection.query("SELECT id FROM users WHERE id = ?", [decoded.id]);
        
        if (rows.length > 0) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false });
        }
    } catch (e) {
        res.status(401).json({ valid: false });
    } finally {
        connection.release();
    }
});

//Criar artigos
app.post('/artigos/criar', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { author_id, title, content, slug, tags } = req.body;
        
        // 1. Inserir o Post
        const [result] = await connection.query(
            "INSERT INTO posts (author_id, title, content, slug) VALUES (?,?,?,?)",
            [author_id, title, content, slug]
        );

        const newPostId = result.insertId;
        const tagIds = [];
        
        // 2. Processar Tags
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                // Insere se não existir
                await connection.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tagName]);
                
                // Busca o ID (CORRIGIDO: primeiro busca, depois dá o push)
                const [rows] = await connection.query('SELECT id FROM tags WHERE name = ?', [tagName]);
                
                if (rows.length > 0) {
                    tagIds.push(rows[0].id);
                }
            }
        }

        // 3. Vincular na tabela pivô (CORRIGIDO: usar connection e não db)
        if (tagIds.length > 0) {
            const tagValues = tagIds.map(tagId => [newPostId, tagId]);
            await connection.query('INSERT INTO post_tags (post_id, tag_id) VALUES ?', [tagValues]);
        }

        await connection.commit();
        res.status(201).json({ id: newPostId, author_id, title, content, slug, tags });

    } catch (e) {
        console.error("Erro na API:", e);
        await connection.rollback();
        res.status(500).json({ erro: "Falha ao criar Post" });
    } finally {
        connection.release();
    }    
});

//Listar artigos
app.get('/artigos', async (req, res) => {
    const connection = await pool.getConnection();
try {
        await connection.beginTransaction();
        const [rows] = await connection.query(
            `
            SELECT 
                p.id, 
                p.title, 
                p.content,
                p.slug, 
                u.name AS author_name, 
                GROUP_CONCAT(t.name SEPARATOR ', ') AS tags,
                p.published_at
            FROM posts p
            JOIN users u ON p.author_id = u.id
            LEFT JOIN post_tags pt ON p.id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            GROUP BY p.id
            ORDER BY p.published_at DESC
        `,
        );
        res.json(rows);
    }catch (e) {
        res.status(500).json({erro: "Falha ao listar usuário"});
    }finally {
        connection.release();
    }
    });

    //Lista artigo por tag
    app.get('/artigos/tag/:tagId', async (req, res) => {
    const { tagId } = req.params;
    const connection = await pool.getConnection();

    try {
        // Query otimizada: 
        // 1. Filtra posts que possuem a tag específica via subquery.
        // 2. Faz o JOIN para trazer os dados completos do autor e todas as tags do post.
        const query = `
            SELECT 
                p.id, 
                p.title, 
                p.content, 
                p.slug, 
                u.name AS author_name, 
                GROUP_CONCAT(t.name SEPARATOR ', ') AS tags,
                p.published_at
            FROM posts p
            JOIN users u ON p.author_id = u.id
            LEFT JOIN post_tags pt ON p.id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE p.id IN (
                SELECT post_id 
                FROM post_tags 
                WHERE tag_id = ?
            )
            GROUP BY p.id
            ORDER BY p.published_at DESC;
        `;

        const [rows] = await connection.query(query, [tagId]);

        // Formatação para que o campo tags retorne como um array no JSON
        const formattedPosts = rows.map(post => ({
            ...post,
            tags: post.tags ? post.tags.split(', ') : []
        }));

        res.status(200).json(formattedPosts);

    } catch (error) {
        console.error("Erro ao buscar por ID da tag:", error);
        res.status(500).json({ erro: "Falha ao processar a busca por categoria." });
    } finally {
        connection.release();
    }
});

//Lista artigo por busca
app.get('/artigos/busca', async (req, res) => {
    const { q } = req.query; // Exemplo: /artigos/busca?q=tecnologia
    const connection = await pool.getConnection();

    try {
        const searchTerm = `%${q}%`;
        const query = `
            SELECT 
                p.id, p.title, p.content, p.slug, 
                u.name AS author_name, 
                GROUP_CONCAT(t.name SEPARATOR ', ') AS tags,
                p.published_at
            FROM posts p
            JOIN users u ON p.author_id = u.id
            LEFT JOIN post_tags pt ON p.id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE p.title LIKE ? OR p.content LIKE ?
            GROUP BY p.id
            ORDER BY p.published_at DESC;
        `;

        const [rows] = await connection.query(query, [searchTerm, searchTerm]);

        const formattedPosts = rows.map(post => ({
            ...post,
            tags: post.tags ? post.tags.split(', ') : []
        }));

        res.status(200).json(formattedPosts);
    } catch (e) {
        res.status(500).json({ erro: "Erro ao realizar busca" });
    } finally {
        connection.release();
    }
});

    //buscar um único artigo
app.get('/artigos/:id', async (req, res) => {
    const connection = await pool.getConnection();
    const { id } = req.params;

    try {
        const [rows] = await connection.query(`
            SELECT 
                p.id, 
                p.title, 
                p.content,
                p.slug, 
                u.name AS author_name, 
                GROUP_CONCAT(t.name SEPARATOR ', ') AS tags,
                p.published_at
            FROM posts p
            JOIN users u ON p.author_id = u.id
            LEFT JOIN post_tags pt ON p.id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ erro: "Artigo não encontrado" });
        }

        // Retorna apenas o primeiro objeto, já que o ID é único
        res.status(200).json(rows[0]);

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Falha ao buscar o artigo" });
    } finally {
        connection.release();
    }
});


//Atualizar artigos
app.put('/artigos/atualizar/:id', async (req, res) => {
    const connection = await pool.getConnection();
try {
        await connection.beginTransaction();
        const { id } = req.params
        const { title, content, slug, tags} = req.body;

        const [result] = await connection.query(
            "UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content), slug = COALESCE(?, slug) WHERE id = ?;",
            [title || null, content || null, slug || null, id]    
        );

    
        const tagIds = [];

        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagName of tags) {
                // Insere a tag se não existir (ignora se for duplicada)
                await connection.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tagName]);
                
                const [rows] = await connection.query('SELECT id FROM tags WHERE name = ?', [tagName]);
                if (rows.length > 0) tagIds.push(rows[0].id);
            }
        }

        // 3. Sincronização da tabela pivô (Delete & Insert)
        await connection.query('DELETE FROM post_tags WHERE post_id = ?', [id]);

        if (tagIds.length > 0) {
            const tagValues = tagIds.map(tagId => [id, tagId]);
            await connection.query('INSERT INTO post_tags (post_id, tag_id) VALUES ?', [tagValues]);
        }

        await connection.commit();
        res.status(201).json({
            mensagem: "Atualizado com sucesso",
            dados: { id, title, content, slug, tags }
        });
    }catch (e) {
        await connection.rollback();
        res.status(500).json({erro: "Falha ao criar usuário"});
    }finally {
        connection.release();
    }    
});

//Criar comentarios
app.post('/comentarios/criar', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { post_id, user_id, content } = req.body;

        const [result] = await connection.query(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [post_id, user_id, content]
        );

        res.status(201).json({
            message: "Comentário enviado!",
            id: result.insertId
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao publicar comentário" });
    } finally {
        connection.release();
    }
});

//Listar Comentários
app.get('/artigos/:id/comentarios', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        const query = `
            SELECT 
                c.id, 
                c.content, 
                c.created_at, 
                u.name AS user_name 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await connection.query(query, [id]);
        res.status(200).json(rows);
    } catch (e) {
        res.status(500).json({ erro: "Erro ao buscar comentários" });
    } finally {
        connection.release();
    }
});

app.delete('/comentarios/deletar/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();

    try {
        // Verifica se o comentário existe antes de tentar deletar (opcional, mas recomendado para logs)
        const [verificacao] = await connection.query("SELECT id FROM comments WHERE id = ?", [id]);
        
        if (verificacao.length === 0) {
            return res.status(404).json({ erro: "Comentário não encontrado." });
        }

        // Executa a remoção
        await connection.query("DELETE FROM comments WHERE id = ?", [id]);

        res.status(200).json({ 
            mensagem: "Comentário removido com sucesso!",
            id_removido: id 
        });

    } catch (e) {
        console.error("Erro ao deletar comentário:", e);
        res.status(500).json({ erro: "Falha interna ao tentar remover o comentário." });
    } finally {
        // Liberta a conexão de volta para o pool para manter a performance da API
        connection.release();
    }
});

// Rota para listar todas as tags
app.get('/tags', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        // 1. Executa a query de busca
        const [rows] = await connection.query(
            "SELECT id, name FROM tags ORDER BY name ASC"
        );

        // 2. Retorna a lista de tags para o front-end
        res.status(200).json(rows);

    } catch (e) {
        console.error("Erro ao buscar tags:", e);
        res.status(500).json({ erro: "Falha ao buscar tags" });
    } finally {
        // 3. Libera a conexão de volta para o pool
        connection.release();
    }
});

app.listen(PORT, () =>{
    console.log(`Servidor MySQL rodando em http://localhost:${PORT}`);
});