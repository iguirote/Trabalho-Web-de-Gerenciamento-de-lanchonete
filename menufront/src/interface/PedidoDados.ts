export interface ItemPedido {
    id?: number;
    produtoId: number;
    quantidade: number;
}

export interface PedidoDados {
    id?: number;
    comandaNumero: number;
    itensPedido: ItemPedido[];
    status?: string;
    visualizado?: boolean;
    criadoEm?: string;
}