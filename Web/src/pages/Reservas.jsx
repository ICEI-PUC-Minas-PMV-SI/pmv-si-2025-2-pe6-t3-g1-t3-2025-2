// src/pages/Reservas.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarReservas } from "../services/reservas"; // OK
import "./reservas.css";

export default function Reservas() {
  const [itens, setItens] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setErro("");
      setLoading(true);
      const data = await listarReservas({ q, status });
      setItens(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar as reservas.");
      setItens([]);
    } finally {
      setLoading(false);
    }
  }

  // Carrega ao abrir e quando o STATUS mudar (o texto q é manual: botão "Atualizar")
  useEffect(() => { carregar(); }, [status]);

  const visiveis = useMemo(() => itens, [itens]);

  return (
    <div className="rs-root">
      <div className="rs-card">
        <div className="rs-header">
          <h2 className="rs-title">📅 Reservas</h2>
          <div className="rs-actions">
            <Link to="/" className="rs-link">← Voltar</Link>
            <Link to="/reservas/nova" className="rs-btn rs-btn--primary">➕ Nova reserva</Link>
          </div>
        </div>

        <div className="rs-toolbar">
          <input
            className="rs-input"
            placeholder="Buscar por hóspede ou quarto"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rs-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Todas</option>
            <option>Ativa</option>
            <option>Cancelada</option>
            <option>Finalizada</option>
          </select>
          <button className="rs-btn" onClick={carregar}>Atualizar</button>
        </div>

        {erro && (
          <div className="rs-alert rs-alert--erro">
            {erro} <button className="rs-btn rs-btn--ghost" onClick={carregar}>Tentar de novo</button>
          </div>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p className="rs-empty">Nenhuma reserva encontrada.</p>
        ) : (
          <div className="rs-list">
            {visiveis.map((r) => {
              // Normaliza campos vindos do backend
              const id = r.id ?? r.Id;
              const hospedeNome = r.hospedeNome ?? r.HospedeNome ?? "-";
              const quartoNumero = r.room?.numero ?? r.roomNumero ?? r.RoomNumero ?? r.QuartoNumero ?? r.quartoNumero ?? r.quartoId;
              const qtdHospedes = r.qtdHospedes ?? r.QtdHospedes ?? r.qtdeHospedes ?? r.Qtd ?? 1;
              const dataEntrada = r.dataEntrada ?? r.DataEntrada;
              const dataSaida = r.dataSaida ?? r.DataSaida;
              const statusR = (r.status ?? r.Status ?? "Ativa").toString();

              const statusClass = statusR.toLowerCase(); // ativa/cancelada/finalizada
              return (
                <div key={id} className="rs-item">
                  <div className="rs-item-main">
                    <div className="rs-item-title">
                      Quarto {quartoNumero} — {hospedeNome}
                    </div>
                    <div className="rs-item-meta">
                      Entrada {fmt(dataEntrada)} · Saída {fmt(dataSaida)} · {qtdHospedes} hóspedes
                    </div>
                  </div>
                  <span className={`rs-pill rs-pill--${statusClass}`}>
                    {statusR}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString();
  } catch {
    return iso;
  }
}
