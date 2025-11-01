// src/services/reservas.js
import { api } from "./api";

/**
 * Lista reservas (o backend atual não filtra por q/status, mas
 * mandamos só se vierem para não quebrar no futuro)
 */
export async function listarReservas({ q, status } = {}) {
  const params = {};
  if (q) params.q = q;
  if (status && status !== "Todas") params.status = status;

  // ✅ sem /api aqui (baseURL já termina com /api)
  const { data } = await api.get("/Reservations", { params });
  return Array.isArray(data) ? data : [];
}

/**
 * Busca quartos livres – casa com GET /Reservations/disponibilidade
 * Query esperada pelo backend:
 *   dataEntrada, dataSaida, capacidade
 */
export async function buscarQuartosLivres({ entrada, saida, hospedes = 1 }) {
  const { data } = await api.get("/Reservations/disponibilidade", {
    params: {
      dataEntrada: entrada,   // ISO (use toISOString() no chamador)
      dataSaida: saida,       // ISO
      capacidade: hospedes
    },
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Cria uma reserva – POST /Reservations
 * DTO esperado pelo backend (PascalCase):
 *  - HospedeNome, HospedeDocumento, Telefone (opcional)
 *  - QtdeHospedes, DataEntrada, DataSaida, QuartoId
 */
export async function criarReserva(payload) {
  const dto = {
    HospedeNome: payload.hospedeNome,
    HospedeDocumento: payload.hospedeDocumento ?? null,
    Telefone: payload.telefone ?? null,
    QtdeHospedes: Number(payload.qtdHospedes || 1),
    DataEntrada: payload.dataEntrada,
    DataSaida: payload.dataSaida,
    QuartoId: Number(payload.quartoId),
  };

  // ✅ sem /api
  const { data } = await api.post("/Reservations", dto);
  return data;
}

/**
 * Busca reservas e devolve apenas as que estão ATIVAS AGORA
 * Sem depender de o backend filtrar por status/intervalo.
 */
export async function listarReservasAtivasAgora() {
  // Se seu backend tiver endpoint dedicado:
  // const { data } = await api.get("/Reservations/active-now");
  // return Array.isArray(data) ? data : [];

  // ✅ sem /api; pedimos “Todas” e filtramos no front
  const { data } = await api.get("/Reservations", { params: { status: "Todas" } });
  const lista = Array.isArray(data) ? data : [];
  const now = new Date();

  return lista.filter((r) => {
    const status = (r.status ?? r.Status ?? "").toString().toLowerCase();
    if (status.includes("cancel") || status.includes("final")) return false;

    const de = new Date(r.dataEntrada ?? r.DataEntrada);
    const ate = new Date(r.dataSaida ?? r.DataSaida);
    if (isNaN(+de) || isNaN(+ate)) return false;

    return de <= now && now < ate; // ativa neste instante
  });
}
