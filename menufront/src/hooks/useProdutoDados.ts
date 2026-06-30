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

    function buscarProdutos() {
        setCarregando(true);
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar produtos.");
                return res.json();
            })
            .then((data) => {
                setProdutos(data);
                setErro(null);
            })
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }

    useEffect(() => {
        buscarProdutos();
    }, []);

    // "recarregar" foi adicionado pra dar pro App.tsx um jeito de buscar a
    // lista de novo depois de criar/editar/desativar um produto — sem isso,
    // a tela de admin ficaria com a lista desatualizada até um F5.
    return { produtos, carregando, erro, recarregar: buscarProdutos };
}