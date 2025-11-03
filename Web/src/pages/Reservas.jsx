// src/pages/Reservas.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { listarReservas } from "../services/reservas";
import "./reservas.css";

const dtf = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

function fmt(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : dtf.format(d);
  } catch {
    return iso;
  }
}
function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Reservas() {
  const [itens, setItens] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const debounceRef = useRef(null);

  const carregar = useCallback(async (params) => {
    const { q: qParam, status: statusParam } = params ?? { q, status };
    setErro("");
    setLoading(true);
    try {
      const filtroStatus = statusParam === "Todas" ? undefined : statusParam;
      const data = await listarReservas({ q: qParam, status: filtroStatus });
      setItens(Array.isArray(data) ? data : data?.items ?? []);
    } catch (e) {
      console.error("[reservas] listarReservas falhou:", e);
      setItens([]);
      setErro("Não foi possível carregar as reservas.");
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => { carregar(); }, [carregar]);                 // ao abrir
  useEffect(() => { carregar({ q, status }); }, [status]);       // mudou status
  useEffect(() => {                                              // debounce q
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => carregar({ q, status }), 300);
    return () => clearTimeout(debounceRef.current);
  }, [q, status, carregar]);

  const visiveis = useMemo(() => itens ?? [], [itens]);

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
            title="Status da reserva"
          >
            <option>Todas</option>
            <option>Aberta</option>
            <option>Confirmada</option>
            <option>Cancelada</option>
          </select>
          <button className="rr-btn" onClick={() => carregar({ q, status })} disabled={loading}>
            {loading ? "Carregando..." : "Atualizar"}
          </button>
          {!loading && (
            <span className="rr-help" style={{ marginLeft: 6 }}>
              {visiveis.length} resultado{visiveis.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {erro && (
          <div className="rr-empty">
            {erro} <button className="rr-btn rr-btn--ghost" onClick={() => carregar({ q, status })}>Tentar de novo</button>
          </div>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p className="rr-empty">Nenhuma reserva encontrada.</p>
        ) : (
          <div className="rr-list">
            {visiveis.map((r) => {
              const id = r.id ?? r.Id;
              const hospedeNome = r.hospedeNome ?? r.HospedeNome ?? "-";
              const quartoNumero =
                r.quartoNumero ?? r.QuartoNumero ?? r.Quarto?.Numero ??
                r.roomNumero ?? r.RoomNumero ?? r.quartoId ?? "-";
              const qtdHospedes =
                r.qtdeHospedes ?? r.QtdHospedes ?? r.qtdHospedes ?? r.quantidadeHospedes ?? 1;
              const dataEntrada = r.dataEntrada ?? r.DataEntrada ?? r.checkinAt ?? r.CheckinAt;
              const dataSaida   = r.dataSaida   ?? r.DataSaida   ?? r.checkoutAt ?? r.CheckoutAt;
              const statusRaw = (r.status ?? r.Status ?? "Aberta").toString();
              const sLower = statusRaw.toLowerCase();
              const cls =
                sLower.includes("cancel") ? "cancelada" :
                sLower.includes("confirm") ? "confirmada" : "aberta";

              return (
                <div key={id} className="rr-row">
                  <div className="rr-td">
                    <div className="rr-item-title">Quarto {quartoNumero} — {hospedeNome}</div>
                    <div className="rr-item-meta">
                      Entrada {fmt(dataEntrada)} · Saída {fmt(dataSaida)} · {qtdHospedes} hóspedes
                    </div>
                  </div>
                  <div className="rr-td">
                    <span className={`rr-pill rr-pill--${cls}`}>{capitalize(statusRaw)}</span>
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

