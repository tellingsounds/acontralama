import { Reducer } from 'redux';

import { EditingLeftState } from '../types/app';

import {
  APP_ACTIVATE_SEGMENT,
  APP_CLEAR_ERROR,
  APP_DEACTIVATE_SEGMENT,
  APP_ELEMENT_SAVED,
  APP_LAYER_SAVED,
  APP_NEW_CLIP,
  APP_SET_ANNOUNCEMENT_MESSAGE,
  APP_SET_CLIP_ACCORDIONS,
  APP_SET_AUTH_STATUS,
  APP_SET_USER_INFO,
  APP_SET_EDITING_LEFT,
  APP_TOGGLE_MODAL,
  APP_TOGGLE_SIDEPANEL,
  CLIPS_SET_CURRENT,
  CLIPS_UNSET_CURRENT,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SAVE_REQUESTED,
  SAVE_SUCCESS,
  SAVE_ERROR,
  SIDEPANEL_SHOW_ENTITY,
} from '../constants/actionTypes';
import {
  AppAction,
  AppActivateSegmentAction,
  AppClearErrorAction,
  AppDeactivateSegmentAction,
  AppElementSavedAction,
  AppLayerSavedAction,
  AppNewClipAction,
  AppSetAnnouncementAction,
  AppSetClipAccordionsAction,
  AppSetAuthStatusAction,
  AppSetUserInfoAction,
  AppSetEditingLeftAction,
  AppToggleModalAction,
  AppToggleSidePanelAction,
  AppState,
  FetchRequestedAction,
  FetchSuccessAction,
  FetchErrorAction,
  SaveRequestedAction,
  SaveSuccessAction,
  SaveErrorAction,
} from '../types/app';
import { SidePanelShowEntityAction } from '../types/sidePanel';
import { ClipsSetCurrentAction, ClipsUnsetCurrentAction } from '../types/clips';

import { keysSetIfUndefined, someKeysSet } from '../util';

const INITIAL_EDITING_LEFT_STATE: EditingLeftState = {
  category: null,
  id: null,
};

const INITIAL_STATE: AppState = {
  activeSegment: '',
  announcementMessage: '',
  clipAccordions: {},
  didInitialize: false,
  userInfo: {
    username: null,
    privileges: 'r',
  },
  error: undefined,
  isAuthenticated: false,
  isSidePanelOpen: false,
  editingLeft: INITIAL_EDITING_LEFT_STATE,
  isLoading: false,
  isModalOpen: false,
  isSaving: false,
};

const applySetClipAccordions = (
  state: AppState,
  action: AppSetClipAccordionsAction,
): AppState => {
  const { isOpen, accordionIds } = action.payload;
  return {
    ...state,
    clipAccordions: someKeysSet(state.clipAccordions, isOpen, accordionIds),
  };
};

const applySetEditingLeft = (
  state: AppState,
  action: AppSetEditingLeftAction,
): AppState => ({
  ...state,
  editingLeft: {
    ...state.editingLeft,
    ...action.payload,
  },
});

const applyElementSaved = (
  state: AppState,
  _action: AppElementSavedAction,
): AppState => ({
  ...state,
  editingLeft: INITIAL_EDITING_LEFT_STATE,
});

const applyLayerSaved = (
  state: AppState,
  _action: AppLayerSavedAction,
): AppState => ({
  ...state,
  editingLeft: INITIAL_EDITING_LEFT_STATE,
});

const applyNewClip = (
  state: AppState,
  _action: AppNewClipAction,
): AppState => ({
  ...state,
  editingLeft: {
    ...state.editingLeft,
    category: 'Clip',
    id: null,
  },
  isSidePanelOpen: true,
});

const applySetCurrentClip = (
  state: AppState,
  action: ClipsSetCurrentAction,
): AppState => ({
  ...state,
  clipAccordions: {
    ...keysSetIfUndefined(state.clipAccordions, true, [
      'ClipAnnotations',
      'Segment',
      'Music',
      'Speech',
      'Noise',
      'Picture',
      'Structure',
      'Timeline',
      'MusicLayer',
      'SpeechLayer',
      'SoundLayer',
    ]),
    ...keysSetIfUndefined(state.clipAccordions, false, [
      ...Object.keys(action.payload.clipElements),
      ...Object.keys(action.payload.clipSegments),
      ...Object.keys(action.payload.clipLayers),
    ]),
  },
  editingLeft: INITIAL_EDITING_LEFT_STATE,
  isSidePanelOpen: true,
});

const applyUnsetCurrentClip = (
  state: AppState,
  _action: ClipsUnsetCurrentAction,
): AppState => ({
  ...state,
  activeSegment: '',
  clipAccordions: {},
  editingLeft: INITIAL_EDITING_LEFT_STATE,
  isSidePanelOpen: false,
});

