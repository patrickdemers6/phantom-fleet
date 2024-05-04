import { Item } from '@/components/dashboard/Items';
import GenericRenderer from '@/components/dashboard/renderers';
import Vehicle from '@/components/dashboard/renderers/Vehicle';
import { testVin } from '@/spec/constants';
import wrapContext from '@/spec/helper';
import { act, render, screen } from '@testing-library/react';

describe('Vehicle', () => {
  beforeEach(async () => {
    await act(async () => render(wrapContext(<Vehicle
      vin={testVin}
      data={{
        positional: {
          driverFront: {
            type: 'mock',
            fieldType: 'floatValue',
            defaultValue: 42,
            data: {
              render: <div>renders</div>,
            },
          },
        },
      }}
      GenericRenderer={GenericRenderer}
      Item={Item}
    />)));
  });

  it('renders with missing positions', () => {
    expect(screen.getAllByText('renders')).toHaveLength(1);
  });
});
