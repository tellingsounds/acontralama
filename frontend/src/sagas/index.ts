import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import { Task } from 'redux-saga';
import { Action } from 'redux';
import { omit } from 'lodash';

// import { watchWebsocket } from './ws';
import { querySagas } from './query';

import {
  deleteAnnotation,
  deleteClip,
  deleteElement,
  deleteLayer,
  deleteEntity,
  deleteSegment,
  updateSegmentAnnots,
  getClipById,
  login,
  logout,
  getReadOnlyAccess,
  getMultipleEntities,
  getUserInfo,
  saveAnnotation,
  saveElement,
  saveLayer,
  saveSegment,
  saveEntity,
  saveClip,
  setFavoriteClip,
} from '../services/api';
import {
  SAGA_CLIP_OVERVIEW_RENDERED,
  SAGA_DELETE_ANNOTATION,
  SAGA_DELETE_ELEMENT,
  SAGA_DELETE_LAYER,
  SAGA_DELETE_ENTITY,
  SAGA_DELETE_SEGMENT,
  SAGA_ENTITY_SAVED,
  SAGA_FETCH_CURRENT_CLIP,
  SAGA_FETCH_ENTITY,
  SAGA_FETCH_USER,
  SAGA_JUMP_TO,
  SAGA_LOGIN,
  SAGA_LOGOUT,
  SAGA_READ_ONLY,
  SAGA_REFRESH,
  SAGA_SAVE_ANNOTATION,
  SAGA_SAVE_CLIP,
  SAGA_SAVE_ELEMENT,
  SAGA_SAVE_LAYER,
  SAGA_SAVE_SEGMENT,
  SAGA_SAVE_ENTITY,
  SAGA_SET_FAVORITE_CLIP,
  SAGA_UPDATE_SEGMENT_ANNOTS,
  SIDEPANEL_CREATE_ENTITY,
  SAGA_DELETE_CLIP,
} from '../constants/actionTypes';
import { getActiveSegment, getUsername } from '../selectors/app';
import { getCurrentClip } from '../selectors/clips';
import {
  doActivateSegment,
  doElementSaved,
  doLayerSaved,
  doFetchRequested,
  doFetchSuccess,
  doFetchError,
  doSaveRequested,
  doSaveSuccess,
  doSaveError,
  doLoggedOut,
  doSetClipAccordions,
  doSetEditingLeft,
  doSetUserInfo,
} from '../actionCreators/app';
import { doReflectFavorite } from '../actionCreators/clipList';
import {
  doSetCurrentClip,
  doUnsetCurrentClip,
  doUpdateSegment,
} from '../actionCreators/clips';
import { doAddEntities } from '../actionCreators/entities';
import {
  doEntitySaved,
  doFetchCurrentClip,
  doJumpTo,
} from '../actionCreators/sagaActions';
import {
  doAnnotationSaved,
  doClearAnnotationInspector,
  doClearEntityInspector,
  doToggleEditingSegment,
} from '../actionCreators/sidePanel';

import { history } from '../browserHistory';
import { getHeight, withPathPrefix } from '../util';

import { UserInfo } from '../types/app';
import {
  Annotation,
  Clip,
  ClipData,
  Segment,
  SegmentMember,
} from '../types/clips';
import { Entity } from '../types/entities';
import {
  SagaDeleteAnnotationAction,
  SagaDeleteClipAction,
  SagaDeleteElementAction,
  SagaDeleteLayerAction,
  SagaDeleteEntityAction,
  SagaDeleteSegmentAction,
  SagaEntitySavedAction,
  SagaFetchCurrentClipAction,
  SagaFetchEntityAction,
  SagaJumpToAction,
  SagaLoginAction,
  SagaReadOnlyAction,
  SagaSaveAnnotationAction,
  SagaSaveClipAction,
  SagaSaveElementAction,
  SagaSaveLayerAction,
  SagaSaveSegmentAction,
  SagaSaveEntityAction,
  SagaSetFavoriteClipAction,
  SagaUpdateSegmentAnnotsAction,
} from '../types/sagaActions';
import { SidePanelCreateEntityAction } from '../types/sidePanel';

const entityIdsToFetch: Set<string> = new Set();
let entityFetchTask: Task | null = null;

function* fetchEntitiesTogether() {
  yield delay(50);
  entityFetchTask = null;
  const entityIds = Array.from(entityIdsToFetch);
  entityIdsToFetch.clear();
  try {
    const { entities } = yield call(getMultipleEntities, entityIds);
    yield put(doAddEntities(entities));
  } catch (e) {
    yield put(doFetchError(e));
  }
}

