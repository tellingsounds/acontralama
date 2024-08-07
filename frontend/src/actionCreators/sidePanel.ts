/**
 * Redux action creator functions for "sidePanel" actions.
 */
import { v4 as uuid4 } from 'uuid';
import {
  SIDEPANEL_ANNOTATION_SAVED,
  SIDEPANEL_CLEAR_ANNOT_INSPECTOR,
  SIDEPANEL_CLEAR_ENTITY_INSPECTOR,
  SIDEPANEL_CREATE_CONNECTION,
  SIDEPANEL_CREATE_ENTITY,
  SIDEPANEL_EDIT_CONNECTION,
  SIDEPANEL_EDIT_ENTITY,
  SIDEPANEL_SHOW_CLIP,
  SIDEPANEL_SHOW_CONNECTION,
  SIDEPANEL_SHOW_ENTITY,
  SIDEPANEL_SHOW_SHELFMARKS,
  SIDEPANEL_STOP_EDITING_CONNECTION,
  SIDEPANEL_STOP_EDITING_ENTITY,
  SIDEPANEL_TOGGLE_ACCORDION,
  SIDEPANEL_TOGGLE_EDITING_SEGMENT,
} from '../constants/actionTypes';
import {
  SidePanelAccordionIds,
  SidePanelAnnotationSavedAction,
  SidePanelClearAnnotationInspectorAction,
  SidePanelClearEntityInspectorAction,
  SidePanelCreateConnectionAction,
  SidePanelCreateEntityAction,
  SidePanelEditConnectionAction,
  SidePanelEditEntityAction,
  SidePanelShowClipAction,
  SidePanelShowConnectionAction,
  SidePanelShowEntityAction,
  SidePanelShowShelfmarksAction,
  SidePanelStopEditingAction,
  SidePanelToggleAccordionAction,
  SidePanelToggleEditingSegmentAction,
} from '../types/sidePanel';
import { PassValue } from '../types';
import { Annotation } from '../types/clips';
import { EntityType } from '../types/entities';
import { Relation } from '../types/relations';

export const doCreateEntity = (
  inputValue: string,
  supportedTypes: EntityType[],
  updateSelection: PassValue,
): SidePanelCreateEntityAction => ({
  type: SIDEPANEL_CREATE_ENTITY,
  payload: {
    inputValue,
    refId: uuid4(),
    supportedTypes,
    updateSelection,
  },
});

export const doEditEntity = (entityId: string): SidePanelEditEntityAction => ({
  type: SIDEPANEL_EDIT_ENTITY,
  payload: {
    entityId,
  },
});

export const doShowEntity = (entityId: string): SidePanelShowEntityAction => ({
  type: SIDEPANEL_SHOW_ENTITY,
  payload: {
    entityId,
  },
});

export const doShowShelfmarks = (): SidePanelShowShelfmarksAction => ({
  type: SIDEPANEL_SHOW_SHELFMARKS,
});

export const doStopEditingEntity = (): SidePanelStopEditingAction => ({
  type: SIDEPANEL_STOP_EDITING_ENTITY,
});

export const doStopEditingConnection = (): SidePanelStopEditingAction => ({
  type: SIDEPANEL_STOP_EDITING_CONNECTION,
});

export const doToggleAccordion = (
  accordionId: SidePanelAccordionIds,
): SidePanelToggleAccordionAction => ({
  type: SIDEPANEL_TOGGLE_ACCORDION,
  payload: {
    accordionId,
  },
});

export const doCreateConnection = (
  relation: Relation,
  elementId = '',
): SidePanelCreateConnectionAction => ({
  type: SIDEPANEL_CREATE_CONNECTION,
  payload: {
    elementId,
    relation,
  },
});

export const doCreateConnectionSegment = (
  relation: Relation,
  segmentId = '',
): SidePanelCreateConnectionAction => ({
  type: SIDEPANEL_CREATE_CONNECTION,
  payload: {
    segmentId,
    relation,
  },
});

export const doCreateConnectionLayer = (
  relation: Relation,
  elementId = '',
  layerId = '',
): SidePanelCreateConnectionAction => ({
  type: SIDEPANEL_CREATE_CONNECTION,
  payload: {
    elementId,
    layerId,
    relation,
  },
});

export const doEditConnection = (): SidePanelEditConnectionAction => ({
  type: SIDEPANEL_EDIT_CONNECTION,
});

export const doAnnotationSaved = (
  annotation: Annotation,
): SidePanelAnnotationSavedAction => ({
  type: SIDEPANEL_ANNOTATION_SAVED,
  payload: { annotation },
});

export const doShowConnection = (
  annotation: Annotation,
): SidePanelShowConnectionAction => ({
  type: SIDEPANEL_SHOW_CONNECTION,
  payload: { annotation },
});

export const doClearAnnotationInspector =
  (): SidePanelClearAnnotationInspectorAction => ({
    type: SIDEPANEL_CLEAR_ANNOT_INSPECTOR,
  });

export const doClearEntityInspector =
  (): SidePanelClearEntityInspectorAction => ({
    type: SIDEPANEL_CLEAR_ENTITY_INSPECTOR,
  });

export const doToggleEditingSegment = (
  isEditingSegment: boolean,
): SidePanelToggleEditingSegmentAction => ({
  type: SIDEPANEL_TOGGLE_EDITING_SEGMENT,
  payload: { isEditingSegment },
});

export const doShowClipDetails = (clipId: string): SidePanelShowClipAction => ({
  type: SIDEPANEL_SHOW_CLIP,
  payload: { clipId },
});
