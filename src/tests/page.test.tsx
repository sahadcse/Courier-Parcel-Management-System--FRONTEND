// src/tests/page.test.tsx
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('@/components/TestComponent', () => {
  const MockedTestComponent = () => (
    <div>Mocked Test Component</div>
  );
  MockedTestComponent.displayName = 'MockedTestComponent';
  return MockedTestComponent;
});

describe('Home Page', () => {
  it('renders TestComponent', () => {
    render(<Home />);
    expect(screen.getByText(/Mocked Test Component/i)).toBeInTheDocument();
  });
});