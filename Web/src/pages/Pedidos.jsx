import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarPedidos() {
    try {
      const res = await api.get("/api/order"); 
      setPedidos(res.data);
    } catch (e) {
      setErro("Não foi possível carregar os pedidos/ordens.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  function formatarData(data) {
    if (!data) return "N/A";
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatarStatus(status) {
    if (status === 0) return "🕒 Aguardando";
    if (status === 1) return "🧑‍🍳 Em Processo";
    if (status === 2) return "✅ Finalizado";
    return status;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: 960,
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>📋 Pedidos</h2>

        {loading && <p>Carregando...</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {!loading && !erro && pedidos.length === 0 && (
          <p>Nenhum pedido registrado ainda.</p>
        )}

        {!loading && pedidos.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 12,
            }}
          >
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={{ textAlign: "left", padding: 8 }}>ID</th>
                <th style={{ textAlign: "left", padding: 8 }}>Quarto</th>
                <th style={{ textAlign: "left", padding: 8 }}>Hóspede</th>
                <th style={{ textAlign: "left", padding: 8 }}>Check-in</th>
                <th style={{ textAlign: "left", padding: 8 }}>Check-out</th>
                <th style={{ textAlign: "left", padding: 8 }}>Total (R$)</th>
                <th style={{ textAlign: "left", padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 8 }}>{p.id}</td>
                  <td style={{ padding: 8 }}>{p.roomId}</td>
                  <td style={{ padding: 8 }}>{p.customerName}</td>
                  <td style={{ padding: 8 }}>{formatarData(p.checkInDate)}</td>
                  <td style={{ padding: 8 }}>{formatarData(p.checkOutDate)}</td>
                  <td style={{ padding: 8 }}>{p.total?.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>
                    <strong>{formatarStatus(p.status)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Link
            to="/pedidos/novo"
            style={{
              background: "#0b5ed7",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            ➕ Novo Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
