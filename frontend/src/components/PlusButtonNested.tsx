/**
 * Nested Menu for Connections (Annotations)
 */
import React, { FC, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  IconButtonProps,
  MenuProps,
  ListItemText,
  SvgIcon,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
// import MusicNoteIcon from '@material-ui/icons/MusicNote';
// import FeedbackIcon from '@material-ui/icons/Feedback';
// import VolumeUpIcon from '@material-ui/icons/VolumeUp';
// import CropOriginalIcon from '@material-ui/icons/CropOriginal';

import {
  withStyles,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {
  getNestedElementLabel,
  getNestedElementRelations,
  getConnectionTypeLabel,
  getConnectionTypeDefinition,
} from '../connectionFormInfo';

import NestedMenuItem from './NestedMenuItem';

import { getIsEditingLeft, getIsEditingRight } from '../selectors/app';
import { doCreateConnectionLayer } from '../actionCreators/sidePanel';

import { StyledTooltip } from '../util';
import { NestedGroupLabels } from 'types/relations';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing(1),
      padding: 8,
    },
  }),
);

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps & { forBar?: boolean }) => {
  const { forBar, ...otherProps } = props;
  return (
    <Menu
      elevation={2}
      getContentAnchorEl={null}
      anchorOrigin={
        forBar
          ? {
              vertical: 'bottom',
              horizontal: 'center',
            }
          : {
              vertical: 'center',
              horizontal: 'right',
            }
      }
      transformOrigin={
        forBar
          ? {
              vertical: 'top',
              horizontal: 'center',
            }
          : { vertical: 'center', horizontal: 'left' }
      }
      {...otherProps}
    />
  );
});

const StyledMenuItem = withStyles(theme => ({
  root: {
    '& .MuiListItemIcon-root': {
      minWidth: '32px',
    },
    '&:active': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

// interface ButtonMenuItem {
//   text: string;
//   icon?: typeof SvgIcon;
//   handleClick: () => void;
//   tooltip?: string;
// }

interface Props extends IconButtonProps {
  forBar?: boolean;
  icon?: typeof SvgIcon;
  options: string[];
  text?: string;
  eId?: string;
  lId?: string;
}

export const PlusButtonNested: FC<Props> = ({
  forBar = false,
  icon = AddIcon,
  options,
  text = '',
  eId,
  lId,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const classes = useStyles();
  const IconComponent = icon;
  const dispatch = useDispatch();
  const isEditingLeft = useSelector(getIsEditingLeft);
  const isEditingRight = useSelector(getIsEditingRight);
  const isDisabled = isEditingLeft || isEditingRight;
  const [menuPosition, setMenuPosition] = useState<any>({
    top: 10,
    left: 10,
  });
  const menuItemRef = useRef<any>(null);

  const handleItemClick = (_event: React.MouseEvent) => {
    setMenuPosition(null);
  };

  return (
    <div>
      <IconButton
        title={isDisabled ? 'Please finish editing first...' : undefined}
        edge="start"
        className={forBar ? classes.button : undefined}
        color={forBar ? 'inherit' : undefined}
        aria-label="menu"
        onClick={event => {
          if (isDisabled) {
            alert('Please finish editing first!');
          } else {
            handleClick(event);
          }
        }}
        {...props}
      >
        <IconComponent fontSize={forBar ? 'large' : undefined} />
        {text}
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClick={handleClose}
        forBar={forBar}
      >
        {(options as NestedGroupLabels[]).map((o, i) => {
          return (
            <NestedMenuItem
              key={i}
              ref={menuItemRef}
              label={getNestedElementLabel(o)}
              parentMenuOpen={!!menuPosition}
              onClick={handleItemClick}
            >
              {getNestedElementRelations(o).map((r, j) => {
                const relLabel = getConnectionTypeLabel(r);
                const def = getConnectionTypeDefinition(r);
                return (
                  <StyledTooltip
                    key={j}
                    title={def || ''}
                    placement="right"
                    interactive
                  >
                    <StyledMenuItem
                      key={j}
                      onClick={() => {
                        dispatch(doCreateConnectionLayer(r, eId, lId));
                      }}
                    >
                      <ListItemText primary={relLabel} />
                    </StyledMenuItem>
                  </StyledTooltip>
                );
              })}
            </NestedMenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
};
