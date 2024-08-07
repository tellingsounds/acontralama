/**
 * Wrap markdown text.
 */
import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

export const MarkdownText: FC<{ source: string }> = ({ source }) => (
  <Typography component="div">
    <ReactMarkdown>{source}</ReactMarkdown>
  </Typography>
);
