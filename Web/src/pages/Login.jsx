import { useState } from "react";
import { useAuth } from "../context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !senha) return setError("Informe e-mail e senha.");
    const res = await login(email, senha);
    if (res.ok) navigate("/");
    else setError(res.message);
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ marginBottom: 8 }}>Acessar o sistema</h2>
        <p style={{ marginTop: 0, color: "#666" }}>Hotel Fazenda</p>

        <label style={styles.label}>E-mail</label>
        <input
          type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
          placeholder="seu@email.com" style={styles.input} autoFocus
        />

        <label style={styles.label}>Senha</label>
        <input
          type="password" value={senha} onChange={(e)=>setSenha(e.target.value)}
          placeholder="••••••••" style={styles.input}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f6f8" },
  card: { width: 360, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)", display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, color: "#222", marginTop: 8 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, outline: "none" },
  button: { marginTop: 12, padding: "10px 14px", borderRadius: 8, border: "none", background: "#0b5ed7", color: "#fff", cursor: "pointer" },
  error: { background: "#fde2e1", color: "#b21f1f", padding: "8px 10px", borderRadius: 8, fontSize: 13 }
};
