/**
 * Function to enable multi timecodes (Segment, Element)
 */
import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { FieldArray, useField } from 'formik';

// type ChangeHandler<T> = (event: { target: { name: string; value: T } }) => void;

interface FormProps<T = any> {
  error?: boolean;
  helperText?: string;
  name: string;
  onChange: (event: { target: { name: string; value: T } }) => void;
  value: T;
}

export function multi<T, P extends FormProps<T>>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<
  Pick<P, Exclude<keyof P, keyof FormProps>> & {
    defaultValue: T;
    labelIfEmpty?: string;
    min?: number;
    name: string;
  }
> {
  return function WrappedWithMulti({
    defaultValue,
    labelIfEmpty,
    min = 0,
    name,
    ...props
  }) {
    const [field, meta] = useField<T[]>({ name });
    const value = meta.value;
    const errors = (meta.error || []) as string[];
    return (
      <FieldArray name={name}>
        {({ insert, push, remove }) => (
          <>
            {value.map((v, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'start',
                  alignItems: 'center',
                  columnGap: '1rem',
                  marginBottom: i < value.length - 1 ? '1rem' : undefined,
                }}
              >
                <WrappedComponent
                  {...(props as any)} // hmmmm....
                  {...field}
                  name={`${name}.${i}`}
                  error={errors[i] !== undefined}
                  helperText={errors[i]}
                  value={v}
                />
                <span
                  style={{
                    marginBottom: errors[i] !== undefined ? '1rem' : undefined,
                  }}
                >
                  <IconButton
                    disabled={value.length <= min}
                    onClick={() => {
                      remove(i);
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (i === value.length - 1) {
                        push(defaultValue);
                      } else {
                        insert(i + 1, defaultValue);
                      }
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </span>
              </div>
            ))}
            {value.length === 0 && (
              <div>
                {labelIfEmpty ? (
                  <Button
                    onClick={() => {
                      push(defaultValue);
                    }}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    {labelIfEmpty}
                  </Button>
                ) : (
                  <IconButton
                    onClick={() => {
                      push(defaultValue);
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                )}
              </div>
            )}
          </>
        )}
      </FieldArray>
    );
  };
}
