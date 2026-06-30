import { useEffect, useRef, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

// Intervalo do polling — a cada 5s a tela busca novidades de novo sozinha.
const INTERVALO_POLLING_MS = 5000;

/*
 * GET /pedido/novidades — usado na AdminPedidoTab (painel central do
 * atendente). Diferente do histórico, este endpoint já filtra só os
 * pedidos com visualizado = false, de qualquer comanda do sistema.
 *
 * Para a tela se atualizar sozinha sem precisar de F5, este hook chama
 * a API de novo a cada INTERVALO_POLLING_MS — esse é o "polling" que a
 * gente conversou. Quando o atendente marca um pedido como visualizado
 * (via usePedidoVisualizar), ele para de aparecer na próxima rodada.
 */
export function usePedidoNovidades() {
    const [pedidos, setPedidos] = useState<PedidoDados[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const primeiraCarga = useRef(true);

    async function buscarNovidades() {
        try {
            const res = await fetch(`${API_URL}/novidades`);
            if (!res.ok) throw new Error("Erro ao buscar novidades.");
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
        buscarNovidades();
        const intervalo = setInterval(buscarNovidades, INTERVALO_POLLING_MS);
        return () => clearInterval(intervalo);
    }, []);

    return { pedidos, carregando, erro, recarregar: buscarNovidades };
}