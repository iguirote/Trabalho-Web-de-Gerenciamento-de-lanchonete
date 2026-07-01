import { useState } from "react";

const API_URL = "http://localhost:8080/produto";

export function useProdutoDesativar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function desativarProduto(id: number): Promise<boolean> {
        setCarregando(true);
        setErro(null);
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao desativar produto.");
            return true;
        } catch (e: any) {
            setErro(e.message);
            return false;
        } finally {
            setCarregando(false);
        }
    }

    return { desativarProduto, carregando, erro };
}