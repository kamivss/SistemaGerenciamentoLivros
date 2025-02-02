# Sistema de Gerenciamento de Livros

## Descrição
Este é um sistema de gerenciamento de livros desenvolvido em Node.js com SQLite como banco de dados. Ele permite cadastrar, listar, buscar, atualizar e deletar livros.

## Propriedades do Recurso (Livro)
- **Campos obrigatórios**:
  - `titulo` (texto): Título do livro.
  - `autor` (texto): Autor do livro.
  - `ano_publicacao` (número): Ano de publicação.
- **Campos opcionais**:
  - `genero` (texto): Gênero do livro.
  - `preco` (número): Preço do livro.
  - `data_cadastro` (texto): Data de cadastro no formato `YYYY-MM-DD`.

## Como Executar
1. Instale as dependências:
   ```bash
   npm install