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
            control={<Radio />} 
            label={option.label}
            // sx={{
            //   '& .MuiTypography-root': {
            //     borderBottom: '2px solid black',
          
            //   }
            // }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RowRadioButtonsGroup;