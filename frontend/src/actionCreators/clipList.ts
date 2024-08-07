/**
 * Redux action creator functions for "clipList" actions.
 */
import {
  CLIPLIST_REFLECT_FAVORITE,
  CLIPLIST_SET_PAGE,
  CLIPLIST_UPDATE_CONFIG,
  CLIPLIST_UPDATE_DATA,
} from '../constants/actionTypes';
import { ClipsResponse } from '../services/api';
import {
  ClipListConfigState,
  ClipListReflectFavoriteAction,
  ClipListSetPageAction,
  ClipListUpdateConfigAction,
  ClipListUpdateDataAction,
} from '../types/clipList';

export const doSetClipListPage = (newPage: number): ClipListSetPageAction => ({
  type: CLIPLIST_SET_PAGE,
  payload: { newPage },
});

export const doUpdateClipListConfig = (
  updatedConfig: Partial<ClipListConfigState>,
): ClipListUpdateConfigAction => ({
  type: CLIPLIST_UPDATE_CONFIG,
  payload: { updatedConfig },
});

export const doUpdateClipListData = (
  data: ClipsResponse,
): ClipListUpdateDataAction => ({
  type: CLIPLIST_UPDATE_DATA,
  payload: { data },
});

export const doReflectFavorite = (
  clipId: string,
  isFavorite: boolean,
): ClipListReflectFavoriteAction => ({
  type: CLIPLIST_REFLECT_FAVORITE,
  payload: { clipId, isFavorite },
});
