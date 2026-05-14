<template>
    <div class="container" v-if="artigo">
        <router-link :to="{ name: 'artigos' }" class="voltar"><svg xmlns="http://www.w3.org/2000/svg" width="512"
                height="512" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32"
                    d="m112 160l-64 64l64 64" />
                <path fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32"
                    d="M64 224h400v128" />
            </svg> Voltar</router-link>
        <div class="artigocont">
            <div class="topo">
                <h1>{{ artigo.title }}</h1>
                <div class="tags-wrapper">
                    <span v-for="tag in formatarTags(artigo.tags)" :key="tag" class="tag-item-artigo">
                        {{ tag }}
                    </span>

                </div>
            </div>
            <p>Publicado por {{ artigo.author_name }} • {{ formatarData(artigo.published_at) }}</p>
            <div class="conteudo" v-html="artigo.content"></div>
            <form @submit.prevent="Comentar">
                <textarea name="comentario" id="comentario" placeholder="Escrever um comentario"
                    v-model="cometario.content" required></textarea>
                <button type="submit">Comentar</button>
            </form>
        </div>

        <article v-for="comentario in comentarios" :key="comentario.id" class="artigo-item">
            <img :src="`../src/assets/img/${comentario.user_name}.png`" alt="">
            <div class="contArtigo">
                <h4>
                    {{ comentario.user_name }} <span class="data"
                        v-html="calcularDiferencaDias(comentario.created_at) + 'd'"></span>
                </h4>
                <p>{{ comentario.content }}</p>
            </div>
            <div class="icone" v-if="user.name == comentario.user_name" @click="DeletarComentarios(comentario.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                    <path fill="currentColor"
                        d="M11.5 6h5a2.5 2.5 0 0 0-5 0M10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5zM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565zM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75m5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0z" />
                </svg>
            </div>
        </article>

    </div>
    <div v-else>Artigo não encontrado.</div>
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import http from '@/services/http.js';

const route = useRoute();
const artigo = ref(null);
const comentarios = ref(null);
const user = JSON.parse(localStorage.getItem('user'));
const cometario = reactive({
    post_id: '',
    user_id: '',
    content: ''
})

onMounted(async () => {
    try {
        // Ele sempre busca pelo ID da URL, não importa de onde o usuário veio
        const { data } = await http.get(`/artigos/${route.params.id}`);
        artigo.value = data;
    } catch (e) {
        console.error("Erro ao carregar");
    } finally {

    }
    ListarComentarios();
});

async function Comentar() {
    cometario.user_id = user.id
    cometario.post_id = artigo.value.id
    console.log(cometario);
    try {
        const { data } = await http.post('/comentarios/criar', cometario);
        console.log(data)
        ListarComentarios();

    } catch (error) {
        const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
        console.log(error?.response?.data);
        alert(mensagemErro);
    }
}

async function ListarComentarios() {
    try {
        const { data } = await http.get(`/artigos/${route.params.id}/comentarios`);
        console.log(data);
        comentarios.value = data;

    } catch (error) {
        const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
        console.log(error?.response?.data);
        alert(mensagemErro);
    }
}

async function DeletarComentarios(id) {
    console.log(id)
    try {
        const { data } = await http.delete(`/comentarios/deletar/${id}`);
        console.log(data);
        ListarComentarios();

    } catch (error) {
        const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
        console.log(error?.response?.data);
        alert(mensagemErro);
    }
}

const formatarData = (dataString) => {
    if (!dataString) return "";

    const data = new Date(dataString);

    // Opção 1: Formato simples dd/mm/aaaa
    // return data.toLocaleDateString('pt-BR'); 

    // Opção 2: Formato mais elegante para Blog (ex: 13 de mai. de 2026)
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

function formatarTags(tagsString) {
    if (!tagsString) return [];
    // Divide pela vírgula e limpa os espaços de cada palavra
    return tagsString.split(',').map(tag => tag.trim());
}

function calcularDiferencaDias(dateISO) {
    const dataRecebida = new Date(dateISO);
    const dataHoje = new Date(); // Captura 2026-05-13 conforme o sistema
    console.log(dataRecebida)
    console.log(dataHoje)
    // Resetamos as horas para comparar apenas os dias do calendário
    dataRecebida.setHours(0, 0, 0, 0);
    dataHoje.setHours(0, 0, 0, 0);

    // Diferença em milissegundos
    const diffEmMs = dataHoje.getTime() - dataRecebida.getTime();

    // Conversão: ms -> segundos -> minutos -> horas -> dias
    const diffEmDias = diffEmMs / (1000 * 60 * 60 * 24);
    return Math.floor(diffEmDias);
}

</script>

<style scoped>
.topo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    padding: 5% 0px 0px 0px;
    gap: 10px;
}

.topo h2 {
    font-size: 2em;
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    /* Para quebrar linha se houver muitas tags */
    gap: 8px;
    /* Espaço entre as tags */
}

.tag-item-artigo {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    height: 25px;
    padding: 5px 25px;
    color: var(--text-muted);
    font-weight: 500;
    font-size: .8em;
}

.artigocont {
    width: 100%;
}

.artigocont p {
    color: #758269;
}

.conteudo {
    padding: 2% 10% 3% 0;
}

.container {
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 0 20%;
    margin-bottom: 5%;
}

textarea {
    height: 130px;
    width: 90%;
    background-color: var(--bg-dark);
    border: 0;
    border-radius: 12px;
    font-size: 1.2em;
    padding: 20px;

}

button {
    background-color: var(--accent-color);
    border: none;
    border-radius: 8px;
    height: 42px;
    margin-top: 20px;
    padding: 5px 25px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-bt);
}

.artigo-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 85%;
    margin-left: 2%;
    margin-top: 5%;
}

.artigo-item img {
    height: 50px;
    width: 50px;
    margin-right: 15px;
    border-radius: 50px;
}

.contArtigo {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 0;
    margin: 20px 0 0 0;
    width: 100%;
}

.contArtigo h4,
p {
    margin: 0;
}

.contArtigo h4 {
    font-size: 1em;
}

.contArtigo p {
    font-size: .8em;
}

.icone svg {
    fill: #758269;
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.voltar {
    width: 100%;
    margin-left: 0;
    margin-top: 15px;
    text-decoration: none;
    color: #758269;
    align-items: center;
    font-size: 1.2em;
}

.voltar svg {
    height: 24px;
    width: 24px;
    fill: #758269;
}

.data {
    color: #758269;
    font-size: 1em;
    font-weight: 400;
    padding-left: 5px;
}

@media only screen and (max-width: 768px) {
    .container {
        gap: 0;
        padding: 0 5%;
        margin-bottom: 5%;
    }

    .topo {
        flex-wrap: wrap;
        margin-bottom: 15px;
    }
}
</style>