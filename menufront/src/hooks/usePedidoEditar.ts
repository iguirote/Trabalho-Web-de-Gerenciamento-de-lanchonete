/**
 * USEPEDIDOEDITAR.TS - ADAPTADO PRO NOVO BACKEND
 *
 * O QUÊ MUDOU?
 * - Antes: editava estrutura genérica
 * - Agora: edita com:
 *   {
 *     "comandaNumero": 42,
 *     "itensPedido": [...]
 *   }
 *
 * CASO DE USO: Admin quer mudar os itens de um pedido que já foi criado
 * Tipo: "Ah, cliente pediu mais um pastel" -> edita o pedido
 */

import { useState } from "react";
import  type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

export interface ItemPedidoRequest {
    produtoId: number;
    quantidade: number;
}

export interface UpdatePedidoRequest {
    comandaNumero: number;
    itensPedido: ItemPedidoRequest[];
}

export function usePedidoEditar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function editarPedido(id: number, dados: UpdatePedidoRequest): Promise<PedidoDados | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) throw new Error("Erro ao editar pedido.");
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { editarPedido, carregando, erro };
}