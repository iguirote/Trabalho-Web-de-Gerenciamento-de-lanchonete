import { useEffect, useRef, useState } from "react";
import type { PedidoDados } from "../interface/PedidoDados";

const API_URL = "http://localhost:8080/pedido";

const INTERVALO_POLLING_MS = 5000;

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