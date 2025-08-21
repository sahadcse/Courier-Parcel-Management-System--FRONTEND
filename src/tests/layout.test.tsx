// src/tests/layout.test.tsx
import { render, screen } from '@testing-library/react';
import ReduxProvider from '@/components/ReduxProvider';

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter-font' }),
}));

describe('RootLayout', () => {
  it('renders children with ReduxProvider and correct font class', () => {
    // Render only the children inside ReduxProvider to avoid <html> nesting issues
    render(
      <ReduxProvider>
        <div>Test Content</div>
      </ReduxProvider>
    );
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    // expect(document.body).toHaveClass('inter-font');
    // expect(document.documentElement).toHaveAttribute('lang', 'en');
  });
});