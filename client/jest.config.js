module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    testMatch: ['<rootDir>/tests/**/*.test.{js,jsx}'],
    moduleNameMapping: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.jsx'
    ]
  };