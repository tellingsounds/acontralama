/**
 * Button with popover menu.
 */
import React, { useState } from 'react';
import { Button, Popover, PopoverOrigin, makeStyles } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import classNames from 'classnames';

const activeColor = lightBlue[500];

const useStyles = makeStyles({
  active: {
    '& .MuiButton-startIcon': {
      stroke: activeColor,
    },
    '& .MuiButton-label': {
      color: activeColor,
    },
    '&.MuiButton-root': {
      boxShadow: '0 0 8px ' + activeColor,
    },
  },
});

const defaultAnchorOrigin: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const defaultTransformOrigin: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

const bottomAnchorOrigin: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const bottomTransformOrigin: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

interface Props {
  children: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  paperStyle?: React.CSSProperties;
  anchorToBottom?: boolean;
  className?: string;
}

export const PopoverButton: React.FC<Props> = ({
  children,
  label,
  icon,
  isActive = false,
  paperStyle = {},
  anchorToBottom = false,
  className,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const isOpen = Boolean(anchorEl);
  return (
    <React.Fragment>
      <Popover
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={anchorToBottom ? bottomAnchorOrigin : defaultAnchorOrigin}
        transformOrigin={
          anchorToBottom ? bottomTransformOrigin : defaultTransformOrigin
        }
        marginThreshold={0}
        PaperProps={{ style: { maxWidth: '100%', padding: 5, ...paperStyle } }}
      >
        {children}
      </Popover>
      <Button
        className={classNames({ [classes.active]: isActive }, className)}
        startIcon={icon}
        title="Click to open"
        onClick={handleOpen}
      >
        {label}
      </Button>
    </React.Fragment>
  );
};
