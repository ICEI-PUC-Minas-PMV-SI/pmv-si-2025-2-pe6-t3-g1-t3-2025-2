import { Link } from "react-router-dom";
import logoHF from "../assets/logoHF.png";

export default function Home() {
  const usuario = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        display: "grid",
        placeItems: "center",
        padding: 16,
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
        {/* 🏨 Logo e título */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={logoHF}
            alt="Logo do Hotel Fazenda"
            style={{
              width: 140,
              objectFit: "contain",
              marginBottom: 8,
            }}
          />
          <h1 style={{ margin: 0, fontSize: 22, color: "#1a1a1a" }}>
            Sistema de Gestão - Hotel Fazenda
          </h1>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />

        {/* 👋 Saudação */}
        <h2 style={{ marginTop: 0, color: "#333" }}>
          Bem-vindo(a), {usuario?.nome || "usuário"} 👋
        </h2>
        <p style={{ color: "#666", marginTop: 4 }}>
          Escolha uma opção para começar:
        </p>

        {/* 🔗 Navegação principal */}
        <nav
          style={{
            display: "grid",
            gap: 8,
            marginTop: 16,
          }}
        >
          <Link
            to="/usuarios/novo"
            style={{
              textDecoration: "none",
              color: "#0b5ed7",
              fontWeight: "500",
            }}
          >
            ➕ Cadastrar usuário
          </Link>

          <Link
            to="/pedidos"
            style={{
              textDecoration: "none",
              color: "#0b5ed7",
              fontWeight: "500",
            }}
          >
            📋 Pedidos
          </Link>

          <Link
            to="/produtos"
            style={{
              textDecoration: "none",
              color: "#0b5ed7",
              fontWeight: "500",
            }}
          >
            🛒 Produtos
          </Link>
        </nav>

        {/* 🔐 Esqueci minha senha */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 24,
          }}
        >
          <a
            href="/esqueci-senha"
            style={{
              fontSize: 13,
              color: "#0b5ed7",
              textDecoration: "none",
            }}
          >
            Esqueci minha senha
          </a>
        </div>
      </div>
    </div>
  );
}
