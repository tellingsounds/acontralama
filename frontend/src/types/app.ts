/**
 * Typing information for "app".
 */
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
  APP_LOGGED_OUT,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SAVE_REQUESTED,
  SAVE_SUCCESS,
  SAVE_ERROR,
} from '../constants/actionTypes';

import { AxiosError } from '../services/api';

export type EditingLeftCategory =
  | 'Clip'
  | 'Segment'
  | 'Music'
  | 'Speech'
  | 'Noise'
  | 'Picture'
  | 'Structure'
  | 'MusicLayer'
  | 'SpeechLayer'
  | 'SoundLayer'
  | null;

export type EditingLeftState = {
  category: EditingLeftCategory;
  parentId?: string;
  id: string | null;
};

export interface AppState {
  activeSegment: string;
  announcementMessage: string;
  clipAccordions: {
    [k: string]: boolean;
  };
  userInfo: UserInfo;
  didInitialize: boolean;
  error?: AxiosError;
  editingLeft: EditingLeftState;
  isAuthenticated: boolean;
  isLoading: boolean;
  isModalOpen: boolean;
  isSaving: boolean;
  isSidePanelOpen: boolean;
}

export interface AppSetClipAccordionsAction {
  type: typeof APP_SET_CLIP_ACCORDIONS;
  payload: {
    accordionIds?: string[];
    isOpen: boolean;
  };
}

export interface AppSetEditingLeftAction {
  type: typeof APP_SET_EDITING_LEFT;
  payload: EditingLeftState;
}

export interface AppNewClipAction {
  type: typeof APP_NEW_CLIP;
}

export interface AppElementSavedAction {
  type: typeof APP_ELEMENT_SAVED;
  payload: {
    elementId: string;
  };
}

export interface AppLayerSavedAction {
  type: typeof APP_LAYER_SAVED;
  payload: {
    layerId: string;
    // elementId: string;
  };
}

export interface AppActivateSegmentAction {
  type: typeof APP_ACTIVATE_SEGMENT;
  payload: {
    segmentId: string;
  };
}

export interface AppDeactivateSegmentAction {
  type: typeof APP_DEACTIVATE_SEGMENT;
}

export type UserPrivileges = 'r' | 'w' | 'a';
export type UserInfo = {
  username: string | null;
  privileges: UserPrivileges;
};

export interface AppSetUserInfoAction {
  type: typeof APP_SET_USER_INFO;
  payload: UserInfo;
}

export interface FetchRequestedAction {
  type: typeof FETCH_REQUESTED;
}

export interface FetchSuccessAction {
  type: typeof FETCH_SUCCESS;
}

export interface FetchErrorAction {
  type: typeof FETCH_ERROR;
  payload: {
    error: AxiosError;
  };
}

export interface SaveRequestedAction {
  type: typeof SAVE_REQUESTED;
}

export interface SaveSuccessAction {
  type: typeof SAVE_SUCCESS;
}

export interface SaveErrorAction {
  type: typeof SAVE_ERROR;
  payload: {
    error: AxiosError;
  };
}

export interface AppToggleSidePanelAction {
  type: typeof APP_TOGGLE_SIDEPANEL;
  payload: {
    isSidePanelOpen: boolean;
  };
}

export interface AppToggleModalAction {
  type: typeof APP_TOGGLE_MODAL;
  payload: {
    isModalOpen: boolean;
  };
}

export interface AppClearErrorAction {
  type: typeof APP_CLEAR_ERROR;
}

export interface AppSetAnnouncementAction {
  type: typeof APP_SET_ANNOUNCEMENT_MESSAGE;
  payload: { message: string };
}

export interface AppLoggedOutAction {
  type: typeof APP_LOGGED_OUT;
}

export interface AppSetAuthStatusAction {
  type: typeof APP_SET_AUTH_STATUS;
  payload: { isAuthenticated: boolean };
}

export type AppAction =
  | AppActivateSegmentAction
  | AppClearErrorAction
  | AppDeactivateSegmentAction
  | AppElementSavedAction
  | AppLayerSavedAction
  | AppNewClipAction
  | AppSetAnnouncementAction
  | AppSetAuthStatusAction
  | AppSetClipAccordionsAction
  | AppSetUserInfoAction
  | AppSetEditingLeftAction
  | AppToggleModalAction
  | AppToggleSidePanelAction
  | AppLoggedOutAction
  | FetchRequestedAction
  | FetchSuccessAction
  | FetchErrorAction
  | SaveRequestedAction
  | SaveSuccessAction
  | SaveErrorAction;
