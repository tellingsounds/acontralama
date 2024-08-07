/**
 * Main query page.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  IconButton,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { QueryBlock } from './QueryBlock';
import { QueryIntersectionResultView } from './QueryIntersectionResultView';

import {
  getQueryBlocks,
  getQueryResults,
  getQueryIntersectionLoadingState,
  getReadyToClear,
  getReadyToQuery,
} from '../selectors/query';

import { doToggleSidePanel } from '../actionCreators/app';
import { doClearQuery, doNewQueryBlock } from '../actionCreators/query';
import { doGetQueryResults } from '../actionCreators/sagaActions';

import { EmptyObject } from '../types';
import { getClipById } from '../services/api';

import { secondsToString } from '../util';

const useStyles = makeStyles(_theme =>
  createStyles({
    topButtons: { display: 'flex', alignItems: 'center' },
    rightButtons: { marginLeft: 'auto' },
  }),
);

export const QueryLand: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const queryBlocks = useSelector(getQueryBlocks);
  const queryResultData = useSelector(getQueryResults);
  const isLoading = useSelector(getQueryIntersectionLoadingState);
  const couldQuery = useSelector(getReadyToQuery)();
  const couldClear = useSelector(getReadyToClear);
  const resultPossible = queryResultData.intersectionByClip !== null;
  const couldClearResult = Object.values(queryResultData.blockAnnotations).some(
    a => a.length > 0,
  );
  const addQueryBlock = () => {
    if (queryBlocks.length < 3) {
      dispatch(doNewQueryBlock());
    }
  };
  React.useEffect(() => {
    dispatch(doToggleSidePanel(true));
    return () => {
      dispatch(doToggleSidePanel(false));
    };
  }, [dispatch]);
  return (
    <div>
      <div className={classes.topButtons}>
        <span>
          {queryBlocks.length < 3 && (
            <IconButton onClick={addQueryBlock} title="Add query block">
              <AddIcon />
            </IconButton>
          )}
          <Button
            title="Order of columns corresponds to query blocks."
            disabled={!couldQuery}
            onClick={() => {
              dispatch(doGetQueryResults(queryBlocks));
            }}
          >
            Combined query by Clip
          </Button>
        </span>
        <span className={classes.rightButtons}>
          {queryResultData.intersectionByClip && couldClearResult && (
            <Button
              title="Download!"
              onClick={() => {
                const clipIds = queryResultData.intersectionByClip
                  ? Object.keys(queryResultData.intersectionByClip)
                  : [];
                Promise.all(
                  clipIds.map(clipId =>
                    getClipById(clipId).then(data => {
                      let annotInfo = '';
                      Object.keys(
                        queryResultData.intersectionByClip![clipId],
                      ).map(qbId => {
                        // eslint-disable-next-line no-console
                        console.log(data.clip);

                        const a =
                          queryResultData.annotationData[
                            queryResultData.intersectionByClip![clipId][qbId][0]
                          ];

                        annotInfo = annotInfo.concat(
                          `${a.target} (${a.relation}), `,
                        );
                      });
                      return (
                        [
                          clipId,
                          'https://acontralama.opus81a.net/clip/' +
                            clipId +
                            '/',
                          data.clip.url,
                          data.clip.title,
                          data.clip.platform,
                          data.clip.shelfmark,
                          secondsToString(data.clip.duration),
                          data.clip.updated,
                          data.clip.collections,
                        ].join(';') +
                        ';' +
                        annotInfo
                      );
                    }),
                  ),
                )
                  .then(data => data.join('\n'))
                  .then(data => {
                    const exported = new Blob(
                      [
                        'ClipId;LAMA_Url;Platform URL;Title;Platform;Shelfmark;Duration;Updated;Collections;Matched Annots (Relation);\n',
                        data,
                      ],
                      { type: 'text/csv' },
                    );
                    saveAs(exported, `results.csv`);
                  });

                // RBroadcastDate
                // RBroadcastSeries
                // RClipType
                // RContributor
                // RDateOfCreation
                // RKeyword
                // RQuote
                // RStation
                // RStatus
                // RTape
              }}
            >
              Download results
            </Button>
          )}
          {couldClearResult && (
            <Button
              title="Clear all results"
              onClick={() => {
                dispatch(doClearQuery());
              }}
            >
              Clear all results
            </Button>
          )}
          {couldClear && (
            <Button
              title="Clear everything"
              onClick={() => {
                dispatch(doClearQuery(true));
              }}
            >
              Clear everything
            </Button>
          )}
        </span>
      </div>
      {queryBlocks.map((qb, i) => (
        <QueryBlock key={i} data={qb} />
      ))}
      {isLoading ? (
        <Paper style={{ margin: '8px', padding: '8px' }}>
          <Typography>Loading...</Typography>
        </Paper>
      ) : resultPossible ? (
        <QueryIntersectionResultView />
      ) : null}
    </div>
  );
};
