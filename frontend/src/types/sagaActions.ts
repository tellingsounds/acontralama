/**
 * Typing information for Redux Saga stuff.
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
  SAGA_SAVE_SEGMENT,
  SAGA_SAVE_ENTITY,
  SAGA_SET_FAVORITE_CLIP,
  SAGA_SUCCESSFUL_REQUEST,
  SAGA_UPDATE_SEGMENT_ANNOTS,
  SAGA_WEBSOCKET_FAILED,
  SAGA_SAVE_LAYER,
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

interface EntityCreationAction {
  payload: {
    entity: Entity;
    refId: string;
  };
}

export interface SagaEntitySavedAction extends EntityCreationAction {
  type: typeof SAGA_ENTITY_SAVED;
}

export interface SagaSaveEntityAction extends EntityCreationAction {
  type: typeof SAGA_SAVE_ENTITY;
}

export interface SagaSaveClipAction {
  type: typeof SAGA_SAVE_CLIP;
  payload: { clip: ClipBasic | Clip };
}

export interface SagaSaveAnnotationAction {
  type: typeof SAGA_SAVE_ANNOTATION;
  payload: { annotation: Annotation };
}

export interface SagaDeleteAnnotationAction {
  type: typeof SAGA_DELETE_ANNOTATION;
  payload: { annotation: Annotation };
}

export interface SagaDeleteClipAction {
  type: typeof SAGA_DELETE_CLIP;
  payload: { clip: Clip };
}

export interface SagaDeleteEntityAction {
  type: typeof SAGA_DELETE_ENTITY;
  payload: { entity: Entity };
}

export interface SagaSaveElementAction {
  type: typeof SAGA_SAVE_ELEMENT;
  payload: { element: ClipElement };
}

export interface SagaDeleteElementAction {
  type: typeof SAGA_DELETE_ELEMENT;
  payload: { element: ClipElement };
}

export interface SagaSaveLayerAction {
  type: typeof SAGA_SAVE_LAYER;
  payload: { layer: ClipLayer };
}

export interface SagaDeleteLayerAction {
  type: typeof SAGA_DELETE_LAYER;
  payload: { layer: ClipLayer };
}

export interface SagaSaveSegmentAction {
  type: typeof SAGA_SAVE_SEGMENT;
  payload: { segment: Segment };
}

export interface SagaDeleteSegmentAction {
  type: typeof SAGA_DELETE_SEGMENT;
  payload: { segment: Segment };
}

export interface SagaFetchCurrentClipAction {
  type: typeof SAGA_FETCH_CURRENT_CLIP;
  payload: { clipId?: string };
}

export interface SagaFetchUserAction {
  type: typeof SAGA_FETCH_USER;
}

export interface SagaRefreshAction {
  type: typeof SAGA_REFRESH;
}

export interface SagaUpdateSegmentAnnotsAction {
  type: typeof SAGA_UPDATE_SEGMENT_ANNOTS;
  payload: {
    segment: string;
    annotations: string[];
  };
}

export interface SagaFetchEntityAction {
  type: typeof SAGA_FETCH_ENTITY;
  payload: { entityId: string };
}

export interface SagaJumpToAction {
  type: typeof SAGA_JUMP_TO;
  payload: { domId: string; accordionIds?: string[] };
}

export interface SagaLoginAction {
  type: typeof SAGA_LOGIN;
  payload: {
    username: string;
    password: string;
    handleInvalidCredentials: (message: string) => void;
    setLoading: (isLoading: boolean) => void;
    path?: string;
    fromPath?: string;
  };
}

export interface SagaReadOnlyAction {
  type: typeof SAGA_READ_ONLY;
  payload: {
    setLoading: (isLoading: boolean) => void;
    path?: string;
    fromPath?: string;
  };
}

export interface SagaLogoutAction {
  type: typeof SAGA_LOGOUT;
}

export interface SagaClipOverviewRenderedAction {
  type: typeof SAGA_CLIP_OVERVIEW_RENDERED;
}

export interface SagaSetFavoriteClipAction {
  type: typeof SAGA_SET_FAVORITE_CLIP;
  payload: { clipId: string; isFavorite: boolean };
}

export interface SagaGetQueryResultsAction {
  type: typeof SAGA_GET_QUERY_RESULTS;
  payload: { blockData: QueryBlockData | QueryBlockData[] };
}

export interface SagaSuccessfulRequestAction {
  type: typeof SAGA_SUCCESSFUL_REQUEST;
}

export interface SagaWebsocketFailedAction {
  type: typeof SAGA_WEBSOCKET_FAILED;
  payload: { onReanimate: () => void };
}
