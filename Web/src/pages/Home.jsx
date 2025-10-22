import { Link } from "react-router-dom";
import logoHF from "../assets/logoHF.png";
import pedidoIcon from "../assets/pedido.png";
import addUsuario from "../assets/addUsuario.png";
import produtoIcon from "../assets/produto.png";
import "./Home.css"; // ⬅️ importe o CSS

export default function Home() {
  const usuario = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="hf-root">
      <div className="hf-card">
        {/* Header / Hero */}
        <div className="hf-hero">
          <img
            src={logoHF}
            alt="Logo do Hotel Fazenda"
            className="hf-logo"
          />
          <div className="hf-hero-text">
            <h1>Sistema de Gestão — Hotel Fazenda</h1>
            <p>
              Bem-vindo(a), <strong>{usuario?.nome || "usuário"}</strong> 👋
            </p>
            <p className="hf-hero-sub">Gerencie usuários, pedidos e produtos num só lugar.</p>
          </div>
        </div>

        {/* Corpo */}
        <div className="hf-body">
          <p className="hf-intro">Escolha uma opção para começar:</p>

          {/* Grid de cards */}
          <nav className="hf-grid">
            <Link to="/usuarios/novo" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={addUsuario} alt="" className="hf-icon" />
              </span>
              <div className="hf-cardtext">
                <span className="hf-cardtitle">Cadastrar usuário</span>
                <small className="hf-cardsub">Crie acessos para gerente e garçom</small>
              </div>
              <span className="hf-arrow">›</span>
            </Link>

            <Link to="/pedidos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={pedidoIcon} alt="" className="hf-icon" />
              </span>
              <div className="hf-cardtext">
                <span className="hf-cardtitle">Pedidos</span>
                <small className="hf-cardsub">Acompanhe e gerencie pedidos</small>
              </div>
              <span className="hf-arrow">›</span>
            </Link>

            <Link to="/produtos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={produtoIcon} alt="" className="hf-icon" />
              </span>
              <div className="hf-cardtext">
                <span className="hf-cardtitle">Produtos</span>
                <small className="hf-cardsub">Cadastre e organize o catálogo</small>
              </div>
              <span className="hf-arrow">›</span>
            </Link>
          </nav>

          {/* Rodapé mini */}
          <div className="hf-footer">
            <a href="/esqueci-senha" className="hf-link">
              Esqueci minha senha
            </a>
            <span className="hf-copy">
              © {new Date().getFullYear()} Hotel Fazenda — Todos os direitos reservados
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
