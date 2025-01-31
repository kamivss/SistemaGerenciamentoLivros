
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initializeDatabase() {
  const db = await open({
    filename: './livros.db', 
    driver: sqlite3.Database, 
  });

  // Cria a tabela 'livros' se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      ano_publicacao INTEGER NOT NULL,
      genero TEXT,
      preco REAL,
      data_cadastro TEXT NOT NULL
    )
  `);
  console.log("Tabela 'livros' criada ou já existente.");

  return db;
}


export default initializeDatabase;