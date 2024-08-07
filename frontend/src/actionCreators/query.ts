/**
 * Redux action creator functions for "query" actions.
 */
import {
  QUERY_CLEAR,
  QUERY_CLOSE_QB,
  QUERY_NEW_BLOCK,
  QUERY_OPEN_QB,
  QUERY_REMOVE_BLOCK,
  QUERY_REMOVE_QB,
  QUERY_SET_LOADING_STATE,
  QUERY_SET_OPEN_QB_LABEL,
  QUERY_SET_OPEN_QB_STATE,
  QUERY_SET_RESULT,
  QUERY_SET_QB_VALUE,
  QUERY_TOGGLE_BLOCK_CONJ,
  QUERY_UPDATE_BLOCK_FILTER,
  QUERY_UPDATE_BLOCK_RELATIONS,
} from '../constants/actionTypes';
import {
  MongoQuery,
  QbTree,
  QueryBlockFilter,
  QueryResultData,
  QueryClearAction,
  QueryCloseQbAction,
  QueryNewBlockAction,
  QueryOpenQbAction,
  QueryRemoveBlockAction,
  QueryRemoveQbAction,
  QuerySetLoadingStateAction,
  QuerySetOpenQbLabelAction,
  QuerySetOpenQbStateAction,
  QuerySetResultAction,
  QuerySetQbValueAction,
  QueryToggleBlockConjAction,
  QueryUpdateBlockFilterAction,
  QueryUpdateBlockRelationsAction,
} from '../types/query';

export const doNewQueryBlock = (): QueryNewBlockAction => ({
  type: QUERY_NEW_BLOCK,
});

export const doRemoveQueryBlock = (id: string): QueryRemoveBlockAction => ({
  type: QUERY_REMOVE_BLOCK,
  payload: { id },
});

export const doUpdateQueryBlockRelations = (
  id: string,
  relations: string[],
): QueryUpdateBlockRelationsAction => ({
  type: QUERY_UPDATE_BLOCK_RELATIONS,
  payload: { id, relations },
});

export const doOpenQb = (
  blockId: string,
  qbId: string | null | undefined,
  field?: string,
): QueryOpenQbAction => ({
  type: QUERY_OPEN_QB,
  payload: { blockId, field, qbId: qbId || undefined },
});

export const doRemoveQb = (
  blockId: string,
  qbId: string,
): QueryRemoveQbAction => ({
  type: QUERY_REMOVE_QB,
  payload: { blockId, qbId },
});

export const doCloseQb = (): QueryCloseQbAction => ({
  type: QUERY_CLOSE_QB,
});

export const doSetQbValue = (
  id: string,
  label: string,
  logic: string,
  query: MongoQuery,
): QuerySetQbValueAction => ({
  type: QUERY_SET_QB_VALUE,
  payload: { id, label, logic, query },
});

export const doToggleConj = (blockId: string): QueryToggleBlockConjAction => ({
  type: QUERY_TOGGLE_BLOCK_CONJ,
  payload: { blockId },
});

export const doSetQueryResult = (
  result: QueryResultData,
): QuerySetResultAction => ({
  type: QUERY_SET_RESULT,
  payload: { result },
});

export const doSetQueryLoading = (
  isLoading: boolean,
  blockId?: string,
): QuerySetLoadingStateAction => ({
  type: QUERY_SET_LOADING_STATE,
  payload: { blockId, isLoading },
});

export const doSetOpenQbState = (tree: QbTree): QuerySetOpenQbStateAction => ({
  type: QUERY_SET_OPEN_QB_STATE,
  payload: { tree },
});

export const doSetOpenQbLabel = (label: string): QuerySetOpenQbLabelAction => ({
  type: QUERY_SET_OPEN_QB_LABEL,
  payload: { label },
});

export const doClearQuery = (clearAll = false): QueryClearAction => ({
  type: QUERY_CLEAR,
  payload: { clearAll },
});

export const doUpdateQueryBlockFilter = (
  id: string,
  filters: QueryBlockFilter,
): QueryUpdateBlockFilterAction => ({
  type: QUERY_UPDATE_BLOCK_FILTER,
  payload: { id, ...filters },
});
