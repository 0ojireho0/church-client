import React from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';

function RowRadioButtonsGroup({ label, name, options = [], value, onChange }) {
  return (
    <FormControl>
      {/* <FormLabel>{label}</FormLabel> */}
      <RadioGroup
        row
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <FormControlLabel 
            key={option.value} 
            value={option.value} 
            control={<Radio required />} 
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RowRadioButtonsGroup;