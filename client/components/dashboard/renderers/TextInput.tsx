import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

export type TextInputData = TextFieldProps & {
  unit?: string;
  type?: string;
};

const TextInput = (props: RendererProps<TextInputData>) => {
  const { type, unit } = props.data;
  const { value, onChange } = props;
  if (value === null || typeof value === 'undefined') return null;

  return (
    <TextField
      title={props.title}
      value={value}
      onChange={onChange ? (e) => onChange(e?.target.value) : () => null}
      label={props.title}
      fullWidth
      InputProps={unit
        ? { endAdornment: <InputAdornment position="end">{unit}</InputAdornment>, ...props.data.InputProps }
        : props.data.InputProps}
      type={type === 'number' ? 'text' : type}
    />
  );
};

export default TextInput;
