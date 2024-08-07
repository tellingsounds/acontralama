/**
 * Wrapper for adding loading indicator.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { doFetchEntity } from '../actionCreators/sagaActions';
import { getEntityById } from '../selectors/entities';

import { Entity } from '../types/entities';

interface TakesEntityLoading {
  entity?: Entity;
  loading?: boolean;
}

interface TakesEntityId {
  entityId: string;
}

export function withLoadingEntity<P extends TakesEntityLoading>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<
  Pick<
    P & TakesEntityId,
    Exclude<keyof (P & TakesEntityId), keyof TakesEntityLoading>
  >
> {
  return function WrappedWithLoadingEntity({ entityId, ...props }) {
    const dispatch = useDispatch();
    const entity = useSelector(getEntityById)(entityId);
    const needsToFetch = entity === undefined;
    React.useEffect(() => {
      if (needsToFetch) {
        dispatch(doFetchEntity(entityId));
      }
    }, [dispatch, entityId, needsToFetch]);
    return (
      <WrappedComponent
        {...(props as P)}
        entity={entity}
        loading={needsToFetch}
      />
    );
  };
}
