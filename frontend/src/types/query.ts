/**
 * Typing information for "query".
 */
import { ImmutableTree } from 'react-awesome-query-builder';

import {
  QUERY_CLEAR,
  QUERY_CLOSE_QB,
  QUERY_NEW_BLOCK,
  QUERY_OPEN_QB,
  QUERY_REMOVE_BLOCK,
  QUERY_REMOVE_QB,
  QUERY_SET_RESULT,
  QUERY_SET_OPEN_QB_LABEL,
  QUERY_SET_OPEN_QB_STATE,
  QUERY_SET_QB_VALUE,
  QUERY_SET_LOADING_STATE,
  QUERY_TOGGLE_BLOCK_CONJ,
  QUERY_UPDATE_BLOCK_FILTER,
  QUERY_UPDATE_BLOCK_RELATIONS,
} from '../constants/actionTypes';

import { Annotation, ClipBasicResp, ClipElement } from './clips';
import { AnyObject } from './index';

export type { ImmutableTree };

export interface QueryBlockData {
  id: string;
  label: string;
  entities: { conj: 'all' | 'any'; qbIds: string[] };
  annotations: {
    absentOnly: boolean;
    interpretativeOnly: boolean;
    relations: string[];
  };
  clips?: any;
}

export interface QueryBlockDataWithQbs extends QueryBlockData {
  entities: { conj: 'all' | 'any'; qbIds: string[]; qbs: QbData[] };
}

export type MongoQuery = AnyObject;

export interface QbData {
  id: string;
  label: string;
  logic: string;
  query: MongoQuery;
}

export type QbTree = ImmutableTree;
// export interface QbTreeData {
//   label: string;
//   tree: ImmutableTree;
// }

type BlockAnnotations = Record<string, string[]>; // block id to annotation ids

export interface QueryResultData {
  blockAnnotations: BlockAnnotations;
  annotationData: Record<string, Annotation>;
  clipData: Record<string, Pick<ClipBasicResp, 'labelTitle'>>;
  elementData: Record<string, Pick<ClipElement, 'label' | 'type'>>;
  intersectionByClip: Record<string, BlockAnnotations> | null; // keys are clip ids
}

export interface QueryState {
  blockData: Record<string, QueryBlockData>;
  loadingState: Record<string, boolean>;
  openQbLabel: string;
  openQbTree: QbTree | null;
  openQbId: string | null;
  qbActiveBlock: string | null;
  qbData: Record<string, QbData>;
  qbIsOpen: boolean;
  queryResultData: QueryResultData;
}

export interface QueryNewBlockAction {
  type: typeof QUERY_NEW_BLOCK;
}

export interface QueryRemoveBlockAction {
  type: typeof QUERY_REMOVE_BLOCK;
  payload: { id: string };
}

export interface QueryUpdateBlockRelationsAction {
  type: typeof QUERY_UPDATE_BLOCK_RELATIONS;
  payload: { id: string; relations: string[] };
}

export type QueryBlockFilter =
  | { absentOnly: boolean }
  | {
      interpretativeOnly: boolean;
    };

export interface QueryUpdateBlockFilterAction {
  type: typeof QUERY_UPDATE_BLOCK_FILTER;
  payload: {
    id: string;
  } & QueryBlockFilter;
}

export interface QueryOpenQbAction {
  type: typeof QUERY_OPEN_QB;
  payload: { blockId: string; field?: string; qbId?: string };
}

export interface QueryRemoveQbAction {
  type: typeof QUERY_REMOVE_QB;
  payload: { blockId: string; qbId: string };
}

export interface QueryCloseQbAction {
  type: typeof QUERY_CLOSE_QB;
}

export interface QuerySetQbValueAction {
  type: typeof QUERY_SET_QB_VALUE;
  payload: { id: string; label: string; logic: string; query: MongoQuery };
}

export interface QueryToggleBlockConjAction {
  type: typeof QUERY_TOGGLE_BLOCK_CONJ;
  payload: { blockId: string };
}

export interface QuerySetResultAction {
  type: typeof QUERY_SET_RESULT;
  payload: { result: QueryResultData };
}

export interface QuerySetLoadingStateAction {
  type: typeof QUERY_SET_LOADING_STATE;
  payload: {
    isLoading: boolean;
    blockId?: string;
  };
}

export interface QuerySetOpenQbStateAction {
  type: typeof QUERY_SET_OPEN_QB_STATE;
  payload: {
    tree: QbTree;
  };
}

export interface QuerySetOpenQbLabelAction {
  type: typeof QUERY_SET_OPEN_QB_LABEL;
  payload: {
    label: string;
  };
}

export interface QueryClearAction {
  type: typeof QUERY_CLEAR;
  payload: { clearAll: boolean };
}

export type QueryAction =
  | QueryClearAction
  | QueryCloseQbAction
  | QueryNewBlockAction
  | QueryOpenQbAction
  | QueryRemoveBlockAction
  | QueryRemoveQbAction
  | QuerySetLoadingStateAction
  | QuerySetResultAction
  | QuerySetOpenQbLabelAction
  | QuerySetOpenQbStateAction
  | QuerySetQbValueAction
  | QueryToggleBlockConjAction
  | QueryUpdateBlockFilterAction
  | QueryUpdateBlockRelationsAction;
