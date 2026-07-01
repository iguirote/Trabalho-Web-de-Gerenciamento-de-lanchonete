CREATE DATABASE IF NOT EXISTS menustream;
USE menustream;

CREATE TABLE produto (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    descricao       VARCHAR(255) NOT NULL,
    preco           DECIMAL(10,2) NOT NULL,
    categoria       VARCHAR(50) NOT NULL,
    disponibilidade BOOLEAN NOT NULL DEFAULT TRUE,
    imagem          VARCHAR(500)
);

CREATE TABLE comanda (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    numero  INT NOT NULL UNIQUE,
    status  VARCHAR(20) NOT NULL
);

CREATE TABLE pedido (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    comanda_id   INT NOT NULL,
    valor_total  DECIMAL(10,2) NOT NULL,
    data_pedido  DATETIME NOT NULL,
    visualizado  BOOLEAN NOT NULL DEFAULT FALSE,
    pago         BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (comanda_id) REFERENCES comanda (id)
);

CREATE TABLE item_pedido (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id   INT NOT NULL,
    produto_id  INT NOT NULL,
    quantidade  INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido (id),
    FOREIGN KEY (produto_id) REFERENCES produto (id)
);

INSERT INTO comanda (numero, status) VALUES
(1, 'LIVRE'), (2, 'LIVRE'), (3, 'LIVRE');


INSERT INTO produto (nome, descricao, preco, categoria, disponibilidade, imagem) VALUES
('X-Burguer Classico',   'Hamburguer 180g, queijo, alface, tomate e molho especial',       18.90, 'Lanches',          TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
('X-Bacon Supreme',      'Hamburguer 200g, bacon duplo, cheddar e cebola caramelizada',     24.90, 'Lanches',          TRUE, 'https://images.unsplash.com/photo-1550547660-d9450f859349'),
('Cachorro Quente',      'Salsicha Viena, molho, mostarda e batata palha',                  11.90, 'Lanches',          TRUE, 'https://images.unsplash.com/photo-1612392062798-29d6d5df0b53'),
('Refrigerante Lata',    'Lata 350ml, gelada',                                               6.00, 'Bebidas',          TRUE, 'https://picsum.photos/seed/refrigerante/400/300'),
('Suco Natural de Laranja', 'Suco de laranja natural, 400ml',                               9.50, 'Bebidas',          TRUE, 'https://picsum.photos/seed/sucolaranja/400/300'),
('Água Mineral',         'Água mineral sem gás, 500ml',                                      4.00, 'Bebidas',          TRUE, 'https://picsum.photos/seed/agua/400/300'),
('Pudim de Leite',       'Fatia de pudim de leite condensado com calda de caramelo',        10.90, 'Sobremesas',       TRUE, 'https://picsum.photos/seed/pudim/400/300'),
('Petit Gâteau',         'Bolo de chocolate quente com recheio cremoso e sorvete',          16.90, 'Sobremesas',       TRUE, 'https://picsum.photos/seed/petitgateau/400/300'),
('Brownie com Sorvete',  'Brownie de chocolate com bola de sorvete de creme',               14.50, 'Sobremesas',       TRUE, 'https://picsum.photos/seed/brownie/400/300'),
('Batata Frita',         'Porção de batata frita crocante, serve 1 pessoa',                 12.50, 'Acompanhamentos',  TRUE, 'https://picsum.photos/seed/batatafrita/400/300'),
('Anéis de Cebola',      'Porção de anéis de cebola empanados e crocantes',                 13.90, 'Acompanhamentos',  TRUE, 'https://picsum.photos/seed/aneisdecebola/400/300'),
('Coxinha de Frango',    'Porção com 4 unidades de coxinha de frango cremosa',               8.90, 'Acompanhamentos',  TRUE, 'https://picsum.photos/seed/coxinha/400/300');
