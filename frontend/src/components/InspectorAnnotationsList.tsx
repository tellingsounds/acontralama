/**
 * Wrapper for AnnotationList to be able to use it in Sidepanel.
 */
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { AnnotationList } from './AnnotationList';

import { getAnnotationIds } from '../selectors/clips';

import { EmptyObject } from '../types';

export const InspectorAnnotationsList: FC<EmptyObject> = () => {
  const annotationIds = useSelector(getAnnotationIds);
  return <AnnotationList annotationIds={annotationIds} />;
};
