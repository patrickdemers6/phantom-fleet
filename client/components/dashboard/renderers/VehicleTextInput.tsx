'use client';

import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import Vehicle from './components/Vehicle';

type VehicleTextInputData = {
  unit?: string;
  formType?: string;
};

const TextInput = ({
  value, onChange, unit, ...props
}: { unit?: string } & TextFieldProps) => {
  if (value === null || typeof value === 'undefined') return null;

  return (
    <TextField
      onChange={onChange}
      value={value}
      InputProps={unit ? { endAdornment: <InputAdornment position="end">{unit}</InputAdornment>, ...props.InputProps } : props.InputProps}
      {...props}
      type={props.type === 'number' ? 'text' : props.type}
    />
  );
};

/**
 * VehicleTextInput renders a vehicle with text input fields for each door and the front and rear of the vehicle
 * Expected order: driverFront, driverRear, passengerFront, passengerRear, front, rear
 * To exclude a field, pass null
 * @param props
 * @returns
 */
const VehicleTextInput = (props: RendererProps<VehicleTextInputData>) => {
  const { handleChangeFns } = props;
  const formType = props.data.formType || 'text';
  const [driverFront, driverRear, passengerFront, passengerRear, front, rear] = props.values;

  const makeOnChangeFn = (index: number) => (e: (React.ChangeEvent<HTMLInputElement>)) => handleChangeFns[index](e.target.value);

  return (
    <Vehicle
      driverFront={<TextInput value={driverFront} onChange={makeOnChangeFn(0)} unit={props.data.unit} type={formType} />}
      driverRear={<TextInput value={driverRear} onChange={makeOnChangeFn(1)} unit={props.data.unit} type={formType} />}
      passengerFront={<TextInput value={passengerFront} onChange={makeOnChangeFn(2)} unit={props.data.unit} type={formType} />}
      passengerRear={<TextInput value={passengerRear} onChange={makeOnChangeFn(3)} unit={props.data.unit} type={formType} />}
      front={<TextInput value={front} onChange={makeOnChangeFn(4)} unit={props.data.unit} type={formType} />}
      rear={<TextInput value={rear} onChange={makeOnChangeFn(5)} unit={props.data.unit} type={formType} />}
    />
  );
};

export default VehicleTextInput;
