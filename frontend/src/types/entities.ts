/**
 * Typing information for "entities".
 */
import {
  ENTITIES_ADD,
  ENTITIES_ADD_MANY,
  ENTITIES_CLEAR,
  ENTITIES_SET,
} from '../constants/actionTypes';
import { EntityType as GEntityType } from '../generated/entityTypes';
import { MetaMeta } from './clips';

export type EntityType = GEntityType;

export interface Entity extends MetaMeta {
  _id: string;
  type: EntityType;
  label: string;
  description: string;
  authorityURIs: string[];
  additionalTags: string[];
  // experimental query beta test phase alert
  analysisCategories?: string[];
  attributes?: {
    composer?: string[];
    lyricist?: string[];
    dateOfCreation?: string;
    associatedWith?: string[];
  };
}

export interface EntityResp extends Entity {
  created: string;
  createdBy: string;
  usageCount?: number;
}

export type EntityRelationsData = {
  broader: string[];
  broaderTransitive: string[];
  narrower: string[];
  narrowerTransitive: string[];
  related: string[];
};

export interface EntityState {
  entities: Record<string, Entity>;
}

export interface AddEntityAction {
  type: typeof ENTITIES_ADD;
  payload: {
    entity: Entity;
  };
}

export interface AddEntitiesAction {
  type: typeof ENTITIES_ADD_MANY;
  payload: {
    entities: Entity[];
  };
}
export interface SetEntitiesAction {
  type: typeof ENTITIES_SET;
  payload: {
    entities: Entity[];
  };
}

export interface ClearEntitiesAction {
  type: typeof ENTITIES_CLEAR;
}

export type EntityAction =
  | AddEntityAction
  | AddEntitiesAction
  | ClearEntitiesAction
  | SetEntitiesAction;
