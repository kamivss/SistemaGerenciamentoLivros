import inquirer from 'inquirer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import logger from './logger.js'; 

// Configuração do banco de dados
const db = await open({
  filename: './livros.db',
  driver: sqlite3.Database,
});

// Inicializar Banco de Dados
async function inicializarBancoDeDados() {
  try {
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
    logger.info('Banco de dados inicializado com sucesso.');
  } catch (error) {
    logger.error(`Erro ao inicializar o banco de dados: ${error.message}`);
  }
}

// Função para listar todos os livros
async function listarLivros() {
  try {
    const livros = await db.all('SELECT * FROM livros');
    console.log('\nLista de Livros:');
    livros.forEach((livro) => {
      console.log(
        `ID: ${livro.id}, Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano_publicacao}, Gênero: ${livro.genero || 'N/A'}, Preço: ${livro.preco || 'N/A'}, Data de Cadastro: ${livro.data_cadastro}`
      );
    });
    logger.info('Listagem de livros realizada com sucesso.');
  } catch (error) {
    logger.error(`Erro ao listar livros: ${error.message}`);
  }
  menuPrincipal();
}

// Função para buscar um livro por ID
async function buscarLivroPorId() {
  try {
    const resposta = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Digite o ID do livro:',
      },
    ]);

    const livro = await db.get('SELECT * FROM livros WHERE id = ?', [resposta.id]);
    if (livro) {
      console.log('\nLivro encontrado:');
      console.log(
        `ID: ${livro.id}, Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano_publicacao}, Gênero: ${livro.genero || 'N/A'}, Preço: ${livro.preco || 'N/A'}, Data de Cadastro: ${livro.data_cadastro}`
      );
      logger.info(`Livro encontrado: ID ${livro.id}`);
    } else {
      console.log('Livro não encontrado.');
      logger.warn(`Tentativa de busca por ID ${resposta.id} falhou (não encontrado).`);
    }
  } catch (error) {
    logger.error(`Erro ao buscar livro por ID: ${error.message}`);
  }
  menuPrincipal();
}

// Função para cadastrar um novo livro
// Função para cadastrar um novo livro
async function cadastrarLivro() {
  try {
    const resposta = await inquirer.prompt([
      { type: 'input', name: 'titulo', message: 'Título do livro:' },
      { type: 'input', name: 'autor', message: 'Autor do livro:' },
      { type: 'input', name: 'ano_publicacao', message: 'Ano de publicação:', validate: (input) => !isNaN(input) || 'Digite um ano válido.' },
      { type: 'input', name: 'genero', message: 'Gênero do livro (opcional):' },
      { type: 'input', name: 'preco', message: 'Preço do livro (opcional):', validate: (input) => input === '' || !isNaN(input) || 'Digite um valor numérico.' },
    ]);

   
    const dataCadastro = new Date().toISOString();

    await db.run(
      'INSERT INTO livros (titulo, autor, ano_publicacao, genero, preco, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)',
      [resposta.titulo, resposta.autor, resposta.ano_publicacao, resposta.genero || null, resposta.preco || null, dataCadastro]
    );

    logger.info(`Livro cadastrado: ${resposta.titulo} por ${resposta.autor}`);
  } catch (error) {
    logger.error(`Erro ao cadastrar livro: ${error.message}`);
  }
  menuPrincipal();
}

// Função para atualizar um livro
async function atualizarLivro() {
  try {
    const resposta = await inquirer.prompt([
      { type: 'input', name: 'id', message: 'Digite o ID do livro que deseja atualizar:' },
    ]);

    const livro = await db.get('SELECT * FROM livros WHERE id = ?', [resposta.id]);
    if (!livro) {
      console.log('Livro não encontrado.');
      logger.warn(`Tentativa de atualização falhou: ID ${resposta.id} não encontrado.`);
      return menuPrincipal();
    }

    const novosDados = await inquirer.prompt([
      { type: 'input', name: 'titulo', message: 'Novo título do livro:' },
      { type: 'input', name: 'autor', message: 'Novo autor do livro:' },
      { type: 'input', name: 'ano_publicacao', message: 'Novo ano de publicação:', validate: (input) => !isNaN(input) || 'Digite um ano válido.' },
      { type: 'input', name: 'genero', message: 'Novo gênero do livro (opcional):' },
      { type: 'input', name: 'preco', message: 'Novo preço do livro (opcional):', validate: (input) => input === '' || !isNaN(input) || 'Digite um valor numérico.' },
    ]);

    await db.run(
      'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, genero = ?, preco = ? WHERE id = ?',
      [novosDados.titulo, novosDados.autor, novosDados.ano_publicacao, novosDados.genero || null, novosDados.preco || null, resposta.id]
    );
    console.log('Livro atualizado com sucesso!');
    logger.info(`Livro ID ${resposta.id} atualizado.`);
  } catch (error) {
    logger.error(`Erro ao atualizar livro: ${error.message}`);
  }
  menuPrincipal();
}

// Função para deletar um livro
async function deletarLivro() {
  try {
    const resposta = await inquirer.prompt([
      { type: 'input', name: 'id', message: 'Digite o ID do livro que deseja deletar:' },
    ]);

    const livro = await db.get('SELECT * FROM livros WHERE id = ?', [resposta.id]);
    if (!livro) {
      console.log('Livro não encontrado.');
      logger.warn(`Tentativa de exclusão falhou: ID ${resposta.id} não encontrado.`);
      return menuPrincipal();
    }

    await db.run('DELETE FROM livros WHERE id = ?', [resposta.id]);
    console.log('Livro deletado com sucesso!');
    logger.info(`Livro ID ${resposta.id} deletado.`);
  } catch (error) {
    logger.error(`Erro ao deletar livro: ${error.message}`);
  }
  menuPrincipal();
}

// Menu principal
async function menuPrincipal() {
  const resposta = await inquirer.prompt([
    {
      type: 'list',
      name: 'acao',
      message: 'O que você deseja fazer?',
      choices: ['Listar Livros', 'Buscar Livro por ID', 'Cadastrar Livro', 'Atualizar Livro', 'Deletar Livro', 'Sair'],
    },
  ]);

  switch (resposta.acao) {
    case 'Listar Livros': await listarLivros(); break;
    case 'Buscar Livro por ID': await buscarLivroPorId(); break;
    case 'Cadastrar Livro': await cadastrarLivro(); break;
    case 'Atualizar Livro': await atualizarLivro(); break;
    case 'Deletar Livro': await deletarLivro(); break;
    case 'Sair': logger.info('Sistema encerrado.'); db.close(); process.exit();
  }
}


// Iniciar aplicação
logger.info('Sistema de gerenciamento de livros iniciado.');
inicializarBancoDeDados().then(() => menuPrincipal()).catch((err) => logger.error(`Erro ao iniciar: ${err.message}`));
