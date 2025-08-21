// src/tests/ReduxProvider.test.tsx
import { render, screen } from '@testing-library/react';
import ReduxProvider from '@/components/ReduxProvider';

describe('ReduxProvider', () => {
  it('renders children with Redux store', () => {
    render(
      <ReduxProvider>
        <div>Test Content</div>
      </ReduxProvider>
    );
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });
});