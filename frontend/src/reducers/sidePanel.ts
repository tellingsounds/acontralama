import { Reducer } from 'redux';
import {
  APP_ACTIVATE_SEGMENT,
  APP_DEACTIVATE_SEGMENT,
  CLIPS_UNSET_CURRENT,
  SAGA_ENTITY_SAVED,
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
  SIDEPANEL_STOP_EDITING_CONNECTION,
  SIDEPANEL_STOP_EDITING_ENTITY,
  SIDEPANEL_TOGGLE_ACCORDION,
  SIDEPANEL_TOGGLE_EDITING_SEGMENT,
} from '../constants/actionTypes';
import {
  AppActivateSegmentAction,
  AppDeactivateSegmentAction,
} from '../types/app';
import { ClipsUnsetCurrentAction } from '../types/clips';
import {
  ConnectionFormInfoState,
  EntityFormInfoState,
  SidePanelAction,
  SidePanelAnnotationSavedAction,
  SidePanelClearAnnotationInspectorAction,
  SidePanelClearEntityInspectorAction,
  SidePanelCreateConnectionAction,
  SidePanelCreateEntityAction,
  SidePanelEditConnectionAction,
  SidePanelEditEntityAction,
  SidePanelShowConnectionAction,
  SidePanelShowClipAction,
  SidePanelShowEntityAction,
  SidePanelStopEditingAction,
  SidePanelToggleAccordionAction,
  SidePanelToggleEditingSegmentAction,
  SidePanelState,
} from '../types/sidePanel';
import { SagaEntitySavedAction } from '../types/sagaActions';

const INITIAL_CONNECTION_FORM_STATE: ConnectionFormInfoState = {
  elementId: '',
  relation: '',
  layerId: '',
};

const INITIAL_ENTITY_FORM_STATE: EntityFormInfoState = {
  inputValue: '',
  refId: '',
  supportedTypes: [],
};

const INITIAL_STATE: SidePanelState = {
  accordions: {
    annotationsList: false,
    shelfmarkList: false,
    segmentAnnotationsList: false,
    clipInspector: false,
    connectionFormInspector: false,
    connectionViewInspector: false,
    entityInspector: false,
    entityQb: true,
    entityQbTemplates: true,
  },
  inspector: {
    isEditingConnection: false,
    isEditingEntity: false,
    isEditingSegment: false,
    connectionForm: INITIAL_CONNECTION_FORM_STATE,
    currentAnnotation: null,
    currentAnnotationEdit: null,
    entityForm: INITIAL_ENTITY_FORM_STATE,
    entityId: '',
    clipId: null,
  },
};

const applyCreateConnection = (
  state: SidePanelState,
  action: SidePanelCreateConnectionAction,
): SidePanelState => ({
  ...state,
  accordions: {
    ...state.accordions,
    annotationsList: false,
    connectionFormInspector: true,
  },
  inspector: {
    ...state.inspector,
    connectionForm: action.payload,
    currentAnnotationEdit: null,
    isEditingConnection: true,
  },
});

const applyCreateEntity = (
  state: SidePanelState,
  action: SidePanelCreateEntityAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    entityInspector: true,
  },
  inspector: {
    ...state.inspector,
    entityForm: action.payload,
    entityId: '',
    isEditingEntity: true,
  },
});

const applyEditEntity = (
  state: SidePanelState,
  action: SidePanelEditEntityAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    entityInspector: true,
  },
  inspector: {
    ...state.inspector,
    entityId: action.payload.entityId,
    isEditingEntity: true,
  },
});

const applyShowEntity = (
  state: SidePanelState,
  action: SidePanelShowEntityAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    entityInspector: true,
  },
  inspector: {
    ...state.inspector,
    entityId: action.payload.entityId,
  },
});

const applyShowConnection = (
  state: SidePanelState,
  action: SidePanelShowConnectionAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    connectionViewInspector: true,
  },
  inspector: {
    ...state.inspector,
    currentAnnotation: action.payload.annotation,
  },
});

const applyStopEditingEntity = (
  state: SidePanelState,
  _action: SidePanelStopEditingAction,
) => ({
  ...state,
  inspector: {
    ...state.inspector,
    entityForm: INITIAL_ENTITY_FORM_STATE,
    isEditingEntity: false,
  },
});

const applyStopEditingConnection = (
  state: SidePanelState,
  _action: SidePanelStopEditingAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    connectionFormInspector: false,
  },
  inspector: {
    ...state.inspector,
    connectionForm: INITIAL_CONNECTION_FORM_STATE,
    currentAnnotationEdit: null,
    isEditingConnection: false,
  },
});

const applyToggleAccordion = (
  state: SidePanelState,
  action: SidePanelToggleAccordionAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    [action.payload.accordionId]: !state.accordions[action.payload.accordionId],
  },
});

const applyEntitySaved = (
  state: SidePanelState,
  action: SagaEntitySavedAction,
) => ({
  ...state,
  inspector: {
    ...state.inspector,
    entityForm: INITIAL_ENTITY_FORM_STATE,
    entityId: action.payload.entity._id,
    isEditingEntity: false,
  },
});

