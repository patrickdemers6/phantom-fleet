import FleetIdPage from '@/app/fleet/[id]/page';
import { SnackbarProvider } from '@/components/SnackbarContext';
import { testVin } from '@/spec/constants';
import wrapContext from '@/spec/helper';
import {
  act, render, screen,
} from '@testing-library/react';
import sendData from '@/api/data';
import { FleetData } from '@/context/types';

jest.mock('../../../../api/data', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

const renderPage = (fleetData: FleetData) => act(async () => render(
  wrapContext(
    <SnackbarProvider>
      <FleetIdPage params={{ id: testVin }} />
    </SnackbarProvider>,
    jest.fn(),
    {
      fleetData,
    },
  ),
));

const vehicle = {
  data: {
    Gear: { intValue: 2 },
  },
  key: 'key',
  cert: 'cert',
};

describe('page /fleet/[id]', () => {
  describe('vehicle exists', () => {
    beforeEach(async () => {
      await renderPage({ [testVin]: vehicle });
    });

    it('renders GearShift', () => {
      expect(screen.getByText('Gear Shift')).toBeInTheDocument();
    });

    it('clicking send button sends data', async () => {
      act(() => screen.getByText('Send').click());
      expect(sendData).toHaveBeenCalledTimes(1);
      expect(sendData).toHaveBeenCalledWith(testVin, vehicle);
    });
  });

  describe('vehicle does not exist', () => {
    beforeEach(async () => {
      await renderPage({});
    });

    it('shows vehicle not found', () => {
      expect(screen.getByText('Vehicle not found.')).toBeInTheDocument();
    });
  });

  describe('pre-send validations', () => {
    it.each([
      ['key', '', 'cert'],
      ['certificate', 'key', ''],
    ])(
      'errors when vehicle %s is empty',
      async (nameInError: string, key: string, cert: string) => {
        await renderPage({
          [testVin]: {
            data: {},
            key,
            cert,
          },
        });

        act(() => screen.getByText('Send').click());
        expect(
          screen.getByText(`Vehicle ${nameInError} is required.`),
        ).toBeInTheDocument();
      },
    );
  });
});
