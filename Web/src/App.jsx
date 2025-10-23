import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import UsuarioCreate from "./pages/UsuarioCreate.jsx";
import Home from "./pages/Home.jsx";
import EsqueciSenha from "./pages/EsqueciSenha.jsx";
import Produtos from "./pages/Produtos.jsx";
import RotaPrivada from "./routes/RotaPrivada.jsx";
import ProdutoCreate from "./pages/ProdutoCreate.jsx";
import Quartos from "./pages/Quartos.jsx";
import QuartosCheckin from "./pages/QuartosCheckin.jsx";
import Reservas from "./pages/Reservas.jsx";
import ReservaNova from "./pages/ReservaNova.jsx";
import ContaHospedagem from "./pages/ContaHospedagem.jsx";


export default function App() {
  return (
    <Routes>
      {/* Página principal do sistema */}
      <Route
        path="/"
        element={
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        }
      />

      {/* Acesso */}
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />

      {/* Usuários */}
      <Route
        path="/usuarios/novo"
        element={
          <RotaPrivada>
            <UsuarioCreate />
          </RotaPrivada>
        }
      />

      {/* Produtos */}
      <Route
        path="/produtos"
        element={
          <RotaPrivada>
            <Produtos />
          </RotaPrivada>
        }
      />

      <Route
        path="/produtos/novo"
        element={
          <RotaPrivada>
            <ProdutoCreate />
          </RotaPrivada>
        }
      />

      <Route
        path="/quartos"
        element={
          <RotaPrivada>
            <Quartos />
          </RotaPrivada>
        }
      />

      <Route
        path="/quartos/checkin/:quartoId"
        element={
          <RotaPrivada>
            <QuartosCheckin />
          </RotaPrivada>
        }
      />

      <Route
        path="/reservas"
        element={
          <RotaPrivada>
            <Reservas />
          </RotaPrivada>
        }
      />
      <Route
        path="/reservas/nova"
        element={
          <RotaPrivada>
            <ReservaNova />
          </RotaPrivada>
        }
      />

      <Route
        path="/conta/:hospedagemId"
        element={
          <RotaPrivada>
            <ContaHospedagem />
          </RotaPrivada>
        }
      />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
