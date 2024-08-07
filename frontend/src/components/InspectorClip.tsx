/**
 * Display a minimalist version of the clip (for Sidepanel).
 */
import React from 'react';
import {
  Button,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { TableView, getBasicTableViewItems } from './TableView';

import { getBasicClipById } from '../services/api';

import { getInspectorState } from '../selectors/sidePanel';
import { doFetchError } from '../actionCreators/app';

import { getMetaInfo, withPathPrefix, withoutPathPrefix } from '../util';

import { BasicField } from '../viewFieldInfo';
import { ClipBasicResp } from '../types/clips';
import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    // root: {},
    buttonsContainer: {
      marginBottom: theme.spacing(1),
    },
  }),
);

const clipFields: BasicField[] = [
  'title',
  'subtitle',
  'label',
  'url',
  'platform',
  'collections',
  'shelfmark',
  'fileType',
  'duration',
  'language',
  'clipType',
  'description',
  'annotationCount',
];

// interface Props {
// }

export const InspectorClip: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { clipId } = useSelector(getInspectorState);
  const [clipData, setClipData] = React.useState<ClipBasicResp | null>(null);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(
    function () {
      if (!clipId) {
        return;
      }
      let active = true;
      (async function () {
        try {
          if (!active) {
            return;
          }
          setLoading(true);
          const fetchedData = await getBasicClipById(clipId);
          setClipData(fetchedData);
        } catch (err) {
          dispatch(doFetchError(err));
        } finally {
          setLoading(false);
        }
      })();
      return function () {
        active = false;
      };
    },
    [dispatch, clipId],
  );
  if (!clipId) {
    return null;
  }
  return (
    <div>
      {clipData ? (
        <React.Fragment>
          <div className={classes.buttonsContainer}>
            <Button
              onClick={function () {
                history.push(withPathPrefix(`/clip/${clipId}`));
              }}
            >
              View
            </Button>
            {!(
              withoutPathPrefix(location.pathname).startsWith('/explore') &&
              withoutPathPrefix(location.pathname).endsWith(clipId)
            ) && (
              <Button
                onClick={function () {
                  history.push(withPathPrefix(`/explore/clip/${clipId}`));
                }}
              >
                Explore
              </Button>
            )}
          </div>
          <TableView
            use39
            items={getBasicTableViewItems(clipFields, clipData)}
            extraInfo={getMetaInfo(clipData)}
          />
        </React.Fragment>
      ) : (
        <Typography>{loading ? 'Loading...' : 'Nothing selected.'}</Typography>
      )}
    </div>
  );
};
