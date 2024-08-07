/**
 * Typing information for "ENTITYList".
 */
import { GridSortModel } from '@material-ui/data-grid';

import {
  ENTITYLIST_SET_PAGE,
  ENTITYLIST_UPDATE_CONFIG,
  ENTITYLIST_UPDATE_DATA,
} from '../constants/actionTypes';

import { EntityType } from '../types/entities';

import { EntitiesResponse } from '../services/api';

interface EntityListRow {
  id: string;
  label: string;
  type: EntityType;
  description: string;
  date: string | undefined;
  associated: string[] | undefined;
  // attributes: Record<string, unknown>;
  createdBy: string;
  updated: string | undefined;
  usageCount: number | undefined;
}

export interface EntityListConfigState {
  entityIds: string[];
  filterUser: string;
  matchAll: boolean;
  catFilters: string[];
  selectedTypes: EntityType[];
  pageBeforeAfter: [string?, string?];
  pageSize: number;
  searchText: string;
  sortModel: GridSortModel;
}

export interface EntityListDataState {
  firstLastIndex: [number, number];
  page: number;
  rows: EntityListRow[];
  totalCount: number;
}

export interface EntityListState {
  config: EntityListConfigState;
  data: EntityListDataState;
}

export interface EntityListSetPageAction {
  type: typeof ENTITYLIST_SET_PAGE;
  payload: { newPage: number };
}

export interface EntityListUpdateConfigAction {
  type: typeof ENTITYLIST_UPDATE_CONFIG;
  payload: { updatedConfig: Partial<EntityListConfigState> };
}

export interface EntityListUpdateDataAction {
  type: typeof ENTITYLIST_UPDATE_DATA;
  payload: { data: EntitiesResponse };
}

export type EntityListAction =
  | EntityListSetPageAction
  | EntityListUpdateConfigAction
  | EntityListUpdateDataAction;
