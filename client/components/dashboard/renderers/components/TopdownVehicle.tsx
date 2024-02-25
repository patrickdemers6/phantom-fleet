'use client';

import { Box } from '@mui/material';
import Image from 'next/image';

type VehicleProps = {
  front?: React.ReactNode;
  driverFront?: React.ReactNode;
  driverRear?: React.ReactNode;
  passengerFront?: React.ReactNode;
  passengerRear?: React.ReactNode;
  rear?: React.ReactNode;
};

const SideWrapper = (props: { children: React.ReactNode }) => (
  <Box sx={{
    height: 100, justifyContent: 'center', display: 'flex', flexDirection: 'column',
  }}
  >
    {props.children}
  </Box>
);

const Vehicle = (props: VehicleProps) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  }}
  >
    {props.front ?? null}
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <SideWrapper>{props.driverFront ?? null}</SideWrapper>
        <SideWrapper>{props.driverRear ?? null}</SideWrapper>
      </Box>
      <Image alt="Overhead view of outlined Model 3" src="/model_3.svg" width={102} height={200} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <SideWrapper>{props.passengerFront ?? null}</SideWrapper>
        <SideWrapper>{props.passengerRear ?? null}</SideWrapper>
      </Box>
    </Box>
    {props.rear ?? null}
  </Box>
);

export default Vehicle;
