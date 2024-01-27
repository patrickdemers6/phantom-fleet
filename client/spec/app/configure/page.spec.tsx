import ConfigurePage from '@/app/configure/page';
import { SnackbarProvider } from '@/components/SnackbarContext';
import { FLEET } from '@/constants/paths';
import wrapContext from '@/spec/helper';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

describe('page /configure', () => {
  beforeEach(async () => {
    await act(async () => render(
      wrapContext(
        <SnackbarProvider>
          <ConfigurePage />
        </SnackbarProvider>,
      ),
      { wrapper: MemoryRouterProvider },
    ));
  });

  it('renders', () => {
    expect(screen.getByText('Welcome to Phantom Fleet')).toBeInTheDocument();
  });

  it('redirects on skip', () => {
    const skip = screen.getByText('Skip connection setup');
    expect(skip).toBeInTheDocument();
    act(() => skip.click());
    expect(mockRouter.pathname).toEqual(FLEET);
  });

  describe('host validations', () => {
    it('errors when empty', () => {
      fireEvent.change(screen.getByLabelText('Host'), {
        target: { value: '' },
      });
      act(() => screen.getByText('Validate Connection').click());
      expect(screen.getByText('Host cannot be empty')).toBeInTheDocument();
    });
  });

  describe('port validations', () => {
    it('errors when empty', () => {
      fireEvent.change(screen.getByLabelText('Port'), {
        target: { value: '' },
      });
      act(() => screen.getByText('Validate Connection').click());
      expect(screen.getByText('Port cannot be empty')).toBeInTheDocument();
    });

    it('errors when non-numeric', () => {
      fireEvent.change(screen.getByLabelText('Port'), {
        target: { value: '12abc' },
      });
      act(() => screen.getByText('Validate Connection').click());
      expect(screen.getByText('Port must be a number')).toBeInTheDocument();
    });
  });
});
