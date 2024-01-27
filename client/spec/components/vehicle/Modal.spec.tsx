import VehicleModal from '@/components/vehicle/Modal';
import { testVehicle, testVin } from '@/spec/constants';
import {
  fireEvent, render, screen,
} from '@testing-library/react';

describe('VehicleModal', () => {
  let onSubmit: jest.Mock;
  let onClose: jest.Mock;
  beforeEach(() => {
    onSubmit = jest.fn();
    onClose = jest.fn();
  });
  describe('update existing vehicle', () => {
    beforeEach(() => {
      render(
        <VehicleModal
          open
          onClose={onClose}
          vehicle={testVehicle}
          onSubmit={onSubmit}
        />,
      );
    });

    it('renders update title', () => {
      expect(screen.getByText(`Update ${testVin}`)).toBeTruthy();
    });

    it('has a delete button', () => {
      expect(screen.getByText('Delete', { selector: 'button' })).toBeTruthy();
    });

    it('has an update button', () => {
      expect(screen.getByText('Update', { selector: 'button' })).toBeTruthy();
    });
  });

  describe('create new vehicle', () => {
    beforeEach(() => {
      render(
        <VehicleModal
          open
          onClose={onClose}
          vehicle={null}
          onSubmit={onSubmit}
        />,
      );
    });

    it('renders create title', () => {
      expect(screen.getByText('Create a vehicle')).toBeTruthy();
    });

    it('renders create button', () => {
      expect(
        screen.getByText('Create', {
          selector: 'button',
        }),
      ).toBeTruthy();
    });
  });

  it('resets data on reopen', async () => {
    const { rerender, getByLabelText } = render(
      <VehicleModal
        open
        onClose={onClose}
        vehicle={null}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.change(getByLabelText('VIN'), {
      target: { value: 'new-vin' },
    });

    rerender(
      <VehicleModal
        open={false}
        onClose={onClose}
        vehicle={null}
        onSubmit={onSubmit}
      />,
    );

    rerender(
      <VehicleModal
        open
        onClose={onClose}
        vehicle={null}
        onSubmit={onSubmit}
      />,
    );

    expect(getByLabelText('VIN').innerText).toBeFalsy();
  });
});
