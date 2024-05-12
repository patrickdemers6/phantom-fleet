import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

describe('page /', () => {
  it('renders title', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Phantom Fleet')).toBeInTheDocument();
  });
});
