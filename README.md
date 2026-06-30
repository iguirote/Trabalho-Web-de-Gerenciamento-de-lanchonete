# MenuStream

Sistema de cardápio digital para restaurante, com área administrativa (gerenciamento de produtos, pedidos e comandas) e área do cliente (cardápio, carrinho e finalização de pedido).

## Tecnologias

- **Back-end:** Java + Spring Boot (Controller / Service / Repository / DTO)
- **Front-end:** React + Vite
- **Banco de dados:** MySQL

## Pré-requisitos

- Java 17+
- Node.js 18+
- MySQL rodando localmente (ou acessível)
- Maven (ou use o `./mvnw` que já vem no projeto, se houver)

## 1. Banco de dados

Crie o banco e as tabelas rodando o script que está em `db/schema.sql`:

```bash
mysql -u SEU_USUARIO -p < db/schema.sql
```

Isso cria o banco `menustream` com as tabelas `produto`, `comanda`, `pedido` e `item_pedido`, já com 3 comandas de exemplo (1, 2 e 3) pra testar.

## 2. Back-end

No `application.properties` (ou `.yml`) do back, configure o acesso ao banco:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/menustream
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.jpa.hibernate.ddl-auto=update
```

Depois, na pasta do back-end:

```bash
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

## 3. Front-end

Na pasta do front-end:

```bash
npm install
npm run dev
```

O app abre em `http://localhost:5173` (porta padrão do Vite).

## 4. Usando o sistema

- Abra `http://localhost:5173` no navegador.
- **Área Cliente:** digite o número de uma comanda livre (1, 2 ou 3, do script de exemplo) pra entrar, ver o cardápio e fazer pedidos.
- **Área Admin:** cadastre produtos, acompanhe pedidos novos, veja comandas abertas e feche o pagamento.

## Estrutura do repositório

```
/back            → código-fonte do back-end (Spring Boot)
/front           → código-fonte do front-end (React + Vite)
/BD/CriacaoMenuStrem   → script de criação do banco de dados
```
