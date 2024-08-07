/**
 * Selector functions for "sidePanel" state.
 */
import { RootState } from '../types/root';
import { InspectorState, SidePanelAccordionState } from '../types/sidePanel';

export const getInspectorState = (state: RootState): InspectorState =>
  state.sidePanelState.inspector;

export const getSidePanelAccordionState = (
  state: RootState,
): SidePanelAccordionState => state.sidePanelState.accordions;
