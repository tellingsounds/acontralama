/**
 * Display the title or lable of a Clip (used in NavBar for example).
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, createStyles, makeStyles } from '@material-ui/core';

import { getCurrentClip, getCurrentClipTitle } from '../selectors/clips';
import { doJumpTo } from '../actionCreators/sagaActions';

import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    padded: {
      padding: theme.spacing(0.3),
    },
    clipTitle: {
      fontSize: '1.33rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }),
);

export const ClipTitle: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clipTitle = useSelector(getCurrentClipTitle);
  const inClip = useSelector(getCurrentClip) !== null;
  return (
    <div id="clipTitle" className={classes.padded}>
      <Typography
        className={classes.clipTitle}
        color="inherit"
        align="left"
        title="Go to top"
        onClick={() => {
          if (inClip) {
            dispatch(doJumpTo('Clip'));
          }
        }}
        style={{
          cursor: inClip ? 'pointer' : undefined,
        }}
      >
        {clipTitle}
      </Typography>
    </div>
  );
};
