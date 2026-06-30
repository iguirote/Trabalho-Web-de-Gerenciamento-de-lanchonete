import { useState } from "react";

const API_URL = "http://localhost:8080/pedido";

/*
 * PATCH /pedido/{id}/visualizar — usado na AdminPedidoTab, no botão
 * "Pedido Entregue". Marca o pedido como visto no banco; o endpoint
 * não devolve corpo (204 No Content), então a tela é quem decide o
 * que fazer com a lista local (ex: remover o card otimisticamente, ou
 * chamar "recarregar" do usePedidoNovidades pra já buscar a lista
 * atualizada do back).
 */
export function usePedidoVisualizar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function marcarComoVisualizado(id: number): Promise<boolean> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/${id}/visualizar`, { method: "PATCH" });
            if (!res.ok) throw new Error("Erro ao marcar pedido como visualizado.");
            return true;
        } catch (e: any) {
            setErro(e.message);
            return false;
        } finally {
            setCarregando(false);
        }
    }

    return { marcarComoVisualizado, carregando, erro };
}