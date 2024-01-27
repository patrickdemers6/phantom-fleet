import RootLayout from '@/app/layout';
import { act, render, screen } from '@testing-library/react';

describe('app/layout', () => {
  it('renders', async () => {
    const { container } = await act(async () => render(<RootLayout>Children</RootLayout>));
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(container.querySelector('html')).toBeInTheDocument();
  });
});
