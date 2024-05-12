'use client';

import AppBar from '@/components/AppBar/AppBar';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useRouter } from 'next/navigation';
import { GUIDED_SETUP, FLEET } from '@/constants/paths';
import { useApp } from '@/context/ApplicationProvider';
import { Delete, Help } from '@mui/icons-material';
import { Vin } from '@/context/types';
import { useSnackbar } from '@/components/SnackbarContext';
import SendConfiguration from '@/components/setup/SendConfiguration';
import { useReducer } from 'react';

type FleetProps = {
  children: React.ReactNode;
};

const hideSecondaryActionUntilHover = {
  '.secondaryAction': {
    visibility: 'hidden',
  },
  '&:hover': {
    '& .secondaryAction': {
      visibility: 'visible',
    },
  },
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 800,
  height: 500,
  overflow: 'scroll',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function VehicleListDrawer() {
  const router = useRouter();
  const params = useParams();
  const app = useApp();
  const vins = Object.keys(app.fleetData);
  const snackbar = useSnackbar();
  const [addVehicleModal, toggleAddVehicleModal] = useReducer((v) => !v, false);
  const fleetVehicles = vins.map((vin) => ({
    vin,
    nickname: app.fleetData[vin].data.VehicleName?.stringValue || '',
  }));

  const deleteVehicle = (vin: Vin) => {
    app.deleteByVin(vin);
    if (window.location.pathname === `${FLEET}/${vin}`) router.push(FLEET);
    snackbar.openSnackbar(`${vin} deleted`, 'success');
  };

  return (
    <>
      <List
        subheader={(
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Your Fleet
            <span>
              <Tooltip title="Add Vehicle">
                {/* span is needed for tooltip since disabled buttons do not emit events */}
                <span>
                  <IconButton
                    size="small"
                    aria-label="add vehicle"
                    onClick={toggleAddVehicleModal}
                    disabled={app.isLoading}
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </span>
          </ListSubheader>
        )}
      >
        {fleetVehicles.map((vehicle) => (
          <ListItem
            key={vehicle.vin}
            disablePadding
            sx={hideSecondaryActionUntilHover}
            secondaryAction={(
              <Box display="flex" alignItems="center">
                <Tooltip title="Delete">
                  <IconButton
                    className="secondaryAction"
                    onClick={() => deleteVehicle(vehicle.vin)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          >
            <ListItemButton
              selected={params.id === vehicle.vin}
              onClick={() => router.push(`${FLEET}/${vehicle.vin}`)}
            >
              <ListItemText primary={vehicle.nickname} secondary={vehicle.vin} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Modal open={addVehicleModal} onClose={toggleAddVehicleModal}>
        <Box sx={modalStyle}>
          <Typography variant="h4">Add a vehicle</Typography>
          <SendConfiguration />
        </Box>
      </Modal>
    </>
  );
}

function Fleet({ children }: FleetProps) {
  const router = useRouter();
  const redirectToConfigure = () => {
    router.push(GUIDED_SETUP);
  };
  return (
    <AppBar
      right={[
        <Tooltip title="Guided Setup">
          <IconButton
            color="inherit"
            onClick={redirectToConfigure}
          >
            <Help />
          </IconButton>
        </Tooltip>,
      ]}
      drawerContent={<VehicleListDrawer />}
    >
      {children}
    </AppBar>
  );
}

export default Fleet;
