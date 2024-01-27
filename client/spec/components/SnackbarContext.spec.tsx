import {
  render, screen, act, waitFor,
} from '@testing-library/react';
import {
  SnackbarProvider,
  useSnackbar,
} from '../../components/SnackbarContext';

function TestComponent() {
  const { openSnackbar } = useSnackbar();

  const handleClick = () => {
    openSnackbar('Test Message', 'success');
  };

  return <button type="button" onClick={handleClick}>Open Snackbar</button>;
}

describe('SnackbarContext', () => {
  it('should render SnackbarProvider with children', () => {
    render(
      <SnackbarProvider>
        <div>Test Child</div>
      </SnackbarProvider>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should open snackbar with message and severity', () => {
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>,
    );

    act(() => screen.getByText('Open Snackbar').click());
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should close snackbar after delay', async () => {
    jest.useFakeTimers();
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>,
    );

    act(() => screen.getByText('Open Snackbar').click());
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(4000));
    await waitFor(
      () => expect(screen.queryByText('Test Message')).not.toBeInTheDocument(),
      { timeout: 500 },
    );
  });
});
