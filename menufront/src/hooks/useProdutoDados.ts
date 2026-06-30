import { useEffect, useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080/produto";

/*
 * GET /produto — usado na aba Produtos do admin (AdminProdutoTab).
 * Diferente do useProdutoAtivos, traz TODOS os produtos, incluindo
 * os desativados, porque o admin precisa poder reativá-los ou editá-los.
 */
export function useProdutoDados() {
    const [produtos, setProdutos] = useState<ProdutoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar produtos.");
                return res.json();
            })
            .then((data) => setProdutos(data))
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, []);

    return { produtos, carregando, erro };
}