function* accumulateFetchEntity(action: SagaFetchEntityAction) {
  const { entityId } = action.payload;
  entityIdsToFetch.add(entityId);
  if (entityFetchTask !== null) {
    yield cancel(entityFetchTask);
  }
  entityFetchTask = yield fork(fetchEntitiesTogether);
}

function* fetchCurrentClip(action: SagaFetchCurrentClipAction) {
  let { clipId } = action.payload;
  if (clipId === undefined) {
    const currentClip: Clip | null = yield select(getCurrentClip);
    if (!currentClip) {
      // const message = 'unable to fetch current clip';
      // yield put(
      //   doFetchError({
      //     message,
      //     name: 'ArtificialError',
      //     response: { data: { message } },
      //   }),
      // );
      return;
    }
    clipId = currentClip._id;
  }
  yield put(doFetchRequested());
  try {
    const clipData: ClipData = yield call(getClipById, clipId);
    yield put(doFetchSuccess());
    yield put(doSetCurrentClip(clipData));
  } catch (e) {
    yield put(doFetchError(e));
  }
}

function* fetchUserInfo() {
  try {
    const userInfo: UserInfo = yield call(getUserInfo);
    yield put(doSetUserInfo(userInfo));
  } catch (e) {
    yield put(doFetchError(e));
  }
}

