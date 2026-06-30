import { useState } from "react";

const API_URL = "http://localhost:8080/produto";

/*
 * DELETE /produto/{id} — atenção: isso NÃO apaga o produto do banco.
 * O back faz uma remoção lógica, só seta disponibilidade = false.
 * O produto continua existindo (necessário para manter o histórico
 * de pedidos antigos íntegro), só some do cardápio do cliente.
 */
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