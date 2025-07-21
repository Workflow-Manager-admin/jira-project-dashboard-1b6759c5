import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form by default', () => {
  render(<App />);
  const headerElement = screen.getByText(/Jira Dashboard/i);
  expect(headerElement).toBeInTheDocument();
});
