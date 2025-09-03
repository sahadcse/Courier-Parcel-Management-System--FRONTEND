// src/tests/axios.test.tsx
import axios from '@/lib/api';

describe('Axios Configuration', () => {
  it('has correct baseURL', () => {
    expect(axios.defaults.baseURL).toBe(process.env.API_URL || 'http://localhost:5000');
  });
});