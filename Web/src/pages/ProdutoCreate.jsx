// src/pages/ProdutoCreate.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { criarProduto } from "../services/produtos";

export default function ProdutoCreate() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [ativo, setAtivo] = useState(true);

    const [erro, setErro] = useState("");
    const [ok, setOk] = useState("");
    const [salvando, setSalvando] = useState(false);

    function valido() {
        if (!nome.trim()) return "Informe o nome do produto.";
        if (!categoria.trim()) return "Informe a categoria.";
        const p = Number(preco);
        if (Number.isNaN(p) || p <= 0) return "Informe um preço válido (maior que zero).";
        return "";
    }

    async function aoSalvar(e) {
        e.preventDefault();
        setErro("");
        setOk("");

        const msg = valido();
        if (msg) return setErro(msg);

        try {
            setSalvando(true);
            await criarProduto({ nome, categoria, preco, descricao, ativo });
            setOk("Produto criado com sucesso!");

            // pequeno delay para feedback visual, depois volta pra lista
            setTimeout(() => {
                navigate("/produtos", {
                    replace: true,
                    state: { toast: "Produto criado com sucesso!" },
                });
            }, 800);
        } catch (err) {
            const detail =
                err?.response?.data?.mensagem ||
                err?.response?.data?.message ||
                err?.message ||
                "Falha ao criar produto.";
            setErro(detail);
        } finally {
            setSalvando(false);
        }
    }

        return (
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h2 style={{ margin: 0 }}>➕ Novo Produto</h2>
                        <Link to="/produtos" style={styles.linkSec}>
                            ← Voltar
                        </Link>
                    </div>

                    {erro && <div style={styles.error}>{erro}</div>}
                    {ok && <div style={styles.success}>{ok}</div>}

                    <form onSubmit={aoSalvar} style={styles.form}>
                        <div style={styles.row}>
                            <label style={styles.label}>Nome *</label>
                            <input
                                style={styles.input}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex.: Suco de Laranja 300ml"
                                autoFocus
                            />
                        </div>

                        <div style={styles.row}>
                            <label style={styles.label}>Categoria *</label>
                            <input
                                style={styles.input}
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                placeholder="Ex.: Bebidas"
                            />
                        </div>

                        <div style={styles.row}>
                            <label style={styles.label}>Preço (R$) *</label>
                            <input
                                style={styles.input}
                                type="number"
                                step="0.01"
                                min="0"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                placeholder="Ex.: 12.90"
                            />
                        </div>

                        <div style={styles.row}>
                            <label style={styles.label}>Descrição</label>
                            <textarea
                                style={{ ...styles.input, minHeight: 88, resize: "vertical" }}
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Observações, alérgenos, etc."
                            />
                        </div>

                        <div style={{ ...styles.row, display: "flex", alignItems: "center", gap: 8 }}>
                            <input
                                id="ativo"
                                type="checkbox"
                                checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)}
                            />
                            <label htmlFor="ativo" style={{ ...styles.label, margin: 0 }}>
                                Produto ativo
                            </label>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                            <Link to="/produtos" style={styles.btnGhost}>Cancelar</Link>
                            <button type="submit" style={styles.button} disabled={salvando}>
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const styles = {
        wrapper: {
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f5f6f8",
            padding: 16,
        },
        card: {
            width: 720,
            maxWidth: "100%",
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 12,
        },
        linkSec: { fontSize: 14, color: "#0b5ed7", textDecoration: "none" },
        form: { display: "grid", gap: 12, marginTop: 8 },
        row: { display: "grid", gap: 6 },
        label: { fontSize: 14, color: "#222" },
        input: {
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            outline: "none",
            background: "#fff",
        },
        button: {
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: "#0b5ed7",
            color: "#fff",
            cursor: "pointer",
            minWidth: 120,
        },
        btnGhost: {
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            color: "#333",
            textDecoration: "none",
            minWidth: 120,
            textAlign: "center",
        },
        error: { background: "#fde2e1", color: "#b21f1f", padding: "8px 10px", borderRadius: 8, fontSize: 13 },
        success: { background: "#e6f6e6", color: "#1b7f1b", padding: "8px 10px", borderRadius: 8, fontSize: 13 },
    };