// livros.test.js
import logger from '../logger.js';

jest.mock('../database.js', () => ({
  initializeDatabase: jest.fn(() => {
    return Promise.resolve(mockDb);
  }),
}));

import { listarLivros, cadastrarLivro, buscarLivroPorId, atualizarLivro, deletarLivro} from '../TesteUnitario.js';


const mockDb = {
  all: jest.fn(),
  run: jest.fn(),
  get: jest.fn(),
};



beforeEach(() => {
 
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



// testes 


describe('Testes de CRUD de livros', () => {
  test('Deve listar os livros corretamente', async () => {
  
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
    expect(id).toBe(2); 
  
    
    expect(mockDb.run).toHaveBeenCalledWith(
      "INSERT INTO livros (titulo, autor, ano_publicacao, genero, preco, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)",
      [livro.titulo, livro.autor, livro.ano_publicacao, livro.genero, livro.preco, livro.data_cadastro]
    );
  });

  test('Deve buscar um livro por ID corretamente', async () => {
    
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
  
    const livroAtualizado = {
      titulo: 'Livro A Atualizado',
      autor: 'Autor A',
      ano_publicacao: 2020,
      genero: 'Ficção',
      preco: 35.99,
      data_cadastro: '2024-01-01',
    };
    const changes = await atualizarLivro(1, livroAtualizado);
    expect(changes).toBe(1); 
  });

  test('Deve deletar um livro corretamente', async () => {
   
    const changes = await deletarLivro(1);
    expect(changes).toBe(1); 
  });
});