'use client';

import { Box, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import VehicleForm, { VehicleFormData } from './Form';

type VehicleModalProps = {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleFormData | null;
  onSubmit: (data: VehicleFormData) => void;
};

const emptyForm: VehicleFormData = {
  vin: '',
  cert: '',
  key: '',
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function VehicleModal(props: VehicleModalProps) {
  const {
    vehicle, open, onClose, onSubmit,
  } = props;
  const [data, setData] = useState<VehicleFormData>(vehicle ?? emptyForm);
  const isUpdate = !!vehicle;

  useEffect(() => {
    if (!open) setData(emptyForm);
    else setData(vehicle ?? emptyForm);
  }, [open, vehicle]);

  const onChange = (field: string, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ pb: 2 }}>
          {isUpdate ? `Update ${data.vin}` : 'Create a vehicle'}
        </Typography>
        <VehicleForm
          data={data}
          onChange={onChange}
          onClose={onClose}
          onDelete={isUpdate ? onClose : undefined}
          btnText={isUpdate ? 'Update' : 'Create'}
          onSubmit={onSubmit}
        />
      </Box>
    </Modal>
  );
}

export default VehicleModal;
