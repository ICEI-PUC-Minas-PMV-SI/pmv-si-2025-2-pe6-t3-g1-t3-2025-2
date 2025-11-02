import { api } from "./api";
/**
 * Cria um novo pedido na API.
 * @param {object} dadosDoPedido
 * @returns {Promise<object>}
 */
export async function criarPedido(dadosDoPedido) {
    try {
        const response = await api.post("/api/Order", dadosDoPedido);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getPedidos() {
    try {
        const response = await api.get("/api/Order");
        return response.data;
    } catch (error) {
        throw error;
    }
}
