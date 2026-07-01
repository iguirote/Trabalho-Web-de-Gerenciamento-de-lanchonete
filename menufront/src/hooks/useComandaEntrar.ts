import { useState } from "react";
import type { ComandaDados } from "../interface/ComandaDados";

const API_URL = "http://localhost:8080/comanda";

export function useComandaEntrar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function entrarNaComanda(numero: number): Promise<ComandaDados | null> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/entrar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero }),
            });
            if (!res.ok) throw new Error("Comanda inválida ou já em uso.");
            return await res.json();
        } catch (e: any) {
            setErro(e.message);
            return null;
        } finally {
            setCarregando(false);
        }
    }

    return { entrarNaComanda, carregando, erro };
}