import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obterReserva, encerrarHospedagem } from "../services/reservas";

export default function ReservaEncerrar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    obterReserva(id).then(setReserva).catch(() => {
      alert("Reserva não encontrada.");
      navigate("/quartos");
    });
  }, [id, navigate]);

  async function handleConfirmar() {
    setBusy(true);
    try {
      await encerrarHospedagem(id);
      alert("Hospedagem encerrada com sucesso.");
      navigate("/quartos");
    } catch (e) {
      console.error(e);
      alert("Falha ao encerrar. Veja o Console.");
    } finally {
      setBusy(false);
    }
  }

  if (!reserva) return <div style={{padding:16}}>Carregando…</div>;

  return (
    <div className="p-4">
      <h2>Encerrar Hospedagem</h2>
      <p><strong>Quarto:</strong> {reserva.roomNumber}</p>
      <p><strong>Hóspede:</strong> {reserva.guestName}</p>
      <p><strong>Entrada:</strong> {new Date(reserva.checkinAt).toLocaleString()}</p>
      {/* acrescente outros campos que sua API tiver */}
      <button type="button" disabled={busy} onClick={handleConfirmar}>
        Confirmar encerramento
      </button>
      <button type="button" onClick={() => navigate(-1)} style={{marginLeft:8}}>
        Voltar
      </button>
    </div>
  );
}
