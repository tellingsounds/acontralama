/**
 * Selector functions for "app" state.
 */
import { RootState } from '../types/root';
import { Segment } from '../types/clips';
import { AxiosError } from '../services/api';

export const getIsModalOpen = (state: RootState): boolean =>
  state.appState.isModalOpen;

export const getIsSidePanelOpen = (state: RootState): boolean =>
  state.appState.isSidePanelOpen;

export const getClipAccordionsState = (state: RootState) =>
  state.appState.clipAccordions;

export const getIsEditingLeft = (state: RootState) =>
  state.appState.editingLeft.category !== null;

export const getEditingLeftState = (state: RootState) =>
  state.appState.editingLeft;

export const getIsEditingRight = (state: RootState) =>
  state.sidePanelState.inspector.isEditingConnection ||
  state.sidePanelState.inspector.isEditingEntity ||
  state.sidePanelState.inspector.isEditingSegment;

export const getActiveSegment = (state: RootState): Segment | undefined => {
  const activeSegmentMaybe =
    state.clipState.clipSegments[state.appState.activeSegment];
  if (activeSegmentMaybe !== undefined) {
    return activeSegmentMaybe as Segment;
  }
  return undefined;
};

export const getLoadingState = (state: RootState): boolean =>
  state.appState.isLoading;

export const getSavingState = (state: RootState): boolean =>
  state.appState.isSaving;

export const getErrorState = (state: RootState): AxiosError | undefined =>
  state.appState.error;

export const getUsername = (state: RootState): string | null =>
  state.appState.userInfo.username;

export const shouldLockFormOnTheLeft = (state: RootState): boolean =>
  state.sidePanelState.inspector.isEditingEntity ||
  state.sidePanelState.inspector.isEditingConnection ||
  state.sidePanelState.inspector.isEditingSegment;

export const shouldLockConnectionForm = (state: RootState): boolean =>
  state.sidePanelState.inspector.isEditingEntity;

export const getAnnouncementMessage = (state: RootState): string =>
  state.appState.announcementMessage;

export const hasActiveClip = (state: RootState): boolean =>
  state.clipState.currentClip !== null;

export const getReadOnly = (state: RootState): boolean =>
  state.appState.userInfo.privileges === 'r';

export const getIsAdmin = (state: RootState): boolean =>
  state.appState.userInfo.privileges === 'a';

export const getDidInitialize = (state: RootState): boolean =>
  state.appState.didInitialize;

export const getAuthStatus = (state: RootState): boolean =>
  state.appState.isAuthenticated;
