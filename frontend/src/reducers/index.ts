import { combineReducers } from 'redux';

import { appReducer } from './app';
import { clipReducer } from './clips';
import { clipListReducer } from './clipList';
import { entityReducer } from './entities';
import { entityListReducer } from './entityList';
import { queryReducer } from './query';
import { sidePanelReducer } from './sidePanel';
import { APP_LOGGED_OUT } from '../constants/actionTypes';

const innerRootReducer = combineReducers({
  appState: appReducer,
  clipState: clipReducer,
  clipListState: clipListReducer,
  entityState: entityReducer,
  entityListState: entityListReducer,
  queryState: queryReducer,
  sidePanelState: sidePanelReducer,
});

export const rootReducer: typeof innerRootReducer = (state, action) => {
  if (action.type === APP_LOGGED_OUT) {
    return innerRootReducer(undefined, action);
  }
  return innerRootReducer(state, action);
};
