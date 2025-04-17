import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Legendary Gunslingers/i);
  expect(titleElement).toBeInTheDocument();
});
