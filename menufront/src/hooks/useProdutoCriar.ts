import { useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080/produto";

// Formato esperado pelo back-end no POST /produto (ProdutoDTORequest).
export interface ProdutoRequest {
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponibilidade: boolean;
    imagem: string;
}

export function useProdutoCriar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function criarProduto(dados: ProdutoRequest): Promise<ProdutoDados | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) throw new Error("Erro ao criar produto.");
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { criarProduto, carregando, erro };
}