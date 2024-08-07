/**
 * Selector functions for "entities" state.
 */
import { Entity } from '../types/entities';
import { RootState } from '../types/root';

export const getEntityById =
  (state: RootState) =>
  (entityId: string): Entity | undefined =>
    state.entityState.entities[entityId];
