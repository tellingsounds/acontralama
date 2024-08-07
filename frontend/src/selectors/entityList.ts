/**
 * Selector functions for "entityList" state.
 */
import { RootState } from '../types/root';
import { EntityListState } from '../types/entityList';

export const getEntityListState = (state: RootState): EntityListState =>
  state.entityListState;
