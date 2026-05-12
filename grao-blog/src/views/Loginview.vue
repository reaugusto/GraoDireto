<template>
<div id="container">
    
<h1>Bem vindo de Volta</h1>
<form @submit.prevent="Login">
    <label for="email">Email</label>
    <input type="text" placeholder="Email" name="email" v-model="user.email">
    <label for="senha">Senha</label>
    <input type="password" placeholder="Senha" name="senha" v-model="user.password">
    <button type="submit" class="button">Entrar</button>
</form>
</div>
</template>

<script setup>
    import http from '@/services/http.js'
    import { reactive } from 'vue';
    import { useAuthStore } from "@/stores/auth.js"
    import { useRouter } from 'vue-router';

    const auth = useAuthStore();
    const router = useRouter()
    const user = reactive({
        email: 'fred@graodireto.com.br',
        password: '123alterar'
    })

   async function Login(){
        try{
            const {data} = await http.post('/login', user);
            console.log(data)
            auth.setUserData(data);
            await router.push({ name: 'artigos' });
        }catch(error) {
            const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor";
            console.log(error?.response?.data);
            alert(mensagemErro);
        }
    }
</script>

<style scoped>
#container{
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    padding: 0 5%;
}

form{
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 578px;
    margin: 10px 10%;
}

input{
    height: 4.2em;
    width: auto;
    border: none;
    padding-left: 15px;
    border-radius: var(--border-radius);
    background-color: var(--bg-dark);
    color: #73964F;
}
label{
    font-size: 1em;
    color: var(--text-muted);
    font-weight: 500;
    padding-left: 10px;
}

h1{
    font-size: 2em;
    padding: 0;
    margin: 0;
}


.button{
    width: auto;
    height: 42px;
    background-color: var(--accent-color);
    border: none;
    border-radius: 12px;

    color: var(--text-bt);
    font-weight: 600;
    text-decoration: none;
}

@media only screen and (max-width: 768px) {

    #container{
        height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;   
    }
    
    form{
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    text-align: left;
    }

}

</style>