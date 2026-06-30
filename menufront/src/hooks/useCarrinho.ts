/**
 * USECARRINHO.TS - NOVO HOOK OBRIGATÓRIO
 *
 * Por quê? Antes o cliente ia direto pra BD. Agora precisa de um "rascunho"
 * local onde acumula itens antes de clicar "Confirmar Pedido".
 *
 * ANALOGIA: É como você escrever uma lista de compras no papel
 * antes de levar pra registradora.
 */

import { useState, useCallback } from "react";

export interface ItemCarrinho {
    produtoId: number;
    nome: string;
    preco: number;
    quantidade: number;
}

export function useCarrinho() {
    const [itens, setItens] = useState<ItemCarrinho[]>([]);

    /* Adiciona item ou aumenta quantidade se já existe */
    const adicionarItem = useCallback(
        (produtoId: number, nome: string, preco: number) => {
            setItens((prev) => {
                const existe = prev.find((item) => item.produtoId === produtoId);
                if (existe) {
                    return prev.map((item) =>
                        item.produtoId === produtoId
                            ? { ...item, quantidade: item.quantidade + 1 }
                            : item
                    );
                }
                return [...prev, { produtoId, nome, preco, quantidade: 1 }];
            });
        },
        []
    );

    /* Remove item completamente do carrinho */
    const removerItem = useCallback((produtoId: number) => {
        setItens((prev) => prev.filter((item) => item.produtoId !== produtoId));
    }, []);

    /* Atualiza quantidade, remove se virar 0 ou menos */
    const atualizarQuantidade = useCallback((produtoId: number, novaQuantidade: number) => {
        setItens((prev) => {
            if (novaQuantidade <= 0) {
                return prev.filter((item) => item.produtoId !== produtoId);
            }
            return prev.map((item) =>
                item.produtoId === produtoId
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            );
        });
    }, []);

    /* Limpa tudo após confirmar pedido */
    const limparCarrinho = useCallback(() => {
        setItens([]);
    }, []);

    /* Calcula total: soma de (preço * quantidade) */
    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    return {
        itens,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        total,
    };
}