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
import { getCurrentClip, getLabelsUsedInClip } from '../selectors/clips';
import { doSetEditingLeft } from '../actionCreators/app';
import { doSaveElement } from '../actionCreators/sagaActions';

import { allowedFieldsMap } from '../generated/formFields';
import { filterObjectKeys } from '../util';

import { ClipElement, ElementType } from '../types/clips';

const allowedFields = allowedFieldsMap.Element as Array<keyof ClipElement>;

const MultiTimecodes = multi<[number, number], TimecodesInputProps>(
  TimecodesInput,
);

const makeInitialElement = (
  elementType: ElementType,
  clipId: string,
): ClipElement => ({
  _id: '',
  type: elementType,
  clip: clipId,
  label: '',
  description: '',
  timecodes: [],
});

interface Props {
  element?: ClipElement;
}

export const BasicElementForm: React.FC<Props> = ({ element }) => {
  const dispatch = useDispatch();
  const clip = useSelector(getCurrentClip);
  const locked = useSelector(shouldLockFormOnTheLeft);
  const labelsUsedInClip = useSelector(getLabelsUsedInClip);
  const currentElementType = useSelector(getEditingLeftState).category;
  const elementType = element?.type || currentElementType;
  if (!clip) {
    return <div>Error: No current clip... should not be possible!</div>;
  }
  const clipId = clip._id;
  const isNew = element === undefined;
  const initialValues = makeInitialElement(elementType as ElementType, clipId);
  const valuesToUse = !isNew ? { ...initialValues, ...element } : initialValues;
  return (
    <Formik
      initialValues={valuesToUse}
      validationSchema={Yup.object({
        label: Yup.string()
          .required('Required')
          .test(
            'labelUnique',
            'Labels need to be unique among segments and elements',
            label =>
              !labelsUsedInClip.has(label || '') || label === element?.label,
          ),
        description: Yup.string(),
        timecodes: makeTimecodesValidation(0, clip.duration),
      })}
      onSubmit={(values, _actions) => {
        const actualValues = filterObjectKeys<ClipElement>(
          values,
          allowedFields,
        );
        dispatch(doSaveElement(actualValues));
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
                    />
                  </Grid>
                  <Grid item md={12}>
                    <MultiTimecodes
                      defaultValue={[0, 0]}
                      labelIfEmpty="Timecodes"
                      min={0}
                      name="timecodes"
                    />
                  </Grid>
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
