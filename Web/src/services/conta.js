import { api } from "./api";

export async function obterHospedagem(hospedagemId){
  const { data } = await api.get(`/api/hospedagens/${hospedagemId}`);
  return data;
}

export async function listarLancamentos(hospedagemId){
  const { data } = await api.get(`/api/hospedagens/${hospedagemId}/lancamentos`);
  return data;
}

export async function adicionarLancamento(hospedagemId, payload){
  // payload: { tipo, descricao, valor, qtd }
  const { data } = await api.post(`/api/hospedagens/${hospedagemId}/lancamentos`, payload);
  return data;
}

export async function fecharConta(hospedagemId){
  const { data } = await api.post(`/api/hospedagens/${hospedagemId}/fechar`);
  return data;
}
