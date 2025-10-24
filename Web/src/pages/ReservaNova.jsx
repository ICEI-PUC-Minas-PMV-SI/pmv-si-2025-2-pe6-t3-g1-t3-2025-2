import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buscarQuartosLivres, criarReserva } from "../services/reservas";
import "./reservas.css";



export default function ReservaNova() {
  const [hospedeNome, setHospedeNome] = useState("");
  const [hospedeDocumento, setHospedeDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [qtdeHospedes, setQtdeHospedes] = useState(2);
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [quartoId, setQuartoId] = useState("");
  const [quartos, setQuartos] = useState([]);

  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  // carrega quartos livres quando datas mudarem
  useEffect(() => {
    async function carregar() {
      setQuartos([]);
      if (!dataEntrada || !dataSaida) return;
      try {
        const res = await buscarQuartosLivres({ dataEntrada, dataSaida, capacidade: qtdeHospedes });
        setQuartos(res || []);
      } catch {
        // silencioso
      }
    }
    carregar();
  }, [dataEntrada, dataSaida, qtdeHospedes]);

  function validar(){
    if(!hospedeNome.trim()) return "Informe o nome do hóspede.";
    if(!dataEntrada || !dataSaida) return "Informe as datas de entrada e saída.";
    if(new Date(dataSaida) <= new Date(dataEntrada)) return "A data de saída deve ser após a entrada.";
    if(!quartoId) return "Selecione um quarto disponível.";
    return "";
  }

  async function aoSalvar(e){
    e.preventDefault();
    setErro(""); setOk("");
    const msg = validar();
    if (msg) return setErro(msg);

    try{
      setSalvando(true);
      await criarReserva({
        hospedeNome, hospedeDocumento, telefone,
        qtdeHospedes: Number(qtdeHospedes),
        dataEntrada, dataSaida, quartoId
      });
      setOk("Reserva criada com sucesso!");
      setTimeout(()=> navigate("/reservas", { replace:true }), 700);
    }catch(err){
      const detail = err?.response?.data?.mensagem || err?.message || "Falha ao criar reserva.";
      setErro(detail);
    }finally{
      setSalvando(false);
    }
  }

  return (
    <div className="rr-root">
      <div className="rr-card">
        <div className="rr-header">
          <h2 className="rr-title">➕ Nova reserva</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/reservas" className="rr-link">← Voltar</Link>
          </div>
        </div>

        {ok &&  <div className="rr-toast rr-toast--ok">{ok}</div>}
        {erro && <div className="rr-toast rr-toast--erro">{erro}</div>}

        <form className="rr-form" onSubmit={aoSalvar} noValidate>
          <div className="rr-grid">
            <div className="rr-col-6">
              <label className="rr-label">Hóspede *</label>
              <input className="rr-input" value={hospedeNome} onChange={(e)=>setHospedeNome(e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="rr-col-3">
              <label className="rr-label">Documento</label>
              <input className="rr-input" value={hospedeDocumento} onChange={(e)=>setHospedeDocumento(e.target.value)} placeholder="CPF/RG" />
            </div>
            <div className="rr-col-3">
              <label className="rr-label">Telefone</label>
              <input className="rr-input" value={telefone} onChange={(e)=>setTelefone(e.target.value)} placeholder="(xx) xxxxx-xxxx" />
            </div>

            <div className="rr-col-3">
              <label className="rr-label">Entrada *</label>
              <input className="rr-input" type="date" value={dataEntrada} onChange={(e)=>setDataEntrada(e.target.value)} />
              <div className="rr-help">Check-in</div>
            </div>
            <div className="rr-col-3">
              <label className="rr-label">Saída *</label>
              <input className="rr-input" type="date" value={dataSaida} onChange={(e)=>setDataSaida(e.target.value)} />
              <div className="rr-help">Check-out</div>
            </div>
            <div className="rr-col-3">
              <label className="rr-label">Hóspedes</label>
              <input className="rr-input" type="number" min="1" value={qtdeHospedes} onChange={(e)=>setQtdeHospedes(e.target.value)} />
            </div>
            <div className="rr-col-3">
              <label className="rr-label">Quarto *</label>
              <select className="rr-select" value={quartoId} onChange={(e)=>setQuartoId(e.target.value)}>
                <option value="">Selecione…</option>
                {quartos.map(q => (
                  <option key={q.id} value={q.id}>
                    {q.numero || q.nome || `Quarto ${q.id}`} — {q.capacidade || 2} hóspedes
                  </option>
                ))}
              </select>
              <div className="rr-help">{quartos.length ? "Quartos livres para o período" : "Informe as datas para listar disponibilidade"}</div>
            </div>

            <div className="rr-col-12" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Link to="/reservas" className="rr-btn rr-btn--ghost">Cancelar</Link>
              <button className="rr-btn rr-btn--primary" disabled={salvando}>
                {salvando ? "Salvando…" : "Salvar reserva"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
