
---

# Sistema de Gerenciamento de Livros

## Descrição

O **Sistema de Gerenciamento de Livros** é uma aplicação para gerenciar o cadastro, edição, exclusão e visualização de livros. A aplicação permite que os usuários realizem as operações de CRUD (Create, Read, Update, Delete).

## Funcionalidades

- Listar Livros
- Buscar por ID
- Cadastrar Livros
- Atualizar Livros
- Deletar Livros

## Tecnologias

- **Linguagens**: Javascript, Node.js
- **Banco de Dados**: SQLite
- **Testes**: Jest (Testes Unitários)
- **Docker**: Para containerização 
- **Bibliotecas**: Winston (logs)

# Como rodar a aplicação com Docker

## Pré-requisitos

- Docker instalado.
- Docker Compose instalado (opcional, mas recomendado).

## Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Navegue até a pasta principal do projeto no terminal.

3. Construa a imagem Docker:
   ```bash
   docker build -t sistemagerenciamentolivros-app .
   ```

4. Execute o container interativo:
   ```bash
   docker run -it sistemagerenciamentolivros-app sh
   ```

5. Para rodar os testes unitários, execute:
   ```bash
   npm test
   ```

6. Para rodar a aplicação:
   ```bash
   node app.js
   ```

---
