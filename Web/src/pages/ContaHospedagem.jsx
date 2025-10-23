import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { obterHospedagem, listarLancamentos, adicionarLancamento, fecharConta } from "../services/conta";
import "./conta.css";

export default function ContaHospedagem() {
  const { hospedagemId } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  // form de novo lançamento
  const [tipo, setTipo] = useState("Consumo"); // Consumo | Diaria | Taxa | Desconto
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [qtd, setQtd] = useState(1);

  async function carregar() {
    try {
      setLoading(true);
      const [h, l] = await Promise.all([
        obterHospedagem(hospedagemId),
        listarLancamentos(hospedagemId),
      ]);
      setInfo(h || null);
      setItens(Array.isArray(l) ? l : []);
    } catch {
      setErro("Não foi possível carregar a conta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [hospedagemId]);

  const totais = useMemo(() => {
    const subtotal = itens.reduce((acc, i) => acc + (i.valor * (i.qtd ?? 1)), 0);
    const descontos = itens
      .filter(i => (i.tipo || "").toLowerCase() === "desconto")
      .reduce((acc, i) => acc + (i.valor * (i.qtd ?? 1)), 0);
    const total = subtotal; // já considera descontos como valor negativo
    return { subtotal, descontos, total };
  }, [itens]);

  async function onAdicionar(e) {
    e.preventDefault();
    setErro(""); setOk("");

    const v = Number(valor);
    const q = Number(qtd || 1);
    if (!descricao.trim()) return setErro("Informe a descrição do lançamento.");
    if (Number.isNaN(v)) return setErro("Informe um valor numérico.");
    if (tipo !== "Desconto" && v <= 0) return setErro("Valor deve ser maior que zero.");
    if (tipo === "Desconto" && v >= 0) return setErro("Desconto deve ser negativo (ex.: -20).");

    try {
      await adicionarLancamento(hospedagemId, { tipo, descricao, valor: v, qtd: q });
      setOk("Lançamento adicionado.");
      setDescricao(""); setValor(""); setQtd(1); setTipo("Consumo");
      await carregar();
    } catch (err) {
      const msg = err?.response?.data?.mensagem || err?.message || "Falha ao adicionar lançamento.";
      setErro(msg);
    }
  }

  async function onFecharConta() {
    setErro(""); setOk("");
    try {
      await fecharConta(hospedagemId);
      navigate("/reservas", { replace: true, state: { toast: "Conta fechada com sucesso." } });
    } catch (err) {
      const msg = err?.response?.data?.mensagem || err?.message || "Não foi possível fechar a conta.";
      setErro(msg);
    }
  }

  return (
    <div className="ct-root">
      <div className="ct-card">
        <div className="ct-header">
          <h2 className="ct-title">🧾 Conta da Hospedagem</h2>
          <div className="ct-actionsHeader">
            <Link to="/reservas" className="ct-link">← Voltar</Link>
            <button
              className="ct-btn ct-btn--danger"
              disabled={loading || !info || itens.length === 0}
              onClick={onFecharConta}
              title={itens.length === 0 ? "Sem lançamentos" : "Encerrar e gerar recibo"}
            >
              Fechar conta
            </button>
          </div>
        </div>

        {ok &&  <div className="ct-toast ct-toast--ok" role="status">{ok}</div>}
        {erro && <div className="ct-toast ct-toast--erro" role="alert">{erro}</div>}

        {loading ? (
          <p>Carregando…</p>
        ) : !info ? (
          <div className="ct-empty">Hospedagem não encontrada.</div>
        ) : (
          <>
            {/* dados resumidos */}
            <section className="ct-info">
              <div>
                <div className="ct-infoLbl">Hóspede</div>
                <div className="ct-infoVal">{info.hospedeNome}</div>
              </div>
              <div>
                <div className="ct-infoLbl">Quarto</div>
                <div className="ct-infoVal">{info.quartoLabel || `Quarto ${info.quartoNumero}`}</div>
              </div>
              <div>
                <div className="ct-infoLbl">Período</div>
                <div className="ct-infoVal">
                  {formatarData(info.dataEntrada)} — {formatarData(info.dataSaida)}
                </div>
              </div>
              <div>
                <div className="ct-infoLbl">Hóspedes</div>
                <div className="ct-infoVal">{info.qtdHospedes}</div>
              </div>
            </section>

            {/* lançamentos + resumo */}
            <div className="ct-layout">
              <section className="ct-lancBox">
                <h3 className="ct-subtitle">Lançamentos</h3>
                {itens.length === 0 ? (
                  <div className="ct-empty">Nenhum lançamento até o momento.</div>
                ) : (
                  <div className="ct-tableWrap">
                    <table className="ct-table">
                      <thead>
                        <tr>
                          <th className="ct-th">Tipo</th>
                          <th className="ct-th">Descrição</th>
                          <th className="ct-th ct-num">Qtd</th>
                          <th className="ct-th ct-num">Valor (R$)</th>
                          <th className="ct-th ct-num">Total (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itens.map((i) => (
                          <tr key={i.id} className="ct-row">
                            <td className="ct-td">{i.tipo}</td>
                            <td className="ct-td">{i.descricao}</td>
                            <td className="ct-td ct-num">{i.qtd ?? 1}</td>
                            <td className="ct-td ct-num">{formatarMoeda(i.valor)}</td>
                            <td className="ct-td ct-num">{formatarMoeda(i.valor * (i.qtd ?? 1))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <aside className="ct-side">
                <h3 className="ct-subtitle">Adicionar lançamento</h3>
                <form className="ct-form" onSubmit={onAdicionar} noValidate>
                  <label className="ct-label">Tipo</label>
                  <select className="ct-input" value={tipo} onChange={(e)=>setTipo(e.target.value)}>
                    <option>Consumo</option>
                    <option>Diaria</option>
                    <option>Taxa</option>
                    <option>Desconto</option>
                  </select>

                  <label className="ct-label">Descrição</label>
                  <input className="ct-input" value={descricao} onChange={(e)=>setDescricao(e.target.value)} placeholder="Ex.: Diária 01/10" />

                  <div className="ct-split2">
                    <div>
                      <label className="ct-label">Valor (R$)</label>
                      <input className="ct-input" type="number" step="0.01" value={valor} onChange={(e)=>setValor(e.target.value)} placeholder={tipo==="Desconto"?"Ex.: -20.00":"Ex.: 120.00"} />
                    </div>
                    <div>
                      <label className="ct-label">Qtd</label>
                      <input className="ct-input" type="number" min="1" value={qtd} onChange={(e)=>setQtd(e.target.value)} />
                    </div>
                  </div>

                  <button className="ct-btn ct-btn--primary">Adicionar</button>
                </form>

                <div className="ct-resumo">
                  <div className="ct-rowR"><span>Subtotal</span><strong>{formatarMoeda(totais.subtotal)}</strong></div>
                  <div className="ct-rowR"><span>Descontos</span><strong>{formatarMoeda(totais.descontos)}</strong></div>
                  <div className="ct-rowR ct-total"><span>Total</span><strong>{formatarMoeda(totais.total)}</strong></div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatarData(iso){
  if(!iso) return "—";
  try{ return new Date(iso).toLocaleDateString(); }catch{return iso;}
}
function formatarMoeda(n){
  if(typeof n !== "number") return "—";
  return n.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
}
