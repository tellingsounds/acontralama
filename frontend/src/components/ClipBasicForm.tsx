/**
 * Form for the entry of the basic meta data of a Clip
 */
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, createStyles, makeStyles } from '@material-ui/core';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';

import { doSaveClip } from '../actionCreators/sagaActions';
import { doSetEditingLeft } from '../actionCreators/app';
import { shouldLockFormOnTheLeft } from '../selectors/app';
import { getCurrentClip } from '../selectors/clips';
import { history } from '../browserHistory';

import {
  CancelButton,
  Form,
  Duration,
  SaveButton,
  Select,
  TextField,
} from './formComponents';
import {
  AutocompleteEntitiesFormik as AutocompleteEntities,
  AutocompleteEntitiesSingleFormik as AutocompleteEntitiesSingle,
} from './AutocompleteEntities';

import { doUnsetCurrentClip } from '../actionCreators/clips';

import { EmptyObject } from '../types';
import { ClipBasic } from '../types/clips';

const useStyles = makeStyles(_theme =>
  createStyles({
    fieldItem: {
      width: '100%',
    },
  }),
);

const INITIAL_VALUES: ClipBasic = {
  _id: '',
  type: 'Clip',
  title: '',
  // label: '',
  subtitle: '',
  url: '',
  platform: '',
  collections: [],
  fileType: 'a',
  duration: 0,
  shelfmark: '',
  // language: [],
  // clipType: [],
  description: '',
  offsetTimecode: 0,
};

export const ClipBasicForm: FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clip = useSelector(getCurrentClip);
  const valuesToUse =
    clip !== undefined ? { ...INITIAL_VALUES, ...clip } : INITIAL_VALUES;
  const locked = useSelector(shouldLockFormOnTheLeft);
  return (
    <Formik
      initialValues={valuesToUse}
      validationSchema={Yup.object({
        title: Yup.string().required('Required'),
        // url: Yup.string().url().required('Required'),
        url: Yup.string().url('Valid URI required'),
        platform: Yup.string().required('Required'),
        fileType: Yup.string().required('Required'),
        duration: Yup.number()
          .moreThan(-1, 'Required (needs to be >= 0)')
          .typeError('Needs to be a valid duration'),
        // clipType: Yup.array().of(Yup.string()).min(1, 'Required'),
      })}
      onSubmit={(values, _actions) => {
        dispatch(doSaveClip(values));
      }}
    >
      <Form locked={locked}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Grid container spacing={2} direction="column">
              <Grid item className={classes.fieldItem}>
                <Field
                  component={TextField}
                  // helperText="The full title."
                  label="Title"
                  name="title"
                  autoFocus
                  required
                />
              </Grid>
              <Grid item className={classes.fieldItem}>
                <Field component={TextField} label="Subtitle" name="subtitle" />
              </Grid>
              {/* <Grid item className={classes.fieldItem}>
                <Field
                  component={TextField}
                  helperText="A more meaningful version of the title (if applicable)."
                  label="Custom label"
                  name="label"
                />
              </Grid> */}
              <Grid item className={classes.fieldItem}>
                <Field
                  component={TextField}
                  label="URL/Permalink"
                  name="url"
                  // required
                />
              </Grid>
              <Grid item className={classes.fieldItem}>
                <Field
                  component={AutocompleteEntitiesSingle}
                  label="Archive (former Platform)"
                  name="platform"
                  types={['Platform']}
                  canCreateNew
                  required
                />
              </Grid>
              <Grid item className={classes.fieldItem}>
                <Field
                  component={TextField}
                  label="Shelfmark"
                  name="shelfmark"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Grid container spacing={2} direction="column">
              <Grid item className={classes.fieldItem}>
                <Field
                  component={Select}
                  label="File type"
                  name="fileType"
                  options={[
                    { label: 'audio', value: 'a' },
                    { label: 'video', value: 'v' },
                  ]}
                  required
                />
              </Grid>
              {/* <Grid item className={classes.fieldItem}>
                <Field
                  component={AutocompleteEntities}
                  label="Language"
                  name="language"
                  types={['VLanguage']}
                  canCreateNew
                />
              </Grid> */}
              {/* <Grid item className={classes.fieldItem}>
                <Field
                  component={AutocompleteEntities}
                  label="Format (former Clip Type)"
                  name="clipType"
                  canCreateNew
                  types={['VClipType']}
                />
              </Grid> */}
              <Grid item className={classes.fieldItem}>
                <Field
                  component={AutocompleteEntities}
                  label="Collection"
                  name="collections"
                  types={['Collection']}
                  canCreateNew
                />
              </Grid>
              <Grid item className={classes.fieldItem}>
                <Field
                  component={Duration}
                  label="Duration"
                  name="duration"
                  required
                />
              </Grid>
              <Grid item className={classes.fieldItem}>
                <Field
                  component={Duration}
                  label="Timecode Offset"
                  name="offsetTimecode"
                />
              </Grid>
              <Grid item className={classes.fieldItem}>
                <Field
                  component={TextField}
                  multiline
                  label="Description"
                  name="description"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <SaveButton />
            <CancelButton
              onClick={() => {
                dispatch(doSetEditingLeft(false));
                if (!clip) {
                  dispatch(doUnsetCurrentClip());
                  history.goBack();
                }
              }}
            >
              Cancel
            </CancelButton>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};
