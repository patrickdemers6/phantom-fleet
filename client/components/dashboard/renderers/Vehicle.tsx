'use client';

import TopdownVehicle from './components/TopdownVehicle';

type VehicleData = {
  unit?: string;
  formType?: string;
  renderer: string;
  rendererData: any;
};

/**
 * VehicleTextInput renders a vehicle with text input fields for each door and the front and rear of the vehicle
 * Expected order: driverFront, driverRear, passengerFront, passengerRear, front, rear
 * To exclude a field, pass null
 * @param props
 * @returns
 */
const Vehicle = (props: RendererProps<VehicleData>) => {
  const { handleChangeFns, vin } = props;
  const GenericRenderer = props.GenericRenderer ?? (() => <div />);
  const { renderer, rendererData } = props.data;
  const [driverFront, driverRear, passengerFront, passengerRear, front, rear] = props.values;

  return (
    <TopdownVehicle
      driverFront={driverFront
        ? <GenericRenderer type={renderer} data={rendererData} handleChangeFns={[handleChangeFns[0]]} values={[driverFront]} vin={vin} />
        : undefined}
      driverRear={driverRear
        ? <GenericRenderer type={renderer} data={rendererData} handleChangeFns={[handleChangeFns[1]]} values={[driverRear]} vin={vin} />
        : undefined}
      passengerFront={passengerFront
        ? <GenericRenderer type={renderer} data={rendererData} handleChangeFns={[handleChangeFns[2]]} values={[passengerFront]} vin={vin} />
        : undefined}
      passengerRear={passengerRear
        ? <GenericRenderer type={renderer} data={rendererData} handleChangeFns={[handleChangeFns[3]]} values={[passengerRear]} vin={vin} />
        : undefined}
      front={front
        ? <GenericRenderer type={renderer} data={rendererData} handleChangeFns={[handleChangeFns[4]]} values={[front]} vin={vin} />
        : undefined}
      rear={rear
        ? <GenericRenderer type={renderer} data={rendererData} handleChangeFns={[handleChangeFns[5]]} values={[rear]} vin={vin} />
        : undefined}
    />
  );
};

export default Vehicle;
