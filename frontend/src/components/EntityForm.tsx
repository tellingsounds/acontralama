/**
 * Form for adding/editing an Entity
 */
import React, { FC, ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';

import CheckIcon from '@material-ui/icons/Check';

import { AdditionalTagCheckboxes } from './AdditionalTagCheckboxes';
import { AdditionalTagMarkers } from './AdditionalTagMarkers';
import { PopoverButton } from './PopoverButton';
import {
  CancelButton,
  DateInput,
  Form,
  SaveButton,
  Select,
  TextField,
} from './formComponents';
import { AutocompleteEntitiesFormik as AutocompleteEntities } from './AutocompleteEntities';

import { getEntityById } from '../selectors/entities';
import { getInspectorState } from '../selectors/sidePanel';
import { allEntityTypes, getTypeLabel } from '../constants/entityTypes';

import { doSaveEntity } from '../actionCreators/sagaActions';
import { doStopEditingEntity } from '../actionCreators/sidePanel';

import { Entity, EntityType } from '../types/entities';

import {
  connectionRelationInfo,
  // getConnectionTypeLabel,
} from '../connectionFormInfo';

const keywordTypes = connectionRelationInfo['RKeyword'].types;

interface Props {
  entityId: string;
}

type SFV = (field: string, value: any, shouldValidate?: boolean) => void;
const handleURIsChange = (
  event: ChangeEvent<HTMLTextAreaElement>,
  setFieldValue: SFV,
): void => {
  const newValue = event.target.value.split(/\r?\n/);
  setFieldValue('authorityURIs', newValue, false);
};

const getInitialState = (
  inputValue: string,
  initialType: EntityType | '',
): Entity => ({
  _id: '',
  type: initialType as EntityType,
  label: inputValue || '',
  description: '',
  authorityURIs: [],
  additionalTags: [],
  analysisCategories: [],
  attributes: {
    associatedWith: [],
  },
});

export const EntityForm: FC<Props> = ({ entityId }) => {
  const entity = useSelector(getEntityById)(entityId);
  const isExisting = entity !== undefined;
  const {
    entityForm: { inputValue, supportedTypes, refId },
  } = useSelector(getInspectorState);
  // prefill type if there's only one option
  const initialType = entity
    ? entity.type
    : supportedTypes.length === 1
    ? supportedTypes[0]
    : '';
  const [currentType, setCurrentType] = useState<string>(initialType);
  const dispatch = useDispatch();
  const stopEditing = () => {
    dispatch(doStopEditingEntity());
  };

  const allowedDOCTypes = [
    'PieceOfMusic',
    'Event',
    'EventSeries',
    'BroadcastSeries',
    'CreativeWork',
    'Group',
    'Movement',
    'Organization',
    'TimePeriod',
    'Topic',
  ];

  function doesItEqualCurrentType(element: string) {
    return currentType === element;
  }
  function doesItEqualEntityType(element: string) {
    return entity?.type === element;
  }

  return (
    <Formik
      initialValues={entity || getInitialState(inputValue, initialType)}
      validationSchema={Yup.object({
        type: Yup.string().required('Required'),
        label: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        authorityURIs: Yup.array().of(Yup.string().url('Valid URI required')),
      })}
      onSubmit={(values, _actions) => {
        // filter out empty string
        const processedValues = {
          ...values,
          authorityURIs: (values.authorityURIs || []).filter(s => s !== ''),
        };
        // eslint-disable-next-line no-console
        dispatch(doSaveEntity(processedValues, refId));
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Grid container direction="column" spacing={1}>
            {entity?.type === 'Topic' && (
              <Grid item>
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <PopoverButton
                    icon={<CheckIcon />}
                    label="Analysis Categories"
                  >
                    <AdditionalTagCheckboxes
                      onChange={newValue => {
                        setFieldValue('analysisCategories', newValue);
                      }}
                      value={values.analysisCategories || []}
                    />
                  </PopoverButton>
                  <AdditionalTagMarkers
                    selectedTags={values.analysisCategories || []}
                  />
                </span>
              </Grid>
            )}
            <Grid item>
              <Field
                component={Select}
                label="Type"
                name="type"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value as string;
                  setCurrentType(newValue);
                  setFieldValue('type', newValue, false);
                }}
                options={
                  isExisting
                    ? allEntityTypes.map(t => ({
                        label: getTypeLabel(t),
                        value: t,
                      }))
                    : supportedTypes.map(t => ({
                        label: getTypeLabel(t),
                        value: t,
                      }))
                }
                required
                value={currentType}
              />
            </Grid>
            <Grid item>
              <Field
                component={TextField}
                label="Label"
                name="label"
                autoFocus
                required
              />
            </Grid>

            {(allowedDOCTypes.some(doesItEqualCurrentType) ||
              allowedDOCTypes.some(doesItEqualEntityType)) && (
              <Grid item>
                <Field
                  component={DateInput}
                  label="Date of Creation/Associated Date"
                  name="attributes.dateOfCreation"
                />
              </Grid>
            )}
            {
              <Grid item>
                <Field
                  component={AutocompleteEntities}
                  label="Associated with"
                  name="attributes.associatedWith" // that could/should work for new ones, make sure, that with 'old' ones, the entity has the attributes object
                  types={keywordTypes}
                  canCreateNew
                  // required={requiredFields.includes('role')}
                />
              </Grid>
            }
            <Grid item>
              <Field
                component={TextField}
                multiline
                label="Description"
                name="description"
                required
              />
            </Grid>
            <Grid item>
              <Field
                component={TextField}
                multiline
                label="URIs (one per line)"
                name="authorityURIs"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleURIsChange(e, setFieldValue)
                }
                value={(values.authorityURIs || []).join('\n')}
              />
            </Grid>
            <Grid item>
              <SaveButton />
              <CancelButton onClick={stopEditing}>Cancel</CancelButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
