import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from '../utils/dayjs-with-timezone';

function CustomDatePicker({ field, fieldState }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        // label="Date of Birth"
        value={field.value ? dayjs.utc(field.value) : null} // force UTC on input
        onChange={(newValue) => {
          if (!newValue) {
            field.onChange(null);
            return;
          }

          // Convert to UTC and format as ISO string
          const utcDate = newValue.utc().format(); // ISO 8601 string in UTC
          field.onChange(utcDate);
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!fieldState.error,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
