import React, { useState } from 'react';
import edtf from 'edtf';
import { Typography, Tooltip, withStyles, Theme } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import ReactMarkdown from 'react-markdown';

import { ExternalLink } from '../ExternalLink';
import { PureTextField as TextField } from './TextField';
import { TextField as MuiTextField } from '@material-ui/core';
import { withFormikErrors } from './withFormikErrors';

import quickEDTF from '../../help/quickEDTF.md';

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 10,
    padding: theme.spacing(2),
    minWidth: theme.spacing(50),
  },
}))(Tooltip);

const EDTFHelp = (
  <Typography component="div">
    <ReactMarkdown
      components={{
        a: node => (
          <ExternalLink href={node.href || ''}>{node.children}</ExternalLink>
        ),
      }}
    >
      {quickEDTF}
    </ReactMarkdown>
  </Typography>
);

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
    target: { name: string; value: string };
  }) => void;
  required?: boolean;
  value: string;
}

const LEVEL = 1;

const DateInput: React.FC<Props> = ({ onChange, value, ...props }) => {
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [isValid, setIsValid] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <TextField
      {...props}
      error={props.error || hasError}
      helperText={
        !isValid
          ? `Needs to be a valid EDTF (level ${LEVEL}) date`
          : props.helperText
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
          if (currentValue.trim() !== '') {
            edtf.parse(currentValue, { level: LEVEL });
          }
          setIsValid(true);
          setHasError(false);
          onChange({
            type: 'change',
            target: { name: props.name, value: currentValue },
          });
        } catch (e) {
          setIsValid(false);
        }
      }}
      placeholder={`EDTF (level ${LEVEL})`}
      value={inputValue}
      InputProps={{
        endAdornment: (
          <LightTooltip title={EDTFHelp} interactive>
            <HelpIcon style={{ cursor: 'help', opacity: 0.4 }} />
          </LightTooltip>
        ),
      }}
    />
  );
};

interface DateInputWithoutBlurProps {
  error?: boolean;
  helperText?: string;
  label: string;
  name: string;
  onChange: (event: {
    type: string;
    target: { name: string; value: string };
  }) => void;
  required?: boolean;
  value: string;
  variant: 'outlined' | 'standard' | 'filled';
  size: string;
}

const DateInputWithoutBlur: React.FC<DateInputWithoutBlurProps> = ({
  onChange,
  value,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [isValid, setIsValid] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <MuiTextField
      {...props}
      size="small"
      variant="outlined"
      fullWidth
      error={props.error || hasError}
      helperText={
        !isValid
          ? `Needs to be a valid EDTF (level ${LEVEL}) date`
          : props.helperText
      }
      onChange={event => {
        const currentValue = event.target.value;
        setInputValue(currentValue);
        try {
          if (currentValue.trim() !== '') {
            edtf.parse(currentValue, { level: LEVEL });
          }
          setIsValid(true);
          setHasError(false);
          onChange({
            type: 'change',
            target: { name: props.name, value: currentValue },
          });
        } catch (e) {
          setIsValid(false);
        }
      }}
      value={inputValue}
      InputProps={{
        endAdornment: (
          <LightTooltip title={EDTFHelp} interactive>
            <HelpIcon style={{ cursor: 'help', opacity: 0.4 }} />
          </LightTooltip>
        ),
      }}
    />
  );
};

export { DateInput as PureDateInput };
const WrappedDateInput = withFormikErrors(DateInput);
export { WrappedDateInput as DateInput };

export { DateInputWithoutBlur as PureDateInputWithoutBlur };
const WrappedDateInputWithoutBlur = withFormikErrors(DateInputWithoutBlur);
export { WrappedDateInputWithoutBlur as DateInputWithoutBlur };
