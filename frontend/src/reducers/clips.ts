import { Reducer } from 'redux';
import {
  APP_NEW_CLIP,
  CLIPS_SET_CURRENT,
  CLIPS_UNSET_CURRENT,
  CLIPS_UPDATE_SEGMENT,
} from '../constants/actionTypes';
import { AppNewClipAction } from '../types/app';
import {
  ClipAction,
  ClipsSetCurrentAction,
  ClipsUnsetCurrentAction,
  ClipsUpdateSegmentAction,
  ClipState,
} from '../types/clips';

const INITIAL_STATE: ClipState = {
  currentClip: null,
  clipElements: {},
  clipAnnotations: {},
  clipSegments: {},
  clipLayers: {},
};

const applySetCurrent = (state: ClipState, action: ClipsSetCurrentAction) => {
  const { clip, clipElements, clipAnnotations, clipSegments, clipLayers } =
    action.payload;
  return {
    ...state,
    currentClip: clip,
    clipElements,
    clipAnnotations,
    clipSegments,
    clipLayers,
  };
};

const applyUnsetCurrentClip = (
  state: ClipState,
  _action: AppNewClipAction | ClipsUnsetCurrentAction,
) => ({
  ...state,
  currentClip: null,
});

const applyUpdateSegment = (
  state: ClipState,
  action: ClipsUpdateSegmentAction,
) => ({
  ...state,
  clipSegments: {
    ...state.clipSegments,
    [action.payload.segment._id]: action.payload.segment,
  },
});

export const clipReducer: Reducer<ClipState, ClipAction | AppNewClipAction> = (
  state = INITIAL_STATE,
  action,
) => {
  switch (action.type) {
    case APP_NEW_CLIP:
      return applyUnsetCurrentClip(state, action);
    case CLIPS_SET_CURRENT:
      return applySetCurrent(state, action);
    case CLIPS_UNSET_CURRENT:
      return applyUnsetCurrentClip(state, action);
    case CLIPS_UPDATE_SEGMENT:
      return applyUpdateSegment(state, action);
    default:
      return state;
  }
};
