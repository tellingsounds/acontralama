/**
 * Custom delete button with confirmation message.
 */
import React from 'react';
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  deleteButton: {
    '&:hover': {
      color: '#f00',
    },
  },
});

const confirmationMessage = 'Are you sure? This cannot be undone.';

interface Props extends ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const DeleteButton: React.FC<Props> = ({ onClick, ...props }) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.deleteButton}
      aria-label="delete"
      onClick={e => {
        if (confirm(confirmationMessage)) {
          onClick(e);
        }
      }}
      {...props}
    >
      Delete
    </Button>
  );
};

interface IconProps extends IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const IconDeleteButton: React.FC<IconProps> = ({
  onClick,
  ...props
}) => (
  <IconButton
    aria-label="delete"
    title="Delete"
    onClick={e => {
      if (confirm(confirmationMessage)) {
        onClick(e);
      }
    }}
    {...props}
  >
    <DeleteIcon />
  </IconButton>
);
