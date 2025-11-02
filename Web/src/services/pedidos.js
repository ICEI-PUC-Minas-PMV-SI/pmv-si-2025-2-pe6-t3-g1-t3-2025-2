// src/services/pedidos.js
import { api } from "./api";
import { listarReservas } from "./reservas";

/** Cria um novo pedido */
export async function criarPedido(dadosDoPedido) {
  const { data } = await api.post("/Order", dadosDoPedido); // baseURL já tem /api
  return data;
}

/**
 * Lista pedidos já enriquecidos com dados da reserva correspondente
 * (hóspede, quarto, datas).
 */
export async function getPedidos() {
  // 1) Busca pedidos
  const { data } = await api.get("/Order");
  const pedidos = Array.isArray(data) ? data : [];

  if (!pedidos.length) return [];

  // 2) Busca TODAS as reservas para montar o mapa (evita N chamadas por pedido)
  const reservas = await listarReservas({ status: "Todas" });
  const mapReservas = new Map(
    (reservas || []).map((r) => [Number(r.id ?? r.Id), r])
  );

  // 3) Mescla: adiciona hospede/quarto/datas em cada pedido
  const enriquecidos = pedidos.map((p) => {
    const reservationId = Number(p.reservationId ?? p.ReservationId);
    const r = mapReservas.get(reservationId);

    const hospedeNome = r?.hospedeNome ?? r?.HospedeNome ?? null;
    const quarto      = r?.quarto ?? r?.Quarto ?? null;
    const checkIn     = r?.dataEntrada ?? r?.DataEntrada ?? p.checkInDate ?? p.CheckInDate ?? null;
    const checkOut    = r?.dataSaida   ?? r?.DataSaida   ?? p.checkOutDate ?? p.CheckOutDate ?? null;

    return {
      ...p,
      reservationId,
      hospedeNome,
      quarto,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    };
  });

  return enriquecidos;
}
