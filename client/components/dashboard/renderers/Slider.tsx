import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MUISlider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { InputAdornment } from '@mui/material';

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
  const value = props.values[0] as number;

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    props.handleChangeFns[0](newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleChangeFns[0](event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      props.handleChangeFns[0](min);
    } else if (value > max) {
      props.handleChangeFns[0](max);
    }
  };

  return (
    <Box>
      <Typography id="input-slider" gutterBottom>
        {props.title}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <MUISlider
            max={max}
            min={min}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            data-testid="Slider-slider"
          />
        </Grid>
        <Grid item>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Slider;
