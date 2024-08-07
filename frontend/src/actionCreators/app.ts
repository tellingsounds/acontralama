/**
 * Redux action creator functions for "app" actions.
 */
import {
  APP_ACTIVATE_SEGMENT,
  APP_CLEAR_ERROR,
  APP_DEACTIVATE_SEGMENT,
  APP_ELEMENT_SAVED,
  APP_LAYER_SAVED,
  APP_NEW_CLIP,
  APP_SET_ANNOUNCEMENT_MESSAGE,
  APP_SET_AUTH_STATUS,
  APP_SET_CLIP_ACCORDIONS,
  APP_SET_USER_INFO,
  APP_SET_EDITING_LEFT,
  APP_TOGGLE_MODAL,
  APP_TOGGLE_SIDEPANEL,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SAVE_REQUESTED,
  SAVE_SUCCESS,
  SAVE_ERROR,
  APP_LOGGED_OUT,
} from '../constants/actionTypes';
import {
  AppActivateSegmentAction,
  AppClearErrorAction,
  AppDeactivateSegmentAction,
  AppElementSavedAction,
  AppLayerSavedAction,
  AppNewClipAction,
  AppSetAnnouncementAction,
  AppSetAuthStatusAction,
  AppSetClipAccordionsAction,
  AppSetUserInfoAction,
  AppSetEditingLeftAction,
  AppToggleModalAction,
  AppToggleSidePanelAction,
  FetchRequestedAction,
  FetchSuccessAction,
  FetchErrorAction,
  SaveRequestedAction,
  SaveSuccessAction,
  SaveErrorAction,
  EditingLeftCategory,
  AppLoggedOutAction,
  UserInfo,
} from '../types/app';
import { AxiosError } from '../services/api';

export const doSetClipAccordions = (
  isOpen: boolean,
  accordionIds?: string[],
): AppSetClipAccordionsAction => ({
  type: APP_SET_CLIP_ACCORDIONS,
  payload: {
    accordionIds,
    isOpen,
  },
});

export const doLoggedOut = (): AppLoggedOutAction => ({
  type: APP_LOGGED_OUT,
});

export const doNewClip = (): AppNewClipAction => ({
  type: APP_NEW_CLIP,
});

export const doSetEditingLeft = (
  isEditing: boolean,
  category: EditingLeftCategory = null,
  id: string | null = null,
  parentId?: string,
): AppSetEditingLeftAction => ({
  type: APP_SET_EDITING_LEFT,
  payload: {
    category: isEditing ? category : null,
    id: isEditing ? id : null,
    parentId,
  },
});

export const doElementSaved = (elementId: string): AppElementSavedAction => ({
  type: APP_ELEMENT_SAVED,
  payload: {
    elementId,
  },
});

export const doLayerSaved = (
  layerId: string,
  // elementId: string,
): AppLayerSavedAction => ({
  type: APP_LAYER_SAVED,
  payload: {
    layerId,
    // elementId,
  },
});

export const doActivateSegment = (
  segmentId: string,
): AppActivateSegmentAction => ({
  type: APP_ACTIVATE_SEGMENT,
  payload: {
    segmentId,
  },
});

export const doDeactivateSegment = (): AppDeactivateSegmentAction => ({
  type: APP_DEACTIVATE_SEGMENT,
});

export const doSetUserInfo = (userInfo: UserInfo): AppSetUserInfoAction => ({
  type: APP_SET_USER_INFO,
  payload: userInfo,
});

export const doToggleModal = (isModalOpen: boolean): AppToggleModalAction => ({
  type: APP_TOGGLE_MODAL,
  payload: { isModalOpen },
});

export const doToggleSidePanel = (
  isSidePanelOpen: boolean,
): AppToggleSidePanelAction => ({
  type: APP_TOGGLE_SIDEPANEL,
  payload: { isSidePanelOpen },
});

export const doClearError = (): AppClearErrorAction => ({
  type: APP_CLEAR_ERROR,
});

export const doFetchRequested = (): FetchRequestedAction => ({
  type: FETCH_REQUESTED,
});

export const doFetchSuccess = (): FetchSuccessAction => ({
  type: FETCH_SUCCESS,
});

export const doFetchError = (error: AxiosError): FetchErrorAction => ({
  type: FETCH_ERROR,
  payload: { error },
});

export const doSaveRequested = (): SaveRequestedAction => ({
  type: SAVE_REQUESTED,
});

export const doSaveSuccess = (): SaveSuccessAction => ({
  type: SAVE_SUCCESS,
});

export const doSaveError = (error: AxiosError): SaveErrorAction => ({
  type: SAVE_ERROR,
  payload: { error },
});

export const doAnnouncement = (message: string): AppSetAnnouncementAction => ({
  type: APP_SET_ANNOUNCEMENT_MESSAGE,
  payload: { message },
});

export const doSetAuthStatus = (
  isAuthenticated: boolean,
): AppSetAuthStatusAction => ({
  type: APP_SET_AUTH_STATUS,
  payload: { isAuthenticated },
});
