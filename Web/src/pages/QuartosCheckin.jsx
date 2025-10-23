// src/pages/QuartosCheckin.jsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { acomodarHospede } from "../services/quartos";

export default function QuartosCheckin() {
  const { quartoId } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [entrada, setEntrada] = useState(() => new Date().toISOString().slice(0,16)); // datetime-local
  const [saidaPrevista, setSaidaPrevista] = useState("");
  const [tarifaDiaria, setTarifaDiaria] = useState("");

  const [obs, setObs] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");
  const [salvando, setSalvando] = useState(false);

  function validar() {
    if (!nome.trim()) return "Informe o nome do hóspede.";
    if (!entrada) return "Informe a data/hora de entrada.";
    if (!saidaPrevista) return "Informe a data/hora de saída prevista.";
    return "";
  }

  async function aoSalvar(e) {
    e.preventDefault();
    setErro("");
    setOk("");
    const v = validar();
    if (v) return setErro(v);

    try {
      setSalvando(true);
      await acomodarHospede({
        quartoId,
        nomeHospede: nome,
        documento,
        adultos,
        criancas,
        dataEntrada: new Date(entrada).toISOString(),
        dataSaidaPrevista: new Date(saidaPrevista).toISOString(),
        observacoes: obs,
        tarifaDiaria,
      });
      setOk("Hóspede acomodado com sucesso!");
      setTimeout(() => {
        navigate("/quartos", {
          replace: true,
          state: { toast: "Check-in realizado com sucesso!" },
        });
      }, 700);
    } catch (err) {
      const detail =
        err?.response?.data?.mensagem ||
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível concluir o check-in.";
      setErro(detail);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
          <h2 style={{ margin: 0 }}>🛎️ Check-in — Quarto {quartoId}</h2>
          <Link to="/quartos" style={s.link}>← Voltar</Link>
        </div>

        {erro && <div style={{...s.alert, background:"#fde2e1", color:"#b21f1f", border:"1px solid #f5c2c0"}}>{erro}</div>}
        {ok &&   <div style={{...s.alert, background:"#e6f6e6", color:"#1b7f1b", border:"1px solid #cceccc"}}>{ok}</div>}

        <form onSubmit={aoSalvar} style={s.form}>
          <div style={s.row}>
            <label style={s.label}>Nome do hóspede *</label>
            <input style={s.input} value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Ex.: Maria Souza" autoFocus />
          </div>

          <div style={s.row}>
            <label style={s.label}>Documento</label>
            <input style={s.input} value={documento} onChange={(e)=>setDocumento(e.target.value)} placeholder="RG/CPF/Passaporte" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12 }}>
            <div style={s.row}>
              <label style={s.label}>Adultos</label>
              <input style={s.input} type="number" min="1" value={adultos} onChange={(e)=>setAdultos(e.target.value)} />
            </div>
            <div style={s.row}>
              <label style={s.label}>Crianças</label>
              <input style={s.input} type="number" min="0" value={criancas} onChange={(e)=>setCriancas(e.target.value)} />
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12 }}>
            <div style={s.row}>
              <label style={s.label}>Entrada *</label>
              <input style={s.input} type="datetime-local" value={entrada} onChange={(e)=>setEntrada(e.target.value)} />
            </div>
            <div style={s.row}>
              <label style={s.label}>Saída prevista *</label>
              <input style={s.input} type="datetime-local" value={saidaPrevista} onChange={(e)=>setSaidaPrevista(e.target.value)} />
            </div>
          </div>

          <div style={s.row}>
            <label style={s.label}>Tarifa diária (R$)</label>
            <input style={s.input} type="number" step="0.01" min="0" value={tarifaDiaria} onChange={(e)=>setTarifaDiaria(e.target.value)} placeholder="Ex.: 350.00" />
          </div>

          <div style={s.row}>
            <label style={s.label}>Observações</label>
            <textarea style={{...s.input, minHeight: 80, resize: "vertical"}} value={obs} onChange={(e)=>setObs(e.target.value)} placeholder="Preferências, restrições, etc." />
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap: 8 }}>
            <Link to="/quartos" style={s.btnGhost}>Cancelar</Link>
            <button type="submit" style={s.btnPrimary} disabled={salvando}>
              {salvando ? "Salvando..." : "Confirmar check-in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  wrapper: { minHeight: "100vh", background: "#f5f6f8", display: "grid", placeItems: "center", padding: 16 },
  card: { width: 720, maxWidth: "100%", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  link: { fontSize: 14, color: "#0b5ed7", textDecoration: "none" },
  form: { display: "grid", gap: 12 },
  row: { display: "grid", gap: 6 },
  label: { fontSize: 14, color: "#222" },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, outline: "none", background: "#fff" },
  btnPrimary: { background: "#0b5ed7", color: "#fff", padding: "10px 14px", borderRadius: 8, border: "none", minWidth: 160, cursor: "pointer" },
  btnGhost: { background: "#fff", color: "#333", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", minWidth: 120, textDecoration: "none", textAlign: "center" },
  alert: { padding: "8px 10px", borderRadius: 8, fontSize: 13, marginBottom: 10 },
};
