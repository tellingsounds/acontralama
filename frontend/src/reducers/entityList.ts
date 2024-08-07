import { Reducer } from 'redux';

import { GridSortModel } from '@material-ui/data-grid';

import {
  ENTITYLIST_SET_PAGE,
  ENTITYLIST_UPDATE_CONFIG,
  ENTITYLIST_UPDATE_DATA,
} from '../constants/actionTypes';

import { getFromLocalStorageMaybe } from '../services/localStorage';

import { allowedSortFields } from '../components/EntityList';
import {
  EntityListAction,
  EntityListState,
  EntityListSetPageAction,
  EntityListUpdateConfigAction,
  EntityListUpdateDataAction,
} from '../types/entityList';

const L_PAGE_SIZE = 'lama.EntityList.pageSize';
const L_SORT_MODEL = 'lama.EntityList.sortModel';

const INITIAL_STATE: EntityListState = {
  config: {
    entityIds: [],
    selectedTypes: [],
    filterUser: '',
    matchAll: false,
    catFilters: [],
    pageBeforeAfter: [undefined, undefined],
    pageSize: getFromLocalStorageMaybe(L_PAGE_SIZE) || 16,
    searchText: '',
    sortModel: getFromLocalStorageMaybe<GridSortModel>(L_SORT_MODEL)?.filter(
      (sortItem: { field: string }) =>
        allowedSortFields.includes(sortItem.field),
    ) || [{ field: 'updatedAny', sort: 'desc' }],
  },
  data: {
    firstLastIndex: [-1, -1],
    page: 0,
    rows: [],
    totalCount: 0,
  },
};

const applyUpdateConfig = (
  state: EntityListState,
  action: EntityListUpdateConfigAction,
): EntityListState => ({
  ...state,
  config: {
    ...state.config,
    ...action.payload.updatedConfig,
  },
});

const applyUpdateData = (
  state: EntityListState,
  action: EntityListUpdateDataAction,
): EntityListState => {
  const { data } = action.payload;
  const newRows = data.entities.map(entity => ({
    id: entity._id,
    label: entity.label,
    type: entity.type,
    description: entity.description,
    date: entity.attributes?.dateOfCreation,
    associated: entity.attributes?.associatedWith,
    usageCount: entity.usageCount,
    createdBy: entity.createdBy,
    created: entity.created,
    updated: entity.updated,
  }));
  return {
    ...state,
    data: {
      firstLastIndex: [data.firstIndex, data.lastIndex],
      page: data.page,
      rows: newRows,
      totalCount: data.totalCount,
    },
  };
};

const applySetPage = (
  state: EntityListState,
  action: EntityListSetPageAction,
): EntityListState => {
  const { rows } = state.data;
  const prevPage = state.data.page;
  const { newPage } = action.payload;
  let pageBeforeAfter: [string?, string?];
  if (newPage > prevPage) {
    pageBeforeAfter = [undefined, rows[rows.length - 1].id];
  } else if (newPage < prevPage) {
    pageBeforeAfter = [rows[0].id, undefined];
  } else {
    pageBeforeAfter = state.config.pageBeforeAfter;
  }
  const page = Math.max(newPage, 0);
  return {
    ...state,
    config: {
      ...state.config,
      pageBeforeAfter,
    },
    data: {
      ...state.data,
      page,
    },
  };
};

export const entityListReducer: Reducer<EntityListState, EntityListAction> = (
  state = INITIAL_STATE,
  action,
) => {
  switch (action.type) {
    case ENTITYLIST_UPDATE_DATA:
      return applyUpdateData(state, action);
    case ENTITYLIST_UPDATE_CONFIG:
      return applyUpdateConfig(state, action);
    case ENTITYLIST_SET_PAGE:
      return applySetPage(state, action);
    default:
      return state;
  }
};
