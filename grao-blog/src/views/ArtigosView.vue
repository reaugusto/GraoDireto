<template>
    <div id="container">
        <div class="topo">
            <h2>Todos os artigo</h2>
            <button class="criar">Criar Artigo</button>
        </div>
        <div class="listTag">
            <button v-for="tag in tags" :key="tag.id" class="tag-item">{{ tag.name }}</button>
            <input type="text" class="pesquisar" placeholder="Perquisar">
        </div>
        <article v-for="artigo in artigos" :key="artigo.id" class="artigo-item">
            <img :src="`../src/assets/img/${artigo.author_name}.png`" alt="">
            <div class="contArtigo">
                <h4 @click="$router.push({ name: 'artigo-detalhe', params: { id: artigo.id } })" style="cursor: pointer;">
                    {{ artigo.title }}
                </h4>
                <p>{{ artigo.content }}</p>
                <div class="tags-wrapper">
                <span 
                    v-for="tag in formatarTags(artigo.tags)" 
                    :key="tag" 
                    class="tag-item-artigo"
                >
                {{ tag }}
                </span>
            </div>
            </div>
<div class="icone" v-if="user.name == artigo.author_name">
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path fill="#758269" d="M5 21h14c1.1 0 2-.9 2-2v-7h-2v7H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2" />
		<path fill="#758269" d="M7 13v3c0 .55.45 1 1 1h3c.27 0 .52-.11.71-.29l9-9a.996.996 0 0 0 0-1.41l-3-3a.996.996 0 0 0-1.41 0l-9.01 8.99A1 1 0 0 0 7 13m10-7.59L18.59 7L17.5 8.09L15.91 6.5zm-8 8l5.5-5.5l1.59 1.59l-5.5 5.5H9z" />
	</svg>
</div>
        </article>
    </div>

</template>

<script setup>
import http from '@/services/http.js'
import { onMounted, ref } from 'vue';

const tags = ref([]);
const artigos = ref([]);
const user = JSON.parse(localStorage.getItem('user'));

    async function ListarTags(){
        try{
            const {data} = await http.get('/tags');

            tags.value = data;
            console.log(tags.value);

        }catch(error) {
            const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
            console.log(error?.response?.data);
            alert(mensagemErro);
        }
    };

   async function ListarArtigos(){
        try{
            const {data} = await http.get('/artigos');
            
            artigos.value = data;
            console.log(artigos.value);

        }catch(error) {
            const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
            console.log(error?.response?.data);
            alert(mensagemErro);
        }
    };
    function formatarTags(tagsString) {
    if (!tagsString) return [];
    // Divide pela vírgula e limpa os espaços de cada palavra
    return tagsString.split(',').map(tag => tag.trim());
}

        onMounted(()=>{
            ListarArtigos();
            ListarTags();
            console.log('App criado');
        });
</script>

<style scoped>
#container{
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0;
    padding: 0 25%;
}

.tag-item{
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    padding: 8px 15px;
    color: var(--text-muted);
    font-weight: 400;
    text-decoration: none;
    cursor: pointer;
}

.topo{
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 25px 30px;
    justify-content: space-between;
}

.topo h2{
    font-size: 2em;
}

.criar{
    background-color: var(--accent-color);
    border: none;
    border-radius: 8px;
    height: 42px;
    padding: 5px 25px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-bt);
}

.listTag{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap; /* Para quebrar linha se houver muitas tags */
    gap: 8px;       /* Espaço entre as tags */
    margin-top: 10px;
}

.pesquisar{
    width: 100%;
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    height: 60px;
    padding-left: 20px;
}
.artigo-item{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
}

.artigo-item img{
    height: 70px;
    width: 70px;
    margin-right: 15px;
    border-radius: 15px;
}


.contArtigo{
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 0;
    margin: 20px 0 0 0;
    width: 100%;
}

.contArtigo h4, p{
    margin: 0;
}
.contArtigo h4{
    font-size: 1em;
}
.contArtigo p{
    font-size: .8em;
    white-space: nowrap;        /* Impede quebra de linha */
  overflow: hidden;           /* Oculta o texto que ultrapassa */
  text-overflow: ellipsis;    /* Adiciona "..." no final */
  width: 500px;
}
.icone svg{
    fill: #758269;
    width: 24px;
    height: 24px;
}
.tag-item-artigo{
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    padding: 5px 15px;
    color: var(--text-muted);
    font-weight: 400;
    font-size: .6em;
}

</style>