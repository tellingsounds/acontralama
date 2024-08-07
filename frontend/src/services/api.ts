/**
 * This is where requests get sent to the server.
 * Unfortunately, the type information is not generated from schema.
 */
import axios from 'axios';
import { GridSortModel } from '@material-ui/data-grid';

import { history } from '../browserHistory';
import { withPathPrefix, withoutPathPrefix } from '../util';
import { store } from '../store';

import { doSetAuthStatus } from '../actionCreators/app';
import { doSuccessfulRequest } from '../actionCreators/sagaActions';

import {
  Annotation,
  Clip,
  ClipBasic,
  ClipBasicResp,
  ClipData,
  ClipElement,
  ClipLayer,
  Segment,
} from '../types/clips';
import {
  Entity,
  EntityResp,
  EntityType,
  EntityRelationsData,
} from '../types/entities';
import { QueryBlockDataWithQbs, QueryResultData } from '../types/query';

import { UserInfo } from '../types/app';
import { AnyObject } from '../types';

const API_URL = process.env.API_URL as string;

export interface AxiosError extends Error {
  response?: {
    data: {
      message?: string;
    };
    status: number;
  };
}

axios.interceptors.request.use(function (config) {
  if (process.env.NODE_ENV === 'production') {
    config.headers['LAMA-Revision'] = process.env.GIT_VERSION;
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (would have to add saga actions to root reducer type)
    store.dispatch(doSuccessfulRequest());
    // trigger reconnection attempt of failed websocket
    return response;
  },
  function (error) {
    if (401 === error.response?.status) {
      store.dispatch(doSetAuthStatus(false));
      if (withoutPathPrefix(history.location.pathname) !== '/login') {
        history.replace(withPathPrefix('/login'), {
          fromPath: history.location.pathname,
        });
      }
    }
    return Promise.reject(error);
  },
);

async function request(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data: unknown = undefined,
  params: unknown = undefined,
) {
  return axios({
    method,
    url: `${API_URL}/${endpoint}`,
    data,
    params,
    withCredentials: true,
  }).then(response => response.data);
}

interface SharedParams {
  pageSize?: number;
  pageBefore?: string;
  pageAfter?: string;
  sortBy?: GridSortModel;
}

const withTransformedSortingParam = <P extends SharedParams>(params: P) => ({
  ...params,
  sortBy: params.sortBy
    ?.filter(({ sort }) => Boolean(sort))
    .map(({ field, sort }) => `${field}.${sort}`)
    .join(','),
});

interface GetClipsParams extends SharedParams {
  createdBy?: string;
  entityIds?: string[];
  entitiesAll?: boolean;
  favoritesOnly?: boolean;
  match?: string;
  matchNot?: boolean;
  matchDate?: string;
}

export interface ClipsResponse {
  clips: Array<ClipBasicResp>;
  totalCount: number;
  firstIndex: number;
  lastIndex: number;
  page: number;
}

export async function getClips(
  params: GetClipsParams = {},
): Promise<ClipsResponse> {
  const actualParams = {
    ...withTransformedSortingParam(params),
    entitiesAll:
      params.entitiesAll !== undefined
        ? String(Number(params.entitiesAll))
        : undefined,
    matchNot: params.matchNot,
    entityIds: params.entityIds?.join(','),
    favoritesOnly:
      params.favoritesOnly !== undefined
        ? String(Number(params.favoritesOnly))
        : undefined,
    match: params.match ? params.match : undefined,
    matchDate: params.matchDate ? params.matchDate : undefined,
  };
  return request('GET', 'clips', undefined, actualParams);
}

export async function getMultipleEntities(
  entityIds: string[],
): Promise<Record<'entities', EntityResp[]>> {
  return request('POST', `entities/byId`, {
    entityIds,
  });
}

interface GetEntitiesParams extends SharedParams {
  type?: EntityType[];
  cats?: string[];
  match?: string;
  matchDate?: string;
  entityIds?: string[];
  entitiesAll?: boolean;
}

export interface EntitiesResponse {
  entities: Array<EntityResp>;
  totalCount: number;
  firstIndex: number;
  lastIndex: number;
  page: number;
}

export async function getEntities(
  params: GetEntitiesParams,
): Promise<EntitiesResponse> {
  const actualParams = {
    ...withTransformedSortingParam(params),
    entitiesAll:
      params.entitiesAll !== undefined
        ? String(Number(params.entitiesAll))
        : undefined,
    entityIds: params.entityIds?.join(','),
    type: params.type?.join(','),
    cats: params.cats?.join(','),
    match: params.match || undefined,
    matchDate: params.matchDate || undefined, // TODO: check if this is correct
  };
  return request('GET', 'entities', undefined, actualParams);
}

export async function saveEntity(entity: Entity): Promise<EntityResp> {
  return request(entity._id ? 'PUT' : 'POST', 'entities', entity);
}

type EntityRelationsPayload = {
  _id: string;
  relation: 'broader' | 'related';
  targetId: string;
};

export async function getEntityRelations(
  entityId: string,
): Promise<EntityRelationsData> {
  return request('GET', `entities/relations/${entityId}`);
}

export async function saveEntityRelation(
  data: EntityRelationsPayload,
): Promise<EntityRelationsData> {
  return request('POST', 'entities/relations', data);
}

export async function saveClip(clip: ClipBasic): Promise<string> {
  return request(clip._id ? 'PUT' : 'POST', 'clips', clip).then(
    data => data._id,
  );
}

export async function deleteClip(clip: Clip): Promise<undefined> {
  return request('DELETE', `clips`, clip);
}

export async function getClipById(clipId: string): Promise<ClipData> {
  return request('GET', `clips/${clipId}`);
}

export async function getBasicClipById(clipId: string): Promise<ClipBasicResp> {
  return request('GET', `clips/basic/${clipId}`);
}

export async function getClipsWithSameShelfmark(
  clipId: string,
): Promise<ClipBasic[]> {
  return request('GET', `clips/sameShelfmark/${clipId}`).then(
    data => data.clips,
  );
}

export async function saveAnnotation(annot: Annotation): Promise<Annotation> {
  return request(annot._id ? 'PUT' : 'POST', 'annotations', annot);
}

export async function deleteAnnotation(annot: Annotation): Promise<undefined> {
  return request('DELETE', 'annotations', annot);
}

export async function deleteEntity(entity: Entity): Promise<undefined> {
  return request('DELETE', 'entities', entity);
}

export async function saveElement(element: ClipElement): Promise<string> {
  return request(element._id ? 'PUT' : 'POST', 'elements', element).then(
    data => data._id,
  );
}

export async function deleteElement(element: ClipElement): Promise<undefined> {
  return request('DELETE', 'elements', element);
}

export async function saveLayer(layer: ClipLayer): Promise<string> {
  return request(layer._id ? 'PUT' : 'POST', 'layers', layer).then(
    data => data._id,
  );
}

export async function deleteLayer(layer: ClipLayer): Promise<undefined> {
  return request('DELETE', 'layers', layer);
}

export async function saveSegment(segment: Segment): Promise<string> {
  return request(segment._id ? 'PUT' : 'POST', 'segments', segment).then(
    data => data._id,
  );
}

export async function deleteSegment(segment: Segment): Promise<undefined> {
  return request('DELETE', 'segments', segment);
}

export async function updateSegmentAnnots(data: {
  segment: string;
  annotations: string[];
}): Promise<Segment> {
  return request('PUT', 'segments/annotations', data);
}

export async function getUserInfo(): Promise<UserInfo> {
  return request('GET', 'users/me');
}

export async function setFavoriteClip(
  clipId: string,
  isFavorite: boolean,
  user: string,
): Promise<undefined> {
  return request(isFavorite ? 'POST' : 'DELETE', `users/${user}/favorites`, {
    clipId,
  });
}

export async function matchEntities(params: {
  input: string;
  types?: EntityType[];
  catsOnly?: boolean;
}): Promise<EntityResp[]> {
  const entityTypes = params.types?.join(',');
  return request('GET', 'entities/match', undefined, {
    q: params.input,
    type: entityTypes && entityTypes.length > 0 ? entityTypes : undefined,
    catsOnly: params.catsOnly ? '1' : undefined,
  }).then(data => data.matches);
}

export async function suggestEntities(params: {
  input: string;
  types?: EntityType[];
  catsOnly?: boolean;
}): Promise<EntityResp[]> {
  const entityTypes = params.types?.join(',');
  return request('GET', 'entities/suggest', undefined, {
    type: entityTypes && entityTypes.length > 0 ? entityTypes : undefined,
    catsOnly: params.catsOnly ? '1' : undefined,
  }).then(data => data.matches);
}

export async function queryEntities(logic: AnyObject): Promise<string[]> {
  return request('POST', 'query/entities', logic).then(data => data.entityIds);
}

export async function getQueryResults(
  queryData: QueryBlockDataWithQbs | QueryBlockDataWithQbs[],
): Promise<QueryResultData> {
  return request(
    'POST',
    `query/${Array.isArray(queryData) ? 'intersection' : 'block'}`,
    Array.isArray(queryData) ? { blocks: queryData } : queryData,
  );
}

export interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    type: 'clip' | 'entity';
    entityType?: EntityType;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
}

export async function getGraphDataClip(
  clipId: string,
  params: string,
): Promise<GraphData> {
  return request('GET', `graph/clip/${clipId}?type=${params}`);
}

export async function getGraphDataEntity(
  entityId: string,
  params: string,
): Promise<GraphData> {
  return request('GET', `graph/entity/${entityId}?type=${params}`);
}

export type SearchResult = {
  annotationIds: string[];
  annotationData: Record<string, Annotation>;
  clipData: Record<string, ClipBasicResp>;
  elementData: Record<string, ClipElement>;
};

export async function getQuoteSearch(
  query: string,
  personIds: string[] = [],
): Promise<SearchResult> {
  return request('GET', 'search/quotes', undefined, {
    q: query,
    personIds: personIds.join(','),
  });
}

export async function login(username: string, password: string): Promise<''> {
  return request('POST', 'login', { username, password });
}

export async function logout(): Promise<''> {
  return request('GET', 'logout');
}

export async function getReadOnlyAccess(): Promise<''> {
  return request('GET', 'guest');
}
