import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { api } from "../services/api";

const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || "/api/auth/login";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function extractRoles(u) {
  if (!u) return [];
  // do objeto user
  const fromUser =
    u.perfil || u.role || u.roles || u?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (Array.isArray(fromUser)) return fromUser;
  if (typeof fromUser === "string") return [fromUser];

  // do payload do JWT
  const claims = u._claims || {};
  const fromClaims =
    claims.role || claims.roles || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (Array.isArray(fromClaims)) return fromClaims;
  if (typeof fromClaims === "string") return [fromClaims];

  return [];
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // opcional: validar token com /api/auth/me
  }, [token]);

  function normalizeAuthResponse(data) {
    const tok =
      data?.token || data?.accessToken || data?.jwt || data?.jwtToken || data?.data?.token || null;
    let usr = data?.user || data?.usuario || data?.data?.user || data?.claims || null;

    if (!usr && tok) {
      const payload = parseJwt(tok);
      if (payload) {
        usr = {
          id: payload.sub || payload.nameid || payload.sid || null,
          nome:
            payload.name ||
            payload.unique_name ||
            payload.given_name ||
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            null,
          email:
            payload.email ||
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
            null,
          perfil: payload.role || payload.roles || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
          _claims: payload,
        };
      }
    }
    return { tok, usr };
  }

  async function login(email, senha) {
    setLoading(true);
    try {
      if (!email || !senha) return { ok: false, message: "Informe e-mail e senha." };
      const res = await api.post(LOGIN_PATH, { email, senha });
      const { tok, usr } = normalizeAuthResponse(res.data);
      if (!tok) throw new Error("Token não recebido da API.");

      localStorage.setItem("token", tok);
      setToken(tok);
      if (usr) {
        localStorage.setItem("user", JSON.stringify(usr));
        setUser(usr);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      return { ok: true };
    } catch (err) {
      const msgFromApi = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      const status = err?.response?.status;
      let message = "Falha no login.";
      if (status === 400) message = "Requisição inválida (400).";
      else if (status === 401) message = "Credenciais inválidas (401).";
      else if (status === 403) message = "Acesso negado (403).";
      else if (status === 404) message = "Rota de login não encontrada (404).";
      else if (status >= 500) message = "Erro no servidor (5xx).";
      else if (msgFromApi) message = msgFromApi;
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const roles = extractRoles(user);
  const isAuthenticated = !!token;
  const isAdmin = roles.some((r) =>
    String(r).toLowerCase().includes("admin") || String(r).toLowerCase().includes("administrador")
  );

  const value = useMemo(
    () => ({ user, token, isAuthenticated, isAdmin, loading, login, logout }),
    [user, token, isAuthenticated, isAdmin, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
