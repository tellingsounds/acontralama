/**
 * Displays notifications or error messages.
 */
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import WarningIcon from '@material-ui/icons/Warning';
import { useDispatch, useSelector } from 'react-redux';

import { getAnnouncementMessage, getErrorState } from '../selectors/app';
import { doClearError } from '../actionCreators/app';
import { EmptyObject } from '../types';

export const Notifications: FC<EmptyObject> = () => {
  const dispatch = useDispatch();
  const error = useSelector(getErrorState);
  const [open, setOpen] = useState(false);
  useEffect(
    function () {
      if (error !== undefined) {
        setOpen(true);
      }
    },
    [error],
  );
  const errorMessage: string =
    error?.response?.data.message || error?.message || '';
  const handleClose = (_event: SyntheticEvent<Element>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    dispatch(doClearError());
  };
  const announcementMessage = useSelector(getAnnouncementMessage);
  return (
    <>
      <Snackbar open={open} onClose={handleClose}>
        <Alert
          onClose={event => {
            handleClose(event, '');
          }}
          severity="error"
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {announcementMessage && (
        <Snackbar open>
          <Alert severity="warning" icon={<WarningIcon fontSize="large" />}>
            <Typography variant="h5">{announcementMessage}</Typography>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
