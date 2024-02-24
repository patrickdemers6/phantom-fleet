'use client';

import TextInput from './TextInput';
import Vehicle from './components/Vehicle';

type VehicleTextInputData = {
  unit?: string;
  formType?: string;
};

/**
 * VehicleTextInput renders a vehicle with text input fields for each door and the front and rear of the vehicle
 * Expected order: driverFront, driverRear, passengerFront, passengerRear, front, rear
 * To exclude a field, pass null
 * @param props
 * @returns
 */
const VehicleTextInput = (props: RendererProps<VehicleTextInputData>) => {
  const { handleChangeFns, vin } = props;
  const { unit } = props.data;
  const type = props.data.formType || 'text';
  const [driverFront, driverRear, passengerFront, passengerRear, front, rear] = props.values;

  return (
    <Vehicle
      driverFront={<TextInput data={{ unit, type }} handleChangeFns={[handleChangeFns[0]]} values={[driverFront]} vin={vin} />}
      driverRear={<TextInput data={{ unit, type }} handleChangeFns={[handleChangeFns[1]]} values={[driverRear]} vin={vin} />}
      passengerFront={<TextInput data={{ unit, type }} handleChangeFns={[handleChangeFns[2]]} values={[passengerFront]} vin={vin} />}
      passengerRear={<TextInput data={{ unit, type }} handleChangeFns={[handleChangeFns[3]]} values={[passengerRear]} vin={vin} />}
      front={<TextInput data={{ unit, type }} handleChangeFns={[handleChangeFns[4]]} values={[front]} vin={vin} />}
      rear={<TextInput data={{ unit, type }} handleChangeFns={[handleChangeFns[5]]} values={[rear]} vin={vin} />}
    />
  );
};

export default VehicleTextInput;
