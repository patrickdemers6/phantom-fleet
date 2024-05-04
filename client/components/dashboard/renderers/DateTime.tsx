import { TextFieldProps, Tooltip } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export type DateTimeData = TextFieldProps & {
  unit?: string;
  type?: string;
};

const DateTime = (props: RendererProps<DateTimeData>) => {
  const { value, onChange } = props;
  if (value === null || typeof value === 'undefined') return null;

  const handleChange = (date: dayjs.Dayjs | null) => {
    if (!onChange) return;
    if (date) onChange(date.format('MMM DD, YYYY hh:mm A'));
    else onChange(dayjs().format('MMM DD, YYYY hh:mm A'));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Tooltip title={value as string}>
        <span>
          <DateTimePicker
            onChange={handleChange}
            value={dayjs(value as string, 'MMM DD, YYYY hh:mm A')}
          />
        </span>
      </Tooltip>
    </LocalizationProvider>
  );
};

export default DateTime;
