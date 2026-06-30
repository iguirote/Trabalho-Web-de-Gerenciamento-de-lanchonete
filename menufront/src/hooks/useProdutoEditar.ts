import { useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080/produto";

// Espelha o UpdateProdutoDTO do back — todos os campos opcionais,
// porque a atualização é parcial (só altera o que vier preenchido).
export interface ProdutoEditarRequest {
    nome?: string;
    descricao?: string;
    preco?: number;
    categoria?: string;
    disponibilidade?: boolean;
    imagem?: string;
}

export function useProdutoEditar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function editarProduto(id: number, dados: ProdutoEditarRequest): Promise<ProdutoDados | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) throw new Error("Erro ao editar produto.");
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { editarProduto, carregando, erro };
}