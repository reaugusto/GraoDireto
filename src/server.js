import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { pool } from "./db.js";
import pkg from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const { json } = pkg;

//Midd
app.use(cors());
app.use(express.json());


//Criar artigos
app.post('/artigos/criar', async (req, res) => {
    const connection = await pool.getConnection();
try {
        await connection.beginTransaction();

        const {author_id, title, content, slug, tags} = req.body;
        const [result] = await connection.query(
            "INSERT INTO posts (author_id, title, content, slug) VALUES (?,?,?,?)",
            [author_id, title, content, slug]
        );


        const newPostId = result.insertId;
        // 2. Processar nomes de Tags para obter IDs
        const tagIds = [];
        
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                // Insere a tag se não existir (ignora se for duplicada)
                await connection.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tagName]);
                tagIds.push(rows[0].id);
                // Busca o ID (seja ele recém-criado ou já existente)
                const [rows] = await connection.query('SELECT id FROM tags WHERE name = ?', [tagName]);
                tagIds.push(rows[0].id);
            }
        }
        // 3. Vincular o novo Post às Tags na tabela pivô
        if (tagIds.length > 0) {
            const tagValues = tagIds.map(tagId => [newPostId, tagId]);
            await db.query('INSERT INTO post_tags (post_id, tag_id) VALUES ?', [tagValues]);
        }

        await connection.commit();

        res.status(201).json({id: author_id, title, content, slug, tags});
    }catch (e) {
        console.error(e);
        await connection.rollback();
        res.status(500).json({erro: "Falha ao criar usuário"});
    }finally {
        connection.release();
    }    
});

//Listar artigos
app.get('/artigos', async (req, res) => {
try {
        const [rows] = await pool.query(
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


app.listen(PORT, () =>{
    console.log(`Servidor MySQL rodando em http://localhost:${PORT}`);
});