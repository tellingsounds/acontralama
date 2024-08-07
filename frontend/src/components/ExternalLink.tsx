/**
 * Wrapper for external links.
 */
import React, { FC, ReactNode } from 'react';
import { Link } from '@material-ui/core';

interface Props {
  href: string;
  children: ReactNode;
}

export const ExternalLink: FC<Props> = ({ href, children }) => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    style={{ wordBreak: 'break-all' }}
  >
    {children}
  </Link>
);
