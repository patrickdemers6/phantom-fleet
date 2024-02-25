import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

export type TextInputData = TextFieldProps & {
  unit?: string;
  type?: string;
};

const TextInput = (props: RendererProps<TextInputData>) => {
  const { type, unit } = props.data;
  const value = props.values[0];
  if (value === null || typeof value === 'undefined') return null;

  return (
    <TextField
      onChange={(e) => props.handleChangeFns[0](e?.target.value)}
      value={value}
      label={props.title}
      fullWidth
      InputProps={unit
        ? { endAdornment: <InputAdornment position="end">{unit}</InputAdornment>, ...props.data.InputProps }
        : props.data.InputProps}
      {...props}
      type={type === 'number' ? 'text' : type}
    />
  );
};

export default TextInput;
