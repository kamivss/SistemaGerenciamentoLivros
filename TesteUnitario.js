import { initializeDatabase } from './database.js';
import logger from './logger.js';

let db;

export async function initDatabase() {
  try {
    db = await initializeDatabase();
   
  } catch (err) {
   
    throw err;
  }
}

export async function listarLivros() {
  try {
    if (!db) await initDatabase();
    const livros = await db.all('SELECT * FROM livros');
    return livros;
  } catch (err) {
   
    throw err;
  }
}

export async function cadastrarLivro(livro) {
  try {
    if (!db) await initDatabase();
    
    const { titulo, autor, ano_publicacao, genero, preco, data_cadastro } = livro;
    const result = await db.run(
      'INSERT INTO livros (titulo, autor, ano_publicacao, genero, preco, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, autor, ano_publicacao, genero, preco, data_cadastro]
    );
    
   
    return result.lastID;
  } catch (err) {
    logger.warn('Erro ao cadastrar livro:', err);
    throw err;
  }
}

export async function buscarLivroPorId(id) {
  try {
    if (!db) await initDatabase();
    
    const livro = await db.get('SELECT * FROM livros WHERE id = ?', [id]);
    if (!livro) throw new Error('Livro não encontrado.');
    
    return livro;
  } catch (err) {
    logger.error('Erro ao buscar livro:', err);
    throw err;
  }
}

export async function atualizarLivro(id, livroAtualizado) {
  try {
    if (!db) await initDatabase();
    
    const { titulo, autor, ano_publicacao, genero, preco, data_cadastro } = livroAtualizado;
    const result = await db.run(
      'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, genero = ?, preco = ?, data_cadastro = ? WHERE id = ?',
      [titulo, autor, ano_publicacao, genero, preco, data_cadastro, id]
    );
    
    if (result.changes === 0) throw new Error('Livro não encontrado para atualização.');
    
   
    return result.changes;
  } catch (err) {
    logger.warn('Erro ao atualizar livro:', err);
    throw err;
  }
}

export async function deletarLivro(id) {
  try {
    if (!db) await initDatabase();
    
    const result = await db.run('DELETE FROM livros WHERE id = ?', [id]);
    if (result.changes === 0) throw new Error('Livro não encontrado para exclusão.');
    
  
    return result.changes;
  } catch (err) {
    logger.warn('Erro ao deletar livro:', err);
    throw err;
  }
}
