import { Reducer } from 'redux';

import { GridSortModel } from '@material-ui/data-grid';

import {
  CLIPLIST_REFLECT_FAVORITE,
  CLIPLIST_SET_PAGE,
  CLIPLIST_UPDATE_CONFIG,
  CLIPLIST_UPDATE_DATA,
} from '../constants/actionTypes';

import { getFromLocalStorageMaybe } from '../services/localStorage';

import { allowedSortFields } from '../generated/clipList';
import {
  ClipListAction,
  ClipListState,
  ClipListReflectFavoriteAction,
  ClipListSetPageAction,
  ClipListUpdateConfigAction,
  ClipListUpdateDataAction,
} from '../types/clipList';

const L_PAGE_SIZE = 'lama.ClipList.pageSize';
const L_SORT_MODEL = 'lama.ClipList.sortModel';

const INITIAL_STATE: ClipListState = {
  config: {
    dateSearch: '',
    entityIds: [],
    favoritesOnly: false,
    filterUser: '',
    matchAll: false,
    matchNot: false,
    myClipsOnly: false,
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
  state: ClipListState,
  action: ClipListUpdateConfigAction,
): ClipListState => ({
  ...state,
  config: {
    ...state.config,
    ...action.payload.updatedConfig,
  },
});

const applyUpdateData = (
  state: ClipListState,
  action: ClipListUpdateDataAction,
): ClipListState => {
  const { data } = action.payload;
  const newRows = data.clips.map(clip => ({
    id: clip._id,
    labelTitle: clip.labelTitle,
    platform: clip.platform,
    fileType: clip.fileType,
    createdBy: clip.createdBy,
    duration: clip.duration,
    created: clip.created,
    updatedAny: clip.updatedAny,
    updatedAnyBy: clip.updatedAnyBy,
    annotationCount: clip.annotationCount,
    isFavorite: clip.isFavorite,
    associatedDate: clip.associatedDate,
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
  state: ClipListState,
  action: ClipListSetPageAction,
): ClipListState => {
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

const applyReflectFavorite = (
  state: ClipListState,
  action: ClipListReflectFavoriteAction,
): ClipListState => {
  const { clipId, isFavorite } = action.payload;
  return {
    ...state,
    data: {
      ...state.data,
      rows: state.data.rows
        .filter(r =>
          state.config.favoritesOnly && r.id === clipId ? isFavorite : true,
        )
        .map(r => (r.id === clipId ? { ...r, isFavorite } : r)),
    },
  };
};

export const clipListReducer: Reducer<ClipListState, ClipListAction> = (
  state = INITIAL_STATE,
  action,
) => {
  switch (action.type) {
    case CLIPLIST_REFLECT_FAVORITE:
      return applyReflectFavorite(state, action);
    case CLIPLIST_UPDATE_DATA:
      return applyUpdateData(state, action);
    case CLIPLIST_UPDATE_CONFIG:
      return applyUpdateConfig(state, action);
    case CLIPLIST_SET_PAGE:
      return applySetPage(state, action);
    default:
      return state;
  }
};
