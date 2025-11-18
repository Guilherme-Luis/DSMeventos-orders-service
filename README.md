# DSMEventos - Orders Service

## Descrição

Este é o microserviço responsável por gerenciar pedidos na plataforma DSMEventos. Ele lida com a criação, leitura, atualização e exclusão de pedidos, integrando-se com outras partes da plataforma para fornecer uma experiência completa de gerenciamento de eventos.

## Funcionalidades

*   Criação e gerenciamento de pedidos.
*   Associação de pedidos a usuários e eventos.
*   Autenticação e autorização via JWT.
*   Integração com bancos de dados MongoDB (via Mongoose) e Prisma.
*   Documentação de API interativa com Swagger.
*   Suporte a CORS para integração com aplicações front-end.

## Tecnologias Utilizadas

*   **Node.js**: Ambiente de execução.
*   **Express.js**: Framework web para construir APIs RESTful.
*   **MongoDB / Mongoose**: Banco de dados NoSQL e ODM para Node.js.
*   **Prisma**: ORM para acesso a dados.
*   **JSON Web Tokens (JWT)**: Para autenticação e autorização.
*   **Dotenv**: Para carregar variáveis de ambiente.
*   **CORS**: Para permitir requisições de diferentes origens.
*   **Swagger-jsdoc & Swagger-ui-express**: Para documentação de API interativa.
*   **Nodemon**: Para desenvolvimento (reinicialização automática do servidor).

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

*   **Node.js** (versão 18.x)
*   **npm** (gerenciador de pacotes do Node.js)
*   Uma instância do **MongoDB** em execução ou acesso a um serviço MongoDB.

## Instalação

Siga os passos abaixo para configurar e executar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Guilherme-Luis/DSMeventos-orders-service.git
    cd dsmeventos-orders-service
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    O comando `npm install` também executará `prisma generate` devido ao script `postinstall`.

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="mongodb://localhost:27017/dsmeventos-orders" # Ou sua URL do MongoDB Atlas/remoto
JWT_SECRET="Secreto" # Altere para uma string forte e única
```

*   `NODE_ENV`: Define o ambiente (ex: `development`, `production`).
*   `PORT`: Porta onde o serviço será executado.
*   `DATABASE_URL`: URL de conexão com o seu banco de dados MongoDB.
*   `JWT_SECRET`: Chave secreta para assinar e verificar tokens JWT.

## Executando a Aplicação

### Modo de Desenvolvimento

Para executar a aplicação em modo de desenvolvimento com `nodemon` (observando alterações nos arquivos):

```bash
npm run dev
```

### Modo de Produção

Para iniciar a aplicação em modo de produção:

```bash
npm start:prod
```

### Iniciar Aplicação (Padrão)

Para iniciar a aplicação normalmente (sem `nodemon`):

```bash
npm start
```

## Scripts Disponíveis

*   `npm test`: Roda testes (atualmente, um placeholder).
*   `npm postinstall`: Gera os clientes Prisma após a instalação.
*   `npm start`: Inicia o servidor Node.js.
*   `npm start:prod`: Inicia o servidor Node.js em ambiente de produção.
*   `npm run dev`: Inicia o servidor com `nodemon` para desenvolvimento.

## Documentação da API (Swagger)

Uma vez que o servidor esteja em execução, você pode acessar a documentação interativa da API no seu navegador:

```
http://localhost:<PORT>/api-docs
```
(Substitua `<PORT>` pela porta configurada no seu arquivo `.env`, geralmente `3000`).

## Contribuição

Contribuições são bem-vindas! Por favor, siga as melhores práticas de desenvolvimento e abra um Pull Request.
