/**
 * Display results of quote search.
 */
import React from 'react';
import {
  Button,
  IconButton,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import { useDispatch } from 'react-redux';

import { Chip } from './Chip';
import { Link } from './Link';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MovieIcon from '@material-ui/icons/Movie';

import {
  doShowClipDetails,
  doShowConnection,
} from '../actionCreators/sidePanel';

import { withPathPrefix } from '../util';

import { SearchResult } from '../services/api';

const useStyles = makeStyles(theme =>
  createStyles({
    quoteContainer: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      maxWidth: theme.spacing(100),
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
    clipTitle: {
      margin: theme.spacing(0.5),
    },
    quoteText: {
      fontSize: theme.typography.fontSize * 1.2,
    },
    speakerElementContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      marginLeft: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
  }),
);

const COUNT = 50;

interface Props {
  resultData: SearchResult | null;
}

interface ResultCountInfoProps {
  showCount: number;
  resultCount: number;
}

const ResultCountInfo: React.FC<ResultCountInfoProps> = ({
  showCount,
  resultCount,
}) => {
  const classes = useStyles();
  const s = resultCount > 0 ? `${Math.min(showCount, resultCount)} of ` : '';
  return (
    <Typography className={classes.quoteContainer}>
      {s}
      {resultCount} result
      {resultCount !== 1 ? 's' : ''}.
    </Typography>
  );
};

export const QuoteSearchResultsView: React.FC<Props> = ({ resultData }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showCount, setShowCount] = React.useState(COUNT);
  React.useEffect(
    function () {
      setShowCount(COUNT);
    },
    [resultData],
  );
  if (!resultData) {
    return null;
  }
  const resultCount = resultData.annotationIds.length;
  return (
    <div>
      <ResultCountInfo showCount={showCount} resultCount={resultCount} />
      {resultData.annotationIds
        .slice(0, showCount)
        .map(annotId => resultData.annotationData[annotId])
        .map(annot => (
          <Paper key={annot._id} className={classes.quoteContainer}>
            <div className={classes.resultItemHeader}>
              <Link to={withPathPrefix(`/clip/${annot.clip}`)}>
                <Typography className={classes.clipTitle}>
                  {resultData.clipData[annot.clip].labelTitle}
                </Typography>
              </Link>
              <span>
                <IconButton
                  className={classes.annotButton}
                  title="Show clip preview"
                  onClick={() => {
                    dispatch(doShowClipDetails(annot.clip));
                  }}
                >
                  <MovieIcon className={classes.previews} />
                </IconButton>
                <IconButton
                  className={classes.annotButton}
                  title="Show annotation"
                  onClick={() => {
                    dispatch(doShowConnection(annot));
                  }}
                >
                  <VisibilityIcon className={classes.previews} />
                </IconButton>
              </span>
            </div>
            <Typography className={classes.quoteText}>
              {annot.quotes}
            </Typography>
            <div className={classes.speakerElementContainer}>
              {annot.target && <Chip entityId={annot.target} />}
              {annot.target && annot.element && <>&nbsp;</>}
              {annot.element && (
                <Typography
                  color="textSecondary"
                  style={{ fontSize: 'smaller' }}
                >
                  in{' '}
                  {resultData.elementData[annot.element].type.replace(
                    'Noise',
                    'Other Sound',
                  )}{' '}
                  <strong>{resultData.elementData[annot.element].label}</strong>
                </Typography>
              )}
            </div>
          </Paper>
        ))}
      {resultCount > 0 && (
        <ResultCountInfo showCount={showCount} resultCount={resultCount} />
      )}
      {resultCount > showCount && (
        <Button
          className={classes.button}
          onClick={function () {
            setShowCount(prev => prev + COUNT);
          }}
        >
          Show more
        </Button>
      )}
    </div>
  );
};
