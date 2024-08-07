/**
 * Inputform for Timecodes
 */
import React from 'react';

import { PureDuration as Duration } from './formComponents/Duration';
import { withFormikErrors } from './formComponents/withFormikErrors';

export interface TimecodesInputProps {
  error?: boolean;
  helperText?: string;
  name: string;
  onBlur?: (event: any) => void;
  onChange: (event: {
    target: { name: string; value: [number, number] };
  }) => void;
  value: [number, number];
}

export const TimecodesInput: React.FC<TimecodesInputProps> = ({
  error,
  helperText,
  name,
  onBlur = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onChange,
  value,
}) => {
  const handleChange = (newValue: [number, number]) => {
    onChange({ target: { name, value: newValue } });
  };
  const handleFieldChange =
    (index: 0 | 1) => (event: { target: { value: number } }) => {
      handleChange(
        value.map((x, i) => (i === index ? event.target.value : x)) as [
          number,
          number,
        ],
      );
    };
  return (
    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem' }}>
      <Duration
        error={error}
        name={`${name}.start`}
        label="Timecode Start"
        onBlur={onBlur}
        onChange={handleFieldChange(0)}
        value={value[0]}
      />
      <Duration
        error={error}
        helperText={helperText}
        name={`${name}.end`}
        label="Timecode End"
        onBlur={onBlur}
        onChange={handleFieldChange(1)}
        value={value[1]}
      />
    </div>
  );
};

export const TimecodesInputFormik = withFormikErrors(TimecodesInput);
