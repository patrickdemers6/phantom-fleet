import FleetIdPage from '@/app/fleet/[id]/page';
import { SnackbarProvider } from '@/components/SnackbarContext';
import { testVin } from '@/spec/constants';
import wrapContext from '@/spec/helper';
import {
  act, render, screen,
} from '@testing-library/react';
import sendData from '@/api/data';
import { FleetData } from '@/context/types';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

jest.mock('../../../../api/data', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));
jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

const renderPage = (fleetData: FleetData) => act(async () => render(
  wrapContext(
    <SnackbarProvider>
      <FleetIdPage params={{ id: testVin }} />
    </SnackbarProvider>,
    jest.fn(),
    fleetData,
  ),
  { wrapper: MemoryRouterProvider },
));

const vehicle = {
  data: {
    Gear: { shiftState: 2 },
  },
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
    });
  });

  describe('vehicle does not exist', () => {
    beforeEach(async () => {
      await renderPage({});
    });

    it('shows vehicle not found', () => {
      expect(screen.getByText('Vehicle not found')).toBeInTheDocument();
    });
  });
});
