import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listarQuartos } from "../services/quartos";
import { listarReservasAtivasAgora } from "../services/reservas"; // <-- NOVO
import "./quartos.css";
import quartoIcon from "../assets/quarto.png";

/** Está “ocupado agora” se: não cancelada/finalizada E (entrada <= agora < saída) */
function isOcupadaAgora(r) {
  const status = (r.status ?? r.Status ?? "").toString().toLowerCase();
  if (status.includes("cancel") || status.includes("final")) return false;

  const de = new Date(r.dataEntrada ?? r.DataEntrada);
  const ate = new Date(r.dataSaida ?? r.DataSaida);
  const now = new Date();
  if (isNaN(+de) || isNaN(+ate)) return false;
  return de <= now && now < ate;
}

function formatarData(iso) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString("pt-BR"); } catch { return iso; }
}

export default function Quartos() {
  const [quartos, setQuartos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // 15 “slots” base (preenche caso back traga < 15)
  function seedQuartosBase() {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      numero: i + 1,
      status: "Livre",
      tipo: "Padrão",
      capacidade: 2,
    }));
  }

  // Merge: usamos os dados reais do back quando existir, senão completa até 15
  function ensureFifteen(list = []) {
    const base = seedQuartosBase();
    const byNumero = new Map(list.map(q => [Number(q.numero ?? q.id), q]));
    return base.map(b => (byNumero.get(b.numero) ? { ...b, ...byNumero.get(b.numero) } : b));
  }

  async function carregar() {
    try {
      setLoading(true);
      setErro("");

      // 1) Quartos “crus” do backend (podem vir com status, mas sem hóspede)
      const rooms = await listarQuartos();
      const roomsSafe = Array.isArray(rooms) ? rooms : [];

      // 2) Reservas ativas AGORA (filtramos no front para garantir)
      const reservasAtivas = await listarReservasAtivasAgora();

      // Index por quarto para achar hóspede + status
      const porQuarto = new Map();
      for (const r of reservasAtivas) {
        const quartoId = r.quartoId ?? r.QuartoId ?? r.quarto?.id ?? r.Quarto?.Id ?? null;
        const quartoNumero =
          r.quartoNumero ?? r.QuartoNumero ?? r.Quarto?.Numero ?? r.roomNumero ?? r.RoomNumero ?? null;

        // Chave preferencial por ID; se não tiver, por número
        const key = quartoId ?? quartoNumero;
        if (key == null) continue;
        if (!porQuarto.has(key) && isOcupadaAgora(r)) {
          porQuarto.set(key, {
            hospede: {
              nome: r.hospedeNome ?? r.HospedeNome ?? "-",
              dataEntrada: r.dataEntrada ?? r.DataEntrada,
            },
            status: "Ocupado",
          });
        }
      }

      // Normaliza rooms, aplicando ocupação vinda das reservas
      const roomsComOcupacao = roomsSafe.map(q => {
        const key = q.id ?? q.Id ?? q.numero ?? q.Numero;
        const extra = porQuarto.get(key);
        return {
          id: q.id ?? q.Id ?? key,
          numero: q.numero ?? q.Numero ?? key,
          capacidade: q.capacidade ?? q.Capacidade ?? 2,
          tipo: q.tipo ?? q.Tipo ?? "Padrão",
          status: extra?.status ?? (q.status ?? q.Status ?? "Livre"),
          hospede: extra?.hospede ?? null,
        };
      });

      setQuartos(ensureFifteen(roomsComOcupacao));
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os quartos (mostrando padrão).");
      setQuartos(ensureFifteen([]));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  // Toast via navigation state
  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      navigate(location.pathname, { replace: true, state: {} });
      const t = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(t);
    }
  }, [location, navigate]);

  // Auto-refresh a cada 15s (para virar “ocupado” logo após check-in)
  useEffect(() => {
    timerRef.current = setInterval(() => carregar(), 15000);
    return () => clearInterval(timerRef.current);
  }, []);

  const visiveis = useMemo(() => {
    if (filtro === "Todos") return quartos;
    if (filtro === "Livre") return quartos.filter(q => (q.status ?? "Livre") === "Livre");
    if (filtro === "Ocupado") return quartos.filter(q => (q.status ?? "") === "Ocupado");
    return quartos.filter(q => (q.status ?? "") === "Manutencao");
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
          <div style={{display:"flex", gap:10, alignItems:"center"}}>
            <button className="qr-btn qr-btn--ghost" onClick={carregar} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
            <Link to="/" className="qr-link">← Voltar</Link>
          </div>
        </div>

        {toast && <div className="qr-toast qr-toast--ok">{toast}</div>}
        {erro && <div className="qr-toast qr-toast--erro">{erro}</div>}

        <div className="qr-toolbar">
          <label style={{ fontSize: 14, color: "var(--texto)" }}>Filtrar:</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="qr-select">
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
                  <div className="qr-roomTitle">Quarto {q.numero ?? q.nome ?? q.id}</div>
                  <span className={classePill(q.status)}>
                    {q.status === "Manutencao" ? "Manutenção" : (q.status ?? "Livre")}
                  </span>
                </div>

                <div className="qr-roomMeta">
                  {q.tipo || "Padrão"} &middot; {q.capacidade || 2} hóspedes
                </div>

                {(q.status === "Ocupado" && q.hospede) && (
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
