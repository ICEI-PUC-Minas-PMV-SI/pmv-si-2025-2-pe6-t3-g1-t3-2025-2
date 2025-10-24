// src/services/api.js
import axios from "axios";

// Usa variável de ambiente se existir, senão cai no localhost:5210/api
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5210/api";

// Cria instância global do Axios
export const api = axios.create({
  baseURL,
  timeout: 15000, // 15 segundos
});

// 🔐 Injeta token JWT automaticamente, se existir no localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Intercepta erros de resposta para logar e tratar globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error?.response || error?.message);
    return Promise.reject(error);
  }
);
