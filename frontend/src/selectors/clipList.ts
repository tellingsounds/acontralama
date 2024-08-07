/**
 * Selector functions for "clipList" state.
 */
import { RootState } from '../types/root';
import { ClipListState } from '../types/clipList';

export const getClipListState = (state: RootState): ClipListState =>
  state.clipListState;
