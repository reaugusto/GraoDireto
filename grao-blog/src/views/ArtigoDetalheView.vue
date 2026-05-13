<template>
  <div class="container" v-if ="artigo">
  <div class="artigocont">
    <div class="topo">
    <h1>{{ artigo.title }}</h1>
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
    <p>Publicado por {{ artigo.author_name }} • {{ formatarData(artigo.published_at) }}</p>
    <div class="conteudo" v-html="artigo.content"></div>
    <form @submit.prevent="Comentar">
        <textarea name="comentario" id="comentario" placeholder="Escrever um comentario" v-model="cometario.content" required></textarea>
        <button type="submit">Comentar</button>
    </form>
    </div>
  </div>
  <div v-else>Artigo não encontrado.</div>
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import http from '@/services/http.js';
import { useAuthStore } from "@/stores/auth.js"

const route = useRoute();
const auth = useAuthStore();
const artigo = ref(null);
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
});

async function Comentar(){
        cometario.user_id = JSON.parse(localStorage.getItem('user')).id
        cometario.post_id = artigo.value.id
        console.log(cometario);
        try{
            const {data} = await http.post('/comentarios/criar', cometario);
            console.log(data)

            
            await router.push({ name: 'artigos' });
        }catch(error) {
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
</script>

<style scoped>
.topo{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    padding: 5% 0px 0px 0px;
    gap: 10px;
}

.topo h2{
    font-size: 2em;
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap; /* Para quebrar linha se houver muitas tags */
    gap: 8px;       /* Espaço entre as tags */
}
.tag-item-artigo{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    height: 25px;
    padding: 5px 25px ;
    color: var(--text-muted);
    font-weight: 500;
    font-size: .8em;
}
.artigocont{
    width: 60%;
}

.artigocont p{
    color: #758269;
}
.conteudo{
    padding: 2% 10% 3% 0;
}
.container{
    width: 100%;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
}

textarea{
    height: 130px;
    width: 90%;
    background-color: var(--bg-dark);
    border: 0 ;
    border-radius: 12px;
    font-size: 1.2em;
    padding: 20px;

}

button{
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
</style>