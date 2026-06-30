import { useState } from "react";

const API_URL = "http://localhost:8080/comanda";

/*
 * POST /comanda/{numero}/fechar — usado na AdminComandaTab, no botão
 * "Finalizar Pagamento". O back devolve um extrato consolidado (não
 * tipado como DTO fixo no back, vem como um Map<String, Object>) e,
 * internamente, já limpa os pedidos da comanda e libera ela pro
 * próximo cliente — tudo numa única chamada.
 *
 * O formato exato do extrato depende do que o ComandaService monta no
 * Map. Deixei "ExtratoComanda" como um tipo aberto (Record<string, any>)
 * porque não vimos o ComandaService — se quiser, me manda esse arquivo
 * que eu tipo certinho (ex: { numero, itens, total }).
 */
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