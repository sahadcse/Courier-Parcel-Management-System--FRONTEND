// src/tests/authSlice.test.tsx
import authReducer, { setUser, clearUser } from '@/lib/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: { id: null, username: null, email: null, role: null },
    token: null,
    isAuthenticated: false,
  };

  it('sets user and token on setUser', () => {
    const user: { id: string; username: string; email: string; role: "customer" | "admin" | "agent"; token: string } = {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'customer',
      token: 'jwt-token',
    };
    const state = authReducer(initialState, setUser(user));
    expect(state).toEqual({
      user: {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'customer',
      },
      token: 'jwt-token',
      isAuthenticated: true,
    });
  });

  it('clears user and token on clearUser', () => {
    const state = authReducer(
      {
        user: { id: '123', username: 'testuser', email: 'test@example.com', role: 'customer' },
        token: 'jwt-token',
        isAuthenticated: true,
      },
      clearUser()
    );
    expect(state).toEqual(initialState);
  });
});