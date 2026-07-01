import { useEffect, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

export function usePedidoHistoricoGeral() {
    const [pedidos, setPedidos] = useState<PedidoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    function buscarHistorico() {
        setCarregando(true);
        fetch(`${API_URL}/historico`)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar histórico.");
                return res.json();
            })
            .then((data) => {
                setPedidos(data);
                setErro(null);
            })
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }

    useEffect(() => {
        buscarHistorico();
    }, []);

    return { pedidos, carregando, erro, recarregar: buscarHistorico };
}