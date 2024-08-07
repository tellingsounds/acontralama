/**
 * Displays the results of a combined query of QueryBlocks.
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  IconButton,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import { AnnotationList } from './AnnotationList';
import { Link } from './Link';

import MovieIcon from '@material-ui/icons/Movie';

import { doShowClipDetails } from '../actionCreators/sidePanel';

import { getQueryResults } from '../selectors/query';

import { EmptyObject } from '../types';

import { withPathPrefix } from '../util';

const containerHeight = 21;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
    listContainer: {
      display: 'flex',
    },
    listItem: {
      width: '100%',
      height: '100%',
      maxWidth: theme.spacing(80),
      margin: theme.spacing(0.5),
    },
    listItemSpacer: {
      backgroundColor: '#ddd',
      height: theme.spacing(containerHeight),
      width: '1px',
    },
    resultItemHeader: {
      display: 'flex',
      alignItems: 'center',
      '& > :last-child': {
        marginLeft: 'auto',
      },
    },
    annotButton: {
      padding: theme.spacing(0.5),
    },
    previews: {
      color: '#aaa',
    },
    byClip: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
    loadMoreButton: {
      marginTop: theme.spacing(1),
    },
  }),
);

const COUNT = 16;

export const QueryIntersectionResultView: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const queryResultData = useSelector(getQueryResults);
  const [showCount, setShowCount] = React.useState(COUNT);
  if (queryResultData.intersectionByClip === null) {
    return <div>ERROR: no result (should not see this)</div>;
  }
  const result = queryResultData.intersectionByClip;
  const resultCount = Object.keys(result).length;
  const getClipLabel = (clipId: string) =>
    queryResultData.clipData[clipId].labelTitle;
  const getA = (annotationId: string) =>
    queryResultData.annotationData[annotationId];
  const getE = (elementId: string) => queryResultData.elementData[elementId];
  return (
    <Paper className={classes.root}>
      <Typography>
        {resultCount > 0
          ? `1-${Math.min(showCount, resultCount)} of ${resultCount} `
          : 'No '}
        combined results.
      </Typography>
      {Object.entries(result)
        .slice(0, showCount)
        .map(([clipId, blockResults]) => (
          <Paper key={clipId} className={classes.byClip}>
            <div className={classes.resultItemHeader}>
              <Link to={withPathPrefix(`/clip/${clipId}`)}>
                <Typography>{getClipLabel(clipId)}</Typography>
              </Link>
              <IconButton
                className={classes.annotButton}
                title="Show clip preview"
                onClick={() => {
                  dispatch(doShowClipDetails(clipId));
                }}
              >
                <MovieIcon className={classes.previews} />
              </IconButton>
            </div>
            <div className={classes.listContainer}>
              {Object.entries(blockResults).map(
                ([blockId, annotationIds], i) => (
                  <React.Fragment key={blockId}>
                    <div className={classes.listItem}>
                      <AnnotationList
                        annotationIds={annotationIds}
                        getAnnotationData={getA}
                        getElementData={getE}
                        height={containerHeight}
                        searchBox={false}
                      />
                    </div>
                    {i < Object.keys(blockResults).length - 1 && (
                      <div className={classes.listItemSpacer}></div>
                    )}
                  </React.Fragment>
                ),
              )}
            </div>
          </Paper>
        ))}
      {resultCount > showCount && (
        <Button
          className={classes.loadMoreButton}
          onClick={() => {
            setShowCount(prev => prev + COUNT);
          }}
        >
          Show more
        </Button>
      )}
    </Paper>
  );
};
