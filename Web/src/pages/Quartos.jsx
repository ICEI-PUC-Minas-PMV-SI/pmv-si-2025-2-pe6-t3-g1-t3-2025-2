import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listarQuartos } from "../services/quartos";
import { buscarQuartosLivres } from "../services/reservas";
import "./quartos.css";
import quartoIcon from "../assets/quarto.png";

/* ---------- Error Boundary local (evita tela branca) ---------- */
function ErrorBoundary({ children }) {
  const [err, setErr] = useState(null);
  if (err) {
    return (
      <div style={{ padding: 16 }}>
        <h3>Falha ao renderizar “Quartos”.</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(err?.message || err)}</pre>
        <div style={{ marginTop: 8, fontSize: 13, opacity: .8 }}>
          Veja também o Console (F12 → Console) e a aba Network para os /api/...
        </div>
      </div>
    );
  }
  return (
    <ErrorCatcher onError={setErr}>{children}</ErrorCatcher>
  );
}
function ErrorCatcher({ onError, children }) {
  try { return children; }
  catch (e) { onError(e); return null; }
}

/* ---------- helpers ---------- */
function formatarData(iso) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString("pt-BR"); } catch { return iso; }
}

function QuartosInner() {
  const [quartos, setQuartos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [entrada, setEntrada] = useState("");
  const [saida, setSaida] = useState("");

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  async function carregar() {
    setLoading(true);
    setErro("");

    try {
      // 1) status “AGORA” do backend
      const rooms = await listarQuartos().catch((e) => {
        console.error("[listarQuartos] falhou:", e);
        throw e;
      });
      const roomsSafe = Array.isArray(rooms) ? rooms : rooms?.items ?? rooms ?? [];

      // 2) Se houver período, recalcula disponibilidade
      if (entrada && saida) {
        let disp = [];
        try {
          disp = await buscarQuartosLivres({ entrada, saida, hospedes: undefined });
        } catch (e) {
          console.warn("[buscarQuartosLivres] falhou (seguindo sem disponibilidade):", e);
          disp = [];
        }
        const dispIds = new Set((disp || []).map((r) => r.id ?? r.Id));

        const sobrepostos = roomsSafe.map((q) => {
          const original = q.status ?? q.Status ?? "Livre";
          if (original === "Manutencao") return { ...q, status: "Manutencao", hospede: null };
          const id = q.id ?? q.Id;
          return { ...q, status: dispIds.has(id) ? "Livre" : "Ocupado", hospede: null };
        });

        setQuartos(sobrepostos);
      } else {
        setQuartos(roomsSafe);
      }
    } catch (e) {
      setErro("Não foi possível carregar os quartos.");
      setQuartos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!entrada && !saida) {
      // modo "agora"
      carregar();
    } else if (entrada && saida && new Date(saida) > new Date(entrada)) {
      // modo "período" válido
      carregar();
    }
    // importante: não retornar nada aqui
  }, [entrada, saida]);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      navigate(location.pathname, { replace: true, state: {} });
      const t = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(t);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (entrada || saida) return; // com período, não precisa auto-refresh

    const id = setInterval(() => carregar(), 15000);
    timerRef.current = id;

    return () => {
      if (id) clearInterval(id);
    };
  }, [entrada, saida]);

  const visiveis = useMemo(() => {
    if (!Array.isArray(quartos)) return [];
    if (filtro === "Todos") return quartos;
    if (filtro === "Livre") return quartos.filter((q) => (q.status ?? "Livre") === "Livre");
    if (filtro === "Ocupado") return quartos.filter((q) => (q.status ?? "") === "Ocupado");
    return quartos.filter((q) => (q.status ?? "") === "Manutencao");
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
            <img src={quartoIcon} alt="" className="qr-icon" width={40} height={40} />
            Quartos
          </h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="qr-btn qr-btn--ghost" onClick={carregar} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
            <Link to="/" className="qr-link">← Voltar</Link>
          </div>
        </div>

        {toast && <div className="qr-toast qr-toast--ok">{toast}</div>}
        {erro && <div className="qr-toast qr-toast--erro">{erro}</div>}

        <div className="qr-toolbar" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ fontSize: 14 }}>Entrada:</label>
            <input type="date" className="qr-input" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ fontSize: 14 }}>Saída:</label>
            <input type="date" className="qr-input" value={saida} onChange={(e) => setSaida(e.target.value)} />
          </div>

          <div style={{ flex: 1 }} />
          <label style={{ fontSize: 14 }}>Filtrar:</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="qr-select">
            <option>Todos</option>
            <option>Livre</option>
            <option>Ocupado</option>
            <option>Manutencao</option>
          </select>
        </div>

        <div className="qr-help" style={{ marginBottom: 8 }}>
          {(entrada && saida)
            ? <>Status calculado para o período informado.</>
            : <>Sem período: status baseado <strong>agora</strong> (API <code>/Rooms/with-guest</code>).</>}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="qr-grid">
            {visiveis.map((q, idx) => {
              const id = q?.id ?? q?.Id ?? idx; // id sempre definido
              const numero = q?.numero ?? q?.Numero ?? id;
              return (
                <div key={id} className="qr-room">
                  <div className="qr-roomHeader">
                    <div className="qr-roomTitle">Quarto {numero}</div>
                    <span className={classePill(q.status)}>
                      {q.status === "Manutencao" ? "Manutenção" : (q.status ?? "Livre")}
                    </span>
                  </div>

                  <div className="qr-roomMeta">
                    {(q.tipo ?? q.Tipo ?? "Padrão")} &middot; {(q.capacidade ?? q.Capacidade ?? 2)} hóspedes
                  </div>

                  {(!entrada && !saida) && q.status === "Ocupado" && q.hospede && (
                    <div className="qr-roomMeta" style={{ marginTop: 8 }}>
                      👤 {q.hospede?.nome} <br />
                      🗓️ Entrada: {formatarData(q.hospede?.dataEntrada)}
                    </div>
                  )}

                  <div className="qr-actions">
                    {(q.status ?? "Livre") === "Livre" ? (
                      <Link to={`/quartos/checkin/${id}`} className="qr-btn qr-btn--primary">
                        🛎️ Acomodar
                      </Link>
                    ) : (
                      <button disabled className="qr-btn qr-btn--ghost">Indisponível</button>
                    )}
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

/* ---------- exporta com boundary ---------- */
export default function Quartos() {
  return (
    <ErrorBoundary>
      <QuartosInner />
    </ErrorBoundary>
  );
}
