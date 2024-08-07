import React, { FC } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  makeStyles,
} from '@material-ui/core';
import { withFormikErrors } from './withFormikErrors';

interface Props extends SelectProps {
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label: string;
  options: { label: string; value: string }[];
}

const useStyles = makeStyles(_theme => ({
  error: {
    color: 'red',
  },
  formControl: {
    minWidth: 120,
  },
}));

const CustomSelect: FC<Props> = ({ helperText, label, required, ...props }) => {
  const classes = useStyles();
  return (
    <FormControl
      className={classes.formControl}
      fullWidth
      required={required}
      variant="filled"
    >
      <InputLabel
        id="select-label"
        className={props.error ? classes.error : ''}
      >
        {label}
      </InputLabel>
      <Select labelId="select-label" {...props}>
        {!required && (
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
        )}
        {props.options.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText className={props.error ? classes.error : ''}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

const WrappedSelect = withFormikErrors(CustomSelect);

export { WrappedSelect as Select, CustomSelect as PureSelect };
