/**
 * Redux entry point.
 */
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from '../reducers';
import rootSaga from '../sagas';

const middleware =
  process.env.NODE_ENV === 'development' ? [createLogger()] : [];
const composeEnhancers = composeWithDevTools({
  features: {
    pause: true, // start/pause recording of dispatched actions
    lock: true, // lock/unlock dispatching actions and side effects
    persist: false, // persist states on page reloading (TURNED OFF)
    export: true, // export history of actions in a file
    import: 'custom', // import history of actions from a file
    jump: true, // jump back and forth (time travelling)
    skip: true, // skip (cancel) actions
    reorder: true, // drag and drop actions in the history list
    dispatch: true, // dispatch custom actions or action creators
    test: true, // generate tests for the selected actions
  },
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  // getPersistedState() || undefined,
  undefined,
  composeEnhancers(applyMiddleware(...middleware, sagaMiddleware)),
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('../reducers/index', () =>
    store.replaceReducer(rootReducer),
  );
}

sagaMiddleware.run(rootSaga);