const applyShowEntity = (
  state: AppState,
  _action: SidePanelShowEntityAction,
): AppState => ({
  ...state,
  isSidePanelOpen: true,
});

const applyActivateSegment = (
  state: AppState,
  action: AppActivateSegmentAction,
): AppState => ({
  ...state,
  activeSegment: action.payload.segmentId,
});

const applyDeactivateSegment = (
  state: AppState,
  _action: AppDeactivateSegmentAction,
): AppState => ({
  ...state,
  activeSegment: '',
});

const applySetUserInfo = (
  state: AppState,
  action: AppSetUserInfoAction,
): AppState => ({
  ...state,
  userInfo: {
    ...state.userInfo,
    ...action.payload,
  },
  didInitialize: true,
  isAuthenticated: true,
});

const applyToggleSidePanel = (
  state: AppState,
  action: AppToggleSidePanelAction,
): AppState => ({
  ...state,
  isSidePanelOpen: action.payload.isSidePanelOpen,
});

const applyToggleModal = (
  state: AppState,
  action: AppToggleModalAction,
): AppState => ({
  ...state,
  isModalOpen: action.payload.isModalOpen,
});

const applyFetchRequested = (
  state: AppState,
  _action: FetchRequestedAction,
): AppState => ({
  ...state,
  isLoading: true,
});

const applyFetchSuccess = (
  state: AppState,
  _action: FetchSuccessAction,
): AppState => ({
  ...state,
  isLoading: false,
});

const applyFetchError = (
  state: AppState,
  action: FetchErrorAction,
): AppState => ({
  ...state,
  isLoading: false,
  error:
    action.payload.error.response?.status === 401
      ? state.error
      : action.payload.error,
});

const applySaveRequested = (
  state: AppState,
  _action: SaveRequestedAction,
): AppState => ({
  ...state,
  isSaving: true,
});

const applySaveSuccess = (
  state: AppState,
  _action: SaveSuccessAction,
): AppState => ({
  ...state,
  isSaving: false,
});

const applySaveError = (
  state: AppState,
  action: SaveErrorAction,
): AppState => ({
  ...state,
  isSaving: false,
  error: action.payload.error,
});

const applyClearError = (
  state: AppState,
  _action: AppClearErrorAction,
): AppState => ({
  ...state,
  error: undefined,
});

const applySetAnnouncementMessage = (
  state: AppState,
  action: AppSetAnnouncementAction,
): AppState => ({
  ...state,
  announcementMessage: action.payload.message,
});

const applySetAuthStatus = (
  state: AppState,
  action: AppSetAuthStatusAction,
): AppState => ({
  ...state,
  isAuthenticated: action.payload.isAuthenticated,
});

export const appReducer: Reducer<
  AppState,
  | AppAction
  | ClipsSetCurrentAction
  | ClipsUnsetCurrentAction
  | SidePanelShowEntityAction
> = (state = INITIAL_STATE, action): AppState => {
  switch (action.type) {
    case APP_ACTIVATE_SEGMENT:
      return applyActivateSegment(state, action);
    case APP_CLEAR_ERROR:
      return applyClearError(state, action);
    case APP_DEACTIVATE_SEGMENT:
      return applyDeactivateSegment(state, action);
    case APP_ELEMENT_SAVED:
      return applyElementSaved(state, action);
    case APP_LAYER_SAVED:
      return applyLayerSaved(state, action);
    case APP_NEW_CLIP:
      return applyNewClip(state, action);
    case APP_SET_ANNOUNCEMENT_MESSAGE:
      return applySetAnnouncementMessage(state, action);
    case APP_SET_CLIP_ACCORDIONS:
      return applySetClipAccordions(state, action);
    case APP_SET_AUTH_STATUS:
      return applySetAuthStatus(state, action);
    case APP_SET_USER_INFO:
      return applySetUserInfo(state, action);
    case APP_SET_EDITING_LEFT:
      return applySetEditingLeft(state, action);
    case APP_TOGGLE_MODAL:
      return applyToggleModal(state, action);
    case APP_TOGGLE_SIDEPANEL:
      return applyToggleSidePanel(state, action);
    case CLIPS_SET_CURRENT:
      return applySetCurrentClip(state, action);
    case CLIPS_UNSET_CURRENT:
      return applyUnsetCurrentClip(state, action);
    case SIDEPANEL_SHOW_ENTITY:
      return applyShowEntity(state, action);
    case FETCH_REQUESTED:
      return applyFetchRequested(state, action);
    case FETCH_SUCCESS:
      return applyFetchSuccess(state, action);
    case FETCH_ERROR:
      return applyFetchError(state, action);
    case SAVE_REQUESTED:
      return applySaveRequested(state, action);
    case SAVE_SUCCESS:
      return applySaveSuccess(state, action);
    case SAVE_ERROR:
      return applySaveError(state, action);
    default:
      return state;
  }
};
