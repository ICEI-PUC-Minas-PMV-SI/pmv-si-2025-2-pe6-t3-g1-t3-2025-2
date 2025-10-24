// src/pages/Reservas.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarReservas } from "../services/reservas";
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

  // carrega ao abrir e quando o status muda
  useEffect(() => { carregar(); }, [status]);

  const visiveis = useMemo(() => itens, [itens]);

  return (
    <div className="rr-root">
      <div className="rr-card">
        <div className="rr-header">
          <h2 className="rr-title">📅 Reservas</h2>
          <div className="rr-actions">
            <Link to="/" className="rr-link">← Voltar</Link>
            <Link to="/reservas/nova" className="rr-btn rr-btn--primary">➕ Nova reserva</Link>
          </div>
        </div>

        <div className="rr-toolbar">
          <input
            className="rr-input"
            placeholder="Buscar por hóspede ou quarto"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rr-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Todas</option>
            <option>Ativa</option>
            <option>Cancelada</option>
            <option>Finalizada</option>
          </select>
          <button className="rr-btn" onClick={carregar}>Atualizar</button>
        </div>

        {erro && (
          <div className="rr-empty">
            {erro}{" "}
            <button className="rr-btn rr-btn--ghost" onClick={carregar}>
              Tentar de novo
            </button>
          </div>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p className="rr-empty">Nenhuma reserva encontrada.</p>
        ) : (
          <div className="rr-list">
            {visiveis.map((r) => {
              // Normaliza campos vindos do backend
              const id = r.id ?? r.Id;
              const hospedeNome = r.hospedeNome ?? r.HospedeNome ?? "-";
              const quartoNumero =
                r.room?.numero ??
                r.roomNumero ??
                r.RoomNumero ??
                r.QuartoNumero ??
                r.quartoNumero ??
                r.quartoId;
              const qtdHospedes =
                r.qtdHospedes ?? r.QtdHospedes ?? r.qtdeHospedes ?? r.Qtd ?? 1;
              const dataEntrada = r.dataEntrada ?? r.DataEntrada;
              const dataSaida = r.dataSaida ?? r.DataSaida;
              const statusR = (r.status ?? r.Status ?? "Ativa").toString().toLowerCase();

              return (
                <div key={id} className="rr-row">
                  <div className="rr-td">
                    <div className="rr-item-title">
                      Quarto {quartoNumero} — {hospedeNome}
                    </div>
                    <div className="rr-item-meta">
                      Entrada {fmt(dataEntrada)} · Saída {fmt(dataSaida)} · {qtdHospedes} hóspedes
                    </div>
                  </div>
                  <div className="rr-td">
                    <span className={`rr-pill rr-pill--${badge(statusR)}`}>
                      {statusR.charAt(0).toUpperCase() + statusR.slice(1)}
                    </span>
                  </div>
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

function badge(s) {
  if (s.includes("cancel")) return "cancelada";
  if (s.includes("final")) return "confirmada"; // ajuste se quiser outra cor
  // default
  return "aberta";
}
