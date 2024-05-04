import GenericRenderer from '@/components/dashboard/renderers';
import { testVin } from '@/spec/constants';
import { render, screen } from '@testing-library/react';

describe('GenericRenderer', () => {
  it('renders', () => {
    render(<GenericRenderer
      vin={testVin}
      onChange={jest.fn()}
      value={1}
      data={{
        field: '',
        title: 'Dropdown',
        menuItems: [
          {
            name: 'one', shortName: '1', value: 1, items: [],
          },
        ],
      }}
      type="dropdown"
    />);
    expect(screen.getByText('Dropdown')).toBeInTheDocument();
  });
});
