import type { ComandaDados } from "./ComandaDados";

export interface ItemPedidoDados {
    produtoId: number;
    produtoNome: string;
    produtoPreco: number;
    quantidade: number;
    subtotal: number;
}

export interface PedidoDados {
    id: number;
    comanda: ComandaDados;
    itensPedido: ItemPedidoDados[];
    valorTotal: number;
    dataPedido: string; // vem como string ISO (LocalDateTime serializado), converter com new Date() ao usar
    visualizado: boolean;
    pago: boolean;
}