import AppBar from '@/components/AppBar/AppBar';
import { render, screen } from '@testing-library/react';

describe('AppBar', () => {
  it('renders without crashing', () => {
    render(
      <AppBar>
        Children
      </AppBar>,
    );
    expect(screen.getByText('Phantom Fleet')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
});
