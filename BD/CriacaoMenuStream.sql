
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