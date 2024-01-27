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
