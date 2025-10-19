import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import UsuarioCreate from "./pages/UsuarioCreate.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/usuarios/novo" element={<UsuarioCreate />} />
    </Routes>
  );
}
