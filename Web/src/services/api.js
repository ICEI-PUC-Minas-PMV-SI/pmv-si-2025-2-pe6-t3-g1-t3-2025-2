// src/services/api.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5001"; // ajuste p/ sua API

export const api = axios.create({
  baseURL,
  timeout: 15000,
  // withCredentials: true, // habilite APENAS se usar cookies (CORS deve permitir)
  // validateStatus: (status) => status >= 200 && status < 300, // padrão do axios
});

// Injeta token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// (Opcional) 401 global – se já trata no AuthProvider, pode remover
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       // redirecione se quiser: window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );
