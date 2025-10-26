// src/pages/Quartos.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listarQuartos } from "../services/quartos";
import "./quartos.css";
import quartoIcon from "../assets/quarto.png";


export default function Quartos() {
  const [quartos, setQuartos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Gera um conjunto base de 15 quartos
  function seedQuartosBase() {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      numero: i + 1,
      status: "Livre",
      tipo: "Padrão",
      capacidade: 2,
    }));
  }

  // Preenche/garante 15 quartos sem duplicar ids
  function ensureFifteen(list = []) {
    const base = seedQuartosBase();
    const byNumero = new Map(list.map(q => [Number(q.numero ?? q.id), q]));
    const final = base.map(b =>
      byNumero.get(b.numero) ? { ...b, ...byNumero.get(b.numero) } : b
    );
    return final;
  }

  async function carregar() {
    try {
      setLoading(true);
      const data = await listarQuartos();        // pode vir [] ou menos de 15
      const safe = Array.isArray(data) ? data : [];
      setQuartos(ensureFifteen(safe));           // sempre 15
    } catch (e) {
      // Falhou? mostra erro mas ainda assim mostra 15 livros
      setErro("Não foi possível carregar os quartos (mostrando padrão).");
      setQuartos(ensureFifteen([]));
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
          <h2 className="qr-title">
            <img
              src={quartoIcon}
              alt=""
              className="qr-icon"
              width={40}
              height={40}
            />
            Quartos
          </h2>
          <Link to="/" className="qr-link">← Voltar</Link>
        </div>



        {toast && <div className="qr-toast qr-toast--ok">{toast}</div>}
        {erro && <div className="qr-toast qr-toast--erro">{erro}</div>}

        <div className="qr-toolbar">
          <label style={{ fontSize: 14, color: "var(--texto)" }}>Filtrar:</label>
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
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="qr-grid">
            {visiveis.map((q) => (
              <div key={q.id ?? q.numero} className="qr-room">
                <div className="qr-roomHeader">
                  <div className="qr-roomTitle">
                    Quarto {q.numero ?? q.nome ?? q.id}
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
                      to={`/quartos/checkin/${q.id ?? q.numero}`}
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
