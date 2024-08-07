import React, { useEffect, useRef, useState } from 'react';
import { uniqueId } from 'lodash';
import {
  FilledInput,
  FilledInputProps,
  FormControl,
  FormHelperText,
  InputLabel,
} from '@material-ui/core';
import { withFormikErrors } from './withFormikErrors';

interface Props extends FilledInputProps {
  helperText?: string;
  label: string;
  InputLabelProps?: object; // eslint-disable-line @typescript-eslint/ban-types
  InputProps?: {
    ref?: React.Ref<any>;
    className?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
  variant?: string;
  size?: string;
}

const CustomTextField: React.FC<Props> = ({
  autoFocus = false,
  helperText,
  InputProps,
  InputLabelProps,
  ...props
}) => {
  const [inputId] = useState(() => uniqueId('textfield-'));
  const fieldRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      if (autoFocus && fieldRef.current !== null) {
        fieldRef.current.focus();
      }
    }, 100);
  }, [autoFocus]);
  const mergedRefs: React.Ref<HTMLInputElement | null> = inst => {
    const inputPropsRef = props.inputProps?.ref;
    if (inputPropsRef) {
      if (typeof inputPropsRef === 'function') {
        inputPropsRef(inst);
      } else {
        inputPropsRef.current = inst;
      }
    }
    fieldRef.current = inst;
  };
  return (
    <FormControl
      disabled={props.disabled}
      error={props.error}
      required={props.required}
      fullWidth
      variant="filled"
    >
      <InputLabel htmlFor={inputId} {...InputLabelProps}>
        {props.label}
      </InputLabel>
      <FilledInput
        {...props}
        {...InputProps}
        inputProps={{
          ...props.inputProps,
          ref: mergedRefs,
        }}
        id={inputId}
        type="text"
      />
      {helperText && (
        <FormHelperText id={`${inputId}-helpertext`}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const WrappedTextField = withFormikErrors(CustomTextField);

export { CustomTextField as PureTextField };
export { WrappedTextField as TextField };
