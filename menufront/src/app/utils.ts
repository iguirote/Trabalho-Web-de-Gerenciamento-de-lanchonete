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
    {
        id: "4",
        nome: "Refrigerante Lata",
        preco: 6.00,
        descricao: "Lata 350ml, gelada",
        categoria: "Bebidas",
        imagem: "https://picsum.photos/seed/refrigerante/400/300",
        disponibilidade:true
    },
    {
        id: "5",
        nome: "Suco Natural de Laranja",
        preco: 9.50,
        descricao: "Suco de laranja natural, 400ml",
        categoria: "Bebidas",
        imagem: "https://picsum.photos/seed/sucolaranja/400/300",
        disponibilidade:true
    },
    {
        id: "6",
        nome: "Água Mineral",
        preco: 4.00,
        descricao: "Água mineral sem gás, 500ml",
        categoria: "Bebidas",
        imagem: "https://picsum.photos/seed/agua/400/300",
        disponibilidade:true
    },
    {
        id: "7",
        nome: "Pudim de Leite",
        preco: 10.90,
        descricao: "Fatia de pudim de leite condensado com calda de caramelo",
        categoria: "Sobremesas",
        imagem: "https://picsum.photos/seed/pudim/400/300",
        disponibilidade:true
    },
    {
        id: "8",
        nome: "Petit Gâteau",
        preco: 16.90,
        descricao: "Bolo de chocolate quente com recheio cremoso e sorvete",
        categoria: "Sobremesas",
        imagem: "https://picsum.photos/seed/petitgateau/400/300",
        disponibilidade:true
    },
    {
        id: "9",
        nome: "Brownie com Sorvete",
        preco: 14.50,
        descricao: "Brownie de chocolate com bola de sorvete de creme",
        categoria: "Sobremesas",
        imagem: "https://picsum.photos/seed/brownie/400/300",
        disponibilidade:true
    },
    {
        id: "10",
        nome: "Batata Frita",
        preco: 12.50,
        descricao: "Porção de batata frita crocante, serve 1 pessoa",
        categoria: "Acompanhamentos",
        imagem: "https://picsum.photos/seed/batatafrita/400/300",
        disponibilidade:true
    },
    {
        id: "11",
        nome: "Anéis de Cebola",
        preco: 13.90,
        descricao: "Porção de anéis de cebola empanados e crocantes",
        categoria: "Acompanhamentos",
        imagem: "https://picsum.photos/seed/aneisdecebola/400/300",
        disponibilidade:true
    },
    {
        id: "12",
        nome: "Coxinha de Frango",
        preco: 8.90,
        descricao: "Porção com 4 unidades de coxinha de frango cremosa",
        categoria: "Acompanhamentos",
        imagem: "https://picsum.photos/seed/coxinha/400/300",
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