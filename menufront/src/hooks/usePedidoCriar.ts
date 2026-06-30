/**
 * USEPEDIDOCRIAR.TS - ADAPTADO PRO NOVO BACKEND
 *
 * O QUÊ MUDOU?
 * - Antes: enviava estrutura genérica de pedido
 * - Agora: OBRIGATÓRIO enviar:
 *   {
 *     "comandaNumero": 42,
 *     "itensPedido": [
 *       { "produtoId": 5, "quantidade": 1 },
 *       { "produtoId": 12, "quantidade": 2 }
 *     ]
 *   }
 *
 * ISSO VEM DO CARRINHO LOCAL! Você chama assim:
 * criarPedido(42, carrinho.itens.map(i => ({
 *   produtoId: i.produtoId,
 *   quantidade: i.quantidade
 * })))
 */

import { useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

export interface ItemPedidoRequest {
    produtoId: number;
    quantidade: number;
}

export function usePedidoCriar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function criarPedido(
        comandaNumero: number,
        itensPedido: ItemPedidoRequest[]
    ): Promise<PedidoDados | null> {
        setCarregando(true);
        setErro(null);

        /* Validação: carrinho não pode estar vazio */
        if (!itensPedido || itensPedido.length === 0) {
            setErro("Carrinho vazio! Adicione itens antes de pedir.");
            setCarregando(false);
            return null;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                /* IMPORTANTE: estrutura EXATA que o backend espera */
                body: JSON.stringify({
                    comandaNumero,
                    itensPedido,
                }),
            });
            if (!res.ok) throw new Error("Erro ao criar pedido.");
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