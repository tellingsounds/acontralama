/**
 * Custom checkbox with styled label.
 */
import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  CheckboxProps,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  fclCheckbox: {
    '& .MuiFormControlLabel-label': {
      textTransform: 'uppercase',
    },
  },
});

interface Props extends CheckboxProps {
  label: string;
  onMouseDown?: (event: React.MouseEvent) => void;
}

export const FCLCheckbox: React.FC<Props> = ({
  label,
  onMouseDown,
  ...props
}) => {
  const classes = useStyles();
  return (
    <FormControlLabel
      className={classes.fclCheckbox}
      onMouseDown={onMouseDown}
      control={<Checkbox {...props} />}
      label={label}
    />
  );
};
