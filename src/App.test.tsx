import 'fake-indexeddb/auto';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders GameScreen header', () => {
    render(<App />);
    expect(screen.getByText('Sudoku: Always Free')).toBeInTheDocument();
  });
});
