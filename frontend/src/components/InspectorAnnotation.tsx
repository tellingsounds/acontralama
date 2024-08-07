/**
 * Display an Annotation (used in the Sidepanel).
 */
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import { ConnectionForm } from './ConnectionForm';
import { ConnectionView } from './ConnectionView';

import { getInspectorState } from '../selectors/sidePanel';

import { EmptyObject } from '../types';

export const AnnotationForm: FC<EmptyObject> = () => {
  const { currentAnnotationEdit, isEditingConnection } =
    useSelector(getInspectorState);
  if (!isEditingConnection && !currentAnnotationEdit) {
    return <div>Not editing.</div>;
  }
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <ConnectionForm />
      </Grid>
    </Grid>
  );
};

export const AnnotationView: FC<EmptyObject> = () => {
  const { currentAnnotation } = useSelector(getInspectorState);
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        {currentAnnotation ? (
          <ConnectionView annotation={currentAnnotation} />
        ) : (
          <div>Nothing selected.</div>
        )}
      </Grid>
    </Grid>
  );
};
