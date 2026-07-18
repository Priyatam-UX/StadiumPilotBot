import '@testing-library/jest-dom';

// Polyfill global fetch in tests
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
