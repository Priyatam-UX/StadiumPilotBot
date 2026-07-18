import '@testing-library/jest-dom';

// Polyfill global fetch in tests
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Polyfill HTML Element scrollIntoView for test environments
window.HTMLElement.prototype.scrollIntoView = jest.fn();
