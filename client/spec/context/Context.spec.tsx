import ContextProvider from '@/context/Context';
import { Context, createContext, useContext } from 'react';
import {
  AppContext,
  DataStore,
  FleetData,
  ServerData,
  Vehicle,
} from '@/context/types';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import { testVin } from '../constants';

function TestComponent({ context, onClick, makeAssertions }: {
  context: Context<AppContext | undefined>;
  onClick: (c: AppContext) => void;
  makeAssertions: (c: AppContext) => void;
}) {
  const app = useContext(context);
  if (!app || app.isLoading) {
    return null;
  }

  return (
    <>
      <div onClick={() => onClick(app)}>click</div>
      <div onClick={() => makeAssertions(app)}>assert</div>
    </>
  );
}

type Data = { fleetData?: FleetData; serverData?: ServerData };

describe('Context', () => {
  let ds: DataStore;
  const testWithContext = async (
    onClick: (c: AppContext) => void,
    makeAssertions: (c: AppContext) => void,
    data: Data = {},
  ) => {
    const context = createContext<AppContext | undefined>(undefined);
    ds = {
      loadData: jest.fn().mockReturnValue({
        fleetData: data.fleetData ?? {},
        serverData: data.serverData ?? { host: '', port: '' },
      }),
      saveData: jest.fn(),
    };

    render(
      <ContextProvider dataStore={ds} Context={context}>
        <TestComponent
          context={context}
          onClick={onClick}
          makeAssertions={makeAssertions}
        />
      </ContextProvider>,
    );
    await waitFor(() => expect(screen.getByText('click')).toBeInTheDocument());
    act(() => screen.getByText('click').click());
    act(() => screen.getByText('assert').click());
  };

  it('saveData called once after update', async () => {
    await testWithContext(
      (ctx) => {
        ctx.configureServer('host2', 'port2');
      },
      () => { },
    );
    await waitFor(() => expect(ds.saveData).toHaveBeenCalledTimes(1));
    expect(ds.saveData).toHaveBeenCalledWith(
      {},
      { host: 'host2', port: 'port2' },
    );
  });

  it('configureServer', async () => {
    await testWithContext(
      (ctx) => {
        ctx.configureServer('host2', 'port2');
      },
      (ctx) => {
        expect(ctx.server).toEqual({ host: 'host2', port: 'port2' });
      },
    );
  });

  it('changeVin', async () => {
    const vehicleData = {
      data: { Gear: { intValue: 1 } },
      key: '',
      cert: '',
    };
    await testWithContext(
      (ctx) => {
        ctx.changeVin('vin1', 'vin2');
      },
      (ctx) => {
        expect(ctx.fleetData).toEqual({ vin2: vehicleData });
      },
      {
        fleetData: {
          vin1: vehicleData,
        },
      },
    );
  });

  it('newVehicle', async () => {
    await testWithContext(
      (ctx) => {
        ctx.newVehicle('newVin');
      },
      (ctx) => {
        expect(ctx.fleetData).toEqual({
          newVin: {
            data: {
              Gear: { intValue: 2 },
              VehicleName: { stringValue: 'First Vehicle' },
            },
            key: '',
            cert: '',
          },
        });
      },
    );
  });

  it.each([
    [
      'setIntData',
      { data: { Odometer: { intValue: 1 } } },
      { data: { Odometer: { intValue: 2 } } },
      (ctx: AppContext) => ctx.setIntData(testVin, 'Odometer', 2),
    ],
    [
      'setStringData',
      { data: { VehicleName: { stringValue: 'before' } } },
      { data: { VehicleName: { stringValue: 'after' } } },
      (ctx: AppContext) => ctx.setStringData(testVin, 'VehicleName', 'after'),
    ],
    [
      'setLocationValue',
      { data: { VehicleName: { stringValue: 'before' } } },
      { data: { VehicleName: { stringValue: 'after' } } },
      (ctx: AppContext) => ctx.setStringData(testVin, 'VehicleName', 'after'),
    ],
    [
      'setChargeState',
      { data: { ChargeState: { chargeState: 1 } } },
      { data: { ChargeState: { chargeState: 2 } } },
      (ctx: AppContext) => ctx.setChargeState(testVin, 'ChargeState', 2),
    ],
    [
      'setShiftState',
      { data: { Gear: { shiftState: 1 } } },
      { data: { Gear: { shiftState: 2 } } },
      (ctx: AppContext) => ctx.setShiftState(testVin, 'Gear', 2),
    ],
    [
      'setCert',
      { cert: 'before' },
      { cert: 'after' },
      (ctx: AppContext) => ctx.setCert(testVin, 'after'),
    ],
    [
      'setKey',
      { key: 'before' },
      { key: 'after' },
      (ctx: AppContext) => ctx.setKey(testVin, 'after'),
    ],
  ])(
    '%s',
    async (
      _,
      vehicleBefore: Partial<Vehicle>,
      vehicleAfter: Partial<Vehicle>,
      onClick,
    ) => {
      const defaultVehicle = { key: '', cert: '', data: {} };
      await testWithContext(
        onClick,
        (ctx) => {
          expect(ctx.fleetData).toEqual({
            [testVin]: { ...defaultVehicle, ...vehicleAfter },
          });
        },
        {
          fleetData: {
            [testVin]: { ...defaultVehicle, ...vehicleBefore },
          },
        },
      );
    },
  );
});
