import Vehicle from '@/components/dashboard/renderers/components/Vehicle';
import { render, screen } from '@testing-library/react';

describe('Vehicle', () => {
  let rerender: (ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => void;
  beforeEach(() => {
    const s = render(<Vehicle
      driverFront={<div>driverFront</div>}
      driverRear={<div>driverRear</div>}
      passengerFront={<div>passengerFront</div>}
      passengerRear={<div>passengerRear</div>}
      front={<div>front</div>}
      rear={<div>rear</div>}
    />);
    rerender = s.rerender;
  });
  it('displays vehicle image', () => {
    const image = screen.getByRole('img');
    expect(image).toBeVisible();
  });

  it.each([
    ['front'],
    ['driverFront'],
    ['driverRear'],
    ['passengerFront'],
    ['passengerRear'],
    ['rear'],
  ])('displays %s', (text) => {
    expect(screen.getByText(text)).toBeVisible();
  });

  it.each([
    'front', 'rear',
  ])('renders with no %s', (field: string) => {
    const props = {
      front: <div>front</div>,
      rear: <div>rear</div>,
      driverFront: <div>driverFront</div>,
      driverRear: <div>driverRear</div>,
      passengerFront: <div>passengerFront</div>,
      passengerRear: <div>passengerRear</div>,
    };
    delete props[field as keyof typeof props];
    rerender(<Vehicle {...props} />);
    expect(screen.queryByText(field)).toBeNull();
  });
});
