import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MUISlider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { InputAdornment } from '@mui/material';
import isNumber from '@/helpers/isNumber';

export type SliderData = {
  min: number;
  max: number;
  step?: number;
  unit?: string;
};

const Slider = (props: RendererProps<SliderData>) => {
  const {
    min, max, step, unit,
  } = props.data;
  const value = props.value as number;

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (!props.onChange) return;
    props.onChange(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return;
    props.onChange(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (!props.onChange) return;
    if (value < min) {
      props.onChange(min);
    } else if (value > max) {
      props.onChange(max);
    }
  };

  return (
    <Box>
      <Typography id="input-slider" gutterBottom>
        {props.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'block' } }}>
          <MUISlider
            max={max}
            min={min}
            step={step}
            value={typeof value === 'string' && isNumber(value) ? parseFloat(value) : value}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            data-testid="Slider-slider"
          />
        </Box>
        <Box sx={{ maxWidth: 150 }}>
          <MuiInput
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step ?? 1,
              min,
              max,
              type: 'number',
              'aria-labelledby': 'input-slider',
              'data-testid': 'Slider-textfield',
            }}
            endAdornment={unit ? <InputAdornment position="end">{unit}</InputAdornment> : null}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Slider;
