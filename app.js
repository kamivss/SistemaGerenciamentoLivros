// Importações
import initializeDatabase from './database.js';
import inquirer from 'inquirer';
import dayjs from 'dayjs';

let db;

async function inicializarBancoDeDados() {
  try {
    db = await initializeDatabase(); 
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1);
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
  } catch (err) {
    console.error('Erro ao listar livros:', err);
  }
}

// Função para buscar um livro por ID
async function buscarLivroPorId() {
  try {
    const resposta = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Digite o ID do livro:',
        validate: (input) => !isNaN(input) || 'Digite um ID válido.',
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
  } catch (err) {
    console.error('Erro ao buscar livro:', err);
  }
}

// Função para cadastrar um novo livro
async function cadastrarLivro() {
  try {
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
  } catch (err) {
    console.error('Erro ao cadastrar livro:', err);
  }
}

// Função para atualizar um livro
async function atualizarLivro() {
  try {
    const respostaId = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Digite o ID do livro que deseja atualizar:',
        validate: (input) => !isNaN(input) || 'Digite um ID válido.',
      },
    ]);

   
    const livro = await db.get('SELECT * FROM livros WHERE id = ?', [respostaId.id]);

    if (!livro) {
     
      console.log('ID não encontrado. Nenhum livro foi atualizado.');
      return;
    }

    
    const respostaDados = await inquirer.prompt([
      {
        type: 'input',
        name: 'titulo',
        message: 'Novo título do livro:',
        default: livro.titulo, 
      },
      {
        type: 'input',
        name: 'autor',
        message: 'Novo autor do livro:',
        default: livro.autor, 
      },
      {
        type: 'input',
        name: 'ano_publicacao',
        message: 'Novo ano de publicação:',
        default: livro.ano_publicacao, 
        validate: (input) => !isNaN(input) || 'Digite um ano válido.',
      },
      {
        type: 'input',
        name: 'genero',
        message: 'Novo gênero do livro (opcional):',
        default: livro.genero || '',
      },
      {
        type: 'input',
        name: 'preco',
        message: 'Novo preço do livro (opcional):',
        default: livro.preco || '', 
        validate: (input) => input === '' || !isNaN(input) || 'Digite um valor numérico.',
      },
    ]);

   
    await db.run(
      'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, genero = ?, preco = ? WHERE id = ?',
      [
        respostaDados.titulo,
        respostaDados.autor,
        respostaDados.ano_publicacao,
        respostaDados.genero || null,
        respostaDados.preco || null,
        respostaId.id,
      ]
    );

    console.log('Livro atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar livro:', err);
  }
}

// Função para deletar um livro
async function deletarLivro() {
  try {
    const resposta = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Digite o ID do livro que deseja deletar:',
        validate: (input) => !isNaN(input) || 'Digite um ID válido.',
      },
    ]);

    const livro = await db.get('SELECT * FROM livros WHERE id = ?', [resposta.id]);

    if (livro) {
      await db.run('DELETE FROM livros WHERE id = ?', [resposta.id]);
      console.log('Livro deletado com sucesso!');
    } else {
     
      console.log('ID não encontrado. Nenhum livro foi deletado.');
    }
  } catch (err) {
    console.error('Erro ao deletar livro:', err);
  }
}

// Menu principal
async function menuPrincipal() {
  while (true) {
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
        await db.close(); 
        process.exit();
    }
  }
}


  console.log('Bem-vindo ao sistema de gerenciamento de livros!');
  await inicializarBancoDeDados(); 
  await menuPrincipal(); 


