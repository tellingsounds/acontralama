import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';

import { getSavingState } from '../../selectors/app';

interface Props {
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const SaveButton: React.FC<Props> = ({ disabled = false, onClick }) => {
  const isSaving = useSelector(getSavingState);
  return onClick !== undefined ? (
    <Button onClick={onClick} disabled={isSaving || disabled}>
      Save
    </Button>
  ) : (
    <Button type="submit" disabled={isSaving || disabled}>
      Save
    </Button>
  );
};
