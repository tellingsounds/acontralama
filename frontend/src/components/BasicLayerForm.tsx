/**
 * Form for adding/editing the basic meta data for an Element
 * Timecodes are not mandatory
 */
import React from 'react';
import { Grid } from '@material-ui/core';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { CancelButton, Form, TextField, SaveButton } from './formComponents';
import { TimecodesInput, TimecodesInputProps } from './TimecodesInput';
import { multi } from './multi';

import { makeTimecodesValidation } from '../validation';

import { getEditingLeftState, shouldLockFormOnTheLeft } from '../selectors/app';
import {
  getCurrentClip,
  getLabelsUsedInClip,
  getClipElementById,
} from '../selectors/clips';
import { doSetEditingLeft } from '../actionCreators/app';
import { doSaveLayer } from '../actionCreators/sagaActions';

import { allowedFieldsMap } from '../generated/formFields';
import { filterObjectKeys } from '../util';

import { ClipLayer, ClipElement, LayerType } from '../types/clips';

const allowedFields = allowedFieldsMap.Layer as Array<keyof ClipLayer>;

const MultiTimecodes = multi<[number, number], TimecodesInputProps>(
  TimecodesInput,
);

const makeInitialLayer = (
  layerType: LayerType,
  elementId: string,
  clipId: string,
): ClipLayer => ({
  _id: '',
  type: layerType,
  clip: clipId,
  element: elementId,
  label: '',
  description: '',
  timecodes: [],
});

interface Props {
  layer?: ClipLayer;
  elementId: string;
}

export const BasicLayerForm: React.FC<Props> = ({ layer, elementId }) => {
  const dispatch = useDispatch();
  const clip = useSelector(getCurrentClip);
  const locked = useSelector(shouldLockFormOnTheLeft);
  const labelsUsedInClip = useSelector(getLabelsUsedInClip);
  const currentLayerType = useSelector(getEditingLeftState).category;
  const getE = useSelector(getClipElementById) as (id: string) => ClipElement;
  const currentElementTimecodes = getE(elementId).timecodes;

  // TODO: rework logic to include element timecode(s) as well as clip duration
  // let start = 0;
  // let end = clip ? clip.duration : 0;
  // // if (currentElementTimecodes.length > 0) {
  // //   start = currentElementTimecodes[0][0];
  // //   end = currentElementTimecodes[currentElementTimecodes.length - 1][1];
  // // }

  const layerType = layer?.type || currentLayerType;
  if (!clip) {
    return <div>Error: No current clip... should not be possible!</div>;
  }
  const clipId = clip._id;
  const isNew = layer === undefined;
  const initialValues = makeInitialLayer(
    layerType as LayerType,
    elementId,
    clipId,
  );
  const valuesToUse = !isNew ? { ...initialValues, ...layer } : initialValues;
  return (
    <Formik
      initialValues={valuesToUse}
      validationSchema={Yup.object({
        label: Yup.string()
          .required('Required')
          .test(
            'labelUnique',
            'Labels need to be unique among segments, elements and layers',
            label =>
              !labelsUsedInClip.has(label || '') || label === layer?.label,
          ),
        description: Yup.string().required('Required'),
        timecodes: makeTimecodesValidation(0, clip.duration),
      })}
      onSubmit={(values, _actions) => {
        const actualValues = filterObjectKeys<ClipLayer>(values, allowedFields);
        dispatch(doSaveLayer(actualValues));
      }}
    >
      <Form locked={locked}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Field
                      component={TextField}
                      label="Label"
                      name="label"
                      autoFocus
                      required
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      multiline
                      label="Description"
                      name="description"
                      required
                    />
                  </Grid>
                  {currentElementTimecodes.length > 0 && (
                    <Grid item md={12}>
                      <MultiTimecodes
                        defaultValue={[0, 0]}
                        labelIfEmpty="Timecodes"
                        min={0}
                        name="timecodes"
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item md={12} xs={12}>
                <SaveButton />
                <CancelButton
                  onClick={() => {
                    dispatch(doSetEditingLeft(false));
                  }}
                >
                  Cancel
                </CancelButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};
