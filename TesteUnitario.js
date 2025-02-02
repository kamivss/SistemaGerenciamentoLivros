// app.js
import { initializeDatabase } from './database.js';
import logger  from './logger.js';

let db;

export async function initDatabase() {
  try {
    db = await initializeDatabase();
    logger.debug(`Banco de dados inicializado com sucesso.`);
  } catch (err) {
    logger.error(`Erro ao inicializar o banco de dados:`, err);
    throw err;
  }
}

// Função para listar livros
export async function listarLivros() {
  try {
    if (!db) {
      await initDatabase(); 
    }

    const livros = await db.all("SELECT * FROM livros");
    console.log("\nLista de Livros:");
    livros.forEach((livro) => {
      console.log(
        `ID: ${livro.id}, Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano_publicacao}, Gênero: ${livro.genero || "N/A"}, Preço: ${livro.preco || "N/A"}, Data de Cadastro: ${livro.data_cadastro}`
      );
    });

    return livros;
  } catch (err) {
    console.error("Erro ao listar livros:", err);
    throw err;
  }
}


// Função para cadastrar um livro
export async function cadastrarLivro(livro) {
  try {
    if (!db) {
      await initDatabase(); // Inicializa o banco de dados se ainda não estiver inicializado
    }

    const { titulo, autor, ano_publicacao, genero, preco, data_cadastro } = livro;
    const result = await db.run(
      "INSERT INTO livros (titulo, autor, ano_publicacao, genero, preco, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)",
      [titulo, autor, ano_publicacao, genero, preco, data_cadastro]
    );

    console.log("Livro cadastrado com sucesso. ID:", result.lastID);
    return result.lastID; // Retorna o ID do livro cadastrado
  } catch (err) {
    console.error("Erro ao cadastrar livro:", err);
    throw err;
  }
}

// Função para buscar um livro por ID
export async function buscarLivroPorId(id) {
  try {
    if (!db) {
      await initDatabase(); // Inicializa o banco de dados se ainda não estiver inicializado
    }

    const livro = await db.get("SELECT * FROM livros WHERE id = ?", [id]);
    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    console.log("\nLivro encontrado:", livro);
    return livro;
  } catch (err) {
    console.error("Erro ao buscar livro:", err);
    throw err;
  }
}

// Função para atualizar um livro
export async function atualizarLivro(id, livroAtualizado) {
  try {
    if (!db) {
      await initDatabase(); // Inicializa o banco de dados se ainda não estiver inicializado
    }

    const { titulo, autor, ano_publicacao, genero, preco, data_cadastro } = livroAtualizado;
    const result = await db.run(
      "UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, genero = ?, preco = ?, data_cadastro = ? WHERE id = ?",
      [titulo, autor, ano_publicacao, genero, preco, data_cadastro, id]
    );

    if (result.changes === 0) {
      throw new Error("Livro não encontrado para atualização.");
    }

    console.log("Livro atualizado com sucesso.");
    return result.changes; // Retorna o número de linhas afetadas
  } catch (err) {
    console.error("Erro ao atualizar livro:", err);
    throw err;
  }
}

// Função para deletar um livro
export async function deletarLivro(id) {
  try {
    if (!db) {
      await initDatabase(); // Inicializa o banco de dados se ainda não estiver inicializado
    }

    const result = await db.run("DELETE FROM livros WHERE id = ?", [id]);
    if (result.changes === 0) {
      throw new Error("Livro não encontrado para exclusão.");
    }

    console.log("Livro deletado com sucesso.");
    return result.changes; // Retorna o número de linhas afetadas
  } catch (err) {
    console.error("Erro ao deletar livro:", err);
    throw err;
  }
}