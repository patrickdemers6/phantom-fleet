'use client';

import sendData from '@/api/data';
import { useApp } from '@/context/ApplicationProvider';
import { useSnackbar } from '@/components/SnackbarContext';
import {
  AppBar,
  Box,
  Button,
  Grid,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material';
import Dashboard from '@/components/dashboard/Dashboard';

type FleetIdPageProps = {
  params: {
    id: string;
  };
};

function FleetIdPage({ params: { id: vin } }: FleetIdPageProps) {
  const { isLoading, fleetData } = useApp();
  const snackbar = useSnackbar();
  const vehicle = fleetData[vin];

  const handleSend = () => {
    if (vehicle.cert === '') {
      snackbar.openSnackbar('Vehicle certificate is required.', 'error');
    }
    if (vehicle.key === '') {
      snackbar.openSnackbar('Vehicle key is required.', 'error');
    }
    sendData(vin, vehicle).catch(() => {
      snackbar.openSnackbar('Failed to send data.', 'error');
    });
  };

  if (!vehicle && !isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" textAlign="center">
          Vehicle not found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" color="transparent" sx={{ boxShadow: 1 }}>
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>{vin}</Typography>
          <Button onClick={handleSend} disabled={isLoading}>
            Send
          </Button>
        </Toolbar>
      </AppBar>
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Dashboard vin={vin} />
          </Grid>
        </Box>
      )}
    </>
  );
}

export default FleetIdPage;
