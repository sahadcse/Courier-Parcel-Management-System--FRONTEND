// src/tests/TestPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import TestPage from '@/app/test/page';
import axios from 'axios';
import ReduxProvider from '@/components/ReduxProvider';

jest.mock('axios');

describe('TestPage', () => {
  it('renders loading state initially', async () => {
    render(
      <ReduxProvider>
        <TestPage />
      </ReduxProvider>,
    );
    // Wait for the loading state to appear to ensure act() is used
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders loading state before API resolves', async () => {
    render(
      <ReduxProvider>
        <TestPage />
      </ReduxProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders health status on successful API call', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { status: 'healthy', mongodb: 'connected', timestamp: '2025-08-21T05:00:00.000Z' },
    });

    render(
      <ReduxProvider>
        <TestPage />
      </ReduxProvider>,
    );

    expect(screen.getByText(/Test Page/i)).toBeInTheDocument();
    expect(screen.getByText(/Toggle Theme/i)).toBeInTheDocument();
    await waitFor(() => {
      const statusElement = screen.getByText(/healthy/i, { selector: 'p' });
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveTextContent('Status: healthy');
    });
  });

  it('renders error message when API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

    render(
      <ReduxProvider>
        <TestPage />
      </ReduxProvider>,
    );

    await waitFor(() => {
      const errorElement = screen.getByText(/Failed to fetch health status/i);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass('text-error');
    });
  });
});
