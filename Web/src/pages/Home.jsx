// src/pages/Home.jsx
import { Link } from "react-router-dom";
import logoHF from "../assets/logoHF.png";
import addUsuario from "../assets/addUsuario.png";
import produto from "../assets/produto.png";
import pedido from "../assets/pedido.png";
import quarto from "../assets/quarto.png";
import "../pages/Home.css"; // usa o CSS local

export default function Home() {
  const usuario = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="hf-root">
      <div className="hf-card">
        {/* HERO */}
        <div className="hf-hero">
          <img src={logoHF} alt="Logo Hotel Fazenda" className="hf-logo" />
          <div className="hf-hero-text">
            <h1>Sistema de Gestão — Hotel Fazenda</h1>
            <p className="hf-hero-sub">
              Bem-vindo(a), {usuario?.nome || "usuário"} 👋
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="hf-body">
          <p className="hf-intro">Escolha uma opção para começar:</p>

          <div className="hf-grid">
            {/* Quartos */}
            <Link to="/quartos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={quarto} alt="Ícone de quartos" className="hf-icon" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Quartos</span>
                <span className="hf-cardsub">Acomodar hóspedes e visualizar status</span>
              </span>
              <span className="hf-arrow">→</span>
            </Link>

            {/* Usuários */}
            <Link to="/usuarios/novo" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={addUsuario} alt="Ícone de usuários" className="hf-icon" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Cadastrar usuário</span>
                <span className="hf-cardsub">Criar acesso para a equipe</span>
              </span>
              <span className="hf-arrow">→</span>
            </Link>

            {/* Produtos */}
            <Link to="/produtos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={produto} alt="Ícone de produtos" className="hf-icon" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Produtos</span>
                <span className="hf-cardsub">Gerenciar cardápio e itens do restaurante</span>
              </span>
              <span className="hf-arrow">→</span>
            </Link>

            {/* Pedidos */}
            <Link to="/pedidos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={pedido} alt="Ícone de pedidos" className="hf-icon" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Pedidos</span>
                <span className="hf-cardsub">Registrar consumos e entregas</span>
              </span>
              <span className="hf-arrow">→</span>
            </Link>
          </div>

          {/* FOOTER */}
          <div className="hf-footer">
            <Link to="/esqueci-senha" className="hf-link">
              Esqueci minha senha
            </Link>
            <span className="hf-copy">
              © {new Date().getFullYear()} Hotel Fazenda
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
