/**
 * Display either EntityView or EntityForm in Sidepanel.
 */
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import { EntityForm } from './EntityForm';
import { EntityView } from './EntityView';
// import { EntityRelationsInfo } from './EntityRelationsInfo';

import { getInspectorState } from '../selectors/sidePanel';

import { EmptyObject } from '../types';

export const InspectorEntity: FC<EmptyObject> = () => {
  const { entityId, isEditingEntity } = useSelector(getInspectorState);
  if (!isEditingEntity && !entityId) {
    return <div>Nothing selected.</div>;
  }
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        {isEditingEntity ? (
          <EntityForm entityId={entityId} />
        ) : (
          entityId && <EntityView entityId={entityId} />
        )}
      </Grid>
      {/*<Grid item>
        <EntityRelationsInfo entityId={entityId} />
      </Grid>*/}
    </Grid>
  );
};
