'use client';

import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import TopdownVehicle from './components/TopdownVehicle';

type Position = 'driverFront' | 'driverRear' | 'passengerFront' | 'passengerRear' | 'front' | 'rear';

type VehicleData = {
  unit?: string;
  formType?: string;
  positional: {
    [key in Position]?: TileItem;
  }
};

/**
 * VehicleTextInput renders a vehicle with text input fields for each door and the front and rear of the vehicle
 * Expected order: driverFront, driverRear, passengerFront, passengerRear, front, rear
 * To exclude a field, pass null
 * @param props
 * @returns
 */
const Vehicle = (props: RendererProps<VehicleData>) => {
  const { vin, Item } = props;

  const topdownVehicleProps = Object.entries(props.data.positional)
    .reduce<{ [key in Position]?: ReactNode }>((accumulator, [key, value]) => {
    accumulator[key as Position] = <Item item={value} vin={vin} />;
    return accumulator;
  }, {});

  return (
    <Box>
      {props.title ? <Typography>{props.title}</Typography> : null}
      <TopdownVehicle {...topdownVehicleProps} />
    </Box>
  );
};

export default Vehicle;
