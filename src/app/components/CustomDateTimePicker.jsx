import * as React from 'react';
import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Box, Button, Typography } from '@mui/material';

import { useBook } from '../hooks/book';



export default function CustomDateTimePicker({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  setFullyBooked,
  church_id
}) {

  const { book } = useBook({
    church_id: church_id
  })

  // console.log(church_id)


  const fullyBookedDates = book?.fullyBook;
  const bookedTimeSlots = book?.bookedSlots
 


  const timeSlots = [
    { label: '8:00 AM - 9:00 AM', value: '08:00:00' },
    { label: '9:00 AM - 10:00 AM', value: '09:00:00' },
    { label: '10:00 AM - 11:00 AM', value: '10:00:00' },
    { label: "11:00 AM - 12:00 PM", value: "11:00:00"}
    // { label: '1:00 PM - 2:00 PM', value: '13:00:00' },
  ];


  const isDateDisabled = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    return formattedDate === today || fullyBookedDates?.includes(formattedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);

    if (onlyOneSlotAvailable) {
      setFullyBooked(dayjs(selectedDate).format('YYYY-MM-DD'))
      return
    }

    setFullyBooked(null)

    // console.log('Time selected:', time);
  };

  const isTimeDisabled = (timeValue) => {
    const dateStr = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
    const booked = bookedTimeSlots[dateStr] || [];
    return booked.includes(timeValue);
  };

  const availableTimeSlots = selectedDate
    ? timeSlots.filter((slot) => !isTimeDisabled(slot.value))
    : [];

  const allSlotsBooked = selectedDate && availableTimeSlots.length === 0;
  const onlyOneSlotAvailable = selectedDate && availableTimeSlots.length === 1;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
        <DatePicker
          label="Select a date"
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={isDateDisabled}
          disablePast
          timezone="Asia/Manila"
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999
              }
            }
          }}
        />

        <div className='flex justify-center items-center flex-col'>
          {selectedDate && (
            <>
            <Typography variant="subtitle1">Select a time slot:</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                width: 400
              }}
            >
              {timeSlots.map((slot) => (
                <Button
                  key={slot.value}
                  variant={selectedTime === slot.value ? 'contained' : 'outlined'}
                  disabled={isTimeDisabled(slot.value)}
                  onClick={() => handleTimeSelect(slot.value)}
                  sx={{
                    textTransform: 'none',
                    opacity: isTimeDisabled(slot.value) ? 0.5 : 1,
                  }}
                >
                  {slot.label}
                </Button>
              ))}
            </Box>

            {allSlotsBooked && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                All time slots are fully booked for this day.
              </Typography>
            )}
            </>
          )}
        </div>

        {selectedDate && selectedTime && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Selected: {dayjs(selectedDate).format('MMMM DD, YYYY')} at {selectedTime}
          </Typography>
        )}

      </Box>
    </LocalizationProvider>
  );
}
