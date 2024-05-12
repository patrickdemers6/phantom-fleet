import Methods from '@/api/methods';
import GuidedSetupPage from '@/app/setup/page';
import { SnackbarProvider } from '@/components/SnackbarContext';
import { testVin } from '@/spec/constants';
import wrapContext from '@/spec/helper';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import Sinon from 'sinon';

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

describe('page /setup', () => {
  beforeEach(() => {
    const stub = Sinon.stub(Methods, 'get');
    stub.resolves(new Response(JSON.stringify({ ca: 'fake ca' })));
  });
  describe('default render', () => {
    beforeEach(async () => {
      await act(async () => render(
        wrapContext(
          <SnackbarProvider>
            <GuidedSetupPage />
          </SnackbarProvider>,
        ),
        { wrapper: MemoryRouterProvider },
      ));
    });

    it('renders title', () => {
      expect(screen.getByText('Guided Setup')).toBeInTheDocument();
    });

    it('renders three pages', () => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeInTheDocument();

      // step 1
      expect(screen.getByText('fake ca')).toBeInTheDocument();
      fireEvent.click(nextButton);

      // step 2
      expect(
        screen.getByText("In your server's config.json, set tls.ca_file to this certificate's path. Below is a basic configuration file."),
      ).toBeInTheDocument();
      fireEvent.click(nextButton);

      // step 3
      expect(screen.getByText((el) => el.includes('Vehicles are configured using an endpoint identical'))).toBeInTheDocument();
    });
  });

  describe('step 3', () => {
    it('does not redirect if vehicle already present', async () => {
      await act(async () => render(
        wrapContext(
          <SnackbarProvider>
            <GuidedSetupPage />
          </SnackbarProvider>,
          async () => {},
          {
            [testVin]: { data: {} },
          },
        ),
        { wrapper: MemoryRouterProvider },
      ));

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(screen.getByText((el) => el.includes('1 vehicle already configured.'))).toBeInTheDocument();
      expect(screen.queryByText('This page will redirect automatically once a configuration is received.')).not.toBeInTheDocument();
    });

    it('redirects once first config received', async () => {
      await act(async () => render(
        wrapContext(
          <SnackbarProvider>
            <GuidedSetupPage />
          </SnackbarProvider>,
        ),
        { wrapper: MemoryRouterProvider },
      ));

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(screen.getByText('This page will redirect automatically once a configuration is received.')).toBeInTheDocument();
    });
  });
});
