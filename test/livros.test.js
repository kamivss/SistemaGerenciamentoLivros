// livros.test.js
// 1️⃣ Mocka-se o módulo database.js **antes de importar listarLivros**
jest.mock('../database.js', () => ({
  initializeDatabase: jest.fn(() => {
    console.log('Mock do initializeDatabase chamado');
    return Promise.resolve(mockDb);
  }),
}));

// 2️⃣ Importa-se o módulo listarLivros
import { listarLivros, cadastrarLivro, buscarLivroPorId, atualizarLivro, deletarLivro} from '../TesteUnitario.js';

// 3️⃣ Cria-se o mock do banco de dados
const mockDb = {
  all: jest.fn(),
  run: jest.fn(),
  get: jest.fn(),
};
console.log('MockDb criado:', mockDb);

// 4️⃣ Configuração antes de cada teste
beforeEach(() => {
  console.log('Configurando mocks no beforeEach');

  // Mock para listarLivros
  mockDb.all.mockResolvedValue([
    {
      id: 1,
      titulo: 'Livro A',
      autor: 'Autor A',
      ano_publicacao: 2020,
      genero: 'Ficção',
      preco: 29.99,
      data_cadastro: '2024-01-01',
    },
  ]);

  // Mock para cadastrarLivro
  mockDb.run.mockResolvedValue({ lastID: 2 });

  // Mock para buscarLivroPorId
  mockDb.get.mockResolvedValue({
    id: 1,
    titulo: 'Livro A',
    autor: 'Autor A',
    ano_publicacao: 2020,
    genero: 'Ficção',
    preco: 29.99,
    data_cadastro: '2024-01-01',
  });

  // Mock para atualizarLivro
  mockDb.run.mockResolvedValue({ changes: 1 });

  // Mock para deletarLivro
  mockDb.run.mockResolvedValue({ changes: 1 });
});

// 5️⃣ Testes
describe('Testes de CRUD de livros', () => {
  test('Deve listar os livros corretamente', async () => {
    console.log('Iniciando teste de listarLivros...');
    const livros = await listarLivros();
    expect(livros).toEqual([
      {
        id: 1,
        titulo: 'Livro A',
        autor: 'Autor A',
        ano_publicacao: 2020,
        genero: 'Ficção',
        preco: 29.99,
        data_cadastro: '2024-01-01',
      },
    ]);
  });

  test('Deve cadastrar um livro corretamente', async () => {
    console.log('Iniciando teste de cadastrarLivro...');
  
    // Mock específico para o cadastrarLivro
    mockDb.run.mockResolvedValueOnce({ lastID: 2 }); // Simula a inserção de um livro
  
    const livro = {
      titulo: 'Livro B',
      autor: 'Autor B',
      ano_publicacao: 2021,
      genero: 'Aventura',
      preco: 39.99,
      data_cadastro: '2024-01-02',
    };
  
    const id = await cadastrarLivro(livro);
    expect(id).toBe(2); // ID do livro cadastrado
  
    // Verifica se o db.run foi chamado corretamente
    expect(mockDb.run).toHaveBeenCalledWith(
      "INSERT INTO livros (titulo, autor, ano_publicacao, genero, preco, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)",
      [livro.titulo, livro.autor, livro.ano_publicacao, livro.genero, livro.preco, livro.data_cadastro]
    );
  });

  test('Deve buscar um livro por ID corretamente', async () => {
    console.log('Iniciando teste de buscarLivroPorId...');
    const livro = await buscarLivroPorId(1);
    expect(livro).toEqual({
      id: 1,
      titulo: 'Livro A',
      autor: 'Autor A',
      ano_publicacao: 2020,
      genero: 'Ficção',
      preco: 29.99,
      data_cadastro: '2024-01-01',
    });
  });

  test('Deve atualizar um livro corretamente', async () => {
    console.log('Iniciando teste de atualizarLivro...');
    const livroAtualizado = {
      titulo: 'Livro A Atualizado',
      autor: 'Autor A',
      ano_publicacao: 2020,
      genero: 'Ficção',
      preco: 35.99,
      data_cadastro: '2024-01-01',
    };
    const changes = await atualizarLivro(1, livroAtualizado);
    expect(changes).toBe(1); // Número de linhas afetadas
  });

  test('Deve deletar um livro corretamente', async () => {
    console.log('Iniciando teste de deletarLivro...');
    const changes = await deletarLivro(1);
    expect(changes).toBe(1); // Número de linhas afetadas
  });
});