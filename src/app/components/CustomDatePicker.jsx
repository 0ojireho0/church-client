import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from "../utils/dayjs-with-timezone"


function CustomDatePicker({field, fieldState, resetDatePicker}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date of Birth"
        value={field.value ? dayjs(field.value).tz('UTC') : null}
        onChange={(newValue) => {
          const utcDate = newValue ? newValue.utc().format() : null;
          field.onChange(utcDate); // or newValue.utc() if you want dayjs object
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!fieldState.error,
          },
        }}
      />
    </LocalizationProvider>
  )
}

export default CustomDatePicker
