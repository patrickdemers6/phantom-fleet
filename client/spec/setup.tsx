import { SliderProps } from '@mui/material';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import Sinon from 'sinon';
import util from 'util';

fetchMock.enableMocks();

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  fetchMock.resetMocks();
  Sinon.reset();
  Sinon.restore();
});

process.env.NEXT_PUBLIC_PHANTOM_FLEET_API_URL = 'http://example.com/';

const filteredMessages = [/<html> cannot appear as a child of <div>/];

const { error } = console;
// eslint-disable-next-line no-console
console.error = (message, ...args) => {
  const fullMessage = util.format(message, ...args);
  if (filteredMessages.some((msg) => msg.test(fullMessage))) return;
  error(message, ...args);
};

// mui doesn't always play pretty with testability
jest.mock('@mui/material/Slider', () => (props: SliderProps & { 'data-testid': string }) => {
  const {
    id, name, min, max, onChange,
  } = props;
  const testId = props['data-testid'];
  return (
    <input
      data-testid={testId}
      type="range"
      id={id}
      name={name}
      min={min}
      max={max}
      // @ts-ignore next-line
      onChange={(e) => onChange(undefined, e?.target.value)}
    />
  );
});

window.structuredClone = (val) => JSON.parse(JSON.stringify(val));
