<template>
  <div class='nav'>
    <span>TechBlog</span>
    <router-link :to="{name: 'login'}" >Entrar</router-link>
  </div>
<router-view/>
</template>


<script setup></script>

<style scoped>

.nav{
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px 0 40px;
  height: 60px;
  border: solid 1px var(--primary-color);
  color: var(--text-main);
}
router-view{
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
