'use client';

import { Box, Button, TextField } from '@mui/material';

export type VehicleFormData = {
  vin: string;
  cert: string;
  key: string;
};

type VehicleFormProps = {
  onChange: (field: string, value: string) => void;
  onSubmit: (data: VehicleFormData) => void;
  onDelete?: () => void;
  onClose: () => void;
  data: VehicleFormData;
  btnText: string;
};

const fields: {
  name: keyof VehicleFormData;
  label: string;
  multiline: boolean;
}[] = [
  { name: 'vin', label: 'VIN', multiline: false },
  { name: 'cert', label: 'Certificate', multiline: true },
  { name: 'key', label: 'Private Key', multiline: true },
];

function VehicleForm({
  onDelete,
  onChange,
  onClose,
  onSubmit,
  btnText,
  data,
}: VehicleFormProps) {
  const handleSubmit = () => {
    onSubmit(data);
    onClose();
  };
  const handleDelete = () => {
    onDelete?.();
    onClose();
  };
  return (
    <Box>
      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          value={data[field.name]}
          fullWidth
          onChange={(e) => onChange(field.name, e.target.value)}
          multiline
          maxRows={4}
          sx={{ pb: 2 }}
        />
      ))}
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          {onDelete && (
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Box>
        <Button onClick={onClose} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {btnText}
        </Button>
      </Box>
    </Box>
  );
}

export default VehicleForm;
