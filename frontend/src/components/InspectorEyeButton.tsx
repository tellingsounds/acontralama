/**
 * Button for showing an Entity in the Sidepanel.
 * UNUSED
 */
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { doShowConnection } from '../actionCreators/sidePanel';

import { Annotation } from '../types/clips';

interface Props {
  annotation: Annotation;
}

export const InspectorEyeButton: FC<Props> = ({ annotation }) => {
  const dispatch = useDispatch();
  return (
    <IconButton
      onClick={() => dispatch(doShowConnection(annotation))}
      style={{ padding: 0 }}
    >
      <VisibilityIcon fontSize="small" />
    </IconButton>
  );
};
