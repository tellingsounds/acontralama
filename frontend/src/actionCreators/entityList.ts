/**
 * Redux action creator functions for "entityList" actions.
 */
import {
  ENTITYLIST_SET_PAGE,
  ENTITYLIST_UPDATE_CONFIG,
  ENTITYLIST_UPDATE_DATA,
} from '../constants/actionTypes';
import { EntitiesResponse } from '../services/api';
import {
  EntityListConfigState,
  EntityListSetPageAction,
  EntityListUpdateConfigAction,
  EntityListUpdateDataAction,
} from '../types/entityList';

export const doSetEntityListPage = (
  newPage: number,
): EntityListSetPageAction => ({
  type: ENTITYLIST_SET_PAGE,
  payload: { newPage },
});

export const doUpdateEntityListConfig = (
  updatedConfig: Partial<EntityListConfigState>,
): EntityListUpdateConfigAction => ({
  type: ENTITYLIST_UPDATE_CONFIG,
  payload: { updatedConfig },
});

export const doUpdateEntityListData = (
  data: EntitiesResponse,
): EntityListUpdateDataAction => ({
  type: ENTITYLIST_UPDATE_DATA,
  payload: { data },
});
