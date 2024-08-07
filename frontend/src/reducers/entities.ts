import { Reducer } from 'redux';
import {
  ENTITIES_ADD,
  ENTITIES_ADD_MANY,
  ENTITIES_CLEAR,
  ENTITIES_SET,
  SAGA_ENTITY_SAVED,
} from '../constants/actionTypes';
import {
  Entity,
  EntityAction,
  AddEntityAction,
  AddEntitiesAction,
  ClearEntitiesAction,
  SetEntitiesAction,
  EntityState,
} from '../types/entities';
import { SagaEntitySavedAction } from '../types/sagaActions';

const INITIAL_STATE: EntityState = {
  entities: {},
};

const applyAdd = (
  state: EntityState,
  action: AddEntityAction | SagaEntitySavedAction,
): EntityState => {
  const { entity } = action.payload;
  return {
    ...state,
    entities: {
      ...state.entities,
      [entity._id]: entity,
    },
  };
};

const mapped = (items: Entity[]) =>
  items.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {});

const applyAddMany = (
  state: EntityState,
  action: AddEntitiesAction,
): EntityState => {
  const { entities } = action.payload;
  return {
    ...state,
    entities: {
      ...state.entities,
      ...mapped(entities),
    },
  };
};

const applySet = (
  state: EntityState,
  action: SetEntitiesAction,
): EntityState => {
  const { entities } = action.payload;
  return {
    ...state,
    entities: {
      ...INITIAL_STATE.entities,
      ...mapped(entities),
    },
  };
};

const applyClear = (
  state: EntityState,
  _action: ClearEntitiesAction,
): EntityState => {
  return {
    ...state,
    entities: {
      ...INITIAL_STATE.entities,
    },
  };
};

export const entityReducer: Reducer<
  EntityState,
  EntityAction | SagaEntitySavedAction
> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ENTITIES_ADD:
      return applyAdd(state, action);
    case SAGA_ENTITY_SAVED:
      return applyAdd(state, action);
    case ENTITIES_ADD_MANY:
      return applyAddMany(state, action);
    case ENTITIES_CLEAR:
      return applyClear(state, action);
    case ENTITIES_SET:
      return applySet(state, action);
    default:
      return state;
  }
};
