import { ServerData } from '@/context/types';
import wrapContext from '@/spec/helper';
import { act, render } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Home from '@/app/page';

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

describe('page /', () => {
  const renderPage = async (serverData?: ServerData) => {
    await act(async () => render(
      wrapContext(<Home />, jest.fn(), {
        serverData,
      }),
    ));
  };

  it('redirects to /configure when server data not defined', async () => {
    await renderPage();
    expect(mockRouter.pathname).toEqual('/configure');
  });

  it('redirects to /configure when server data empty', async () => {
    await renderPage({ host: '', port: '' });
    expect(mockRouter.pathname).toEqual('/configure');
  });

  it('redirects to /fleet when server data defined', async () => {
    await renderPage({ host: 'host', port: '1234' });
    expect(mockRouter.pathname).toEqual('/fleet');
  });
});
