import { useEffect, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

/*
 * GET /pedido/comanda/{comandaId} — histórico completo de uma comanda,
 * em ordem cronológica. Pode alimentar tanto a AdminComandaTab (extrato
 * antes de fechar) quanto a AdminHistoricoTab.
 *
 * ATENÇÃO: o back espera o ID interno da comanda (Long, gerado pelo
 * banco), não o "numero" de 1 a 100 que o cliente digita. Hoje o front
 * só guarda o numero (ex: comandaVisualizada: string). Antes de plugar
 * este hook, vai ser preciso buscar o id da comanda primeiro — por
 * exemplo, via GET /comanda/{numero} (que devolve o ComandaDTOResponse
 * com o id) — e só então chamar este hook com esse id.
 */
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