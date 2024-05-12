import ContextProvider from '@/context/Context';
import { Context, createContext, useContext } from 'react';
import {
  AppContext,
  DataStore,
  FleetData,
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

describe('Context', () => {
  let ds: DataStore;
  const testWithContext = async (
    onClick: (c: AppContext) => void,
    makeAssertions: (c: AppContext) => void,
    data: FleetData = {},
  ) => {
    const context = createContext<AppContext | undefined>(undefined);
    ds = {
      loadData: jest.fn().mockImplementation(async (callback) => {
        callback(data ?? {});
      }),
      saveData: jest.fn(),
      deleteByVin: jest.fn(),
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
        ctx.setIntValue(testVin, 'Odometer', 2);
      },
      () => {},
      { [testVin]: { data: { Odometer: { intValue: 1 } } } },
    );
    expect(ds.saveData).toHaveBeenCalledTimes(1);
  });

  it('changeVin', async () => {
    const vehicleData = {
      data: { Gear: { intValue: 1 } },
    };
    await testWithContext(
      (ctx) => {
        ctx.changeVin('vin1', 'vin2');
      },
      (ctx) => {
        expect(ctx.fleetData).toEqual({ vin2: vehicleData });
      },
      {
        vin1: vehicleData,
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
            },
          },
        });
      },
    );
  });

  it.each([
    [
      'setIntValue',
      { data: { Odometer: { intValue: 1 } } },
      { data: { Odometer: { intValue: 2 } } },
      (ctx: AppContext) => ctx.setIntValue(testVin, 'Odometer', 2),
    ],
    [
      'setFloatValue with int',
      { data: { Odometer: { floatValueInternal: '1' } } },
      { data: { Odometer: { floatValueInternal: '2' } } },
      (ctx: AppContext) => ctx.setFloatValue(testVin, 'Odometer', 2),
    ],
    [
      'setFloatValue with float',
      { data: { Odometer: { floatValueInternal: '1.1' } } },
      { data: { Odometer: { floatValueInternal: '2.2' } } },
      (ctx: AppContext) => ctx.setFloatValue(testVin, 'Odometer', 2.2),
    ],
    [
      'setFloatValue with valid string',
      { data: { Odometer: { floatValueInternal: '1.1' } } },
      { data: { Odometer: { floatValueInternal: '2.2' } } },
      (ctx: AppContext) => ctx.setFloatValue(testVin, 'Odometer', '2.2'),
    ],
    [
      'setIntValue with string',
      { data: { Odometer: { intValue: 1 } } },
      { data: { Odometer: { intValue: 2 } } },
      (ctx: AppContext) => ctx.setIntValue(testVin, 'Odometer', '2'),
    ],
    [
      'setStringValue',
      { data: { VehicleName: { stringValue: 'before' } } },
      { data: { VehicleName: { stringValue: 'after' } } },
      (ctx: AppContext) => ctx.setStringValue(testVin, 'VehicleName', 'after'),
    ],
    [
      'setShiftState',
      { data: { Gear: { shiftState: 1 } } },
      { data: { Gear: { shiftState: 2 } } },
      (ctx: AppContext) => ctx.setShiftState(testVin, 'Gear', 2),
    ],
  ])(
    '%s',
    async (
      _,
      vehicleBefore: Partial<Vehicle>,
      vehicleAfter: Partial<Vehicle>,
      onClick,
    ) => {
      const defaultVehicle = { data: {} };
      await testWithContext(
        onClick,
        (ctx) => {
          expect(ctx.fleetData).toEqual({
            [testVin]: { ...defaultVehicle, ...vehicleAfter },
          });
        },
        {
          [testVin]: { ...defaultVehicle, ...vehicleBefore },
        },
      );
    },
  );

  it('does not set int if string contains invalid characters', () => {
    const action = (app: AppContext) => {
      app.setIntValue(testVin, 'Odometer', '1a');
    };
    const makeAssertions = (app: AppContext) => {
      expect(app.fleetData).toEqual({
        [testVin]: { data: { Odometer: { intValue: 1 } }, key: '', cert: '' },
      });
    };
    testWithContext(
      action,
      makeAssertions,
      {
        [testVin]: { data: { Odometer: { intValue: 1 } } },
      },
    );
  });
});
