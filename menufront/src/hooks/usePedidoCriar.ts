import { useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

export interface ItemPedidoRequest {
    produtoId: number;
    quantidade: number;
}

export interface PedidoRequest {
    comandaNumero: number;
    itensPedido: ItemPedidoRequest[];
}

export function usePedidoCriar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function criarPedido(dados: PedidoRequest): Promise<PedidoDados | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) throw new Error("Erro ao enviar pedido.");
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { criarPedido, carregando, erro };
}