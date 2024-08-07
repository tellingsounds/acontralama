/**
 * Typing information for "clipList".
 */
import { GridSortModel } from '@material-ui/data-grid';

import {
  CLIPLIST_REFLECT_FAVORITE,
  CLIPLIST_SET_PAGE,
  CLIPLIST_UPDATE_CONFIG,
  CLIPLIST_UPDATE_DATA,
} from '../constants/actionTypes';

import { ClipsResponse } from '../services/api';

interface ClipListRow {
  id: string;
  labelTitle: string;
  platform: string;
  fileType: string;
  createdBy: string;
  duration: number;
  created: string;
  updatedAny: string;
  updatedAnyBy: string;
  annotationCount: number;
  isFavorite: boolean;
  associatedDate?: string;
}

export interface ClipListConfigState {
  entityIds: string[];
  favoritesOnly: boolean;
  filterUser: string;
  matchAll: boolean;
  matchNot: boolean;
  myClipsOnly: boolean;
  pageBeforeAfter: [string?, string?];
  pageSize: number;
  searchText: string;
  dateSearch: string;
  sortModel: GridSortModel;
}

export interface ClipListDataState {
  firstLastIndex: [number, number];
  page: number;
  rows: ClipListRow[];
  totalCount: number;
}

export interface ClipListState {
  config: ClipListConfigState;
  data: ClipListDataState;
}

export interface ClipListSetPageAction {
  type: typeof CLIPLIST_SET_PAGE;
  payload: { newPage: number };
}

export interface ClipListUpdateConfigAction {
  type: typeof CLIPLIST_UPDATE_CONFIG;
  payload: { updatedConfig: Partial<ClipListConfigState> };
}

export interface ClipListUpdateDataAction {
  type: typeof CLIPLIST_UPDATE_DATA;
  payload: { data: ClipsResponse };
}

export interface ClipListReflectFavoriteAction {
  type: typeof CLIPLIST_REFLECT_FAVORITE;
  payload: { clipId: string; isFavorite: boolean };
}

export type ClipListAction =
  | ClipListReflectFavoriteAction
  | ClipListSetPageAction
  | ClipListUpdateConfigAction
  | ClipListUpdateDataAction;
