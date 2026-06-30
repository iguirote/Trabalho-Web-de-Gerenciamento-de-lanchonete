/**
 * USEPRODUTODADOS.TS - ADAPTADO PRO NOVO BACKEND
 *
 * O QUÊ MUDOU?
 * - Antes: buscava /produto (tudo)
 * - Agora: precisa buscar /produto/ativos (cliente vê só ativos)
 *         e /produto (admin vê todos)
 *
 * SOLUÇÃO: Adicionei parâmetro "apenasAtivos" pra escolher qual endpoint
 */

import { useEffect, useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080/produto";

export function useProdutoDados(apenasAtivos: boolean = false) {
    const [produtos, setProdutos] = useState<ProdutoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        /* Escolhe o endpoint certo baseado no parâmetro */
        const endpoint = apenasAtivos ? `${API_URL}/ativos` : API_URL;

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar produtos.");
                return res.json();
            })
            .then((data) => setProdutos(data))
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, [apenasAtivos]);

    return { produtos, carregando, erro };
}