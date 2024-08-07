import React from 'react';

// import { SxProps } from '@material-ui/system';

export interface MenuItemData {
  uid?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  callback?: (event: React.MouseEvent<HTMLElement>, item: MenuItemData) => void;
  items?: MenuItemData[];
  disabled?: boolean;
  sx?: any;
}
