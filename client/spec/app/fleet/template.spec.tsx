import Fleet from '@/app/fleet/template';
import { testVin } from '@/spec/constants';
import wrapContext from '@/spec/helper';
import { act, render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next-router-mock'),
  useParams: () => ({ vin: testVin }),
}));

describe('fleet page template', () => {
  it('renders', async () => {
    await act(async () => {
      render(
        wrapContext(<Fleet>Children</Fleet>, jest.fn(), {
          fleetData: {},
        }),
      );
    });
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
});
