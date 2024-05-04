import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButtonGroup from '@mui/material/ButtonGroup';
import MuiButton from '@mui/material/Button';

export type ButtonGroupData = {
  items: {
    title: string;
    value: string;
  }[];
};

const ButtonGroup = (props: RendererProps<ButtonGroupData>) => {
  const { items } = props.data;
  const value = props.value as string;

  const handleChange = (updatedValue: string) => {
    if (!props.onChange) return;
    props.onChange(updatedValue);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography id="input-slider" gutterBottom>
        {props.title}
      </Typography>
      <MuiButtonGroup style={{ float: 'right' }}>
        {items.map((item) => (
          <MuiButton
            onClick={() => handleChange(item.value)}
            variant={item.value === value ? 'contained' : 'outlined'}
            key={item.value}
            value={item.value}
          >
            {item.title}
          </MuiButton>
        ))}
      </MuiButtonGroup>
    </Box>
  );
};

export default ButtonGroup;
