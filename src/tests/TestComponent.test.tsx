// src/tests/TestComponent.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestComponent from '../components/TestComponent';

test('renders TestComponent with Tailwind styles', () => {
  render(<TestComponent />);
  const heading = screen.getByText(/Welcome to Courier System/i);
  expect(heading).toHaveClass('text-2xl');
  expect(heading).toHaveClass('font-bold');
});
