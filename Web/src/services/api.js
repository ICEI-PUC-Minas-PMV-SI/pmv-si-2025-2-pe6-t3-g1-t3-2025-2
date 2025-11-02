// src/services/api.js
import axios from "axios";

/**
 * Normaliza a baseURL:
 * - Remove barras finais repetidas
 * - Garante sufixo /api (independente do .env vir com ou sem)
 */
function buildBaseURL() {
  const raw = import.meta.env.VITE_API_BASE_URL || "http://localhost:5210";
  const noTrailing = String(raw).replace(/\/+$/, "");
  // Se já terminar com /api (exato), mantém. Caso contrário, adiciona.
  return noTrailing.endsWith("/api") ? noTrailing : `${noTrailing}/api`;
}

const baseURL = buildBaseURL();

// Instância global do Axios
export const api = axios.create({
  baseURL,
  timeout: 15000,
  // withCredentials: false, // deixe false com Bearer; true só se for cookie de auth
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 🔐 Injeta token JWT automaticamente (se existir)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper para extrair mensagens amigáveis de erro
export function apiErrorMessage(error) {
  const r = error?.response;
  return (
    r?.data?.mensagem ||
    r?.data?.detail ||
    r?.data?.title ||
    error?.message ||
    "Erro inesperado. Tente novamente."
  );
}

// ⚠️ Log básico (deixe simples e padronizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Evita poluir o console com objetos enormes
    const status = error?.response?.status;
    const url = error?.config?.url;
    console.error(`[API ${status ?? "ERR"}] ${url}:`, apiErrorMessage(error));
    return Promise.reject(error);
  }
);
