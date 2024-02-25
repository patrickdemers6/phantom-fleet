import GenericRenderer from '@/components/dashboard/renderers';
import Vehicle from '@/components/dashboard/renderers/Vehicle';
import { testVin } from '@/spec/constants';
import { render, screen } from '@testing-library/react';

describe('Vehicle', () => {
  beforeEach(() => {
    render(<Vehicle
      vin={testVin}
      handleChangeFns={[]}
      values={[1, 2, 3, 4, 5, 6]}
      data={{
        renderer: 'mock',
        rendererData: {
          render: <div>renders</div>,
        },
      }}
      GenericRenderer={GenericRenderer}
    />);
  });

  it('renders 6 positions', () => {
    screen.debug();
    expect(screen.getAllByText('renders')).toHaveLength(6);
  });
});
