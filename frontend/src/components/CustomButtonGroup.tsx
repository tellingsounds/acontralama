/**
 * Group Buttons and add possibility to disable all buttons in the group
 */
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  buttonGroup: { display: 'flex', flexDirection: 'row' },
});

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  disabledTitle?: string;
}

export const ButtonGroup: React.FC<Props> = ({
  children,
  disabled = false,
  disabledTitle,
}) => {
  const classes = useStyles();
  const childrenWithProps = React.Children.map(children, c =>
    React.isValidElement(c)
      ? React.cloneElement(c as React.ReactElement<any>, { disabled })
      : c,
  );
  return (
    <div
      className={classes.buttonGroup}
      title={disabled ? disabledTitle : undefined}
    >
      {childrenWithProps}
    </div>
  );
};
