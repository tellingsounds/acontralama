import React from 'react';
import { useFormikContext } from 'formik';
import { Button, ButtonProps } from '@material-ui/core';

interface Props extends ButtonProps {
  onClick: () => void;
}

export const CancelButton: React.FC<Props> = ({ onClick, ...props }) => {
  const { dirty } = useFormikContext();
  return (
    <Button
      onClick={() => {
        if (
          dirty &&
          !confirm('Are you sure you want to cancel? Your edits will be lost.')
        ) {
          return;
        }
        onClick();
      }}
      {...props}
    >
      Cancel
    </Button>
  );
};
