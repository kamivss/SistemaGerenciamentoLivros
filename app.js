import inquirer from 'inquirer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // Importe o "open" do pacote "sqlite"
import dayjs from 'dayjs';


// Configuração do banco de dados
const db = await open({
  filename: './livros.db', // Nome do arquivo do banco de dados
  driver: sqlite3.Database, // Driver do SQLite
});


// Função para inicializar o banco de dados e criar a tabela se não existir
async function inicializarBancoDeDados() {
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
  console.log('Banco de dados inicializado e tabela "livros" verificada/criada.');
}


// Função para listar todos os livros
async function listarLivros() {
  const livros = await db.all('SELECT * FROM livros');
  console.log('\nLista de Livros:');
  livros.forEach((livro) => {
    console.log(
      `ID: ${livro.id}, Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano_publicacao}, Gênero: ${livro.genero || 'N/A'}, Preço: ${livro.preco || 'N/A'}, Data de Cadastro: ${livro.data_cadastro}`
    );
  });
  menuPrincipal();
}


// Função para buscar um livro por ID
async function buscarLivroPorId() {
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
  } else {
    console.log('Livro não encontrado.');
  }
  menuPrincipal();
}


// Função para cadastrar um novo livro
async function cadastrarLivro() {
  const resposta = await inquirer.prompt([
    {
      type: 'input',
      name: 'titulo',
      message: 'Título do livro:',
    },
    {
      type: 'input',
      name: 'autor',
      message: 'Autor do livro:',
    },
    {
      type: 'input',
      name: 'ano_publicacao',
      message: 'Ano de publicação:',
      validate: (input) => !isNaN(input) || 'Digite um ano válido.',
    },
    {
      type: 'input',
      name: 'genero',
      message: 'Gênero do livro (opcional):',
    },
    {
      type: 'input',
      name: 'preco',
      message: 'Preço do livro (opcional):',
      validate: (input) => input === '' || !isNaN(input) || 'Digite um valor numérico.',
    },
  ]);


  const dataCadastro = dayjs().format('YYYY-MM-DD');
  await db.run(
    'INSERT INTO livros (titulo, autor, ano_publicacao, genero, preco, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)',
    [resposta.titulo, resposta.autor, resposta.ano_publicacao, resposta.genero || null, resposta.preco || null, dataCadastro]
  );
  console.log('Livro cadastrado com sucesso!');
  menuPrincipal();
}


// Função para atualizar um livro
async function atualizarLivro() {
  const resposta = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Digite o ID do livro que deseja atualizar:',
    },
    {
      type: 'input',
      name: 'titulo',
      message: 'Novo título do livro:',
    },
    {
      type: 'input',
      name: 'autor',
      message: 'Novo autor do livro:',
    },
    {
      type: 'input',
      name: 'ano_publicacao',
      message: 'Novo ano de publicação:',
      validate: (input) => !isNaN(input) || 'Digite um ano válido.',
    },
    {
      type: 'input',
      name: 'genero',
      message: 'Novo gênero do livro (opcional):',
    },
    {
      type: 'input',
      name: 'preco',
      message: 'Novo preço do livro (opcional):',
      validate: (input) => input === '' || !isNaN(input) || 'Digite um valor numérico.',
    },
  ]);


  await db.run(
    'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, genero = ?, preco = ? WHERE id = ?',
    [resposta.titulo, resposta.autor, resposta.ano_publicacao, resposta.genero || null, resposta.preco || null, resposta.id]
  );
  console.log('Livro atualizado com sucesso!');
  menuPrincipal();
}


// Função para deletar um livro
async function deletarLivro() {
  const resposta = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Digite o ID do livro que deseja deletar:',
    },
  ]);


  await db.run('DELETE FROM livros WHERE id = ?', [resposta.id]);
  console.log('Livro deletado com sucesso!');
  menuPrincipal();
}


// Menu principal
async function menuPrincipal() {
  const resposta = await inquirer.prompt([
    {
      type: 'list',
      name: 'acao',
      message: 'O que você deseja fazer?',
      choices: [
        'Listar Livros',
        'Buscar Livro por ID',
        'Cadastrar Livro',
        'Atualizar Livro',
        'Deletar Livro',
        'Sair',
      ],
    },
  ]);


  switch (resposta.acao) {
    case 'Listar Livros':
      await listarLivros();
      break;
    case 'Buscar Livro por ID':
      await buscarLivroPorId();
      break;
    case 'Cadastrar Livro':
      await cadastrarLivro();
      break;
    case 'Atualizar Livro':
      await atualizarLivro();
      break;
    case 'Deletar Livro':
      await deletarLivro();
      break;
    case 'Sair':
      console.log('Saindo...');
      db.close();
      process.exit();
  }
}


// Iniciar aplicação
console.log('Bem-vindo ao sistema de gerenciamento de livros!');


// Inicializar o banco de dados antes de exibir o menu
inicializarBancoDeDados()
  .then(() => {
    menuPrincipal();
  })
  .catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err);
  });
