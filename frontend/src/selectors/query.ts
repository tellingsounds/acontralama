/**
 * Selector functions for "query" state.
 */
import { INTERSECTION, QB_PLACEHOLDER_ID } from '../constants/query';
import { RootState } from '../types/root';
import {
  QueryResultData,
  QueryBlockData,
  QbData,
  QbTree,
} from '../types/query';

export const getQueryBlocks = (state: RootState) =>
  Object.values(state.queryState.blockData);

export const getAllQbData = (state: RootState) => state.queryState.qbData;

export const getQbData =
  (state: RootState) =>
  (qbId: string): QbData | undefined =>
    state.queryState.qbData[qbId];

export const getQbState = (state: RootState) => ({
  openQbId: state.queryState.openQbId,
  qbActiveBlock: state.queryState.qbActiveBlock,
  qbIsOpen: state.queryState.qbIsOpen,
});

export const getQueryResults = (state: RootState): QueryResultData =>
  state.queryState.queryResultData;

export const getQueryBlockLoadingState =
  (state: RootState) =>
  (blockId: string): boolean =>
    state.queryState.loadingState[blockId];

export const getQueryIntersectionLoadingState = (state: RootState): boolean =>
  state.queryState.loadingState[INTERSECTION];

export const getQueryAnyLoadingState = (state: RootState): boolean =>
  Object.values(state.queryState.loadingState).some(x => x);

export const getOpenQbState = (
  state: RootState,
): { label: string; tree: QbTree | null } => ({
  label: state.queryState.openQbLabel,
  tree: state.queryState.openQbTree,
});

const doesBlockHaveViableQbs = (blockData: QueryBlockData): boolean =>
  blockData.entities.qbIds.filter(qbId => qbId !== QB_PLACEHOLDER_ID).length >
  0;

export const getReadyToQuery = (state: RootState) => (blockId?: string) =>
  blockId
    ? doesBlockHaveViableQbs(state.queryState.blockData[blockId])
    : Object.values(state.queryState.blockData).every(doesBlockHaveViableQbs);

export const getReadyToClear = (state: RootState) =>
  Object.values(state.queryState.blockData).some(doesBlockHaveViableQbs);
