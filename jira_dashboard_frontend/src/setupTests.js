import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Mock fetch globally
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
