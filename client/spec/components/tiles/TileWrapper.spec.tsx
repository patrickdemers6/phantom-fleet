import TileWrapper from '@/components/tiles/TileWrapper';
import { render, screen } from '@testing-library/react';

describe('TileWrapper', () => {
  it('renders without crashing', () => {
    render(<TileWrapper title="Test Title">Children</TileWrapper>);
    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Children')).toBeTruthy();
  });
});
