import { useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthProvider.jsx";

const ROLES = [
  { value: "ADMINISTRADOR", label: "Administrador" },
  { value: "GERENTE", label: "Gerente" },
  { value: "GARCOM", label: "Garçom" },
];

export default function UsuarioCreate() {
  const { user, token, isAdmin } = useAuth?.() || {};
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    perfil: ROLES[1].value,
    ativo: true,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    if (!form.nome.trim()) return "Informe o nome.";
    if (!form.email.trim()) return "Informe o e-mail.";
    const emailOk = /.+@.+\..+/.test(form.email);
    if (!emailOk) return "E-mail inválido.";
    if (!form.senha || form.senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (form.senha !== form.confirmarSenha) return "As senhas não coincidem.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const v = validate();
    if (v) return setErr(v);

    try {
      setSaving(true);
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        perfil: form.perfil,
        ativo: form.ativo,
      };
      const res = await api.post("/api/usuarios", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 201) {
        setMsg("Usuário cadastrado com sucesso!");
        setForm({ nome: "", email: "", senha: "", confirmarSenha: "", perfil: ROLES[1].value, ativo: true });
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Erro ao salvar usuário.");
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2>Acesso negado</h2>
          <p>Somente administradores podem cadastrar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Novo Usuário</h2>

        <label style={styles.label}>Nome</label>
        <input name="nome" value={form.nome} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>E-mail</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Senha</label>
        <input name="senha" type="password" value={form.senha} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Confirmar senha</label>
        <input name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Perfil</label>
        <select name="perfil" value={form.perfil} onChange={handleChange} style={styles.input}>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {err && <div style={styles.error}>{err}</div>}
        {msg && <div style={styles.success}>{msg}</div>}

        <button style={styles.button} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" },
  card: { width: 400, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)", display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, color: "#222", marginTop: 8 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, outline: "none" },
  button: { marginTop: 12, padding: "10px 14px", borderRadius: 8, border: "none", background: "#0b5ed7", color: "#fff", cursor: "pointer" },
  error: { background: "#fde2e1", color: "#b21f1f", padding: "8px 10px", borderRadius: 8, fontSize: 13 },
  success: { background: "#e6f6e6", color: "#1b5e20", padding: "8px 10px", borderRadius: 8, fontSize: 13 },
};
