import { api } from "./api";
export async function listarQuartos() {
  const res = await api.get("/Rooms/with-guest");
  return res.data;
}

/** (se usar criação de quarto, ajuste para /api/Rooms) */
export async function criarQuarto(payload) {
  const res = await api.post("/Rooms", payload);
  return res.data;
}

/** Check-in continua criando uma Reservation */
export async function acomodarHospede({
  quartoId,
  nomeHospede,
  documento,
  adultos,
  criancas,
  dataEntrada,
  dataSaidaPrevista,
}) {
  const dto = {
    HospedeNome: nomeHospede,
    HospedeDocumento: documento || null,
    Telefone: null,
    QtdeHospedes: Number(adultos || 0) + Number(criancas || 0),
    DataEntrada: dataEntrada,       // use toISOString() no chamador
    DataSaida: dataSaidaPrevista,   // idem
    QuartoId: quartoId != null ? Number(quartoId) : null,
  };

  const res = await api.post("/Reservations", dto);
  return res.data;
}
