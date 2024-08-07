import React, { useState } from 'react';
import { DateInput } from './DateInput';

import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { Field } from 'formik';
import { withFormikErrors } from './withFormikErrors';

import { v4 as uuidv4 } from 'uuid';

interface Event {
  type: string;
  target: EventTarget;
}

interface InputFieldType {
  id: string;
  value: string;
}

interface Props {
  error?: boolean;
  //   helperText?: string;
  //   label: string;
  //   name: string;
  onBlur: (event: Event) => void;
  onChange: (event: {
    type: string;
    target: { name: string; value: string };
  }) => void;
  //   required?: boolean;
  value: string | null;
}

// TODO: does this retur any data??

const MultiDateInput: React.FC<Props> = (
  {
    // onChange, value, ...props
  },
) => {
  const [inputFields, setInputFields] = useState<InputFieldType[]>([
    { id: uuidv4(), value: '' },
  ]);
  //   const [isValid, setIsValid] = useState(true);
  //   const [hasError, setHasError] = useState(false);

  const handleChangeInput = (id: string, event: any) => {
    const newInputFields = inputFields.map((i: any) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });
    setInputFields(newInputFields);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), value: '' }]);
  };

  const handleRemoveFields = (id: string) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex(value => value.id === id),
      1,
    );
    setInputFields(values);
  };
  return (
    <div>
      {inputFields.map(inputField => (
        <Grid container key={inputField.id}>
          <Grid item xs={9}>
            <Field
              component={DateInput}
              label="Broadcast date"
              name="value"
              value={inputField.value}
              onChange={(event: any) => handleChangeInput(inputField.id, event)}
            />
          </Grid>
          <Grid item>
            <IconButton
              disabled={inputFields.length === 1}
              onClick={() => handleRemoveFields(inputField.id)}
            >
              <DeleteIcon></DeleteIcon>
            </IconButton>
            <IconButton onClick={handleAddFields}>
              <AddIcon></AddIcon>
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export { MultiDateInput as PureMultiDateInput };
const WrappedMultiDateInput = withFormikErrors(MultiDateInput);
export { WrappedMultiDateInput as MultiDateInput };
