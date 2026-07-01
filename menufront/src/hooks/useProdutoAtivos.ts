import { useEffect, useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080/produto";


export function useProdutoAtivos() {
    const [produtos, setProdutos] = useState<ProdutoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    function buscarAtivos() {
        setCarregando(true);
        fetch(`${API_URL}/ativos`)
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
        buscarAtivos();
    }, []);

    return { produtos, carregando, erro, recarregar: buscarAtivos };
}