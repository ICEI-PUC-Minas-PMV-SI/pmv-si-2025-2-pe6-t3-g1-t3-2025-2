// src/services/quartos.js
import { api } from "./api";

// Lista todos os quartos
export async function listarQuartos() {
  const res = await api.get("/api/quarto");
  return res.data;
}

// (Opcional) cria/edita quarto — se já tiver endpoints
export async function criarQuarto(payload) {
  const res = await api.post("/api/quarto", payload);
  return res.data;
}

// Check-in (acomodar hóspede no quarto)
export async function acomodarHospede({
  quartoId,
  nomeHospede,
  documento,
  adultos,
  criancas,
  dataEntrada,           // "2025-10-23T14:00:00"
  dataSaidaPrevista,     // "2025-10-25T11:00:00"
  observacoes,
  tarifaDiaria
}) {
  const body = {
    quartoId,
    nomeHospede,
    documento,
    adultos: Number(adultos || 1),
    criancas: Number(criancas || 0),
    dataEntrada,
    dataSaidaPrevista,
    observacoes,
    tarifaDiaria: Number(tarifaDiaria || 0),
  };
  const res = await api.post("/api/hospedagem/checkin", body);
  return res.data;
}
