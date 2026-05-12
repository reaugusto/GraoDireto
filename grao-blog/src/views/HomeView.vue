<template>
<div id="container">
    
<h1>Insights & Learning</h1>
<p>Explorando tendêmcoas Tech, um post por vez</p>
<router-link :to="{name: 'artigos'}" class="button">Começar a ler</router-link>
</div>
</template>

<script setup>
</script>

<style scoped>
#container{
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
}

h1{
    font-size: 5em;
    padding: 0;
    margin: 0;
}

p{
    font-size: 1.8em;
}

.button{
    background-color: var(--accent-color);
    border: none;
    border-radius: 12px;
    padding: 15px 30px;
    color: var(--text-bt);
    font-weight: 600;
    text-decoration: none;
}

@media only screen and (max-width: 768px) {
    h1{
        font-size: 3em;
        padding: 0;
        margin: 0;
        }
    #container{
        height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0 21%;
    }
    p{
        font-size: 1em;
    }   
}
</style>