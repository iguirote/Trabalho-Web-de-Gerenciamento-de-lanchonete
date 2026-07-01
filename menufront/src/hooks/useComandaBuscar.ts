import { useState } from "react";
import type { ComandaDados } from "../interface/ComandaDados";

const API_URL = "http://localhost:8080/comanda";

export function useComandaBuscar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function buscarComanda(numero: number): Promise<ComandaDados | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/${numero}`);
            if (!res.ok) throw new Error("Comanda não encontrada.");
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { buscarComanda, carregando, erro };
}