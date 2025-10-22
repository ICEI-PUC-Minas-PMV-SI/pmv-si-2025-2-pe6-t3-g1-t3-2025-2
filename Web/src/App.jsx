import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import UsuarioCreate from "./pages/UsuarioCreate.jsx";
import Home from "./pages/Home.jsx";
import EsqueciSenha from "./pages/EsqueciSenha.jsx";
import RotaPrivada from "./routes/RotaPrivada.jsx";

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

      {/* Exemplo de rota privada adicional */}
      <Route
        path="/usuarios/novo"
        element={
          <RotaPrivada>
            <UsuarioCreate />
          </RotaPrivada>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
