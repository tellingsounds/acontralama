/**
 * Redux action creator functions for "entities" actions.
 */
import {
  ENTITIES_ADD,
  ENTITIES_ADD_MANY,
  ENTITIES_CLEAR,
  ENTITIES_SET,
} from '../constants/actionTypes';
import {
  Entity,
  AddEntityAction,
  AddEntitiesAction,
  ClearEntitiesAction,
  SetEntitiesAction,
} from '../types/entities';

export const doAddEntity = (entity: Entity): AddEntityAction => ({
  type: ENTITIES_ADD,
  payload: { entity },
});

export const doAddEntities = (entities: Entity[]): AddEntitiesAction => ({
  type: ENTITIES_ADD_MANY,
  payload: { entities },
});

export const doSetEntities = (entities: Entity[]): SetEntitiesAction => ({
  type: ENTITIES_SET,
  payload: { entities },
});

export const doClearEntities = (): ClearEntitiesAction => ({
  type: ENTITIES_CLEAR,
});
