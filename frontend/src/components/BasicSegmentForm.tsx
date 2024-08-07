/**
 * Form for adding/editing the basic meta data for a Segment
 * At least one timespan must be added
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

import { shouldLockFormOnTheLeft } from '../selectors/app';
import { getCurrentClip, getLabelsUsedInClip } from '../selectors/clips';
import { doSetEditingLeft } from '../actionCreators/app';
import { doSaveSegment } from '../actionCreators/sagaActions';

import { allowedFieldsMap } from '../generated/formFields';
import { filterObjectKeys } from '../util';

import { Segment } from '../types/clips';

const allowedFields = allowedFieldsMap.Segment as Array<keyof Segment>;

const MultiTimecodes = multi<[number, number], TimecodesInputProps>(
  TimecodesInput,
);

const makeInitialSegment = (clipId: string): Segment => ({
  _id: '',
  type: 'Segment',
  clip: clipId,
  label: '',
  description: '',
  timecodes: [],
  segmentContains: [],
});

interface Props {
  segment?: Segment;
}

export const BasicSegmentForm: React.FC<Props> = ({ segment }) => {
  const dispatch = useDispatch();
  const clip = useSelector(getCurrentClip);
  const locked = useSelector(shouldLockFormOnTheLeft);
  const labelsUsedInClip = useSelector(getLabelsUsedInClip);
  if (!clip) {
    return <div>Error: No current clip... should not be possible!</div>;
  }
  const clipId = clip._id;
  const initialValues = makeInitialSegment(clipId);
  const valuesToUse =
    segment !== undefined ? { ...initialValues, ...segment } : initialValues;
  return (
    <Formik
      initialValues={valuesToUse}
      validationSchema={Yup.object({
        label: Yup.string()
          .required('Required')
          .test(
            'labelUnique',
            'Labels need to be unique among Interpretations and other elements',
            label =>
              !labelsUsedInClip.has(label || '') || label === segment?.label,
          ),
        description: Yup.string(),
        timecodes: makeTimecodesValidation(0, clip.duration),
      })}
      onSubmit={(values, _actions) => {
        const actualValues = filterObjectKeys<Segment>(values, allowedFields);
        dispatch(doSaveSegment(actualValues));
      }}
    >
      <Form locked={locked}>
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
            />
          </Grid>
          <Grid item md={12}>
            <MultiTimecodes
              defaultValue={[0, 0]}
              min={0}
              labelIfEmpty="Timecodes"
              name="timecodes"
            />
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
      </Form>
    </Formik>
  );
};
