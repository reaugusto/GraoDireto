<template>
    <div class="container">
        <div class="topo" v-if="route.params.id == 0">
            <h2 @click="ListarArtigos()">Novo artigo</h2>
            <button class="criar" @click="Criar()">Criar Artigo</button>
        </div>
        <div class="topo" v-if="route.params.id != 0">
            <h2 @click="ListarArtigos()">Editar artigo</h2>
            <button class="criar" @click="Atualziar()">Salvar</button>
        </div>
        <form>
            <label for="titulo">Titulo do artigo*</label>
            <input type="tags" placeholder="Título do Artigo" name="titulo" v-model="dados.title" required>
            <label for="senha">Tags*</label>
            <input type="text" placeholder="Digite a tag e pressione Enter" name="tags"
                @keydown.enter="dados.tags.push(tag) && (tag = '')" v-model="tag" required>
            <div class="tags-wrapper">
                <span v-for="tag in dados.tags" :key="tag" class="tag-item-artigo">
                    {{ tag }}   

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" @click="dados.tags = dados.tags.filter(t => t !== tag)" style="cursor: pointer;">
                        <path fill="currentColor"
                            d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" />
                    </svg>

                </span>
            </div>
            <label for="conteudo">Conteúdo</label>
            <textarea name="conteudo" id="conteudo" placeholder="Escrever o conteúdo do arquivo" v-model="dados.content"
                required></textarea>
        </form>
    </div>

</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import http from '@/services/http.js';

const route = useRoute();
const router = useRouter();
const user = JSON.parse(localStorage.getItem('user'));

const tag = ref();
const dados = reactive({
    author_id: '',
    title: '',
    content: '',
    slug: '',
    tags: []
})

onMounted(async () => {
    if (route.params.id != 0) {
        try {
            // Ele sempre busca pelo ID da URL, não importa de onde o usuário veio
            const { data } = await http.get(`/artigos/${route.params.id}`);
            console.log(data.title);
            dados.title = data.title;
            dados.content = data.content;
            dados.slug = data.slug;
            dados.tags = data.tags.split(',');
            console.log(dados);
        } catch (e) {
            console.error("Erro ao carregar");
        } finally {

        }
    } else {
        artigo.value = [];
    }
});

async function Criar() {
    dados.slug = gerarSlug(dados.title);
    dados.author_id = user.id;
    console.log(dados);

    try {
        const { data } = await http.post('/artigos/criar', dados);
        console.log(data)

        alert("Post Criado com Sucesso");
        await router.push({ name: 'artigos' });

    } catch (error) {
        const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
        console.log(error?.response?.data);
        alert(mensagemErro);
    }
}

async function Atualziar() {
    dados.slug = gerarSlug(dados.title);
    dados.author_id = user.id;
    console.log(dados);

    try {
        const { data } = await http.put(`/artigos/atualizar/${route.params.id}`, dados);
        console.log(data)

        alert("Post Criado com Sucesso");
        await router.push({ name: 'artigos' });

    } catch (error) {
        const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
        console.log(error?.response?.data);
        alert(mensagemErro);
    }
}



function gerarSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
</script>

<style scoped>
.container {
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0;
    padding: 0 25%;
}

.topo {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 25px 30px;
    justify-content: space-between;
}

.topo h2 {
    font-size: 2em;
}

.criar {
    background-color: var(--accent-color);
    border: none;
    border-radius: 8px;
    height: 42px;
    padding: 5px 25px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-bt);
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    /* Para quebrar linha se houver muitas tags */
    gap: 8px;
    /* Espaço entre as tags */
    margin-top: 10px;
}

.tag-item-artigo {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    height: 25px;
    padding: 5px 10px;
    color: var(--text-muted);
    font-weight: 500;
    font-size: .8em;
    gap: 10px
}

form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    margin: 10px 10%;
}

input {
    height: 4.2em;
    width: auto;
    border: none;
    padding-left: 15px;
    border-radius: var(--border-radius);
    background-color: var(--bg-dark);
    color: #73964F;
}

label {
    font-size: 1.2em;
    color: var(--text-muted);
    font-weight: 600;
    padding-left: 10px;
}

textarea {
    height: 130px;
    background-color: var(--bg-dark);
    border: 0;
    border-radius: 12px;
    font-size: 1.2em;
    padding: 20px;

}
</style>