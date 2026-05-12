// src/services/http.js
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const http = axios.create({
    baseURL: 'http://localhost:3005' // Verifique se a porta está correta!
});

http.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
        // É essencial que seja 'Bearer ' com o espaço
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default http;