import CircleSelect from '@/components/dashboard/renderers/CircleSelect';
import { testVin } from '@/spec/constants';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import { JSXElementConstructor, ReactElement } from 'react';

const data = {
  primary: [
    { name: 'one', shortName: '1', value: 1 },
    { name: 'two', shortName: '2', value: 2 },
    {
      name: 'three',
      shortName: '3',
      value: 3,
      items: [{
        type: 'dropdown', data: {}, defaultValue: 1, field: '', fieldType: '',
      }],
    },
  ],
  secondary: [
    { name: 'four', shortName: '4', value: 4 },
  ],
};

describe('CircleSelect', () => {
  let handleChangeStub: jest.Mock;
  let rerender:(ui: ReactElement<any, string | JSXElementConstructor<any>>) => void;

  beforeEach(() => {
    handleChangeStub = jest.fn();
    const s = render(<CircleSelect
      onChange={handleChangeStub}
      vin={testVin}
      value={1}
      data={data}
      RenderSubItems={() => <>subitems_present</>}
      Item={() => null}
    />);
    rerender = s.rerender;
  });

  it('renders primary options', () => {
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('emits handleChange when selecting different value', async () => {
    await act(() => fireEvent.click(screen.getByText('2')));
    expect(handleChangeStub).toHaveBeenCalledTimes(1);
    expect(handleChangeStub).toHaveBeenCalledWith(2);
  });

  it('highlights active option', () => {
    expect(screen.getByText('1').classList).toContain('MuiButton-contained');
  });

  describe('secondary present', () => {
    it('renders the more button', () => {
      expect(screen.getByText('+')).toBeInTheDocument();
    });

    describe('secondary option selected', () => {
      beforeEach(() => {
        rerender(<CircleSelect
          onChange={handleChangeStub}
          vin={testVin}
          value={4}
          data={data}
          RenderSubItems={() => <>subitems_present</>}
          Item={() => null}
        />);
      });
      it('highlights menu button', () => {
        expect(screen.getByText('+').classList).toContain('MuiButton-contained');
      });
    });

    it('renders menu', () => {
      expect(screen.getByText('+')).toBeInTheDocument();
      fireEvent.click(screen.getByText('+'));
      expect(screen.getByText('four')).toBeInTheDocument();
    });
  });

  describe('secondary not present', () => {
    beforeEach(() => {
      rerender(<CircleSelect
        onChange={handleChangeStub}
        vin={testVin}
        value={1}
        data={{ primary: data.primary }}
        RenderSubItems={() => <>subitems_present</>}
        Item={() => null}
      />);
    });

    it('does not render the more button', () => {
      expect(screen.queryByText('+')).toBeNull();
    });
  });

  it('renders subitems', () => {
    expect(screen.queryByText('subitems_present')).toBeNull();
    rerender(<CircleSelect
      onChange={handleChangeStub}
      vin={testVin}
      value={3}
      data={data}
      RenderSubItems={() => <>subitems_present</>}
      Item={() => null}
    />);
    expect(screen.getByText('subitems_present')).toBeInTheDocument();
  });
});
