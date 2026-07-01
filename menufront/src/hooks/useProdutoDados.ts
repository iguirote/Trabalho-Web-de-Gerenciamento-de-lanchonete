import { useEffect, useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080/produto";


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

    return { produtos, carregando, erro, recarregar: buscarProdutos };
}