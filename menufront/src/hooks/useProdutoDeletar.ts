import { useState } from "react";

const API_URL = "http://localhost:8080/produto";

export function useProdutoDeletar() {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function deletarProduto(id: number): Promise<boolean> {
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

    return { deletarProduto, carregando, erro };
}