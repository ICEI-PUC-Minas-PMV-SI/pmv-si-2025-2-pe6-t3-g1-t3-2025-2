import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { listarReservas } from "../services/reservas";
import "./reservas.css";

const dtf = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function Reservas() {
  const [itens, setItens] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const debounceRef = useRef(null);

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

  // carrega ao abrir
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, []);

  // recarrega quando status mudar
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [status]);

  // recarrega quando q mudar (com debounce)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => carregar(), 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [q]);

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
            <option>Aberta</option>
            <option>Confirmada</option>
            <option>Cancelada</option>
          </select>
          <button className="rr-btn" onClick={carregar} disabled={loading}>
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
              // Normalizações
              const id = r.id ?? r.Id;
              const hospedeNome = r.hospedeNome ?? r.HospedeNome ?? "-";
              const quartoNumero =
                r.quartoNumero ??
                r.QuartoNumero ??
                r.Quarto?.Numero ??
                r.roomNumero ??
                r.RoomNumero ??
                r.quartoId ??
                "-";
              const qtdHospedes = r.qtdeHospedes ?? r.QtdHospedes ?? r.qtdHospedes ?? 1;
              const dataEntrada = r.dataEntrada ?? r.DataEntrada;
              const dataSaida = r.dataSaida ?? r.DataSaida;

              // status exibido e classe
              const statusRaw = (r.status ?? r.Status ?? "Aberta").toString();
              const sLower = statusRaw.toLowerCase();
              const cls =
                sLower.includes("cancel") ? "cancelada" :
                sLower.includes("confirm") ? "confirmada" :
                "aberta";

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
                    <span className={`rr-pill rr-pill--${cls}`}>
                      {capitalize(statusRaw)}
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
    return isNaN(d.getTime()) ? iso : dtf.format(d);
  } catch {
    return iso;
  }
}
function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
