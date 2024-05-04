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
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useRouter } from 'next/navigation';
import { CONFIGURE, FLEET } from '@/constants/paths';
import {
  VehicleModalProvider,
  useModal as useVehicleModal,
} from '@/components/vehicle/ModalContext';
import EditIcon from '@mui/icons-material/Edit';
import { useApp } from '@/context/ApplicationProvider';
import { VehicleFormData } from '@/components/vehicle/Form';
import { Error } from '@mui/icons-material';

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

function VehicleListDrawer() {
  const router = useRouter();
  const params = useParams();
  const vehicleModal = useVehicleModal();
  const app = useApp();
  const vins = Object.keys(app.fleetData);
  const fleetVehicles = vins.map((vin) => ({
    vin,
    cert: app.fleetData[vin].cert,
    key: app.fleetData[vin].key,
    nickname: app.fleetData[vin].data.VehicleName?.stringValue || '',
  }));

  const onSubmit = (data: VehicleFormData) => {
    if (params.vin !== data.vin) router.push(`${FLEET}/${data.vin}`);
  };

  return (
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
                  onClick={() => vehicleModal.newVehicle()}
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
              <Tooltip title="Edit configuration">
                <IconButton
                  className="secondaryAction"
                  onClick={() => vehicleModal.editVehicle(vehicle, onSubmit)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {(vehicle.cert === '' || vehicle.key === '') && (
                <Tooltip title="Invalid configuration">
                  <Error style={{ marginLeft: 8 }} color="error" />
                </Tooltip>
              )}
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
  );
}

function Fleet({ children }: FleetProps) {
  const router = useRouter();
  const redirectToConfigure = () => {
    router.push(CONFIGURE);
  };
  return (
    <AppBar
      right={[
        <Tooltip key="settings" title="Connection Settings">
          <IconButton
            key="settings"
            aria-label="settings"
            color="inherit"
            onClick={redirectToConfigure}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>,
      ]}
      drawerContent={(
        <VehicleModalProvider>
          <VehicleListDrawer />
        </VehicleModalProvider>
      )}
    >
      {children}
    </AppBar>
  );
}

export default Fleet;
