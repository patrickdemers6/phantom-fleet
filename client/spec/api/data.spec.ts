import sendData from '@/api/data';
import Methods from '@/api/methods';
import Sinon from 'sinon';
import { testVin } from '../constants';

describe('data api', () => {
  it('should send data', async () => {
    Sinon.useFakeTimers(100);
    const stub = Sinon.stub(Methods, 'post');
    stub.resolves(new Response('{}'));
    await sendData(testVin, {
      data: {
        Gear: {
          intValue: 3,
        },
      },
      key: 'key',
      cert: 'cert',
    });
    Sinon.assert.calledOnce(stub);
    expect(JSON.parse(stub.firstCall.args[1]?.body?.toString() || '')).toEqual({
      cert: 'cert',
      data: [{ key: 'Gear', value: { intValue: 3 } }],
      messageId: 'msg-0',
      createdAt: 100,
      txid: 'msg-0',
      topic: 'V',
      vin: testVin,
      device_type: 'vehicle_device',
      key: 'key',
    });
  });

  it('rejects on error', async () => {
    Sinon.useFakeTimers(100);
    const stub = Sinon.stub(Methods, 'post');
    stub.resolves(new Response('{}', { status: 500 }));
    await expect(() => sendData(testVin, {
      data: {
        Gear: {
          intValue: 3,
        },
      },
      key: 'key',
      cert: 'cert',
    })).rejects.toThrow('Failed to send data');
  });
});
