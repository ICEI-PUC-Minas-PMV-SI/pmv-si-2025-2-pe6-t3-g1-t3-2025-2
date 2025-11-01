import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { acomodarHospede } from "../services/quartos";
import "./checkin.css";

/** Helpers */
function nowForInput() {
  const d = new Date();
  d.setSeconds(0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function toIsoUtc(inputValue) {
  const d = new Date(inputValue);
  return d.toISOString();
}

export default function QuartosCheckin() {
  const { quartoId } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [entrada, setEntrada] = useState(nowForInput());
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
    const dE = new Date(entrada);
    const dS = new Date(saidaPrevista);
    if (isNaN(+dE) || isNaN(+dS)) return "Datas inválidas.";
    if (dS <= dE) return "A saída prevista deve ser após a entrada.";
    const total = Number(adultos || 0) + Number(criancas || 0);
    if (total < 1) return "Inclua pelo menos 1 hóspede.";
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
        quartoId: Number(quartoId),
        nomeHospede: nome.trim(),
        documento: documento?.trim() || null,
        adultos: Number(adultos || 0),
        criancas: Number(criancas || 0),
        dataEntrada: toIsoUtc(entrada),
        dataSaidaPrevista: toIsoUtc(saidaPrevista),
        observacoes: obs?.trim() || null,
        tarifaDiaria: tarifaDiaria ? Number(tarifaDiaria) : null,
      });

      setOk("Hóspede acomodado com sucesso!");
      setTimeout(() => {
        navigate("/quartos", {
          replace: true,
          state: { toast: "Check-in realizado com sucesso!" },
        });
      }, 600);
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
    <div className="ci-root">
      <div className="ci-card">
        <div className="ci-header">
          <h2 className="ci-title">🛎️ Check-in — Quarto {quartoId}</h2>
          <Link to="/quartos" className="ci-link">← Voltar</Link>
        </div>

        {erro && <div className="ci-alert ci-alert--erro">{erro}</div>}
        {ok && <div className="ci-alert ci-alert--ok">{ok}</div>}

        <form onSubmit={aoSalvar} className="ci-form">
          <div className="ci-row">
            <label className="ci-label">Nome do hóspede *</label>
            <input
              className="ci-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Maria Souza"
              autoFocus
            />
          </div>

          <div className="ci-row">
            <label className="ci-label">Documento</label>
            <input
              className="ci-input"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="RG/CPF/Passaporte"
            />
          </div>

          <div className="ci-grid-2">
            <div className="ci-row">
              <label className="ci-label">Adultos</label>
              <input
                className="ci-input"
                type="number"
                min="0"
                value={adultos}
                onChange={(e) => setAdultos(e.target.value)}
              />
            </div>
            <div className="ci-row">
              <label className="ci-label">Crianças</label>
              <input
                className="ci-input"
                type="number"
                min="0"
                value={criancas}
                onChange={(e) => setCriancas(e.target.value)}
              />
            </div>
          </div>

          <div className="ci-grid-2">
            <div className="ci-row">
              <label className="ci-label">Entrada *</label>
              <input
                className="ci-input"
                type="datetime-local"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
              />
            </div>
            <div className="ci-row">
              <label className="ci-label">Saída prevista *</label>
              <input
                className="ci-input"
                type="datetime-local"
                value={saidaPrevista}
                onChange={(e) => setSaidaPrevista(e.target.value)}
              />
            </div>
          </div>

          <div className="ci-row">
            <label className="ci-label">Tarifa diária (R$)</label>
            <input
              className="ci-input"
              type="number"
              step="0.01"
              min="0"
              value={tarifaDiaria}
              onChange={(e) => setTarifaDiaria(e.target.value)}
              placeholder="Ex.: 350.00"
            />
          </div>

          <div className="ci-row">
            <label className="ci-label">Observações</label>
            <textarea
              className="ci-textarea"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Preferências, restrições, etc."
            />
          </div>

          <div className="ci-actions">
            <Link to="/quartos" className="ci-btn ci-btn--ghost">Cancelar</Link>
            <button
              type="submit"
              className="ci-btn ci-btn--primary"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Confirmar check-in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
