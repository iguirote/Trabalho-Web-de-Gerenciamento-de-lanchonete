/**
 * USEPEDIDODADOS.TS - ADAPTADO PRO NOVO BACKEND
 *
 * O QUÊ MUDOU?
 * - Antes: buscava /pedido (todos os pedidos)
 * - Agora: pode buscar:
 *   1. /pedido/novidades (pedidos não visualizados - pra atendente)
 *   2. /pedido/comanda/{id} (histórico de uma comanda)
 *   3. /pedido (todos - mantém compatibilidade)
 *
 * SOLUÇÃO: Adicionei parâmetro "tipo" pra escolher qual buscar
 */

import { useEffect, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

export function usePedidoDados(tipo: "todos" | "novidades" | "comanda" = "todos", comandaId?: number) {
    const [pedidos, setPedidos] = useState<PedidoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let endpoint = API_URL;

        /* Escolhe o endpoint baseado no tipo */
        if (tipo === "novidades") {
            endpoint = `${API_URL}/novidades`;
        } else if (tipo === "comanda" && comandaId) {
            endpoint = `${API_URL}/comanda/${comandaId}`;
        }

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar pedidos.");
                return res.json();
            })
            .then((data) => setPedidos(data))
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, [tipo, comandaId]);

    return { pedidos, carregando, erro };
}