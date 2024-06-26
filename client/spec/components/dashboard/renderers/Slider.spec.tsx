import Slider, { SliderData } from '@/components/dashboard/renderers/Slider';
import { testVin } from '@/spec/constants';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Slider', () => {
  let props: RendererProps<SliderData>;
  beforeEach(() => {
    props = {
      title: 'Test title',
      data: {
        min: 0,
        max: 10,
        step: 1,
        unit: 'PSI',
      },
      value: 1,
      onChange: jest.fn(),
      vin: testVin,
    };
  });
  it('renders title', () => {
    render(<Slider {...props} />);
    expect(screen.getByText('Test title')).toBeInTheDocument();
  });

  it('renders units without title', () => {
    delete props.title;
    render(<Slider {...props} />);
    expect(screen.getByText('PSI')).toBeInTheDocument();
  });

  it('updates value from slider', () => {
    render(<Slider {...props} />);
    fireEvent.change(screen.getByTestId('Slider-slider'), { target: { value: 5 } });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('5');
  });

  it('updates value from input', () => {
    render(<Slider {...props} />);
    fireEvent.change(screen.getByTestId('Slider-textfield'), { target: { value: 5 } });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith(5);
  });
});
