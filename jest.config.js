// jest.config.js
export default {
  testEnvironment: 'node', // Define o ambiente de teste como Node.js
  transform: {
    '^.+\\.js$': 'babel-jest', // Usa o Babel para transformar arquivos .js
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Mapeia imports para arquivos .js
  },
};


