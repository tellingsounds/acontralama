/**
 * Display List of Clips with same shelfmark in Sidepanel.
 */
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { getCurrentClip } from '../selectors/clips';
import { doFetchError } from '../actionCreators/app';
import { ClipBasic } from '../types/clips';
import { Link } from './Link';
import { withPathPrefix } from '../util';

import { EmptyObject } from '../types';
import { getClipsWithSameShelfmark } from '../services/api';

export const InspectorShelfmarksList: FC<EmptyObject> = () => {
  const dispatch = useDispatch();
  const currentClip = useSelector(getCurrentClip);
  const clipId = currentClip?._id;
  const [clipsData, setClipsData] = React.useState<ClipBasic[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(
    function () {
      if (!clipId) {
        return;
      }
      (async function () {
        try {
          setLoading(true);
          const clips = await getClipsWithSameShelfmark(clipId);
          setClipsData(clips);
        } catch (err) {
          dispatch(doFetchError(err));
        } finally {
          setLoading(false);
        }
      })();
    },
    [dispatch, clipId, currentClip?.shelfmark],
  );
  if (!clipId) {
    return null;
  }
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        {clipId ? (
          <div>
            Clips with the same shelfmark:
            <ul>
              {/* TODO: don't show the current clip in the list */}
              {clipsData?.map(c => (
                <li key={c._id}>
                  {
                    <Link to={withPathPrefix(`/clip/${c._id}`)}>
                      <Typography>{c.title}</Typography>
                    </Link>
                  }
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Typography>{loading ? 'Loading...' : 'No shelfmark'}</Typography>
        )}

        {/* {clipId ? (
          // console.log(clipsData)

          clipsData?.map(c =>  <Typography key={c._id}>{c.title}</Typography>)
          
           // element for displaying simple clip list goes here?
        ) : (
          <Typography>{loading ? 'Loading...' : 'Nothing selected.'}</Typography>
        )} */}
      </Grid>
    </Grid>
  );
};
