/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'node',
  testRegex: '/build/__tests__/.*',
  setupFiles: ['dotenv/config'],
};
