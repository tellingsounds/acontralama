import { Reducer } from 'redux';

import { v4 as uuid4 } from 'uuid';

import { Utils as QbUtils, ImmutableTree } from 'react-awesome-query-builder';

import { config as qbConfig } from '../components/EntityQueryBuilder';

import {
  QUERY_CLEAR,
  QUERY_CLOSE_QB,
  QUERY_NEW_BLOCK,
  QUERY_OPEN_QB,
  QUERY_REMOVE_BLOCK,
  QUERY_REMOVE_QB,
  QUERY_SET_LOADING_STATE,
  QUERY_SET_RESULT,
  QUERY_SET_OPEN_QB_LABEL,
  QUERY_SET_OPEN_QB_STATE,
  QUERY_SET_QB_VALUE,
  QUERY_TOGGLE_BLOCK_CONJ,
  QUERY_UPDATE_BLOCK_FILTER,
  QUERY_UPDATE_BLOCK_RELATIONS,
} from '../constants/actionTypes';
import { INTERSECTION, QB_PLACEHOLDER_ID } from '../constants/query';
import {
  QueryState,
  QueryAction,
  QueryBlockData,
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

const DEFAULT_QB_LABEL = 'My query';

const newQueryBlock = (id: string): QueryBlockData => ({
  id,
  label: 'My Query',
  entities: { conj: 'any', qbIds: [] },
  annotations: { absentOnly: false, interpretativeOnly: false, relations: [] },
});

const makeQueryTree = (field: string): ImmutableTree => {
  const groupId = uuid4();
  const ruleId = uuid4();
  return QbUtils.loadTree({
    id: groupId,
    type: 'group',
    children1: {
      [ruleId]: {
        type: 'rule',
        properties: {
          field,
          operator: 'select_any_in',
          value: [null],
          valueSrc: ['value'],
          valueType: ['multiselect'],
        },
      },
    },
  });
};

const INITIAL_RESULTS_STATE = {
  blockAnnotations: {},
  annotationData: {},
  clipData: {},
  elementData: {},
  intersectionByClip: null,
};

const STARTING_ID = `qbl_${uuid4()}`;
const INITIAL_STATE: QueryState = {
  blockData: {
    [STARTING_ID]: {
      ...newQueryBlock(STARTING_ID),
      entities: {
        conj: 'any',
        qbIds: [],
      },
    },
  },
  loadingState: {},
  openQbLabel: DEFAULT_QB_LABEL,
  openQbTree: null,
  openQbId: null,
  qbActiveBlock: null,
  qbData: {
    // [QB_TEST_ID]: {
    //   id: QB_TEST_ID,
    //   label: 'AMemory',
    //   logic: MEMORY_TOPIC_LOGIC,
    //   query: MEMORY_TOPIC_QUERY,
    // },
  },
  qbIsOpen: false,
  queryResultData: INITIAL_RESULTS_STATE,
};

const applyNewBlock = (
  state: QueryState,
  _action: QueryNewBlockAction,
): QueryState => {
  const newId = 'qbl_' + uuid4();
  return {
    ...state,
    blockData: {
      ...state.blockData,
      [newId]: newQueryBlock(newId),
    },
  };
};

const applyRemoveBlock = (
  state: QueryState,
  action: QueryRemoveBlockAction,
): QueryState => {
  const { [action.payload.id]: _, ...newBlockData } = state.blockData;
  return {
    ...state,
    blockData: newBlockData,
  };
};

const applyUpdateBlockRelations = (
  state: QueryState,
  action: QueryUpdateBlockRelationsAction,
): QueryState => {
  const { id, relations } = action.payload;
  const prev = state.blockData[id];
  return {
    ...state,
    blockData: {
      ...state.blockData,
      [id]: {
        ...prev,
        annotations: {
          ...prev.annotations,
          relations,
        },
      },
    },
  };
};

const applySetQbValue = (
  state: QueryState,
  action: QuerySetQbValueAction,
): QueryState => {
  const { id } = action.payload;
  const block = state.blockData[state.qbActiveBlock!];
  return {
    ...state,
    blockData: {
      ...state.blockData,
      [block.id]: {
        ...block,
        entities: {
          ...block.entities,
          qbIds: block.entities.qbIds.includes(id)
            ? block.entities.qbIds
            : [...block.entities.qbIds, id],
        },
      },
    },
    qbData: {
      ...state.qbData,
      [id]: action.payload,
    },
    openQbId: null,
    qbIsOpen: false,
  };
};

const applyOpenQb = (
  state: QueryState,
  action: QueryOpenQbAction,
): QueryState => {
  const { blockId, field, qbId } = action.payload;
  const prevBlock = state.blockData[blockId];
  const newQbTree = qbId
    ? QbUtils.loadFromJsonLogic(JSON.parse(state.qbData[qbId].logic), qbConfig)
    : field
    ? makeQueryTree(field)
    : state.openQbTree;
  return {
    ...state,
    qbActiveBlock: blockId,
    openQbId: action.payload.qbId || null,
    openQbLabel: qbId ? state.qbData[qbId].label : DEFAULT_QB_LABEL,
    openQbTree: newQbTree,
    qbIsOpen: true,
    blockData: {
      ...state.blockData,
      [blockId]: {
        ...prevBlock,
        entities: {
          ...prevBlock.entities,
          qbIds: qbId
            ? prevBlock.entities.qbIds.filter(x => x !== QB_PLACEHOLDER_ID)
            : [
                ...prevBlock.entities.qbIds.filter(
                  x => x !== QB_PLACEHOLDER_ID,
                ),
                QB_PLACEHOLDER_ID,
              ],
        },
      },
    },
  };
};

const makeClearNewQbPlaceholderState = (
  state: QueryState,
): Partial<QueryState> => {
  const blockId = state.qbActiveBlock;
  if (!blockId) {
    return {};
  }
  const prevBlock = state.blockData[blockId];
  return {
    blockData: {
      ...state.blockData,
      [blockId]: {
        ...prevBlock,
        entities: {
          ...prevBlock.entities,
          qbIds: prevBlock.entities.qbIds.filter(x => x !== QB_PLACEHOLDER_ID),
        },
      },
    },
  };
};

const applyCloseQb = (
  state: QueryState,
  _action: QueryCloseQbAction,
): QueryState => ({
  ...state,
  openQbLabel: DEFAULT_QB_LABEL,
  openQbTree: null,
  openQbId: null,
  qbActiveBlock: null,
  qbIsOpen: false,
  ...makeClearNewQbPlaceholderState(state),
});

const applyRemoveQb = (
  state: QueryState,
  action: QueryRemoveQbAction,
): QueryState => {
  const { blockId, qbId } = action.payload;
  const block = state.blockData[blockId];
  const { [qbId]: _, ...newQbData } = state.qbData;
  return {
    ...state,
    blockData: {
      ...state.blockData,
      [blockId]: {
        ...block,
        entities: {
          ...block.entities,
          qbIds: block.entities.qbIds.filter(x => x !== qbId),
        },
      },
    },
    qbData: newQbData,
  };
};

const applyToggleConj = (
  state: QueryState,
  action: QueryToggleBlockConjAction,
): QueryState => {
  const { blockId } = action.payload;
  const block = state.blockData[blockId];
  return {
    ...state,
    blockData: {
      ...state.blockData,
      [blockId]: {
        ...block,
        entities: {
          ...block.entities,
          conj: block.entities.conj === 'any' ? 'all' : 'any',
        },
      },
    },
  };
};

const applySetResult = (
  state: QueryState,
  action: QuerySetResultAction,
): QueryState => {
  const prev = state.queryResultData;
  const {
    blockAnnotations,
    annotationData,
    clipData,
    elementData,
    intersectionByClip,
  } = action.payload.result;
  return {
    ...state,
    queryResultData: {
      ...prev,
      blockAnnotations: { ...prev.blockAnnotations, ...blockAnnotations },
      annotationData: { ...prev.annotationData, ...annotationData },
      clipData: { ...prev.clipData, ...clipData },
      elementData: { ...prev.elementData, ...elementData },
      intersectionByClip: intersectionByClip
        ? intersectionByClip
        : prev.intersectionByClip,
    },
  };
};

const applySetLoadingState = (
  state: QueryState,
  action: QuerySetLoadingStateAction,
): QueryState => ({
  ...state,
  loadingState: {
    ...state.loadingState,
    [action.payload.blockId || INTERSECTION]: action.payload.isLoading,
  },
});

const applySetOpenQbState = (
  state: QueryState,
  action: QuerySetOpenQbStateAction,
): QueryState => ({
  ...state,
  openQbTree: action.payload.tree,
});

const applySetOpenQbLabel = (
  state: QueryState,
  action: QuerySetOpenQbLabelAction,
): QueryState => ({
  ...state,
  openQbLabel: action.payload.label,
});

const applyClear = (state: QueryState, action: QueryClearAction): QueryState =>
  action.payload.clearAll
    ? INITIAL_STATE
    : {
        ...state,
        queryResultData: INITIAL_RESULTS_STATE,
      };

const applyUpdateBlockFilter = (
  state: QueryState,
  action: QueryUpdateBlockFilterAction,
): QueryState => {
  const { id, ...fields } = action.payload;
  const prev = state.blockData[id];
  return {
    ...state,
    blockData: {
      ...state.blockData,
      [id]: {
        ...prev,
        annotations: {
          ...prev.annotations,
          ...fields,
        },
      },
    },
  };
};
export const queryReducer: Reducer<QueryState, QueryAction> = (
  state = INITIAL_STATE,
  action,
): QueryState => {
  switch (action.type) {
    case QUERY_CLEAR:
      return applyClear(state, action);
    case QUERY_CLOSE_QB:
      return applyCloseQb(state, action);
    case QUERY_NEW_BLOCK:
      return applyNewBlock(state, action);
    case QUERY_OPEN_QB:
      return applyOpenQb(state, action);
    case QUERY_REMOVE_BLOCK:
      return applyRemoveBlock(state, action);
    case QUERY_REMOVE_QB:
      return applyRemoveQb(state, action);
    case QUERY_SET_LOADING_STATE:
      return applySetLoadingState(state, action);
    case QUERY_SET_OPEN_QB_LABEL:
      return applySetOpenQbLabel(state, action);
    case QUERY_SET_OPEN_QB_STATE:
      return applySetOpenQbState(state, action);
    case QUERY_SET_RESULT:
      return applySetResult(state, action);
    case QUERY_SET_QB_VALUE:
      return applySetQbValue(state, action);
    case QUERY_TOGGLE_BLOCK_CONJ:
      return applyToggleConj(state, action);
    case QUERY_UPDATE_BLOCK_FILTER:
      return applyUpdateBlockFilter(state, action);
    case QUERY_UPDATE_BLOCK_RELATIONS:
      return applyUpdateBlockRelations(state, action);
    default:
      return state;
  }
};
