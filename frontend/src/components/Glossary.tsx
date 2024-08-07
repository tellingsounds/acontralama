/**
 * Wrapper for the generated glossary.md file.
 */
import React from 'react';
import { MarkdownText } from './MarkdownText';

import markdown from '../generated/glossary.md';

import { EmptyObject } from 'types';

export const Glossary: React.FC<EmptyObject> = () => (
  <div style={{ padding: '15px' }}>
    <MarkdownText source={markdown}></MarkdownText>
  </div>
);
