import TextInput, { TextInputData } from '@/components/dashboard/renderers/TextInput';
import { testVin } from '@/spec/constants';
import { fireEvent, render, screen } from '@testing-library/react';

describe('TextInput', () => {
  let props: RendererProps<TextInputData>;
  let changeFn: jest.Mock;
  const defaultVaue = 'default-value';
  const unit = 'psi';
  beforeEach(() => {
    changeFn = jest.fn();
    props = {
      vin: testVin,
      data: {
        unit,
      },
      handleChangeFns: [changeFn],
      values: [defaultVaue],
    };
  });

  it('renders value', () => {
    render(<TextInput {...props} />);

    const el = screen.getByDisplayValue(defaultVaue);
    expect(el).toBeInTheDocument();
  });

  it('renders unit', () => {
    render(<TextInput {...props} />);
    expect(screen.getByText(unit)).toBeInTheDocument();
  });

  it('renders when no unit', () => {
    delete props.data.unit;
    render(<TextInput {...props} />);
  });

  it('calls change function', () => {
    render(<TextInput {...props} />);

    const el = screen.getByDisplayValue(defaultVaue);
    expect(el).toBeInTheDocument();

    expect(changeFn).toHaveBeenCalledTimes(0);
    fireEvent.change(el, {
      target: { value: 'updated' },
    });
    expect(changeFn).toHaveBeenCalledTimes(1);
    expect(changeFn).toHaveBeenCalledWith('updated');
  });
});
