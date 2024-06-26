import {
  InputLabel, MenuItem, Select, SelectChangeEvent,
} from '@mui/material';

type DropdownData = {
  field: string,
  title: string;
  menuItems: FieldOption[]
};

const Dropdown = (props: RendererProps<DropdownData>) => {
  const { RenderSubItems } = props;
  const selectedItem = props.data.menuItems.find((item) => item.value === props.value);
  const handleChange = (e: SelectChangeEvent<unknown>) => {
    props.onChange?.(e.target.value);
  };
  return (
    <>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        {props.data.title}
      </InputLabel>
      <Select
        value={props.value}
        onChange={handleChange}
        fullWidth
        inputProps={{
          'data-testid': 'select',
        }}
      >
        {props.data.menuItems.map(({ value, name }) => (
          <MenuItem value={value} key={value}>
            {name}
          </MenuItem>
        ))}
      </Select>
      {selectedItem?.items && RenderSubItems
        ? <RenderSubItems secondary vin={props.vin} items={selectedItem.items} />
        : null}
    </>
  );
};

export default Dropdown;
