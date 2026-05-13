import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth.js"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: "login",
      component: () => import('../views/Loginview.vue')
    },
    {
      path: '/artigos',
      name: "artigos",
      component: () => import('../views/ArtigosView.vue'),
      meta: {
        auth:true
      }
    },
    {
      path: '/artigo/:id',
      name: 'artigo-detalhe',
      component: () => import('../views/ArtigoDetalheView.vue'),
      props: true // Isso permite receber o :id como uma prop no componente
    }
  ],
})

// src/router/index.js
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Se a rota exige autenticação
  if (to.meta?.auth) {
    // 1. Verifica se existe um token salvo
    if (!auth.token) {
      return { name: 'login' };
    }

    // 2. Valida o token com o servidor
    const isTokenValid = await auth.checkToken();
    
    if (!isTokenValid) {
      return { name: 'login' };
    }
    
    // Se chegou aqui, o token existe e é válido
    return true;
  }

  // Se a rota for pública
  return true;
});

export default router