function* applySetFavoriteClip(action: SagaSetFavoriteClipAction) {
  const currentUser: string = yield select(getUsername);
  const { clipId, isFavorite } = action.payload;
  try {
    yield call(setFavoriteClip, clipId, isFavorite, currentUser);
    yield put(doReflectFavorite(clipId, isFavorite));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* jumpTo(action: SagaJumpToAction) {
  const { domId, accordionIds } = action.payload;
  if (accordionIds !== undefined) {
    yield put(doSetClipAccordions(true, accordionIds));
  }
  setTimeout(() => {
    // const currentLocationWithHash =
    //   history.location.pathname + history.location.hash;
    // const newLocationWithHash = `${history.location.pathname}#${domId}`;
    // if (newLocationWithHash !== currentLocationWithHash) {
    //   history.push(newLocationWithHash);
    // }
    const domElement: HTMLElement | null = document.getElementById(domId);
    if (domElement === null) {
      return;
    }
    domElement.scrollIntoView();
    const offsetHeight = getHeight('LamaSegmentAlert');
    if (offsetHeight > 0) {
      const mainPanel = document.getElementById('LamaMainPanel') as HTMLElement;
      mainPanel.scrollBy(0, -offsetHeight);
    }
  }, 500);
}

function* refresh() {
  const clip: Clip | null = yield select(getCurrentClip);
  if (clip) {
    yield put(doFetchCurrentClip(clip._id));
  }
  // (currently included in fetchCurrentClip)
  // yield put(doFetchAllEntities);
}

function* saveEntityAsync(action: SagaSaveEntityAction) {
  const { entity, refId } = action.payload;
  yield put(doSaveRequested());
  try {
    const savedEntity: Entity = yield call(saveEntity, entity);
    yield put(doSaveSuccess());
    yield put(doEntitySaved(savedEntity, refId));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* saveClipAsync(action: SagaSaveClipAction) {
  const { clip } = action.payload;
  const basicClip = omit(clip as Clip, 'annotations', 'elements');
  const isNew = !basicClip._id;
  yield put(doSaveRequested());
  try {
    const savedClipId: string = yield call(saveClip, basicClip);
    yield put(doSaveSuccess());
    if (isNew) {
      yield call(history.push, withPathPrefix(`/clip/${savedClipId}`));
    } else {
      yield put(doSetEditingLeft(false));
      yield put(doFetchCurrentClip(savedClipId));
    }
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* saveAnnotationAsync(action: SagaSaveAnnotationAction) {
  const { annotation } = action.payload;
  const isNew = !Boolean(annotation._id);
  const activeSegment: Segment | undefined = yield select(getActiveSegment);
  yield put(doSaveRequested());
  try {
    const savedAnnot: Annotation = yield call(saveAnnotation, annotation);
    if (
      activeSegment !== undefined &&
      isNew &&
      annotation.relation !== 'RInterpretationAnnot'
    ) {
      yield call(updateSegmentAnnots, {
        segment: activeSegment._id,
        annotations: [
          ...activeSegment.segmentContains
            .map((sc: SegmentMember) => sc.annotation)
            .filter((a: string) => a !== savedAnnot._id),
          savedAnnot._id,
        ],
      });
    }
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(annotation.clip));
    yield put(doAnnotationSaved(savedAnnot));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* deleteAnnotationAsync(action: SagaDeleteAnnotationAction) {
  const { annotation } = action.payload;
  yield put(doSaveRequested());
  try {
    yield call(deleteAnnotation, annotation);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(annotation.clip));
    yield put(doClearAnnotationInspector());
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* deleteClipAsync(action: SagaDeleteClipAction) {
  const { clip } = action.payload;

  yield put(doSaveRequested());
  try {
    yield call(deleteClip, clip);
    yield put(doSaveSuccess());
    yield put(doUnsetCurrentClip());
    yield call(history.push, withPathPrefix('/'));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* deleteEntityAsync(action: SagaDeleteEntityAction) {
  const { entity } = action.payload;
  yield put(doSaveRequested());
  try {
    yield call(deleteEntity, entity);
    yield put(doSaveSuccess());
    yield put(doClearEntityInspector());
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* saveElementAsync(action: SagaSaveElementAction) {
  const { element } = action.payload;
  yield put(doSaveRequested());
  try {
    const savedElementId: string = yield call(saveElement, element);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(element.clip));
    yield put(doElementSaved(savedElementId));
    yield take((a: Action) => {
      return a.type === SAGA_CLIP_OVERVIEW_RENDERED;
    });
    yield put(doJumpTo(savedElementId, [element.type, savedElementId]));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* deleteElementAsync(action: SagaDeleteElementAction) {
  const { element } = action.payload;
  yield put(doSaveRequested());
  try {
    yield call(deleteElement, element);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(element.clip));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* saveLayerAsync(action: SagaSaveLayerAction) {
  const { layer } = action.payload;
  yield put(doSaveRequested());
  try {
    const savedLayerId: string = yield call(saveLayer, layer);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(layer.clip));
    yield put(doLayerSaved(savedLayerId));
    yield take((a: Action) => {
      return a.type === SAGA_CLIP_OVERVIEW_RENDERED;
    });
    yield put(doJumpTo(savedLayerId, [layer.type, savedLayerId]));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* deleteLayerAsync(action: SagaDeleteLayerAction) {
  const { layer } = action.payload;
  yield put(doSaveRequested());
  try {
    yield call(deleteLayer, layer);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(layer.clip));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* saveSegmentAsync(action: SagaSaveSegmentAction) {
  const { segment } = action.payload;
  const isNewSegment = !segment._id;
  yield put(doSaveRequested());
  try {
    const savedSegmentId: string = yield call(saveSegment, segment);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(segment.clip));
    yield put(doElementSaved(savedSegmentId));
    if (isNewSegment) {
      yield put(doActivateSegment(savedSegmentId));
    }
    yield take((a: Action) => {
      return a.type === SAGA_CLIP_OVERVIEW_RENDERED;
    });
    yield put(doJumpTo(savedSegmentId, ['Segment', savedSegmentId]));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* deleteSegmentAsync(action: SagaDeleteSegmentAction) {
  const { segment } = action.payload;
  yield put(doSaveRequested());
  try {
    yield call(deleteSegment, segment);
    yield put(doSaveSuccess());
    yield put(doFetchCurrentClip(segment.clip));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* updateSegmentAnnotsAsync(action: SagaUpdateSegmentAnnotsAction) {
  yield put(doSaveRequested());
  try {
    const updatedSegment: Segment = yield call(
      updateSegmentAnnots,
      action.payload,
    );
    yield put(doSaveSuccess());
    yield put(doToggleEditingSegment(false));
    yield put(doUpdateSegment(updatedSegment));
  } catch (e) {
    yield put(doSaveError(e));
  }
}

function* takeCareOfFormField(action: SidePanelCreateEntityAction) {
  // 1. pass setFieldValue bind field along in action
  // 2. store ref, refId
  // 3. forward refId to Saved-action
  // 4. wait for Saved-action with corresponding refId
  const { updateSelection, refId } = action.payload;
  const saveAction: SagaEntitySavedAction = yield take((a: Action) => {
    if (a.type === SAGA_ENTITY_SAVED) {
      const ac = a as SagaEntitySavedAction;
      return ac.payload.refId === refId;
    }
    return false;
  });
  updateSelection(saveAction.payload.entity._id);
}

function* applyLogin(action: SagaLoginAction) {
  const {
    username,
    password,
    handleInvalidCredentials,
    setLoading,
    path,
    fromPath,
  } = action.payload;
  setLoading(true);
  try {
    yield call(login, username, password);
    yield call(fetchUserInfo);
    if (path === '/login') {
      history.replace(
        withPathPrefix(
          fromPath && !['/login'].includes(fromPath) ? fromPath : '/',
        ),
        undefined,
      );
    }
  } catch (err) {
    if (err.response?.status === 401 && err.response?.data.message) {
      handleInvalidCredentials(err.response.data.message);
    } else {
      yield put(doFetchError(err));
    }
  } finally {
    setLoading(false);
  }
}

function* applyReadOnly(action: SagaReadOnlyAction) {
  const { setLoading, path, fromPath } = action.payload;
  setLoading(true);
  try {
    yield call(getReadOnlyAccess);
    yield call(fetchUserInfo);
    if (path === '/login') {
      history.replace(
        withPathPrefix(
          fromPath && !['/login'].includes(fromPath) ? fromPath : '/',
        ),
        undefined,
      );
    }
  } catch (err) {
    yield put(doFetchError(err));
  } finally {
    setLoading(false);
  }
}

function* applyLogout() {
  try {
    yield call(logout);
    yield put(doLoggedOut());
    yield call(history.push, withPathPrefix('/login'));
  } catch (err) {
    yield put(doFetchError(err));
  }
}

function* watchSaveEntity() {
  yield takeLatest(SAGA_SAVE_ENTITY, saveEntityAsync);
}

function* watchDeleteEntity() {
  yield takeLatest(SAGA_DELETE_ENTITY, deleteEntityAsync);
}

function* watchSaveClip() {
  yield takeLatest(SAGA_SAVE_CLIP, saveClipAsync);
}

function* watchDeleteClip() {
  yield takeLatest(SAGA_DELETE_CLIP, deleteClipAsync);
}

function* watchDeleteAnnotation() {
  yield takeLatest(SAGA_DELETE_ANNOTATION, deleteAnnotationAsync);
}

function* watchSaveAnnotation() {
  yield takeLatest(SAGA_SAVE_ANNOTATION, saveAnnotationAsync);
}

function* watchSaveElement() {
  yield takeLatest(SAGA_SAVE_ELEMENT, saveElementAsync);
}

function* watchDeleteElement() {
  yield takeLatest(SAGA_DELETE_ELEMENT, deleteElementAsync);
}

function* watchSaveLayer() {
  yield takeLatest(SAGA_SAVE_LAYER, saveLayerAsync);
}

function* watchDeleteLayer() {
  yield takeLatest(SAGA_DELETE_LAYER, deleteLayerAsync);
}

function* watchSaveSegment() {
  yield takeLatest(SAGA_SAVE_SEGMENT, saveSegmentAsync);
}

function* watchDeleteSegment() {
  yield takeLatest(SAGA_DELETE_SEGMENT, deleteSegmentAsync);
}

function* watchUpdateSegmentAnnots() {
  yield takeLatest(SAGA_UPDATE_SEGMENT_ANNOTS, updateSegmentAnnotsAsync);
}

function* watchCreateEntity() {
  yield takeLatest(SIDEPANEL_CREATE_ENTITY, takeCareOfFormField);
}

function* watchFetchEntity() {
  yield takeEvery(SAGA_FETCH_ENTITY, accumulateFetchEntity);
}

function* watchFetchCurrentClip() {
  yield takeLatest(SAGA_FETCH_CURRENT_CLIP, fetchCurrentClip);
}

function* watchFetchUserInfo() {
  yield takeLatest(SAGA_FETCH_USER, fetchUserInfo);
}

function* watchRefresh() {
  yield takeLatest(SAGA_REFRESH, refresh);
}

function* watchJumpTo() {
  yield takeLatest(SAGA_JUMP_TO, jumpTo);
}

function* watchSetFavoriteClip() {
  yield takeLatest(SAGA_SET_FAVORITE_CLIP, applySetFavoriteClip);
}

function* watchLogin() {
  yield takeLatest(SAGA_LOGIN, applyLogin);
}

function* watchLogout() {
  yield takeLatest(SAGA_LOGOUT, applyLogout);
}

function* watchReadOnly() {
  yield takeLatest(SAGA_READ_ONLY, applyReadOnly);
}

export default function* rootSaga() {
  yield all([
    watchSaveEntity(),
    watchSaveClip(),
    watchDeleteClip(),
    watchSaveAnnotation(),
    watchDeleteAnnotation(),
    watchDeleteElement(),
    watchDeleteLayer(),
    watchDeleteEntity(),
    watchSaveElement(),
    watchSaveLayer(),
    watchSaveSegment(),
    watchSetFavoriteClip(),
    watchDeleteSegment(),
    watchUpdateSegmentAnnots(),
    watchCreateEntity(),
    watchFetchEntity(),
    watchFetchCurrentClip(),
    watchFetchUserInfo(),
    watchRefresh(),
    watchJumpTo(),
    watchLogin(),
    watchLogout(),
    watchReadOnly(),
    // watchWebsocket(),
    ...querySagas,
  ]);
}
