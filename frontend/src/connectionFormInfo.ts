/**
 * Re-exporting relation data generated from "truth".
 */
import * as G from './generated/relations';
import { EntityType } from './types/entities';
import {
  AnnotationField,
  ClipElement,
  Relation,
  NestedGroupLabels,
  NestedElements,
} from './types/relations';

export const supportedRelations = G.supportedRelations as Record<
  ClipElement,
  Relation[]
>;

type CRI = {
  label: string;
  definition: string;
  multi: boolean;
  types: EntityType[];
  roles: EntityType[];
  allowed: AnnotationField[];
  required: AnnotationField[];
  interpretAbsent: boolean; // show the menu for interpretative or notably absent for a entitytype
  canCreateNew: boolean; // can create new entitytype
};

export const connectionRelationInfo = G.connectionRelationInfo as Record<
  Relation,
  CRI
>;

export const NestedGroupElements = G.supportedRelations as Record<
  NestedElements,
  NestedGroupLabels[]
>;

type NEL = {
  label: string;
  definition: string;
  relations: Relation[];
};

export const connectionNestedElementInfo = G.nestedElementsLabels as Record<
  NestedGroupLabels,
  NEL
>;

export const getConnectionTypeLabel = (t: Relation): string =>
  connectionRelationInfo[t].label;

export const getConnectionTypeDefinition = (t: Relation): string =>
  connectionRelationInfo[t].definition;

export const getNestedElementLabel = (t: NestedGroupLabels): string =>
  connectionNestedElementInfo[t].label;

export const getNestedElementDefinition = (t: NestedGroupLabels): string =>
  connectionNestedElementInfo[t].definition;

export const getNestedElementRelations = (t: NestedGroupLabels): Relation[] =>
  connectionNestedElementInfo[t].relations;
