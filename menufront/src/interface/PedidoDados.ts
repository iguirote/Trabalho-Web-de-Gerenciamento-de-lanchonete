import type { ComandaDados } from "./ComandaDados";

// Espelha o ItemPedidoDTOResponse do back.
export interface ItemPedidoDados {
    produtoId: number;
    produtoNome: string;
    produtoPreco: number;
    quantidade: number;
    subtotal: number;
}

// Espelha o PedidoDTOResponse do back.
export interface PedidoDados {
    id: number;
    comanda: ComandaDados;
    itensPedido: ItemPedidoDados[];
    valorTotal: number;
    dataPedido: string; // vem como string ISO (LocalDateTime serializado), converter com new Date() ao usar
    visualizado: boolean;
    pago: boolean; // indica se o pedido já foi pago (comanda fechada) — diferencia histórico de pedido em aberto
}