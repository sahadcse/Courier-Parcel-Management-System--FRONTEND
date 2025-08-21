// src/tests/axios.test.tsx
import axios from '@/lib/axios';

describe('Axios Configuration', () => {
  it('has correct baseURL', () => {
    expect(axios.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
  });
});