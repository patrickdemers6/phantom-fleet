const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    sinon: '<rootDir>/node_modules/sinon/pkg/sinon.js',
  },
  setupFilesAfterEnv: ['<rootDir>/spec/setup.ts'],
};

module.exports = createJestConfig(config);
