import { Link } from "react-router-dom";

export default function Home() {
  const usuario = JSON.parse(localStorage.getItem("user"));

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
        <h2 style={{ marginTop: 0 }}>
          Bem-vindo(a), {usuario?.nome || "usuário"} 👋
        </h2>
        <p style={{ color: "#666" }}>Escolha uma opção para começar:</p>

        <nav style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <Link to="/usuarios/novo">➕ Cadastrar usuário</Link>
          <Link to="/pedidos">📋 Pedidos</Link>
          <Link to="/produtos">🛒 Produtos</Link>
        </nav>

        {/* 🔗 Link Esqueci minha senha */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <a href="/esqueci-senha" style={{ fontSize: 13, color: "#0b5ed7" }}>
            Esqueci minha senha
          </a>
        </div>
      </div>
    </div>
  );
}
