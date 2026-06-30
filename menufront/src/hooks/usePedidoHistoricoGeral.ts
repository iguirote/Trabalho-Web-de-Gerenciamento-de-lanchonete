import { useEffect, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

/*
 * GET /pedido/historico — usado na aba Histórico do admin (AdminHistoricoTab).
 * Traz só os pedidos com pago = true, de qualquer comanda, do mais recente
 * pro mais antigo. Diferente do usePedidoHistorico (que é por comanda e só
 * traz os pedidos em aberto dela), este é o histórico GERAL do sistema.
 */
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