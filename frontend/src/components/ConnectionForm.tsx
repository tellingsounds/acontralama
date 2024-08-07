/**
 * Form to add/edit an Annotation
 * TODO: should actually be called AnnotationForm (everything called Connection should be called Annotation)
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Grid, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import {
  AutocompleteEntitiesFormik as AutocompleteEntities,
  AutocompleteEntitiesSingleFormik as AutocompleteEntitiesSingle,
} from './AutocompleteEntities';
import {
  CancelButton,
  DateInput,
  Duration,
  Form,
  SaveButton,
  Select,
  TextField,
} from './formComponents';
import { FCLCheckbox } from './FCLCheckbox';

import { AnnotationList } from './AnnotationList';
import { CompactAnnotation } from './CompactAnnotation';
import { PopoverButton } from './PopoverButton';

import { shouldLockConnectionForm } from '../selectors/app';
import { getAnnotationIds, getCurrentClip } from '../selectors/clips';
import { getInspectorState } from '../selectors/sidePanel';
import { doSaveAnnotation } from '../actionCreators/sagaActions';
import { doStopEditingConnection } from '../actionCreators/sidePanel';

import {
  connectionRelationInfo,
  getConnectionTypeLabel,
} from '../connectionFormInfo';

import { EmptyObject } from '../types';
import { Annotation } from '../types/clips';
import { Relation } from '../types/relations';

const useStyles = makeStyles({
  title: {
    fontSize: 18,
  },
  checkboxItem: {
    padding: '0 8px !important',
  },
});

interface SafeAnnotation extends Annotation {
  constitutedBy: string[];
}

const makeInitialValues = (
  relation: Relation,
  clipId: string,
  elementId?: string,
  segmentId?: string,
  layerId?: string,
): SafeAnnotation => ({
  _id: '',
  type: 'Annotation',
  clip: clipId,
  element: elementId,
  segment: segmentId,
  layer: layerId,
  relation,
  target: '',
  quotes: '',
  quoteEntities: [],
  date: '',
  role: '',
  instrument: '',
  metaDate: '',
  timecodeStart: 0,
  timecodeEnd: 0,
  confidence: '',
  attribution: '',
  // attribution: { zoteroId: '', locator: '', attributionComment: '' },
  comment: '',
  fromPlatformMetadata: false,
  interpretative: false,
  constitutedBy: [],
  refersTo: '',
  notablyAbsent: false,
  // onSite: false, // can't be undefined??
  // diegetic: false, // can't be undefined??
});

const makeValidationSchema = (relation: Relation) =>
  Yup.object(
    connectionRelationInfo[relation].required.reduce(
      (acc, cur) => ({ ...acc, [cur]: Yup.string().required('Required') }),
      {},
    ),
  );

export const ConnectionForm: React.FC<EmptyObject> = () => {
  const handleTimecodeCheckedChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTimecodeChecked(event.target.checked);
  };

  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    connectionForm: { relation, elementId, segmentId, layerId },
    currentAnnotationEdit,
  } = useSelector(getInspectorState);
  const currentClip = useSelector(getCurrentClip);
  const [timecodeChecked, setTimecodeChecked] = React.useState(
    currentAnnotationEdit !== null &&
      currentAnnotationEdit.timecodeStart !== undefined,
  );
  const elementIdMaybe = elementId || undefined;
  const segmentIdMaybe = segmentId || undefined;

  const layerIdMaybe = layerId || undefined;
  const locked = useSelector(shouldLockConnectionForm);
  // const [isInterpretativeChecked, setIsInterpretativeChecked] = useState(
  //   Boolean(currentAnnotationEdit?.interpretative),
  // );
  // const [isNotablyAbsentChecked, setIsNotablyAbsentChecked] = useState(
  //   Boolean(currentAnnotationEdit?.interpretative),
  // );
  const allAnnotationIds = useSelector(getAnnotationIds);
  if (currentClip === null) {
    return <div>This only works in the context of a clip!</div>;
  }
  const clipId = currentClip._id;
  const actualRelation = (
    currentAnnotationEdit !== null ? currentAnnotationEdit.relation : relation
  ) as Relation;
  const allowedFields = connectionRelationInfo[actualRelation].allowed;
  const requiredFields = connectionRelationInfo[actualRelation].required;
  const supportedTypes = connectionRelationInfo[actualRelation].types;
  const canCreateNew = connectionRelationInfo[actualRelation].canCreateNew;
  const interpretAbsent =
    connectionRelationInfo[actualRelation].interpretAbsent;
  const roles = connectionRelationInfo[actualRelation].roles;
  const initialValues = makeInitialValues(
    actualRelation,
    clipId,
    elementIdMaybe,
    segmentIdMaybe,
    layerIdMaybe,
  );
  const valuesToUse = currentAnnotationEdit
    ? { ...initialValues, ...currentAnnotationEdit }
    : initialValues;

  return (
    <Formik
      enableReinitialize // otherwise relation will not update in Formik state
      initialValues={valuesToUse}
      validationSchema={makeValidationSchema(actualRelation)}
      onSubmit={(values, _actions) => {
        const actualValues: Annotation = {
          ...values,
          timecodeStart: timecodeChecked ? values.timecodeStart : undefined,
          timecodeEnd:
            timecodeChecked && values.timecodeEnd && values.timecodeEnd > 0
              ? values.timecodeEnd
              : undefined,
        };
        dispatch(doSaveAnnotation(actualValues));
      }}
    >
      {({ setFieldValue, values }) => (
        <Form locked={locked}>
          <Grid
            container
            spacing={2}
            direction="column"
            style={{ flexWrap: 'unset' }}
          >
            <Grid item>
              <Typography className={classes.title}>
                {getConnectionTypeLabel(actualRelation)}
              </Typography>
            </Grid>
            {interpretAbsent && (
              <Grid item className={classes.checkboxItem}>
                <FCLCheckbox
                  label="Interpretative / Implied"
                  style={{ color: '#fb8c00' }}
                  checked={values.interpretative}
                  onChange={event => {
                    const { checked } = event.target;
                    // setIsInterpretativeChecked(checked);
                    setFieldValue('interpretative', checked);
                  }}
                />
              </Grid>
            )}
            {values.interpretative && (
              <Grid item>
                <PopoverButton label="Refers to:" icon={<AddIcon />}>
                  <AnnotationList
                    annotationIds={allAnnotationIds.filter(
                      annotId =>
                        !(
                          values.constitutedBy.includes(annotId) ||
                          values.refersTo === annotId ||
                          values.target === annotId
                        ),
                    )}
                    leftButtonProps={{
                      icon: <CheckIcon />,
                      onClick: annotId => {
                        setFieldValue('refersTo', annotId);
                      },
                    }}
                  />
                </PopoverButton>
              </Grid>
            )}
            {values.interpretative && values.refersTo && (
              <Grid container direction="row">
                <Grid item>
                  <IconButton
                    title="Remove"
                    onClick={() => {
                      setFieldValue('refersTo', '');
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Grid>
                <Grid item md={10}>
                  <CompactAnnotation
                    withDetails
                    annotationId={values.refersTo}
                  />
                </Grid>
              </Grid>
            )}
            {values.interpretative && (
              <Grid item>
                <PopoverButton label="Constituted by:" icon={<AddIcon />}>
                  <AnnotationList
                    annotationIds={allAnnotationIds.filter(
                      annotId =>
                        !(
                          values.constitutedBy.includes(annotId) ||
                          values.refersTo === annotId ||
                          values.target === annotId
                        ),
                    )}
                    leftButtonProps={{
                      icon: <CheckIcon />,
                      onClick: annotId => {
                        setFieldValue('constitutedBy', [
                          ...values.constitutedBy,
                          annotId,
                        ]);
                      },
                    }}
                  />
                </PopoverButton>
                <AnnotationList
                  annotationIds={values.constitutedBy}
                  searchBox={false}
                  leftButtonProps={{
                    icon: <ClearIcon />,
                    onClick: annotId => {
                      setFieldValue(
                        'constitutedBy',
                        values.constitutedBy.filter(a => a !== annotId),
                      );
                    },
                  }}
                />
              </Grid>
            )}
            {interpretAbsent && (
              <Grid item className={classes.checkboxItem}>
                <FCLCheckbox
                  label="Notably absent"
                  style={{ color: '#f06292' }}
                  checked={values.notablyAbsent}
                  onChange={event => {
                    const { checked } = event.target;
                    // setIsNotablyAbsentChecked(checked);
                    setFieldValue('notablyAbsent', checked);
                  }}
                />
              </Grid>
            )}
            {allowedFields.includes('quotes') && (
              <Grid item>
                <Field
                  component={TextField}
                  multiline
                  label="Quote"
                  name="quotes"
                  required={requiredFields.includes('quotes')}
                  autoFocus
                />
              </Grid>
            )}
            {allowedFields.includes('date') && (
              <Grid item>
                <Field
                  component={DateInput}
                  label="Date"
                  name="date"
                  required={requiredFields.includes('date')}
                  autoFocus
                />
              </Grid>
            )}
            {allowedFields.includes('target') && (
              <Grid item>
                <Field
                  component={AutocompleteEntitiesSingle}
                  label="Target"
                  name="target"
                  types={supportedTypes}
                  canCreateNew={canCreateNew}
                  required={requiredFields.includes('target')}
                  autoFocus={
                    !allowedFields.includes('date') &&
                    !allowedFields.includes('quotes')
                  }
                />
              </Grid>
            )}
            {allowedFields.includes('quoteEntities') && (
              <Grid item>
                <Field
                  component={AutocompleteEntities}
                  label="Quote Entities"
                  name="quoteEntities"
                  types={[
                    'AnySound',
                    'Broadcaster',
                    'BroadcastSeries',
                    'CollectiveIdentity',
                    'CreativeWork',
                    'Event',
                    'EventSeries',
                    'FictionalCharacter',
                    'Genre',
                    'Group',
                    'Location',
                    'Movement',
                    'Organization',
                    'Person',
                    'PieceOfMusic',
                    'Place',
                    'Repertoire',
                    'Thing',
                    'TimePeriod',
                    'Topic',
                    'Topos',
                    'VActivity',
                    'VLanguage',
                  ]}
                  canCreateNew
                />
              </Grid>
            )}
            {allowedFields.includes('role') && (
              <Grid item>
                <Field
                  component={AutocompleteEntitiesSingle}
                  label="Role"
                  name="role"
                  types={roles}
                  canCreateNew
                  required={requiredFields.includes('role')}
                />
              </Grid>
            )}
            {/* allowedFields.includes('instrument') && (
              <Grid item>
                <Field
                  component={TypedAutocompleteSingle}
                  label="Instrument"
                  name="instrument"
                  types={supportedTypes}
                />
              </Grid>
            ) */}
            {allowedFields.includes('metaDate') && (
              <Grid item>
                <Field
                  component={DateInput}
                  label=" Meta date"
                  name="metaDate"
                />
              </Grid>
            )}
            {/* {allowedFields.includes('onSite') && (
              <Grid item className={classes.checkboxItem}>
                <FCLCheckbox
                  label="On Site"
                  style={{ color: '#f06292' }}
                  checked={values.onSite}
                  onChange={event => {
                    const { checked } = event.target;
                    // setIsNotablyAbsentChecked(checked);
                    setFieldValue('onSite', checked);
                  }}
                />
              </Grid>
            )} */}
            {allowedFields.includes('timecodeStart') && (
              <Grid item>
                <Grid container direction="row" spacing={1} alignItems="center">
                  <Grid item md={2}>
                    <Checkbox
                      checked={timecodeChecked}
                      onChange={handleTimecodeCheckedChange}
                      color="primary"
                      title="Enter timecode"
                    />
                  </Grid>
                  <Grid item md={5}>
                    <Field
                      component={Duration}
                      label="Timecode Start"
                      name="timecodeStart"
                      disabled={!timecodeChecked}
                    />
                  </Grid>
                  <Grid item md={5}>
                    <Field
                      component={Duration}
                      label="Timecode End"
                      name="timecodeEnd"
                      disabled={!timecodeChecked}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {!values.fromPlatformMetadata && (
              <Grid item>
                <Field
                  component={Select}
                  label="Confidence"
                  name="confidence"
                  options={[
                    { label: 'certain', value: 'certain' },
                    { label: 'unsure', value: 'unsure' },
                    { label: 'maybe', value: 'maybe' },
                  ]}
                />
              </Grid>
            )}
            {!values.fromPlatformMetadata && (
              <Grid item>
                <Field
                  component={TextField}
                  multiline
                  label="Attribution"
                  name="attribution"
                />
              </Grid>
            )}
            {/*
          Attribution:
          <Grid item>
            <Field component={TextField} label="Zotero ID" name="zoteroId" />
          </Grid>
          <Grid item>
            <Field component={TextField} label="Locator" name="locator" />
          </Grid>
          <Grid item>
            <Field
              component={TextField}
              label="Comment (Attribution)"
              name="attributionComment"
            />
          </Grid>
            */}
            <Grid item>
              <Field
                component={TextField}
                multiline
                label="Comment"
                name="comment"
              />
            </Grid>
          </Grid>
          <Grid item md={12} xs={12}>
            <SaveButton />
            <CancelButton
              onClick={() => {
                dispatch(doStopEditingConnection());
              }}
            >
              Cancel
            </CancelButton>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
