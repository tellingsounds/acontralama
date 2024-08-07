/**
 * Display and edit annotations of a segment in sidepanel.
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { isEqual } from 'lodash';

import { AnnotationList } from './AnnotationList';
import { PopoverButton } from './PopoverButton';
import { SaveButton } from './formComponents/SaveButton';

import {
  getAnnotationIds,
  getSegmentById,
  getAnnotationById,
} from '../selectors/clips';
import { getInspectorState } from '../selectors/sidePanel';

import { doUpdateSegmentAnnots } from '../actionCreators/sagaActions';
import { doToggleEditingSegment } from '../actionCreators/sidePanel';

interface Props {
  segmentId: string;
}

export const InspectorSegmentAnnotationsList: React.FC<Props> = ({
  segmentId,
}) => {
  const dispatch = useDispatch();
  const setIsEditing = (isEditing: boolean) => {
    dispatch(doToggleEditingSegment(isEditing));
  };
  const segment = useSelector(getSegmentById)(segmentId);
  if (!segment) {
    throw new Error('no segment');
  }
  const allAnnotationIds = useSelector(getAnnotationIds);
  const getA = useSelector(getAnnotationById);
  const segmentAnnots = segment.segmentContains.map(sc => sc.annotation);

  const filteredAnnots = allAnnotationIds
    .map(getA)
    .filter(a => a.relation !== 'RInterpretationAnnot')
    .map(a => a._id);

  const { isEditingSegment } = useSelector(getInspectorState);
  const [selectedAnnots, setSelectedAnnots] = useState<string[]>(segmentAnnots);
  return (
    <div>
      <div>
        <Typography style={{ fontSize: 'larger' }}>{segment.label}</Typography>
        {!isEditingSegment && (
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </Button>
        )}
        {isEditingSegment && (
          <PopoverButton label="Add" icon={<AddIcon />}>
            <AnnotationList
              annotationIds={filteredAnnots.filter(
                annotId => !selectedAnnots.includes(annotId),
              )}
              leftButtonProps={{
                icon: <CheckIcon />,
                onClick: annotId => {
                  setSelectedAnnots(prev => [...prev, annotId]);
                },
              }}
            />
          </PopoverButton>
        )}
      </div>
      <AnnotationList
        annotationIds={isEditingSegment ? selectedAnnots : segmentAnnots}
        leftButtonProps={
          isEditingSegment
            ? {
                icon: <ClearIcon />,
                onClick: annotId => {
                  setSelectedAnnots(prev => prev.filter(a => a !== annotId));
                },
              }
            : undefined
        }
      />
      {isEditingSegment && (
        <div>
          <SaveButton
            onClick={() => {
              dispatch(doUpdateSegmentAnnots(segment._id, selectedAnnots));
            }}
          />
          <Button
            onClick={() => {
              if (
                !isEqual(
                  [...selectedAnnots].sort(),
                  [...segmentAnnots].sort(),
                ) &&
                !confirm(
                  'Are you sure you want to cancel? Your edits will be lost.',
                )
              ) {
                return;
              }
              setSelectedAnnots(segmentAnnots);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
