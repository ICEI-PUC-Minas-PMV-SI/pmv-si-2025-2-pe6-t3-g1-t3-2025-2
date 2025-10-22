// src/services/produtos.js
import { api } from "./api";

// lista produtos (GET /api/produto)
export async function listarProdutos() {
  const res = await api.get("/api/produto");
  return res.data;
}

// cria produto (POST /api/produto)
// mapeando campos comuns do seu backend (Nome, Preco, Categoria, Descricao, Ativo)
export async function criarProduto({ nome, preco, categoria, descricao, ativo }) {
  const payload = {
    nome,
    preco: Number(preco),
    categoria,
    descricao,
    ativo,
  };
  const res = await api.post("/api/produto", payload);
  return res.data;
}
