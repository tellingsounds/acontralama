/**
 * Overlay to display backdrop while loading.
 */
import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { EmptyObject } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      position: 'sticky',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      zIndex: theme.zIndex.drawer + 2,
      '-webkit-user-select': 'none',
      'user-select': 'none',
      fontSize: '2rem',
      color: '#000',
      backgroundColor: 'rgb(200, 200, 200, 0.5)',
      fallbacks: [{ position: '-webkit-sticky' }],
    },
  }),
);

export const LoadingOverlay: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open>
      <div>Loading...</div>
    </Backdrop>
  );
};
