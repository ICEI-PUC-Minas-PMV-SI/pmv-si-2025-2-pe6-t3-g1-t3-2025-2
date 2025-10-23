// src/pages/Quartos.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listarQuartos } from "../services/quartos";
import "./quartos.css";

export default function Quartos() {
  const [quartos, setQuartos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  async function carregar() {
    try {
      setLoading(true);
      const data = await listarQuartos();
      setQuartos(data || []);
    } catch (e) {
      setErro("Não foi possível carregar os quartos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      navigate(location.pathname, { replace: true, state: {} });
      const t = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(t);
    }
  }, [location, navigate]);

  const visiveis = useMemo(() => {
    if (filtro === "Todos") return quartos;
    if (filtro === "Livre") return quartos.filter(q => q.status === "Livre");
    if (filtro === "Ocupado") return quartos.filter(q => q.status === "Ocupado");
    return quartos.filter(q => q.status === "Manutencao");
  }, [quartos, filtro]);

  function classePill(status) {
    if (status === "Ocupado") return "qr-pill qr-pill--ocupado";
    if (status === "Manutencao") return "qr-pill qr-pill--manutencao";
    return "qr-pill qr-pill--livre";
  }

  return (
    <div className="qr-root">
      <div className="qr-card">
        <div className="qr-header">
          <h2 className="qr-title">🏠 Quartos</h2>
          <Link to="/" className="qr-link">← Voltar</Link>
        </div>

        {toast && <div className="qr-toast qr-toast--ok">{toast}</div>}
        {erro &&  <div className="qr-toast qr-toast--erro">{erro}</div>}

        <div className="qr-toolbar">
          <label style={{ fontSize: 14, color: "#333" }}>Filtrar:</label>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="qr-select"
          >
            <option>Todos</option>
            <option>Livre</option>
            <option>Ocupado</option>
            <option>Manutencao</option>
          </select>

          {/* (Opcional) cadastro de quarto */}
          {/* <Link to="/quartos/novo" className="qr-btn qr-btn--primary">➕ Novo quarto</Link> */}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p>Nenhum quarto encontrado.</p>
        ) : (
          <div className="qr-grid">
            {visiveis.map((q) => (
              <div key={q.id} className="qr-room">
                <div className="qr-roomHeader">
                  <div className="qr-roomTitle">
                    Quarto {q.numero || q.nome || q.id}
                  </div>
                  <span className={classePill(q.status)}>
                    {q.status === "Manutencao" ? "Manutenção" : q.status}
                  </span>
                </div>

                <div className="qr-roomMeta">
                  {q.tipo || "Padrão"} &middot; {q.capacidade || 2} hóspedes
                </div>

                {q.status === "Ocupado" && q.hospede && (
                  <div className="qr-roomMeta" style={{ marginTop: 8 }}>
                    👤 {q.hospede?.nome} <br />
                    🗓️ Entrada: {formatarData(q.hospede?.dataEntrada)}
                  </div>
                )}

                <div className="qr-actions">
                  {q.status === "Livre" ? (
                    <Link
                      to={`/quartos/checkin/${q.id}`}
                      className="qr-btn qr-btn--primary"
                    >
                      🛎️ Acomodar
                    </Link>
                  ) : (
                    <button disabled className="qr-btn qr-btn--ghost">
                      Indisponível
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
