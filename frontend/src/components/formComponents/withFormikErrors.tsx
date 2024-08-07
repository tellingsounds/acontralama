import React, { ComponentType, FC, ReactNode } from 'react';
import { FieldInputProps, FormikProps } from 'formik';

interface FormikFieldPropsMaybe {
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
}

interface ErrorProps {
  error?: boolean;
  helperText?: ReactNode;
}

interface FieldProps {
  label: string;
  name: string;
}

export function withFormikErrors<P extends ErrorProps>(
  WrappedComponent: ComponentType<P>,
): FC<FieldProps & FormikFieldPropsMaybe & P> {
  return function wrappedWithFormikErrors({ field, form, ...props }) {
    const touched = form?.touched;
    const errors = form?.errors;
    const name = field?.name;
    let errorMaybe = null;
    if (name && touched && errors) {
      if (touched[name] && errors[name] && typeof errors[name] === 'string') {
        errorMaybe = errors[name];
      } else if (touched[name] && errors[name] && Array.isArray(errors[name])) {
        errorMaybe = [...new Set(errors[name] as string[])].join(', ');
      }
    }
    return (
      <WrappedComponent
        {...field}
        {...(props as P)}
        error={errorMaybe !== null}
        helperText={errorMaybe || props.helperText}
      />
    );
  };
}
