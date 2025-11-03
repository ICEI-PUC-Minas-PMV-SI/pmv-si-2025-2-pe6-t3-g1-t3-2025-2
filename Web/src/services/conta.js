// src/services/conta.js
import { api } from "./api";

/* util p/ número seguro */
const n = (v, def = 0) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : def;
};

/* ------------ Normalizador da resposta do checkout ------------ */
function normalizeCheckout(raw = {}) {
  const dataEntrada = raw.dataEntrada ?? raw.DataEntrada ?? null;
  const dataSaidaPrevista = raw.dataSaidaPrevista ?? raw.DataSaidaPrevista ?? null;
  const dataSaidaReal = raw.dataSaidaReal ?? raw.DataSaidaReal ?? null;

  const quarto = raw.quarto ?? raw.Quarto ?? {};
  const hospede = raw.hospede ?? raw.Hospede ?? {};

  const tarifaDiaria = n(raw.tarifaDiaria ?? raw.TarifaDiaria ?? hospede.tarifaDiaria ?? hospede.TarifaDiaria);
  const noites       = n(raw.noites ?? raw.Noites);
  const totalDiarias = n(raw.totalDiarias ?? raw.TotalDiarias ?? tarifaDiaria * noites);

  const itensRaw = raw.itensPedidos ?? raw.ItensPedidos ?? raw.pedidos ?? raw.Pedidos ?? [];
  const itens = Array.isArray(itensRaw)
    ? itensRaw.map((p, i) => {
        const qtd  = n(p.quantidade ?? p.Quantidade);
        const unit = n(p.precoUnitario ?? p.PrecoUnitario ?? p.preco ?? p.Preco);
        return {
          id: p.id ?? p.Id ?? i,
          produto: p.produto ?? p.Produto ?? p.nome ?? p.Nome ?? "Item",
          quantidade: qtd,
          precoUnitario: unit,
          subtotal: n(p.subtotal ?? p.Subtotal ?? qtd * unit),
        };
      })
    : [];

  const totalPedidos = n(raw.totalPedidos ?? raw.TotalPedidos ?? itens.reduce((acc, it) => acc + n(it.subtotal), 0));
  const totalGeral   = n(raw.totalGeral ?? raw.TotalGeral ?? (totalDiarias + totalPedidos));

  return {
    reservaId: raw.reservaId ?? raw.ReservaId ?? raw.id ?? raw.Id ?? null,
    quarto: {
      id: quarto.id ?? quarto.Id ?? null,
      numero: quarto.numero ?? quarto.Numero ?? quarto.nome ?? quarto.Nome ?? "-",
      capacidade: quarto.capacidade ?? quarto.Capacidade ?? null,
      tipo: quarto.tipo ?? quarto.Tipo ?? "Padrão",
    },
    hospede: {
      id: hospede.id ?? hospede.Id ?? null,
      nome: hospede.nome ?? hospede.Nome ?? "Hóspede",
      documento: hospede.documento ?? hospede.Documento ?? null,
      telefone: hospede.telefone ?? hospede.Telefone ?? null,
    },
    datas: { dataEntrada, dataSaidaPrevista, dataSaidaReal },
    valores: { tarifaDiaria, noites, totalDiarias, totalPedidos, totalGeral },
    itens,
  };
}

/* ------------ Fallbacks para achar reserva ativa do quarto ------------ */
export async function resolverReservaAtiva(roomId) {
  // 1) endpoint “oficial”
  try {
    const { data } = await api.get(`/api/Reservations/ativa-por-quarto/${roomId}`);
    const id = data?.id ?? data?.reservaId ?? data?.ReservaId;
    if (id) return id;
  } catch (e) {
    if (![404].includes(e?.response?.status)) throw e; // 401/403/500 sobem
  }

  // 2) alternativa
  try {
    const { data } = await api.get(`/api/Reservations/atual-por-quarto/${roomId}`);
    const id = data?.id ?? data?.reservaId ?? data?.ReservaId;
    if (id) return id;
  } catch (e) {
    if (![404].includes(e?.response?.status)) throw e;
  }

  // 3) fallback no recurso do quarto
  try {
    const { data } = await api.get(`/api/Rooms/${roomId}/reserva-ativa`);
    const id = data?.id ?? data?.reservaId ?? data?.ReservaId;
    if (id) return id;
  } catch (e) {
    if (![404].includes(e?.response?.status)) throw e;
  }

  return null;
}

/* ------------ Checkout (aceita reservaId OU roomId) ------------ */
export async function obterCheckout(reservaOuRoomId) {
  // tenta como reservaId direto
  try {
    const { data } = await api.get(`/api/Reservations/${reservaOuRoomId}/checkout`);
    return normalizeCheckout(data ?? {});
  } catch (e) {
    if (![404].includes(e?.response?.status)) throw e;
  }

  // tenta como roomId (derivados)
  const roomId = reservaOuRoomId;
  try {
    const { data } = await api.get(`/api/Reservations/ativa-por-quarto/${roomId}/checkout`);
    return normalizeCheckout(data ?? {});
  } catch (e) {
    if (![404].includes(e?.response?.status)) throw e;
  }
  try {
    const { data } = await api.get(`/api/Rooms/${roomId}/checkout`);
    return normalizeCheckout(data ?? {});
  } catch (e) {
    if (![404].includes(e?.response?.status)) throw e;
  }

  // último recurso: resolve reserva e refaz
  const rid = await resolverReservaAtiva(roomId);
  if (rid) {
    const { data } = await api.get(`/api/Reservations/${rid}/checkout`);
    return normalizeCheckout(data ?? {});
  }

  return normalizeCheckout({});
}

/* ------------ Encerrar ------------ */
export async function encerrarConta(reservaId, payload = {}) {
  const body = {
    formaPagamento: payload.formaPagamento ?? null,
    observacao: payload.observacao ?? null,
  };
  const { data } = await api.post(`/api/Reservations/${reservaId}/encerrar`, body);
  return data;
}
