/**
 * Link and ButtonLink (used for internal linking, eg. to a clip)
 */
import React, { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';

interface Props {
  children: ReactNode;
  to: string;
}

interface ButtonLinkProps {
  children: ReactNode;
  onClick: () => void;
}

export const Link: FC<Props> = ({ children, to }) => (
  <MuiLink component={RouterLink} to={to}>
    {children}
  </MuiLink>
);

export const ButtonLink: FC<ButtonLinkProps> = ({ children, onClick }) => (
  <MuiLink component="button" onClick={onClick} style={{ textAlign: 'left' }}>
    {children}
  </MuiLink>
);
