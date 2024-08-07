/**
 * Action creator functions for redux saga actions.
 */
import {
  SAGA_CLIP_OVERVIEW_RENDERED,
  SAGA_DELETE_ANNOTATION,
  SAGA_DELETE_CLIP,
  SAGA_DELETE_ELEMENT,
  SAGA_DELETE_LAYER,
  SAGA_DELETE_ENTITY,
  SAGA_DELETE_SEGMENT,
  SAGA_ENTITY_SAVED,
  SAGA_FETCH_CURRENT_CLIP,
  SAGA_FETCH_ENTITY,
  SAGA_FETCH_USER,
  SAGA_GET_QUERY_RESULTS,
  SAGA_JUMP_TO,
  SAGA_LOGIN,
  SAGA_LOGOUT,
  SAGA_READ_ONLY,
  SAGA_REFRESH,
  SAGA_SAVE_ANNOTATION,
  SAGA_SAVE_CLIP,
  SAGA_SAVE_ELEMENT,
  SAGA_SAVE_LAYER,
  SAGA_SAVE_SEGMENT,
  SAGA_SAVE_ENTITY,
  SAGA_SET_FAVORITE_CLIP,
  SAGA_SUCCESSFUL_REQUEST,
  SAGA_UPDATE_SEGMENT_ANNOTS,
  SAGA_WEBSOCKET_FAILED,
} from '../constants/actionTypes';
import {
  Annotation,
  Clip,
  ClipBasic,
  ClipElement,
  ClipLayer,
  Segment,
} from '../types/clips';
import { Entity } from '../types/entities';
import { QueryBlockData } from '../types/query';
import {
  SagaClipOverviewRenderedAction,
  SagaDeleteAnnotationAction,
  SagaDeleteClipAction,
  SagaDeleteElementAction,
  SagaDeleteLayerAction,
  SagaDeleteEntityAction,
  SagaDeleteSegmentAction,
  SagaFetchEntityAction,
  SagaFetchCurrentClipAction,
  SagaFetchUserAction,
  SagaGetQueryResultsAction,
  SagaJumpToAction,
  SagaLoginAction,
  SagaLogoutAction,
  SagaReadOnlyAction,
  SagaRefreshAction,
  SagaSaveAnnotationAction,
  SagaSaveClipAction,
  SagaSaveElementAction,
  SagaSaveLayerAction,
  SagaSaveSegmentAction,
  SagaSaveEntityAction,
  SagaSetFavoriteClipAction,
  SagaEntitySavedAction,
  SagaUpdateSegmentAnnotsAction,
  SagaSuccessfulRequestAction,
  SagaWebsocketFailedAction,
} from '../types/sagaActions';

export const doClipOverviewRendered = (): SagaClipOverviewRenderedAction => ({
  type: SAGA_CLIP_OVERVIEW_RENDERED,
});

export const doJumpTo = (
  domId: string,
  accordionIds?: string[],
): SagaJumpToAction => ({
  type: SAGA_JUMP_TO,
  payload: {
    domId,
    accordionIds,
  },
});

export const doLogin = (
  username: string,
  password: string,
  handleInvalidCredentials: (message: string) => void,
  setLoading: (isLoading: boolean) => void,
  path?: string,
  fromPath?: string,
): SagaLoginAction => ({
  type: SAGA_LOGIN,
  payload: {
    username,
    password,
    handleInvalidCredentials,
    setLoading,
    path,
    fromPath,
  },
});

export const doReadOnly = (
  setLoading: (isLoading: boolean) => void,
  path?: string,
  fromPath?: string,
): SagaReadOnlyAction => ({
  type: SAGA_READ_ONLY,
  payload: {
    setLoading,
    path,
    fromPath,
  },
});

export const doLogout = (): SagaLogoutAction => ({
  type: SAGA_LOGOUT,
});

export const doEntitySaved = (
  entity: Entity,
  refId: string,
): SagaEntitySavedAction => ({
  type: SAGA_ENTITY_SAVED,
  payload: {
    entity,
    refId,
  },
});

