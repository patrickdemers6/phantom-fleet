'use client';

import { useApp } from '@/context/ApplicationProvider';
import { FLEET } from '@/constants/paths';
import { Box, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

function FleetPage() {
  const { fleetData, isLoading } = useApp();

  useEffect(() => {
    if (isLoading) return;
    if (Object.keys(fleetData).length > 0) {
      redirect(`${FLEET}/${Object.keys(fleetData)[0]}`);
    }
  }, [isLoading, fleetData]);

  if (isLoading) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Typography variant="h6">
        To get started, add a vehicle to your fleet.
      </Typography>
    </Box>
  );
}

export default FleetPage;
