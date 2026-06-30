import { useState } from "react";
import type { ComandaDados } from "../interface/ComandaDados";

const API_URL = "http://localhost:8080/comanda";

/*
 * POST /comanda/entrar — usado na ClienteEntradaStep, quando o cliente
 * digita o número da comanda e confirma. O back valida se o número
 * existe (1 a 100) e marca a comanda como OCUPADA.
 *
 * Se o número não existir ou a comanda já estiver ocupada, o back
 * devolve erro — aqui só repassamos a mensagem pra tela poder avisar
 * o cliente, sem deixar ele avançar pro cardápio.
 */
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