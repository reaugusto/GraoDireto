<template>
  <div class='nav'>
    <router-link :to="{name: 'home'}" class="linkH">TechBlog</router-link>
    <router-link :to="{name: 'login'}" v-if="!auth.isAuthenticated && $route.path !== '/login'" class="entrar">Entrar</router-link>
    <button @click="Logout()" v-if="auth.isAuthenticated">
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5l3-3m0 0l-3-3m3 3H9" />
	</svg>
    </button> 

  </div>
<router-view/>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter()

async function Logout(){
  auth.logout();
  await router.push({ name: 'home' });
}

</script>

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

.linkH{
  text-decoration: none;
  font-size: 1.2em;
  font-weight: 600;
  color: var(--text-main);
}

.entrar{
  text-decoration: none;
  font-size: 1em;
  font-weight: 500;
  color: var(--accent-color);
}

button{
    background-color: var(--bg-dark);
    border: none;
    border-radius: 8px;
    padding: 8px;
    color: var(--text-muted);
    font-weight: 400;
    text-decoration: none;
    cursor: pointer;
}

router-view{
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
