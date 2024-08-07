/**
 * Alert that indicates, which Segment is active (includes deactivate button).
 */
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, createStyles, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { SegmentIcon } from './SegmentIcon';
import { getActiveSegment } from '../selectors/app';
import { getInspectorState } from '../selectors/sidePanel';
import { doDeactivateSegment } from '../actionCreators/app';
import { doJumpTo } from '../actionCreators/sagaActions';

import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    segmentAlert: {
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);

export const SegmentAlert: FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const segment = useSelector(getActiveSegment);
  const { isEditingSegment } = useSelector(getInspectorState);
  if (!segment) {
    return null;
  }
  return (
    <Alert
      id="LamaSegmentAlert"
      title="Go to active Interpretation"
      style={{ cursor: 'pointer' }}
      onClick={e => {
        e.preventDefault();
        dispatch(doJumpTo(segment._id, ['Interpretation', segment._id]));
      }}
      className={classes.segmentAlert}
      elevation={1}
      action={
        <Button
          title="Deactivate"
          onClick={e => {
            e.stopPropagation();
            if (!isEditingSegment) {
              dispatch(doDeactivateSegment());
            } else {
              alert('Please finish editing first!');
            }
          }}
        >
          Deactivate
        </Button>
      }
      icon={<SegmentIcon />}
      severity="info"
    >
      <span>
        Interpretation <strong>{segment.label}</strong> is active. Annotations
        you make will be assigned to this Interpretation.
      </span>
    </Alert>
  );
};
