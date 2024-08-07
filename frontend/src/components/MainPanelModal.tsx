/**
 * Sets backdrop??
 * UNUSED
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Modal, createStyles, makeStyles } from '@material-ui/core';

import { getIsModalOpen } from '../selectors/app';
import { doToggleModal } from '../actionCreators/app';

const useStyles = makeStyles(theme =>
  createStyles({
    modalMP: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

interface Props {
  children: React.ReactElement;
}

export const MainPanelModal: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isOpen = useSelector(getIsModalOpen);
  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
      }}
      open={isOpen}
      onClose={() => {
        dispatch(doToggleModal(false));
      }}
    >
      <div className={classes.modalMP}>{children}</div>
    </Modal>
  );
};