const applyEditConnection = (
  state: SidePanelState,
  _action: SidePanelEditConnectionAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    annotationsList: false,
    connectionFormInspector: true,
  },
  inspector: {
    ...state.inspector,
    currentAnnotationEdit: state.inspector.currentAnnotation,
    isEditingConnection: true,
  },
});

const applyAnnotationSaved = (
  state: SidePanelState,
  action: SidePanelAnnotationSavedAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    connectionFormInspector: false,
    connectionViewInspector: true,
  },
  inspector: {
    ...state.inspector,
    currentAnnotation: action.payload.annotation,
    currentAnnotationEdit: null,
    isEditingConnection: false,
  },
});

const applyUnsetCurrentClip = (
  state: SidePanelState,
  _action: ClipsUnsetCurrentAction,
) => ({
  ...INITIAL_STATE,
  inspector: {
    ...INITIAL_STATE.inspector,
    clipId: state.inspector.clipId,
  },
});

const applyClearAnnotationInspector = (
  state: SidePanelState,
  _action: SidePanelClearAnnotationInspectorAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    connectionFormInspector: false,
  },
  inspector: {
    ...state.inspector,
    currentAnnotation: null,
    currentAnnotationEdit: null,
    isEditingConnection: false,
  },
});

const applyClearEntityInspector = (
  state: SidePanelState,
  _action: SidePanelClearEntityInspectorAction,
): SidePanelState => ({
  ...state,
  accordions: {
    ...state.accordions,
    entityInspector: false,
  },
  inspector: {
    ...state.inspector,
    entityId: '',
    isEditingEntity: false,
  },
});

const applyToggleEditingSegment = (
  state: SidePanelState,
  action: SidePanelToggleEditingSegmentAction,
): SidePanelState => {
  const { isEditingSegment } = action.payload;
  return {
    ...state,
    accordions: {
      ...state.accordions,
      segmentAnnotationsList: isEditingSegment
        ? true
        : state.accordions.segmentAnnotationsList,
    },
    inspector: {
      ...state.inspector,
      isEditingSegment,
    },
  };
};

const applyActivateSegment = (
  state: SidePanelState,
  _action: AppActivateSegmentAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    segmentAnnotationsList: true,
  },
});

const applyDeactivateSegment = (
  state: SidePanelState,
  _action: AppDeactivateSegmentAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    segmentAnnotationsList: false,
  },
  inspector: {
    ...state.inspector,
    isEditingSegment: false,
  },
});

const applyShowClip = (
  state: SidePanelState,
  action: SidePanelShowClipAction,
) => ({
  ...state,
  accordions: {
    ...state.accordions,
    clipInspector: true,
  },
  inspector: {
    ...state.inspector,
    clipId: action.payload.clipId,
  },
});

export const sidePanelReducer: Reducer<
  SidePanelState,
  | SidePanelAction
  | SagaEntitySavedAction
  | ClipsUnsetCurrentAction
  | AppActivateSegmentAction
  | AppDeactivateSegmentAction
> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case APP_ACTIVATE_SEGMENT:
      return applyActivateSegment(state, action);
    case APP_DEACTIVATE_SEGMENT:
      return applyDeactivateSegment(state, action);
    case CLIPS_UNSET_CURRENT:
      return applyUnsetCurrentClip(state, action);
    case SAGA_ENTITY_SAVED:
      return applyEntitySaved(state, action);
    case SIDEPANEL_ANNOTATION_SAVED:
      return applyAnnotationSaved(state, action);
    case SIDEPANEL_CLEAR_ANNOT_INSPECTOR:
      return applyClearAnnotationInspector(state, action);
    case SIDEPANEL_CLEAR_ENTITY_INSPECTOR:
      return applyClearEntityInspector(state, action);
    case SIDEPANEL_CREATE_CONNECTION:
      return applyCreateConnection(state, action);
    case SIDEPANEL_CREATE_ENTITY:
      return applyCreateEntity(state, action);
    case SIDEPANEL_EDIT_CONNECTION:
      return applyEditConnection(state, action);
    case SIDEPANEL_EDIT_ENTITY:
      return applyEditEntity(state, action);
    case SIDEPANEL_SHOW_CLIP:
      return applyShowClip(state, action);
    case SIDEPANEL_SHOW_CONNECTION:
      return applyShowConnection(state, action);
    case SIDEPANEL_SHOW_ENTITY:
      return applyShowEntity(state, action);
    case SIDEPANEL_STOP_EDITING_CONNECTION:
      return applyStopEditingConnection(state, action);
    case SIDEPANEL_STOP_EDITING_ENTITY:
      return applyStopEditingEntity(state, action);
    case SIDEPANEL_TOGGLE_ACCORDION:
      return applyToggleAccordion(state, action);
    case SIDEPANEL_TOGGLE_EDITING_SEGMENT:
      return applyToggleEditingSegment(state, action);
    default:
      return state;
  }
};
