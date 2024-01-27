import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Form from '@/components/vehicle/Form';
import { testVehicle, testVin } from '@/spec/constants';

describe('Form', () => {
  describe('onDelete is set', () => {
    let onSubmit: jest.Mock;
    let onChange: jest.Mock;
    let onClose: jest.Mock;
    let onDelete: jest.Mock;
    beforeEach(() => {
      onSubmit = jest.fn();
      onChange = jest.fn();
      onClose = jest.fn();
      onDelete = jest.fn();
      render(
        <Form
          onSubmit={onSubmit}
          onChange={onChange}
          onClose={onClose}
          onDelete={onDelete}
          data={testVehicle}
          btnText="Submit"
        />,
      );
    });

    it('calls onSubmit when the submit button is clicked', () => {
      screen.getByText('Submit').click();
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(testVehicle);
    });

    it('calls onClose when the submit button is clicked', () => {
      screen.getByText('Cancel').click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete when the delete button is clicked', () => {
      screen.getByText('Delete').click();
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('calls onChange when a field is changed', () => {
      const newVin = `${testVin}updated`;
      fireEvent.change(screen.getByLabelText('VIN'), {
        target: { value: newVin },
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('vin', newVin);
    });
  });

  describe('hides onDelete is not set', () => {
    it('hides delete button', () => {
      render(
        <Form
          onSubmit={jest.fn()}
          onChange={jest.fn()}
          onClose={jest.fn()}
          data={testVehicle}
          btnText="Submit"
        />,
      );
      expect(screen.queryByText('Delete')).toBeNull();
    });
  });
});
