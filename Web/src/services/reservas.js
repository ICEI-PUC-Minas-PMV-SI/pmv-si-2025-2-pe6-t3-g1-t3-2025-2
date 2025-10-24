// src/services/reservas.js
import { api } from "./api";

/**
 * Lista reservas com filtros opcionais
 * @param {{ q?: string, status?: string }} param0
 */
export async function listarReservas({ q, status } = {}) {
  const params = {};
  if (q) params.q = q;
  if (status && status !== "Todas") params.status = status;

  const { data } = await api.get("/reservations", { params });
  // garanta array
  return Array.isArray(data) ? data : [];
}

/**
 * Busca quartos disponíveis no período informado
 * (ajuste o endpoint caso o seu backend use outro caminho)
 * @param {{ entrada: string, saida: string, hospedes?: number }} param0
 */
export async function buscarQuartosLivres({ entrada, saida, hospedes = 1 }) {
  // tente primeiro este endpoint; se o seu for outro, só troque a URL:
  // exemplo alternativo: "/rooms/available"
  const { data } = await api.get("/reservations/available-rooms", {
    params: { from: entrada, to: saida, guests: hospedes },
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Cria uma reserva
 * @param {{
 *  hospedeNome: string,
 *  hospedeDocumento?: string,
 *  telefone?: string,
 *  qtdHospedes: number,
 *  dataEntrada: string,
 *  dataSaida: string,
 *  quartoId: number
 * }} payload
 */
export async function criarReserva(payload) {
  const { data } = await api.post("/reservations", payload);
  return data;
}
