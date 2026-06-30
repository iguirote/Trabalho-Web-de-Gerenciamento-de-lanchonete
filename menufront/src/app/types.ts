// Tipos compartilhados entre as views do sistema.
// Por enquanto ainda usam id: string (como no protótipo do Figma) — isso é
// proposital nesta etapa de separação de componentes, sem API ainda.
// Na etapa de integração, esses tipos "fake" vão ser substituídos pelos
// que já existem em src/interface/ (ProdutoDados, ComandaDados, PedidoDados),
// que usam id: number e batem exatamente com os DTOs do back.

export type View = "login" | "admin" | "cliente";
export type AdminTab = "pedidos" | "comandas" | "produtos" | "historico";
export type ClienteStep = "entrada" | "menu" | "sucesso";

export interface Produto {
    id: string;
    nome: string;
    preco: number;
    descricao: string;
    categoria: string;
}

export interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}

export interface ItemPedido {
    produtoId: string;
    produtoNome: string;
    quantidade: number;
    preco: number;
}

export interface PedidoPendente {
    id: string;
    numeroComanda: string;
    timestamp: Date;
    itens: ItemPedido[];
    expandido: boolean;
}

export interface EntradaHistorico {
    id: string;
    numeroComanda: string;
    timestamp: Date;
    itens: ItemPedido[];
    total: number;
}