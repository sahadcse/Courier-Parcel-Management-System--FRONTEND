// src/tests/themeSlice.test.tsx
import themeReducer, { toggleTheme, setTheme } from '@/lib/themeSlice';

describe('themeSlice', () => {
  const initialState: { mode: 'light' | 'dark' } = { mode: 'light' };

  it('toggles theme from light to dark', () => {
    const state = themeReducer(initialState, toggleTheme());
    expect(state.mode).toBe('dark');
  });

  it('toggles theme from dark to light', () => {
    const state = themeReducer({ mode: 'dark' }, toggleTheme());
    expect(state.mode).toBe('light');
  });

  it('sets theme to specified mode', () => {
    const state = themeReducer(initialState, setTheme('dark'));
    expect(state.mode).toBe('dark');
  });
});