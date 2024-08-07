/**
 * Styling for MetaInfo (createdBy, updatedBy, etc.)
 */
import React from 'react';
import { Typography } from '@material-ui/core';

import { getMetaInfo } from '../util';
import { MetaMeta } from '../types/clips';

export const MetaInfo = <T extends MetaMeta>(props: { about: T }) => (
  <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
    {getMetaInfo(props.about)}
  </Typography>
);
