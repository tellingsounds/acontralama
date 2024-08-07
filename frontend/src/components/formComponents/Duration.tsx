import React, { FC, useState } from 'react';

import { PureTextField as TextField } from './TextField';
import { withFormikErrors } from './withFormikErrors';
import { secondsToString } from '../../util';

const string2Secs = (s: string): number => {
  const re = RegExp(/^\d{2}:[0-5][0-9]:[0-5][0-9]$/);
  const isValid = re.test(s);
  if (!isValid) {
    throw 'Invalid duration/timecode (use "hh:mm:ss" format).';
  }
  return +s.split(':').reduce((acc, cur) => 60 * acc + +cur, 0);
};

const secs2String = (secs: number | null): string => {
  if (secs === null) {
    return '';
  }
  return secondsToString(secs);
};

// const REGEXP_1 = RegExp(/[0-5][0-9]/);

// function handleKeyUp(e) {
//   const target = e.target;
//   const charCode = e.which || e.keyCode;

//   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//     return false;
//   }

//   target.value = target.value.replace(REGEXP_1, ':');

//   return true;
// }

interface Event {
  type: string;
  target: EventTarget;
}
// TODO: find better solution for change handler / number (or let it be a
// string
interface Props {
  error?: boolean;
  helperText?: string;
  label: string;
  name: string;
  onBlur: (event: Event) => void;
  onChange: (event: {
    type: string;
    target: { name: string; value: number };
  }) => void;
  required?: boolean;
  value: number | null;
}

const Duration: FC<Props> = ({ onChange, value, ...props }) => {
  const [inputValue, setInputValue] = useState(secs2String(value));
  React.useEffect(() => {
    setInputValue(secs2String(value)); // handle change of value prop
  }, [value]);
  const [isValid, setIsValid] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <TextField
      {...props}
      error={props.error || hasError}
      helperText={
        !isValid ? 'Needs to be in HH:MM:SS format.' : props.helperText
      }
      onBlur={event => {
        if (!isValid) {
          setHasError(true);
        }
        props.onBlur(event);
      }}
      onChange={event => {
        const currentValue = event.target.value;
        setInputValue(currentValue);
        try {
          const seconds = string2Secs(currentValue);
          setIsValid(true);
          setHasError(false);
          onChange({
            type: 'change',
            target: { name: props.name, value: seconds },
          });
        } catch (e) {
          setIsValid(false);
        }
      }}
      placeholder="HH:MM:SS"
      value={inputValue}
    />
  );
};

export { Duration as PureDuration };
const WrappedDuration = withFormikErrors(Duration);
export { WrappedDuration as Duration };
