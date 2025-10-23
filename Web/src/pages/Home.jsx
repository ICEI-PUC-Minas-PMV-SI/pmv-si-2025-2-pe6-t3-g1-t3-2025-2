// src/pages/Home.jsx
import { Link } from "react-router-dom";
import logoHF from "../assets/logoHF.png";
import addUsuario from "../assets/addUsuario.png";
import produto from "../assets/produto.png";
import pedido from "../assets/pedido.png";
import quarto from "../assets/quarto.png";
import "../pages/Home.css";

function getUsuario() {
  try {
    // se não existir, cai no "null" (string) e vira null de verdade
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function Home() {
  const usuario = getUsuario();

  return (
    <div className="hf-root">
      <div className="hf-card">
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

          <nav className="hf-grid" aria-label="Atalhos do sistema">
            {/* Quartos */}
            <Link to="/quartos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={quarto} alt="" width={22} height={22} className="hf-icon" loading="lazy" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Quartos</span>
                <span className="hf-cardsub">Acomodar hóspedes e visualizar status</span>
              </span>
              <span className="hf-arrow" aria-hidden>→</span>
            </Link>

            {/* Reservas (novo atalho útil) */}
            <Link to="/reservas" className="hf-cardlink">
              <span className="hf-iconbox">
                {/* Reaproveita o ícone de pedido/quarto se não tiver um específico */}
                <img src={pedido} alt="" width={22} height={22} className="hf-icon" loading="lazy" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Reservas</span>
                <span className="hf-cardsub">Criar, consultar e confirmar hospedagens</span>
              </span>
              <span className="hf-arrow" aria-hidden>→</span>
            </Link>

            {/* Usuários */}
            <Link to="/usuarios/novo" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={addUsuario} alt="" width={22} height={22} className="hf-icon" loading="lazy" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Cadastrar usuário</span>
                <span className="hf-cardsub">Criar acesso para a equipe</span>
              </span>
              <span className="hf-arrow" aria-hidden>→</span>
            </Link>

            {/* Produtos */}
            <Link to="/produtos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={produto} alt="" width={22} height={22} className="hf-icon" loading="lazy" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Produtos</span>
                <span className="hf-cardsub">Gerenciar cardápio e itens do restaurante</span>
              </span>
              <span className="hf-arrow" aria-hidden>→</span>
            </Link>

            {/* Pedidos */}
            <Link to="/pedidos" className="hf-cardlink">
              <span className="hf-iconbox">
                <img src={pedido} alt="" width={22} height={22} className="hf-icon" loading="lazy" />
              </span>
              <span className="hf-cardtext">
                <span className="hf-cardtitle">Pedidos</span>
                <span className="hf-cardsub">Registrar consumos e entregas</span>
              </span>
              <span className="hf-arrow" aria-hidden>→</span>
            </Link>
          </nav>

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
