import Methods from '@/api/methods';
import fetchMock from 'jest-fetch-mock';

describe('api methods', () => {
  beforeEach(() => {});
  describe('post', () => {
    it('makes request', async () => {
      const reqBody = { foo: 'bar' };
      const resBody = { bar: 'baz' };
      fetchMock.mockOnceIf('http://example.com/path', async (req) => {
        expect(req.method).toEqual('POST');
        expect(req.headers.get('Content-Type')).toEqual('application/json');
        expect(await req.json()).toMatchObject(reqBody);
        return JSON.stringify(resBody);
      });

      const res = await Methods.post('path', { body: JSON.stringify(reqBody) });
      expect(res.status).toEqual(200);
      expect(await res.json()).toMatchObject(resBody);
    });
  });
});
