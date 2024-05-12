import FleetPage from '@/app/fleet/page';
import { testVin } from '@/spec/constants';
import wrapContext from '@/spec/helper';
import { act, render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next-router-mock'),
  redirect: jest.fn(),
}));

describe('page /fleet', () => {
  it('renders when no vehicles', async () => {
    await act(async () => {
      render(
        wrapContext(<FleetPage />),
      );
    });
    expect(
      screen.getByText('To get started, add a vehicle to your fleet.'),
    ).toBeInTheDocument();
  });

  it('redirects when vehicle present', async () => {
    await act(async () => {
      render(
        wrapContext(<FleetPage />, jest.fn(), {
          [testVin]: {
            data: { Gear: { intValue: 1 } },
          },
        }),
      );
    });

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(`/fleet/${testVin}`);
  });
});
