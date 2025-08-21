// src/tests/ClientThemeProvider.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '@/lib/store';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import { setTheme } from '@/lib/themeSlice';

describe('ClientThemeProvider', () => {
  it('applies dark theme class when mode is dark', () => {
    store.dispatch(setTheme('dark'));
    render(
      <Provider store={store}>
        <ClientThemeProvider>
          <div>Test Content</div>
        </ClientThemeProvider>
      </Provider>
    );
    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });

  it('removes dark theme class when mode is light', () => {
    store.dispatch(setTheme('light'));
    render(
      <Provider store={store}>
        <ClientThemeProvider>
          <div>Test Content</div>
        </ClientThemeProvider>
      </Provider>
    );
    expect(document.documentElement).not.toHaveClass('dark');
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });
});