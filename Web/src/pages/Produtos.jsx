import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarProdutos() {
    try {
      const res = await api.get("/api/produto");
      setProdutos(res.data);
    } catch (e) {
      setErro("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

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
          width: 720,
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>🛒 Produtos</h2>

        {loading && <p>Carregando...</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {!loading && !erro && produtos.length === 0 && (
          <p>Nenhum produto cadastrado ainda.</p>
        )}

        {!loading && produtos.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 12,
            }}
          >
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Nome</th>
                <th style={{ textAlign: "left", padding: 8 }}>Preço (R$)</th>
                <th style={{ textAlign: "left", padding: 8 }}>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 8 }}>{p.nome}</td>
                  <td style={{ padding: 8 }}>{p.preco?.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{p.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Link
            to="/produtos/novo"
            style={{
              background: "#0b5ed7",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            ➕ Novo Produto
          </Link>
        </div>
      </div>
    </div>
  );
}