export const doSaveEntity = (
  entity: Entity,
  refId: string,
): SagaSaveEntityAction => ({
  type: SAGA_SAVE_ENTITY,
  payload: {
    entity,
    refId,
  },
});

export const doSaveClip = (clip: ClipBasic): SagaSaveClipAction => ({
  type: SAGA_SAVE_CLIP,
  payload: {
    clip,
  },
});

export const doSaveAnnotation = (
  annotation: Annotation,
): SagaSaveAnnotationAction => ({
  type: SAGA_SAVE_ANNOTATION,
  payload: {
    annotation,
  },
});

export const doDeleteAnnotation = (
  annotation: Annotation,
): SagaDeleteAnnotationAction => ({
  type: SAGA_DELETE_ANNOTATION,
  payload: {
    annotation,
  },
});

export const doDeleteClip = (clip: Clip): SagaDeleteClipAction => ({
  type: SAGA_DELETE_CLIP,
  payload: {
    clip,
  },
});

export const doDeleteEntity = (entity: Entity): SagaDeleteEntityAction => ({
  type: SAGA_DELETE_ENTITY,
  payload: {
    entity,
  },
});

export const doSaveElement = (element: ClipElement): SagaSaveElementAction => ({
  type: SAGA_SAVE_ELEMENT,
  payload: {
    element,
  },
});

export const doDeleteElement = (
  element: ClipElement,
): SagaDeleteElementAction => ({
  type: SAGA_DELETE_ELEMENT,
  payload: {
    element,
  },
});

export const doSaveLayer = (layer: ClipLayer): SagaSaveLayerAction => ({
  type: SAGA_SAVE_LAYER,
  payload: {
    layer,
  },
});

export const doDeleteLayer = (layer: ClipLayer): SagaDeleteLayerAction => ({
  type: SAGA_DELETE_LAYER,
  payload: {
    layer,
  },
});

export const doSaveSegment = (segment: Segment): SagaSaveSegmentAction => ({
  type: SAGA_SAVE_SEGMENT,
  payload: {
    segment,
  },
});

export const doDeleteSegment = (segment: Segment): SagaDeleteSegmentAction => ({
  type: SAGA_DELETE_SEGMENT,
  payload: {
    segment,
  },
});

export const doUpdateSegmentAnnots = (
  segment: string,
  annotations: string[],
): SagaUpdateSegmentAnnotsAction => ({
  type: SAGA_UPDATE_SEGMENT_ANNOTS,
  payload: {
    segment,
    annotations,
  },
});

export const doFetchCurrentClip = (
  clipId?: string,
): SagaFetchCurrentClipAction => ({
  type: SAGA_FETCH_CURRENT_CLIP,
  payload: { clipId },
});

export const doFetchUser = (): SagaFetchUserAction => ({
  type: SAGA_FETCH_USER,
});

export const doRefresh = (): SagaRefreshAction => ({
  type: SAGA_REFRESH,
});

export const doFetchEntity = (entityId: string): SagaFetchEntityAction => ({
  type: SAGA_FETCH_ENTITY,
  payload: { entityId },
});

export const doSetFavoriteClip = (
  clipId: string,
  isFavorite: boolean,
): SagaSetFavoriteClipAction => ({
  type: SAGA_SET_FAVORITE_CLIP,
  payload: { clipId, isFavorite },
});

export const doGetQueryResults = (
  blockData: QueryBlockData | QueryBlockData[],
): SagaGetQueryResultsAction => ({
  type: SAGA_GET_QUERY_RESULTS,
  payload: { blockData },
});

export const doSuccessfulRequest = (): SagaSuccessfulRequestAction => ({
  type: SAGA_SUCCESSFUL_REQUEST,
});

export const doWebsocketFailed = (
  onReanimate: () => void,
): SagaWebsocketFailedAction => ({
  type: SAGA_WEBSOCKET_FAILED,
  payload: { onReanimate },
});
