import { useState } from "react";

const API_URL = "http://localhost:8080/comanda";



export type ExtratoComanda = Record<string, any>;

export function useComandaFechar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function fecharComanda(numero: number): Promise<ExtratoComanda | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/${numero}/fechar`, { method: "POST" });
            if (!res.ok) {
                const corpo = await res.json().catch(() => null);
                throw new Error(corpo?.erro ?? "Erro ao fechar comanda.");
            }
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { fecharComanda, carregando, erro };
}