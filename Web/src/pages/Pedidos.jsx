// src/pages/Pedidos.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPedidos, criarPedido } from "../services/pedidos";
import { listarReservasAtivasAgora } from "../services/reservas";
import { listarProdutos } from "../services/produtos";
import "./Pedidos.css";

export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [reservationId, setReservationId] = useState("");
  const [itens, setItens] = useState([{ productId: "", quantity: 1 }]);

  async function carregarTudo() {
    setLoading(true);
    setErro("");

    try {
      const [pedRes, resAtivas, prodsRes] = await Promise.allSettled([
        getPedidos(),                 // GET /api/Order  (service enriquece com dados da reserva)
        listarReservasAtivasAgora(),  // GET /api/Reservations (filtra no front “ativas agora”)
        listarProdutos(),             // GET /api/Produto
      ]);

      // --- pedidos ---
      if (pedRes.status === "fulfilled") {
        const lista = Array.isArray(pedRes.value) ? pedRes.value : [];
        setPedidos(lista);
      } else {
        console.error("Falha ao carregar pedidos:", pedRes.reason);
      }

      // --- reservas ativas ---
      if (resAtivas.status === "fulfilled") {
        const arr = Array.isArray(resAtivas.value) ? resAtivas.value : [];
        setReservas(arr);

        if (!reservationId && arr.length) {
          const primeiroId = arr[0].id ?? arr[0].Id ?? "";
          setReservationId(primeiroId);
        }
      } else {
        console.error("Falha ao carregar reservas ativas:", resAtivas.reason);
      }

      // --- produtos (filtra por categoria “alimento” quando existir) ---
      if (prodsRes.status === "fulfilled") {
        const lista = Array.isArray(prodsRes.value) ? prodsRes.value : [];
        setProdutos(
          lista.filter((p) =>
            String(p.categoria ?? p.Categoria ?? "").toLowerCase().includes("alimento")
          )
        );
      } else {
        console.warn("Produtos não carregados:", prodsRes.reason);
      }

      if (pedRes.status === "rejected" || resAtivas.status === "rejected") {
        setErro("Erro ao carregar dados. Verifique conexão e autenticação.");
      }
    } catch (e) {
      console.error("carregarTudo falhou:", e);
      setErro("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const produtosById = useMemo(() => {
    const map = new Map();
    produtos.forEach((p) => map.set(Number(p.id ?? p.Id), p));
    return map;
  }, [produtos]);

  const totalEstimado = useMemo(() => {
    return itens.reduce((acc, it) => {
      const prod = produtosById.get(Number(it.productId));
      const preco = Number(prod?.preco ?? prod?.Preco ?? prod?.price ?? 0);
      const qtd = Number(it.quantity || 0);
      return acc + preco * qtd;
    }, 0);
  }, [itens, produtosById]);

  function formatarData(data) {
    if (!data) return "N/A";
    const d = new Date(data);
    return isNaN(+d) ? "N/A" : d.toLocaleDateString("pt-BR");
  }
  function formatarMoeda(v) {
    return Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function formatarStatus(status) {
    const s = String(status ?? "").toLowerCase();
    if (s.includes("aguard") || s === "0") return "🕒 Aguardando";
    if (s.includes("process") || s === "1") return "🧑‍🍳 Em Processo";
    if (s.includes("final") || s === "2") return "✅ Finalizado";
    return status ?? "—";
  }

  function addItem() {
    setItens((prev) => [...prev, { productId: "", quantity: 1 }]);
  }
  function removeItem(idx) {
    setItens((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateItem(idx, key, value) {
    setItens((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      if (!reservationId) throw new Error("Selecione um hóspede acomodado.");
      const itensValidos = itens.filter((i) => i.productId && Number(i.quantity) > 0);
      if (!itensValidos.length) throw new Error("Adicione ao menos 1 item válido.");

      await criarPedido({
        reservationId: Number(reservationId),
        items: itensValidos.map((i) => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity),
        })),
      });

      setItens([{ productId: "", quantity: 1 }]);
      await carregarTudo();
    } catch (e) {
      setErro(e?.message || "Erro ao salvar o pedido.");
    }
  }

  return (
    <div className="pedidos-page">
      <div className="pedidos-card">
        <header className="pedidos-header">
          <button type="button" className="btn-back" onClick={() => navigate(-1)} aria-label="Voltar">
            ← Voltar
          </button>
          <h2 className="pedidos-title">📋 Pedidos</h2>
        </header>

        {loading && <p className="info">Carregando...</p>}
        {erro && <p className="error">{erro}</p>}

        {/* Novo Pedido */}
        <section className="section">
          <h3 className="section-title">➕ Novo Pedido</h3>
          <form className="pedido-form" onSubmit={onSubmit}>
            <div className="field">
              <label className="label">Hóspede (reserva ativa)</label>
              <select
                className="select"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {reservas.map((r) => {
                  const id = r.id ?? r.Id;
                  const hospede = r.hospedeNome ?? r.HospedeNome ?? "—";
                  const quarto = r.quarto ?? r.Quarto ?? r.quartoNumero ?? r.QuartoNumero ?? "—";
                  return (
                    <option key={id} value={id}>
                      #{id} • Quarto {quarto} • {hospede}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="field">
              <label className="label">Itens</label>

              {itens.map((it, idx) => {
                const prod = produtosById.get(Number(it.productId));
                const preco = Number(prod?.preco ?? prod?.Preco ?? prod?.price ?? 0);
                const subtotal = preco * Number(it.quantity || 0);

                return (
                  <div className="item-row" key={idx}>
                    <select
                      className="select"
                      value={it.productId}
                      onChange={(e) => updateItem(idx, "productId", e.target.value)}
                    >
                      <option value="">Selecione o alimento…</option>
                      {produtos.map((p) => (
                        <option key={p.id ?? p.Id} value={p.id ?? p.Id}>
                          {(p.nome ?? p.Nome) + " - " + formatarMoeda(p.preco ?? p.Preco ?? p.price ?? 0)}
                        </option>
                      ))}
                    </select>

                    <input
                      className="input-qty"
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    />

                    <div className="item-subtotal">{formatarMoeda(subtotal)}</div>

                    <button type="button" className="btn-remove" onClick={() => removeItem(idx)} title="Remover">
                      ✕
                    </button>
                  </div>
                );
              })}

              <button type="button" className="btn-primary" onClick={addItem}>
                + Adicionar item
              </button>
            </div>

            <div className="total">
              Total estimado: <strong>{formatarMoeda(totalEstimado)}</strong>
            </div>

            <div className="actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setReservationId("");
                  setItens([{ productId: "", quantity: 1 }]);
                }}
              >
                Limpar
              </button>
              <button type="submit" className="btn-success">
                Salvar Pedido
              </button>
            </div>
          </form>
        </section>

        {/* Lista de pedidos */}
        <section className="section">
          <h3 className="section-title">📦 Pedidos cadastrados</h3>

          {!loading && !erro && pedidos.length === 0 && (
            <p className="info">Nenhum pedido registrado ainda.</p>
          )}

          {!loading && pedidos.length > 0 && (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reserva</th>
                    <th>Quarto</th>
                    <th>Hóspede</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id ?? p.Id}>
                      <td>{p.id ?? p.Id}</td>
                      <td>{p.reservationId ?? p.ReservationId}</td>
                      <td>{p.quarto ?? p.Quarto ?? "—"}</td>
                      <td>{p.hospedeNome ?? p.HospedeNome ?? "—"}</td>
                      <td>{formatarData(p.checkInDate ?? p.CheckInDate)}</td>
                      <td>{formatarData(p.checkOutDate ?? p.CheckOutDate)}</td>
                      <td>{formatarMoeda(p.total ?? p.Total)}</td>
                      <td>{formatarStatus(p.status ?? p.Status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
