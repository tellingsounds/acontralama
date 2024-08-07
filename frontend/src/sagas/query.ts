import { call, put, select, takeLatest } from 'redux-saga/effects';

import { getQueryResults } from '../services/api';

import { SAGA_GET_QUERY_RESULTS } from '../constants/actionTypes';

import { doSaveError } from '../actionCreators/app';
import { doSetQueryLoading, doSetQueryResult } from '../actionCreators/query';

import { getAllQbData } from '../selectors/query';

import {
  QbData,
  QueryBlockData,
  QueryBlockDataWithQbs,
  QueryResultData,
} from '../types/query';
import { SagaGetQueryResultsAction } from '../types/sagaActions';

function* applyGetQueryResults(action: SagaGetQueryResultsAction) {
  const { blockData } = action.payload;
  const qbData: Record<string, QbData> = yield select(getAllQbData);
  const withQbs = (block: QueryBlockData): QueryBlockDataWithQbs => ({
    ...block,
    entities: {
      ...block.entities,
      qbs: block.entities.qbIds.map(qbId => qbData[qbId]),
    },
  });
  const blockDataWithQbs = Array.isArray(blockData)
    ? blockData.map(withQbs)
    : withQbs(blockData);
  const blockId = !Array.isArray(blockData) ? blockData.id : undefined;
  yield put(doSetQueryLoading(true, blockId));
  try {
    const result: QueryResultData = yield call(
      getQueryResults,
      blockDataWithQbs,
    );
    yield put(doSetQueryResult(result));
  } catch (e) {
    yield put(doSaveError(e));
  } finally {
    yield put(doSetQueryLoading(false, blockId));
  }
}

function* watchGetQueryResults() {
  yield takeLatest(SAGA_GET_QUERY_RESULTS, applyGetQueryResults);
}

export const querySagas = [watchGetQueryResults()];
