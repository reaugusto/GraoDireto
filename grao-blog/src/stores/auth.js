// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import http from '@/services/http.js'

export const useAuthStore = defineStore('auth', () => {
    // --- STATE ---
    // Em Setup Stores, ref() vira a propriedade do state
    const user = ref(null);
    const token = ref(localStorage.getItem('user_token') || null);
    const isAuthenticated = ref(!!localStorage.getItem('user_token'));

    // --- GETTERS ---
    // Em Setup Stores, computed() vira um getter
    const fullName = computed(() => {
        return user.value.name || 'Usuário';
    });

    const getUserID = computed(() => {
        return user.value.id || null;
    });

    const firstName = computed(() => {
        return user.value?.name?.split(' ')[0] || 'Usuário';
    });

    // --- ACTIONS ---
    // Em Setup Stores, funções simples viram actions
    function setUserData(data) {

        user.value = data.user;
        token.value = data.token;
        isAuthenticated.value = true;
        console.log(data.user)
        console.log(token.value)
        localStorage.setItem('user', JSON.stringify(user.value));
        localStorage.setItem('user_token', token.value);
        
    }

    function logout() {
        user.value = null;
        token.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
    }

  // src/stores/auth.js
async function checkToken() {
    if (!token.value) return false;

    try {
        const { data } = await http.get('/login/verify');
        // Se a API retornar { valid: true }, o usuário está logado
        return data.valid; 
    } catch (error) {
        console.error("Token inválido:", error);
        logout(); // Limpa tudo se o token estiver podre
        return false;
    }
}

    // É OBRIGATÓRIO retornar tudo o que você quer que seja acessível
    return { 
        user, 
        token, 
        isAuthenticated, 
        firstName, 
        setUserData, 
        logout,
        checkToken,
        fullName,
        getUserID
    };
});