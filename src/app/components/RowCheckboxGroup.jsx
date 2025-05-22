import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Box } from '@mui/material';

function RowCheckboxGroup({ label, name, options = [], values = [], onChange }) {
  const handleToggle = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter((val) => val !== optionValue)
      : [...values, optionValue];

    onChange(newValues);
  };

  return (
    <FormControl>
      {/* <FormLabel>{label}</FormLabel> */}
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={values.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                name={name}
              />
            }
            label={option.label}
            sx={{
              '& .MuiTypography-root': {
                backgroundColor: '#ff6467',
                color: 'white',
                padding: '2px 4px',
                borderRadius: '4px',
              }
            }}
          />
        ))}
      </Box>
    </FormControl>
  );
}

export default RowCheckboxGroup;
