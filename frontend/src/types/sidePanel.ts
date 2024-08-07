/**
 * Typing information for "sidePanel".
 */
import {
  SIDEPANEL_ANNOTATION_SAVED,
  SIDEPANEL_CLEAR_ANNOT_INSPECTOR,
  SIDEPANEL_CLEAR_ENTITY_INSPECTOR,
  SIDEPANEL_CREATE_CONNECTION,
  SIDEPANEL_CREATE_ENTITY,
  SIDEPANEL_EDIT_CONNECTION,
  SIDEPANEL_EDIT_ENTITY,
  SIDEPANEL_SHOW_CONNECTION,
  SIDEPANEL_SHOW_CLIP,
  SIDEPANEL_SHOW_ENTITY,
  SIDEPANEL_STOP_EDITING_CONNECTION,
  SIDEPANEL_STOP_EDITING_ENTITY,
  SIDEPANEL_TOGGLE_ACCORDION,
  SIDEPANEL_TOGGLE_EDITING_SEGMENT,
  SIDEPANEL_SHOW_SHELFMARKS,
} from '../constants/actionTypes';
import { PassValue } from '../types';
import { Annotation } from '../types/clips';
import { EntityType } from '../types/entities';
import { Relation } from '../types/relations';

export interface EntityFormInfoState {
  inputValue: string;
  refId: string;
  supportedTypes: EntityType[];
}

export interface ConnectionFormInfoState {
  elementId?: string;
  layerId?: string;
  segmentId?: string;
  relation: Relation | '';
}

export interface InspectorState {
  isEditingConnection: boolean;
  isEditingEntity: boolean;
  isEditingSegment: boolean;
  connectionForm: ConnectionFormInfoState;
  currentAnnotation: Annotation | null;
  currentAnnotationEdit: Annotation | null;
  entityForm: EntityFormInfoState;
  entityId: string;
  clipId: string | null;
}

export interface SidePanelAccordionState {
  annotationsList: boolean;
  shelfmarkList: boolean;
  segmentAnnotationsList: boolean;
  clipInspector: boolean;
  connectionFormInspector: boolean;
  connectionViewInspector: boolean;
  entityInspector: boolean;
  entityQb: boolean;
  entityQbTemplates: boolean;
}

export type SidePanelAccordionIds = keyof SidePanelAccordionState;

export interface SidePanelState {
  accordions: SidePanelAccordionState;
  inspector: InspectorState;
}

export interface SidePanelCreateEntityAction {
  type: typeof SIDEPANEL_CREATE_ENTITY;
  payload: EntityFormInfoState & { updateSelection: PassValue };
}

interface EntityIdAction {
  payload: {
    entityId: string;
  };
}

export interface SidePanelEditEntityAction extends EntityIdAction {
  type: typeof SIDEPANEL_EDIT_ENTITY;
}

export interface SidePanelShowEntityAction extends EntityIdAction {
  type: typeof SIDEPANEL_SHOW_ENTITY;
}

export interface SidePanelShowShelfmarksAction {
  type: typeof SIDEPANEL_SHOW_SHELFMARKS;
}

export interface SidePanelStopEditingAction {
  type:
    | typeof SIDEPANEL_STOP_EDITING_ENTITY
    | typeof SIDEPANEL_STOP_EDITING_CONNECTION;
}

export interface SidePanelToggleAccordionAction {
  type: typeof SIDEPANEL_TOGGLE_ACCORDION;
  payload: {
    accordionId: SidePanelAccordionIds;
  };
}

export interface SidePanelCreateConnectionAction {
  type: typeof SIDEPANEL_CREATE_CONNECTION;
  payload: ConnectionFormInfoState;
}

export interface SidePanelEditConnectionAction {
  type: typeof SIDEPANEL_EDIT_CONNECTION;
}

export interface SidePanelAnnotationSavedAction {
  type: typeof SIDEPANEL_ANNOTATION_SAVED;
  payload: {
    annotation: Annotation;
  };
}

export interface SidePanelShowConnectionAction {
  type: typeof SIDEPANEL_SHOW_CONNECTION;
  payload: {
    annotation: Annotation;
  };
}

export interface SidePanelClearAnnotationInspectorAction {
  type: typeof SIDEPANEL_CLEAR_ANNOT_INSPECTOR;
}

export interface SidePanelClearEntityInspectorAction {
  type: typeof SIDEPANEL_CLEAR_ENTITY_INSPECTOR;
}

export interface SidePanelToggleEditingSegmentAction {
  type: typeof SIDEPANEL_TOGGLE_EDITING_SEGMENT;
  payload: { isEditingSegment: boolean };
}

export interface SidePanelShowClipAction {
  type: typeof SIDEPANEL_SHOW_CLIP;
  payload: { clipId: string };
}

export type SidePanelAction =
  | SidePanelAnnotationSavedAction
  | SidePanelClearAnnotationInspectorAction
  | SidePanelClearEntityInspectorAction
  | SidePanelCreateConnectionAction
  | SidePanelCreateEntityAction
  | SidePanelEditConnectionAction
  | SidePanelEditEntityAction
  | SidePanelShowConnectionAction
  | SidePanelShowClipAction
  | SidePanelShowEntityAction
  | SidePanelStopEditingAction
  | SidePanelToggleAccordionAction
  | SidePanelToggleEditingSegmentAction;
