/**
 * Lock forms, when input is not valid for submitting.
 */
import React, { FC } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      position: 'absolute',
      left: 'inherit',
      top: 'inherit',
      width: '100%',
      height: '100%',
      zIndex: theme.zIndex.drawer + 1,
      '-webkit-user-select': 'none',
      'user-select': 'none',
      textAlign: 'center',
      fontSize: '2rem',
      color: '#000',
      backgroundColor: 'rgb(200, 200, 200, 0.3)',
    },
  }),
);

export interface LockdownProps {
  locked?: boolean;
  lockedMessage?: string;
}

// this should maybe be a wrapper function instead

export const Lockdown: FC<LockdownProps> = ({
  locked = false,
  lockedMessage = 'Locked!',
}) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={locked}>
      <div>{lockedMessage}</div>
    </Backdrop>
  );
};
