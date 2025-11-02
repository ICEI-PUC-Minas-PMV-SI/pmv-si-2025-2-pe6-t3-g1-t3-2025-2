import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProdutos } from "../services/produtos"; // usa o service (rota certa /api/Produto)
import "./produtos.css";
// opcional: se tiver um ícone, descomente e troque o caminho
// import produtoIcon from "../assets/produto.png";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarProdutos() {
    try {
      setErro("");
      setLoading(true);
      const data = await listarProdutos();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div className="pr-root">
      <div className="pr-card">
        <div className="pr-header">
          <h2 className="pr-title">
            {/* {produtoIcon ? <img src={produtoIcon} alt="" className="pr-icon" /> : null} */}
            <span className="pr-emoji" aria-hidden>🛒</span>
            Produtos
          </h2>

          <div className="pr-actionsHeader">
            <button
              className="pr-btn pr-btn--ghost"
              onClick={carregarProdutos}
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </button>

            <Link to="/" className="pr-link">← Voltar</Link>

            <Link to="/produtos/novo" className="pr-btn pr-btn--primary">
              ➕ Novo Produto
            </Link>
          </div>
        </div>

        {erro && <div className="pr-toast pr-toast--erro">{erro}</div>}

        {loading ? (
          <p className="pr-loading">Carregando...</p>
        ) : produtos.length === 0 ? (
          <div className="pr-empty">Nenhum produto cadastrado ainda.</div>
        ) : (
          <div className="pr-tableWrap">
            <table className="pr-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço (R$)</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{Number(p.preco ?? 0).toFixed(2)}</td>
                    <td>{p.categoria ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
