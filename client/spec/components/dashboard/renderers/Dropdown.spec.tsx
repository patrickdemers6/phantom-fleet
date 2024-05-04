import Dropdown from '@/components/dashboard/renderers/Dropdown';
import { testVin } from '@/spec/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { JSXElementConstructor, ReactElement } from 'react';

describe('Dropdown', () => {
  let handleChangeStub: jest.Mock;
  let rerender:(ui: ReactElement<any, string | JSXElementConstructor<any>>) => void;
  const data = {
    field: '',
    title: 'Title',
    menuItems: [
      {
        name: 'one',
        shortName: '1',
        value: 1,
        items: [
          {
            type: 'dropdown', data: {}, defaultValue: 1, field: '', fieldType: '',
          },
        ],
      },
      { name: 'two', shortName: '2', value: 2 },
    ],
  };

  beforeEach(() => {
    handleChangeStub = jest.fn();
    const s = render(<Dropdown
      onChange={handleChangeStub}
      vin={testVin}
      value={1}
      data={data}
      RenderSubItems={() => <>subitems_present</>}
      Item={() => null}
    />);
    rerender = s.rerender;
  });

  it('renders selected item', () => {
    expect(screen.getByText('one')).toBeInTheDocument();
  });

  it('renders subitems when present', () => {
    expect(screen.getByText('subitems_present')).toBeInTheDocument();
  });

  it('renders no subitems when not present', () => {
    rerender(<Dropdown
      onChange={handleChangeStub}
      vin={testVin}
      value={2}
      data={data}
      RenderSubItems={() => <>subitems_present</>}
      Item={() => null}
    />);
    expect(screen.queryByText('subitems_present')).toBeNull();
  });

  it('emits handleChange when selecting different value', () => {
    fireEvent.mouseDown(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    fireEvent.click(options[1]);

    expect(handleChangeStub).toHaveBeenCalledTimes(1);
  });

  it('updates shown value based on state change', () => {
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.queryByText('two')).toBeNull();

    rerender(<Dropdown
      onChange={handleChangeStub}
      vin={testVin}
      value={2}
      data={data}
      RenderSubItems={() => <>subitems_present</>}
      Item={() => null}
    />);

    expect(screen.queryByText('one')).toBeNull();
    expect(screen.getByText('two')).toBeInTheDocument();
  });
});
