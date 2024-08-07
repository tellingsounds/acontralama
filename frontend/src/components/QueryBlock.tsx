/**
 * Main block for entering a query.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Grid,
  IconButton,
  Paper,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ExploreIcon from '@material-ui/icons/Explore';

import { config } from './EntityQueryBuilder';

import { saveAs } from 'file-saver';

import { EntityQueryBuilderRepr } from './EntityQueryBuilderRepr';
import { FCLCheckbox } from './FCLCheckbox';
import { RelationSelect } from './RelationSelect';
import { QueryBlockResultGrid } from './QueryBlockResultGrid';
import { QueryPlusButton } from './QueryPlusButton';

import {
  getQueryResults,
  getQbData,
  getQbState,
  getQueryBlockLoadingState,
  getReadyToQuery,
} from '../selectors/query';
import {
  doOpenQb,
  doRemoveQb,
  doRemoveQueryBlock,
  doToggleConj,
  doUpdateQueryBlockFilter,
  doUpdateQueryBlockRelations,
} from '../actionCreators/query';
import { doGetQueryResults } from '../actionCreators/sagaActions';

import { QueryBlockData } from '../types/query';
import { Accordion } from './Accordion';

const qbFields = config.fields;

const useStyles = makeStyles(theme =>
  createStyles({
    entityContainer: {
      border: 'solid 1px rgba(199,199,199,0.7)',
      borderRadius: '4px',
      display: 'flex',
      flexWrap: 'wrap',
      margin: `${theme.spacing(1)}px 0`,
      minHeight: '40px',
      padding: 0,
      '& :last-child': {
        marginLeft: 'auto',
      },
    },
    edgeButton: {
      backgroundColor: 'rgba(199,199,199,0.5)',
      minWidth: 0,
      padding: `0 ${theme.spacing(1)}px`,
      '& .MuiSvgIcon-root': {
        fontSize: 22,
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      '& > span:last-child': {
        marginLeft: 'auto',
      },
      '& .MuiIconButton-root': {
        padding: `${theme.spacing(1)}px`,
      },
    },
    root: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
    blockResults: {
      // height: theme.spacing(24),
      height: theme.spacing(88),
      // minHeight: theme.spacing(8),
      // maxHeight: theme.spacing(24),
      overflow: 'auto',
      // overflowY: 'hidden',
      padding: 0,
    },
    checkboxContainer: {
      border: 'solid 1px rgba(199,199,199,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing(0.5),
      padding: theme.spacing(0.72),
      paddingLeft: theme.spacing(2),
    },
  }),
);

interface Props {
  data: QueryBlockData;
}

export const QueryBlock: React.FC<Props> = ({ data }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const getQb = useSelector(getQbData);
  const { openQbId } = useSelector(getQbState);
  const queryResultData = useSelector(getQueryResults);
  const blockResults = queryResultData.blockAnnotations[data.id];
  const hasResults = blockResults !== undefined;
  const isLoading = Boolean(useSelector(getQueryBlockLoadingState)(data.id));
  const getA = (annotationId: string) =>
    queryResultData.annotationData[annotationId];
  const { absentOnly, interpretativeOnly, relations } = data.annotations;
  const setRelations = (newRelations: string[]) => {
    dispatch(doUpdateQueryBlockRelations(data.id, newRelations));
  };
  const handleDelete = () => {
    dispatch(doRemoveQueryBlock(data.id));
  };
  const [resultsExpanded, setResultsExpanded] = React.useState(false);
  const couldQuery = useSelector(getReadyToQuery)(data.id);
  return (
    <Paper className={classes.root} elevation={2}>
      <Grid container direction="column">
        <Grid item>
          <div className={classes.header}>
            <span>
              {hasResults && (
                <IconButton
                  onClick={() => {
                    const annots =
                      queryResultData.blockAnnotations[data.id].map(getA);
                    const exported = new Blob(
                      [
                        annots
                          .map(a =>
                            [
                              a._id,
                              a.clip,
                              a.element || '',
                              a.relation,
                              a.target,
                            ].join(';'),
                          )
                          .join('\n'),
                      ],
                      { type: 'text/csv' },
                    );
                    saveAs(exported, `${data.id}.csv`);
                  }}
                >
                  <SaveAltIcon />
                </IconButton>
              )}
              <IconButton
                title="Show results"
                disabled={!couldQuery}
                onClick={() => {
                  setResultsExpanded(true);
                  dispatch(doGetQueryResults(data));
                }}
              >
                <ExploreIcon />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </span>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.entityContainer}>
            <Button
              className={classes.edgeButton}
              onClick={() => {
                dispatch(doToggleConj(data.id));
              }}
            >
              {data.entities.conj.toUpperCase()}
            </Button>
            {data.entities.qbIds.map(getQb).map((qbData, i) => (
              <EntityQueryBuilderRepr
                key={i}
                active={openQbId === qbData?.id}
                handleClick={() => {
                  dispatch(doOpenQb(data.id, qbData?.id));
                }}
                handleRemove={
                  qbData
                    ? () => {
                        dispatch(doRemoveQb(data.id, qbData.id));
                      }
                    : undefined
                }
                qbData={qbData}
              />
            ))}
            <QueryPlusButton
              className={classes.edgeButton}
              fields={qbFields}
              handleSelect={path => {
                dispatch(doOpenQb(data.id, null, path));
              }}
            />
          </div>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item md={6}>
              <RelationSelect onChange={setRelations} value={relations} />
            </Grid>
            <Grid item md={3}>
              <Paper elevation={0} className={classes.checkboxContainer}>
                <FCLCheckbox
                  label="Interpretative"
                  checked={interpretativeOnly}
                  onChange={event => {
                    dispatch(
                      doUpdateQueryBlockFilter(data.id, {
                        interpretativeOnly: event.target.checked,
                      }),
                    );
                  }}
                />
              </Paper>
            </Grid>
            <Grid item md={3}>
              <Paper elevation={0} className={classes.checkboxContainer}>
                <FCLCheckbox
                  label="Notably absent"
                  checked={absentOnly}
                  onChange={event => {
                    dispatch(
                      doUpdateQueryBlockFilter(data.id, {
                        absentOnly: event.target.checked,
                      }),
                    );
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {(hasResults || isLoading) && (
          <Grid item>
            <Accordion
              heading={`Results (${blockResults?.length || 0})`}
              className={classes.blockResults}
              expanded={resultsExpanded}
              onChange={(_event, newExpanded) => {
                setResultsExpanded(newExpanded);
              }}
              unmountContentsIfClosed
            >
              <QueryBlockResultGrid
                blockId={data.id}
                loading={isLoading}
                resultData={queryResultData}
              />
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
