/* eslint-disable no-console */
import { call, put, take, takeLatest } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
import { Action } from 'redux';

import { doAnnouncement, doFetchError } from '../actionCreators/app';
import { doClearEntities } from '../actionCreators/entities';
import {
  // doFetchCurrentClip,
  doFetchEntity,
  doWebsocketFailed,
} from '../actionCreators/sagaActions';

import {
  APP_SET_USER_INFO,
  SAGA_SUCCESSFUL_REQUEST,
  SAGA_WEBSOCKET_FAILED,
} from '../constants/actionTypes';
import { FetchErrorAction } from '../types/app';
import { ClearEntitiesAction } from '../types/entities';
import {
  SagaFetchEntityAction,
  SagaFetchCurrentClipAction,
  SagaWebsocketFailedAction,
} from '../types/sagaActions';

const WS_URL = process.env.WS_URL as string;

type AnnouncementMessage = {
  messageType: 'ANNOUNCEMENT';
  payload: { message: string };
};
type EntityUpdatedMessage = {
  messageType: 'ENTITY_UPDATED';
  payload: { entityId: string };
};
type PongMessage = { messageType: 'PONG' };
type Message = PongMessage | AnnouncementMessage | EntityUpdatedMessage;

type EmittedAction =
  | SagaFetchEntityAction
  | SagaFetchCurrentClipAction
  | ClearEntitiesAction
  | FetchErrorAction
  | SagaWebsocketFailedAction;

const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 10000;
const RECONNECT_WAIT = 5000;
const MAX_CONNECTION_ATTEMPTS = 3;

function* initWebsocket() {
  console.log('initializing websocket');
  return eventChannel(emitter => {
    let ws: WebSocket;
    let pingInterval: ReturnType<typeof setTimeout>;
    let pingTimer: ReturnType<typeof setTimeout>;
    let numReconnectAttempts = 0;
    let inReconnectAttempt = false;
    let inReanimationAttempt = false;
    function heartbeat() {
      ws.send(JSON.stringify({ messageType: 'PING' }));
      pingTimer = setTimeout(() => {
        console.log('connection lost');
        ws.close();
        reconnect();
      }, HEARTBEAT_TIMEOUT);
    }
    function freshHeartbeat() {
      clearTimeout(pingTimer); // connection is still alive
      clearInterval(pingInterval);
      pingInterval = setInterval(heartbeat, HEARTBEAT_INTERVAL);
    }
    function open(onOpen?: () => void) {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        console.log('connected');
        numReconnectAttempts = 0;
        inReanimationAttempt = false;
        ws.send(JSON.stringify({ messageType: 'HI' }));
        freshHeartbeat();
        if (onOpen) {
          onOpen();
        }
      };
      ws.onerror = _error => {
        reconnect();
      };
      ws.onmessage = messageEvent => {
        let msg: Message | null = null;
        try {
          msg = JSON.parse(messageEvent.data);
        } catch {
          console.error(`Error parsing : ${messageEvent.data}`);
        }
        if (msg) {
          freshHeartbeat();
          const { messageType } = msg;
          switch (messageType) {
            case 'PONG':
              console.log('❤');
              return;
            case 'ANNOUNCEMENT':
              const { message } = (msg as AnnouncementMessage).payload;
              return emitter(doAnnouncement(message));
            case 'ENTITY_UPDATED':
              const { entityId } = (msg as EntityUpdatedMessage).payload;
              return emitter(doFetchEntity(entityId));
            default:
              console.log(msg);
          }
        }
      };
      ws.onclose = closeEvent => {
        clearInterval(pingInterval);
        clearTimeout(pingTimer);
        const code = closeEvent.code;
        console.log(`closed: ${code}`);
        if (!(code === 1000 || code === 1001 || code === 1005)) {
          reconnect();
        }
      };
    }
    function reconnect() {
      if (!inReconnectAttempt) {
        inReconnectAttempt = true;
        if (numReconnectAttempts++ < MAX_CONNECTION_ATTEMPTS) {
          setTimeout(() => {
            console.log(`trying to reconnect: ${numReconnectAttempts}`);
            try {
              open(() => {
                emitter(doClearEntities());
                // emitter(doFetchCurrentClip());
              });
            } finally {
              inReconnectAttempt = false;
            }
          }, RECONNECT_WAIT);
        } else {
          if (inReanimationAttempt) {
            const message = `Failed to reconnect to websocket after ${MAX_CONNECTION_ATTEMPTS} attempts; please reload the app!`;
            emitter(
              doFetchError({
                message,
                name: 'ArtificialError',
                response: { data: { message }, status: 318 },
              }),
            );
          } else {
            emitter(
              doWebsocketFailed(function () {
                inReanimationAttempt = true;
                inReconnectAttempt = false;
                numReconnectAttempts = 0;
                reconnect();
              }),
            );
          }
        }
      }
    }
    open();
    // unsubscribe function
    return () => {
      ws.close();
      console.log('Socket off');
    };
  });
}

function* watchReInit(action: SagaWebsocketFailedAction) {
  yield take((action: Action) => action.type === SAGA_SUCCESSFUL_REQUEST);
  action.payload.onReanimate();
}

export function* watchWebsocket() {
  // try to re-initialize on successful api request after websocket failure
  yield takeLatest(SAGA_WEBSOCKET_FAILED, watchReInit);
  // wait for authentication before activating websocket
  yield take((action: Action) => action.type === APP_SET_USER_INFO);
  const channel: EventChannel<EmittedAction> = yield call(initWebsocket);
  while (true) {
    const action: EmittedAction = yield take(channel);
    yield put(action);
  }
}
