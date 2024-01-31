import wrapContext from '@/spec/helper';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { testVin } from '@/spec/constants';
import GearShift from '../../../components/tiles/GearShift';

const GEAR_PARK = 2;
const GEAR_REVERSE = 3;
const GEAR_NEUTRAL = 5;

describe('GearShift', () => {
  let saveData: jest.Mock;
  beforeEach(() => {
    saveData = jest.fn();
  });

  describe('when the gear is in park', () => {
    beforeEach(async () => {
      await act(async () => render(
        wrapContext(<GearShift vin={testVin} />, saveData, {
          fleetData: {
            'device-1': {
              data: { Gear: { shiftState: GEAR_PARK } },
              key: '',
              cert: '',
            },
          },
        }),
      ));
    });

    it('renders the gear shift component', () => {
      expect(screen.getByText('Gear Shift')).toBeTruthy();
    });

    it.each(['P', 'R', 'D', '+'])('renders the %s button', (gear) => {
      expect(screen.getByText(gear)).toBeTruthy();
    });

    it.each(['Neutral', 'Unknown', 'Invalid', 'SNA'])(
      'renders %s in menu',
      (option) => {
        expect(screen.getByText('+')).toBeTruthy();
        fireEvent.click(screen.getByText('+'));
        expect(screen.getByText(option)).toBeTruthy();
      },
    );

    it('highlights the selected gear', () => {
      expect(screen.getByText('P').classList).toContain('MuiButton-contained');
    });

    it('does not highlight non selected gear', () => {
      expect(screen.getByText('R').classList).not.toContain(
        'MuiButton-contained',
      );
    });

    it('switches gears', async () => {
      await act(() => fireEvent.click(screen.getByText('R')));
      expect(screen.getByText('R').classList).toContain('MuiButton-contained');
      expect(screen.getByText('P').classList).not.toContain(
        'MuiButton-contained',
      );
    });

    it('saves the change', async () => {
      await act(() => fireEvent.click(screen.getByText('R')));
      expect(saveData).toHaveBeenCalledTimes(1);
      expect(saveData.mock.calls[0][0]).toMatchObject({
        [testVin]: { data: { Gear: { shiftState: GEAR_REVERSE } } },
      });
    });
  });

  describe('when the gear is in neutral', () => {
    beforeEach(async () => {
      await act(async () => render(
        wrapContext(<GearShift vin="device-1" />, saveData, {
          fleetData: {
            'device-1': {
              data: { Gear: { shiftState: GEAR_NEUTRAL } },
              key: '',
              cert: '',
            },
          },
        }),
      ));
    });

    it('highlights the + button', () => {
      expect(screen.getByText('+').classList).toContain('MuiButton-contained');
    });
  });
});
