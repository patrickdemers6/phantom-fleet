import VehicleTextInput from '@/components/dashboard/renderers/VehicleTextInput';
import { testVin } from '@/spec/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { JSXElementConstructor, ReactElement } from 'react';

describe('VehicleTextInput', () => {
  let handleChangeStub1: jest.Mock;
  let handleChangeStub2: jest.Mock;
  let rerender: (ui: ReactElement<any, string | JSXElementConstructor<any>>) => void;

  beforeEach(() => {
    handleChangeStub1 = jest.fn();
    handleChangeStub2 = jest.fn();
    const s = render(<VehicleTextInput
      vin={testVin}
      handleChangeFns={[handleChangeStub1, handleChangeStub2]}
      values={[10, 12]}
      data={{
        unit: 'psi',
      }}
      RenderSubItems={() => <div />}
    />);
    rerender = s.rerender;
  });

  it('renders unit', () => {
    expect(screen.getAllByText('psi')).toHaveLength(2);
  });

  it('handles rendering and updates of all 6 positions', () => {
    const values = [0, 1, 2, 3, 4, 5];
    const stubs = values.map(() => jest.fn());
    rerender(<VehicleTextInput
      vin={testVin}
      handleChangeFns={stubs}
      values={values}
      data={{
        unit: 'psi',
        formType: 'number',
      }}
      RenderSubItems={() => <div />}
    />);
    values.forEach((value) => {
      const el = screen.getByDisplayValue(value);
      expect(el).toBeInTheDocument();

      expect(stubs[value]).toHaveBeenCalledTimes(0);
      fireEvent.change(el, {
        target: { value: value + 10 },
      });
      expect(stubs[value]).toHaveBeenCalledTimes(1);
      expect(stubs[value]).toHaveBeenCalledWith((value + 10).toString());
    });
  });
});
