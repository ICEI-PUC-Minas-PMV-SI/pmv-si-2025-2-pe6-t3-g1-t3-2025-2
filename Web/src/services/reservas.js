// src/services/reservas.js
import { api } from "./api";

/** Lista reservas (enviamos q/status só se vierem) */
export async function listarReservas({ q, status } = {}) {
  const params = {};
  if (q) params.q = q;
  if (status && status !== "Todas") params.status = status;

  const { data } = await api.get("/api/Reservations", { params });
  return Array.isArray(data) ? data : [];
}

/** Busca quartos livres usando a rota do RoomsController */
export async function buscarQuartosLivres({ entrada, saida, hospedes = 1 }) {
  const { data } = await api.get("/api/Rooms/available", {
    params: { entrada, saida, hospedes },
  });
  return Array.isArray(data) ? data : data?.items ?? [];
}

/** Cria reserva – POST /api/Reservations */
export async function criarReserva(payload) {
  const dto = {
    HospedeNome: payload.hospedeNome,
    HospedeDocumento: payload.hospedeDocumento ?? null,
    Telefone: payload.telefone ?? null,
    QtdeHospedes: Number(payload.qtdeHospedes || 1), // << alinhar NOME
    DataEntrada: payload.dataEntrada,
    DataSaida: payload.dataSaida,
    QuartoId: Number(payload.quartoId),
  };

  const { data } = await api.post("/api/Reservations", dto);
  return data;
}

/** Retorna reservas ATIVAS AGORA (filtrando no front) */
export async function listarReservasAtivasAgora() {
  const { data } = await api.get("/api/Reservations", { params: { status: "Todas" } });
  const lista = Array.isArray(data) ? data : [];
  const now = new Date();

  return lista.filter((r) => {
    const status = (r.status ?? r.Status ?? "").toString().toLowerCase();
    if (status.includes("cancel") || status.includes("final")) return false;

    const de = new Date(r.dataEntrada ?? r.DataEntrada);
    const ate = new Date(r.dataSaida ?? r.DataSaida);
    if (isNaN(+de) || isNaN(+ate)) return false;

    return de <= now && now < ate;
  });
}
