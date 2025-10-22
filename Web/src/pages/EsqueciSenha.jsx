import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitarRedefinicaoSenha } from "../services/auth"; // << caminho correto

// Validação simples de e-mail
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [tocouCampo, setTocouCampo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  const desabilitado = !emailValido(email) || carregando;

  async function aoEnviarFormulario(e) {
    e.preventDefault();
    setTocouCampo(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    if (!emailValido(email)) return;

    try {
      setCarregando(true);
      const resposta = await solicitarRedefinicaoSenha(email.trim());
      setMensagemSucesso(
        (resposta && resposta.mensagem) ||
          "Se o e-mail existir no sistema, enviaremos instruções para redefinir sua senha."
      );
    } catch (erro) {
      const msg =
        (erro && erro.response && erro.response.data && erro.response.data.mensagem) ||
        erro?.message ||
        "Não foi possível processar sua solicitação. Tente novamente.";
      setMensagemErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  const mostrarErroEmail = tocouCampo && !emailValido(email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-1">Esqueci minha senha</h1>
        <p className="text-sm text-gray-600 mb-6">
          Digite seu e-mail para receber o link de redefinição de senha.
        </p>

        {mensagemSucesso && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-700 text-sm">
            {mensagemSucesso}
          </div>
        )}

        {mensagemErro && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
            {mensagemErro}
          </div>
        )}

        <form onSubmit={aoEnviarFormulario} noValidate>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-mail cadastrado
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
              mostrarErroEmail
                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:ring-2 focus:ring-blue-200"
            }`}
            placeholder="exemplo@hotel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTocouCampo(true)}
          />

          {mostrarErroEmail && (
            <p className="mt-1 text-xs text-red-600">Informe um e-mail válido.</p>
          )}

          <button
            type="submit"
            disabled={desabilitado}
            className={`mt-5 w-full rounded-xl px-4 py-2 font-medium text-white transition ${
              desabilitado
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            aria-busy={carregando}
          >
            {carregando ? "Enviando..." : "Enviar instruções"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 flex items-center justify-between">
          <Link to="/login" className="hover:underline">
            Voltar ao login
          </Link>
          <Link to="/reset-password" className="hover:underline">
            Já tenho o código/token
          </Link>
        </div>

        <p className="mt-6 text-[11px] leading-4 text-gray-500">
          🔒 Por segurança, a resposta é genérica para evitar exposição de dados.
        </p>
      </div>
    </div>
  );
}
