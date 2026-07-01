import { useEffect, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";


export function usePedidoHistorico(comandaId: number | null) {
    const [pedidos, setPedidos] = useState<PedidoDados[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (comandaId === null) {
            setPedidos([]);
            return;
        }
        setCarregando(true);
        setErro(null);
        fetch(`${API_URL}/comanda/${comandaId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar histórico da comanda.");
                return res.json();
            })
            .then((data) => setPedidos(data))
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, [comandaId]);

    return { pedidos, carregando, erro };
}