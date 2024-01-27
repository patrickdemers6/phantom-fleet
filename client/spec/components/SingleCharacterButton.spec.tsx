import { render, screen } from '@testing-library/react';
import SingleCharacterButton from '../../components/SingleCharacterButton';

const character = 'A';

describe('SingleCharacterButton', () => {
  it('renders the character correctly', () => {
    render(<SingleCharacterButton character={character} />);
    expect(screen.getByText(character)).toBeInTheDocument();
  });

  it('has equal width and height', () => {
    render(<SingleCharacterButton character={character} />);
    const button = screen.getByText(character);
    expect(button.clientWidth).toEqual(button.clientHeight);
  });
});
