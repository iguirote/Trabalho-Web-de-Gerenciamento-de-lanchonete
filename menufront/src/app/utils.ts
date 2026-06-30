import type { Produto } from "./types";

// Funções e constantes usadas em várias views.

export const PRODUTOS_INICIAIS: Produto[] = [
    {
        id: "1",
        nome: "X-Burguer Clássico",
        preco: 18.90,
        descricao: "Hambúrguer 180g, queijo, alface, tomate e molho especial",
        categoria: "Lanches",
        imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        disponibilidade:true
    },
    {
        id: "2",
        nome: "X-Bacon Supreme",
        preco: 24.90,
        descricao: "Hambúrguer 200g, bacon duplo, cheddar e cebola caramelizada",
        categoria: "Lanches",
        imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        disponibilidade:true
    },
    {
        id: "3",
        nome: "Cachorro Quente",
        preco: 11.90,
        descricao: "Salsicha Viena, molho, mostarda e batata palha",
        categoria: "Lanches",
        imagem: "https://images.unsplash.com/photo-1612392062798-29d6d5df0b53",
        disponibilidade:true
    },
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