import { useState } from "react";
import { api } from "../services/api";

const ROLES = [
  { value: "Gerente", label: "Gerente" },
  { value: "Garcom", label: "Garçom" },
];

export default function UsuarioCreate() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", perfil: ROLES[0].value });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!form.nome || !form.email || !form.senha) {
      setErr("Preencha nome, e-mail e senha.");
      return;
    }

    setSaving(true);
    try {
      // endpoint esperado no back (ajuste se o seu for diferente)
      // Somente Administrador deve ter permissão neste endpoint.
      const res = await api.post("/api/usuarios", form);
      setMsg("Usuário cadastrado com sucesso!");
      setForm({ nome: "", email: "", senha: "", perfil: ROLES[0].value });
    } catch (e) {
      const m =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Erro ao salvar usuário.";
      setErr(m);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ marginBottom: 8 }}>Novo usuário</h2>
        <p style={{ marginTop: 0, color: "#666" }}>Apenas Administrador</p>

        <label style={styles.label}>Nome</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome completo"
          style={styles.input}
          required
        />

        <label style={styles.label}>E-mail</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@empresa.com"
          style={styles.input}
          required
        />

        <label style={styles.label}>Senha</label>
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          placeholder="••••••••"
          style={styles.input}
          required
        />

        <label style={styles.label}>Perfil</label>
        <select
          name="perfil"
          value={form.perfil}
          onChange={handleChange}
          style={{ ...styles.input, height: 40 }}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        {err && <div style={styles.error}>{err}</div>}
        {msg && <div style={styles.success}>{msg}</div>}

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f6f8" },
  card: { width: 420, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)", display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, color: "#222", marginTop: 8 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, outline: "none" },
  button: { marginTop: 12, padding: "10px 14px", borderRadius: 8, border: "none", background: "#0b5ed7", color: "#fff", cursor: "pointer" },
  error: { background: "#fde2e1", color: "#b21f1f", padding: "8px 10px", borderRadius: 8, fontSize: 13 },
  success: { background: "#e6f6e6", color: "#1b5e20", padding: "8px 10px", borderRadius: 8, fontSize: 13 }
};
