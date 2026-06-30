/**
 * USECOMANDA.TS - NOVO HOOK OBRIGATÓRIO
 *
 * Por quê? Cliente precisa "entrar" numa comanda digitando número (1-100)
 * e depois admin precisa "fechar" (gerar extrato + limpar).
 *
 * FLUXO:
 * 1. Cliente digita número -> entrar(numero)
 * 2. Servidor marca OCUPADA -> retorna dados
 * 3. Cliente pede itens
 * 4. Admin fecha -> fechar() -> retorna extrato
 */

import { useState, useCallback } from "react";

export interface ComandaResponse {
    id: number;
    numero: number;
    status: "LIVRE" | "OCUPADA";
}

export interface ExtratoComanada {
    numero: number;
    totalGeral: number;
    pedidos: any[];
}

type StatusComanda = "idle" | "carregando" | "sucesso" | "erro";

export function useComanda() {
    const [comandaAtual, setComandaAtual] = useState<ComandaResponse | null>(null);
    const [status, setStatus] = useState<StatusComanda>("idle");
    const [erro, setErro] = useState<string | null>(null);

    /* Cliente entra numa comanda digitando número */
    const entrar = useCallback(async (numero: number): Promise<boolean> => {
        setStatus("carregando");
        setErro(null);

        try {
            const res = await fetch("http://localhost:8080/comanda/entrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero }),
            });

            if (!res.ok) throw new Error("Comanda não encontrada ou já ocupada");

            const comanda: ComandaResponse = await res.json();
            setComandaAtual(comanda);
            setStatus("sucesso");
            return true;
        } catch (e: any) {
            setErro(e.message);
            setStatus("erro");
            return false;
        }
    }, []);

    /* Admin fecha comanda - retorna extrato pra imprimir */
    const fechar = useCallback(async (): Promise<ExtratoComanada | null> => {
        if (!comandaAtual) {
            setErro("Nenhuma comanda aberta");
            return null;
        }

        setStatus("carregando");
        setErro(null);

        try {
            const res = await fetch(
                `http://localhost:8080/comanda/${comandaAtual.numero}/fechar`,
                { method: "POST" }
            );

            if (!res.ok) throw new Error("Erro ao fechar comanda");

            const extrato: ExtratoComanada = await res.json();
            setComandaAtual(null);
            setStatus("sucesso");
            return extrato;
        } catch (e: any) {
            setErro(e.message);
            setStatus("erro");
            return null;
        }
    }, [comandaAtual]);

    const resetar = useCallback(() => {
        setComandaAtual(null);
        setStatus("idle");
        setErro(null);
    }, []);

    return {
        comandaAtual,
        entrar,
        fechar,
        resetar,
        status,
        erro,
        estaAberta: comandaAtual !== null,
    };
}