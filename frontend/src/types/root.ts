/**
 * Redux RootState typing information.
 */
import { AppState } from './app';
import { ClipState } from './clips';
import { ClipListState } from './clipList';
import { EntityListState } from './entityList';
import { EntityState } from './entities';
import { QueryState } from './query';
import { SidePanelState } from './sidePanel';

export interface RootState {
  appState: AppState;
  clipState: ClipState;
  clipListState: ClipListState;
  entityListState: EntityListState;
  entityState: EntityState;
  queryState: QueryState;
  sidePanelState: SidePanelState;
}
