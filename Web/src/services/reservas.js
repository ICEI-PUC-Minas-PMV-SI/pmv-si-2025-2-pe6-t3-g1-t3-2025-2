// src/services/reservas.js
const API = "http://localhost:5210/api";
function authHeader() {
  const tok = localStorage.getItem("token");
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

export async function listarReservas({ q = "", status = "Todas" } = {}) {
  const params = new URLSearchParams();
  if (q?.trim()) params.append("q", q.trim());
  if (status && status !== "Todas") params.append("status", status);

  const res = await fetch(`${API}/reservations?${params.toString()}`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error("Falha ao carregar reservas");
  return res.json(); // <- deve devolver um array
}

export async function criarReserva(payload) {
  const res = await fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha ao salvar reserva");
  return res.json();
}

export async function cancelarReserva(id) {
  const res = await fetch(`${API}/reservations/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Falha ao cancelar");
}
