// src/pages/Quartos.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listarQuartos } from "../services/quartos";

const PILL = {
  Livre: { bg: "#e6f6e6", fg: "#1b7f1b", bd: "#cceccc" },
  Ocupado: { bg: "#fde2e1", fg: "#b21f1f", bd: "#f5c2c0" },
  Manutencao: { bg: "#fff6e0", fg: "#9a6b00", bd: "#ffe5a3" },
};

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

  // exibe toast vindo de outras telas
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

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
          <h2 style={{ margin: 0 }}>🏠 Quartos</h2>
          <Link to="/" style={s.link}>← Voltar</Link>
        </div>

        {toast && (
          <div style={{...s.toast, background:"#e6f6e6", color:"#1b7f1b", border:"1px solid #cceccc"}}>
            {toast}
          </div>
        )}
        {erro && (
          <div style={{...s.toast, background:"#fde2e1", color:"#b21f1f", border:"1px solid #f5c2c0"}}>
            {erro}
          </div>
        )}

        <div style={s.toolbar}>
          <label style={{ fontSize: 14, color: "#333" }}>Filtrar:</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} style={s.select}>
            <option>Todos</option>
            <option>Livre</option>
            <option>Ocupado</option>
            <option>Manutencao</option>
          </select>

          {/* (Opcional) cadastro de quarto */}
          {/* <Link to="/quartos/novo" style={s.btnPrimary}>➕ Novo quarto</Link> */}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p>Nenhum quarto encontrado.</p>
        ) : (
          <div style={s.grid}>
            {visiveis.map((q) => {
              const pill = PILL[q.status] || PILL.Livre;
              return (
                <div key={q.id} style={s.room}>
                  <div style={s.roomHeader}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Quarto {q.numero || q.nome || q.id}</div>
                    <span style={{ ...s.pill, background: pill.bg, color: pill.fg, border: `1px solid ${pill.bd}` }}>
                      {q.status === "Manutencao" ? "Manutenção" : q.status}
                    </span>
                  </div>

                  <div style={{ color: "#666", fontSize: 13 }}>
                    {q.tipo || "Padrão"} &middot; {q.capacidade || 2} hóspedes
                  </div>

                  {q.status === "Ocupado" && q.hospede && (
                    <div style={{ marginTop: 8, fontSize: 13 }}>
                      👤 {q.hospede?.nome} <br />
                      🗓️ Entrada: {formatarData(q.hospede?.dataEntrada)}
                    </div>
                  )}

                  <div style={s.actions}>
                    {q.status === "Livre" ? (
                      <Link to={`/quartos/checkin/${q.id}`} style={s.btnPrimary}>
                        🛎️ Acomodar
                      </Link>
                    ) : (
                      <button disabled style={s.btnGhost}>Indisponível</button>
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

// helpers e estilos
function formatarData(iso) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

const s = {
  wrapper: { minHeight: "100vh", background: "#f5f6f8", display: "grid", placeItems: "center", padding: 16 },
  card: { width: 960, maxWidth: "100%", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  link: { fontSize: 14, color: "#0b5ed7", textDecoration: "none" },
  toolbar: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 },
  select: { padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginTop: 8 },
  room: { border: "1px solid #eee", borderRadius: 12, padding: 12 },
  roomHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  pill: { fontSize: 12, padding: "2px 8px", borderRadius: 999 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 },
  btnPrimary: { background: "#0b5ed7", color: "#fff", padding: "8px 12px", borderRadius: 8, textDecoration: "none", border: "none" },
  btnGhost: { background: "#fff", color: "#333", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" },
  toast: { padding: "8px 10px", borderRadius: 8, fontSize: 13, marginBottom: 10 },
};
