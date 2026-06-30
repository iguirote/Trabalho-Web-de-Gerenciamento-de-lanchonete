import { useEffect, useRef, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

// Mesmo intervalo de polling do usePedidoNovidades.
const INTERVALO_POLLING_MS = 5000;

/*
 * GET /pedido/abertos — usado na AdminComandaTab pra montar os "chips" de
 * comandas abertas. Diferente do usePedidoNovidades (que filtra
 * visualizado = false e some um pedido assim que o atendente marca como
 * entregue), este filtra pago = false: a comanda só sai da lista quando é
 * fechada/paga de verdade, não quando os pedidos dela são só "vistos".
 *
 * Mesmo padrão de polling do usePedidoNovidades: busca de novo a cada
 * INTERVALO_POLLING_MS, e usa primeiraCarga pra só mostrar "carregando" no
 * primeiro fetch, sem piscar a tela a cada rodada do polling.
 */
export function usePedidoAbertos() {
    const [pedidos, setPedidos] = useState<PedidoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const primeiraCarga = useRef(true);

    async function buscarAbertos() {
        try {
            const res = await fetch(`${API_URL}/abertos`);
            if (!res.ok) throw new Error("Erro ao buscar comandas abertas.");
            const data = await res.json();
            setPedidos(data);
            setErro(null);
        } catch (e: any) {
            setErro(e.message);
        } finally {
            if (primeiraCarga.current) {
                setCarregando(false);
                primeiraCarga.current = false;
            }
        }
    }

    useEffect(() => {
        buscarAbertos();
        const intervalo = setInterval(buscarAbertos, INTERVALO_POLLING_MS);
        return () => clearInterval(intervalo);
    }, []);

    return { pedidos, carregando, erro, recarregar: buscarAbertos };
}