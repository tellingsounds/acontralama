/**
 * Redux action creator functions for "clips" actions.
 */
import {
  CLIPS_SET_CURRENT,
  CLIPS_UNSET_CURRENT,
  CLIPS_UPDATE_SEGMENT,
} from '../constants/actionTypes';
import {
  ClipData,
  ClipsSetCurrentAction,
  ClipsUnsetCurrentAction,
  ClipsUpdateSegmentAction,
  Segment,
} from '../types/clips';

export const doSetCurrentClip = (
  clipData: ClipData,
): ClipsSetCurrentAction => ({
  type: CLIPS_SET_CURRENT,
  payload: clipData,
});

export const doUnsetCurrentClip = (): ClipsUnsetCurrentAction => ({
  type: CLIPS_UNSET_CURRENT,
});

export const doUpdateSegment = (
  segment: Segment,
): ClipsUpdateSegmentAction => ({
  type: CLIPS_UPDATE_SEGMENT,
  payload: { segment },
});
