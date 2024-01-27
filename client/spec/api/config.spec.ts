import { setConfig } from '@/api/config';
import Methods from '@/api/methods';
import Sinon from 'sinon';

const host = 'example.com';
const port = 8080;

describe('setConfig', () => {
  it('return json on success', async () => {
    const stub = Sinon.stub(Methods, 'post');
    stub.resolves(new Response(JSON.stringify({ reason: 'success' })));

    const res = await setConfig(host, port);
    Sinon.assert.calledOnce(stub);
    expect(JSON.parse(stub.firstCall.args[1]?.body?.toString() || '')).toEqual({
      host,
      port,
    });
    expect(res).toEqual({ reason: 'success' });
  });

  it('returns error', async () => {
    const stub = Sinon.stub(Methods, 'post');
    stub.rejects(new Error('API is down'));

    const res = await setConfig(host, port);
    Sinon.assert.calledOnce(stub);
    expect(res).toEqual({ reason: 'Unexpected error: API is down' });
  });
});
