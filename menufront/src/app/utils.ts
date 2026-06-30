import type { Produto } from "./types";

// Funções e constantes usadas em várias views.

export const PRODUTOS_INICIAIS: Produto[] = [
    { id: "1", nome: "X-Burguer Clássico", preco: 18.90, descricao: "Hambúrguer 180g, queijo, alface, tomate e molho especial", categoria: "Lanches" },
    { id: "2", nome: "X-Bacon Supreme", preco: 24.90, descricao: "Hambúrguer 200g, bacon duplo, cheddar e cebola caramelizada", categoria: "Lanches" },
    { id: "3", nome: "Cachorro Quente", preco: 11.90, descricao: "Salsicha Viena, molho, mostarda e batata palha", categoria: "Lanches" },
    { id: "4", nome: "Batata Frita", preco: 13.90, descricao: "Porção 300g de batatas crocantes temperadas", categoria: "Acompanhamentos" },
    { id: "5", nome: "Onion Rings", preco: 15.90, descricao: "Anéis de cebola empanados, porção com 10 unidades", categoria: "Acompanhamentos" },
    { id: "6", nome: "Refrigerante Lata", preco: 6.90, descricao: "Coca-Cola, Pepsi ou Guaraná Antarctica 350ml", categoria: "Bebidas" },
    { id: "7", nome: "Suco Natural", preco: 10.90, descricao: "Laranja, limão ou maracujá — 400ml", categoria: "Bebidas" },
    { id: "8", nome: "Milk Shake", preco: 17.90, descricao: "Chocolate, morango ou baunilha — 500ml cremoso", categoria: "Bebidas" },
    { id: "9", nome: "Brownie com Sorvete", preco: 14.90, descricao: "Brownie quentinho com bola de sorvete de creme", categoria: "Sobremesas" },
];

export const CATEGORIAS = ["Lanches", "Acompanhamentos", "Bebidas", "Sobremesas"];

export const estiloCategoria: Record<string, { pill: string }> = {
    Lanches:         { pill: "bg-orange-100 text-orange-700" },
    Acompanhamentos: { pill: "bg-yellow-100 text-yellow-700" },
    Bebidas:         { pill: "bg-sky-100 text-sky-700" },
    Sobremesas:      { pill: "bg-pink-100 text-pink-700" },
};

// Formata número para Real brasileiro: 18.9 -> "R$ 18,90"
export function formatarPreco(n: number) {
    return "R$ " + n.toFixed(2).replace(".", ",");
}