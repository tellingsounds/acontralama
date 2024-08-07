/**
 * Display a Segment in ClipOverview.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { IconButton, Typography, makeStyles } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';

import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';

import { sortBy } from 'lodash';

import { TableView, getAnnotTableViewItems } from './TableView';
import { Accordion } from './Accordion';
import { BasicSegmentForm } from './BasicSegmentForm';
import { MetaInfo } from './MetaInfo';
import { ButtonGroup } from './CustomButtonGroup';
import { PlusButton } from './PlusButton';
import { IconDeleteButton } from './DeleteButton';

import { doCreateConnectionSegment } from '../actionCreators/sidePanel';

import {
  supportedRelations,
  getConnectionTypeLabel,
  getConnectionTypeDefinition,
} from '../connectionFormInfo';

import {
  doActivateSegment,
  doDeactivateSegment,
  doSetEditingLeft,
} from '../actionCreators/app';
import { doJumpTo, doDeleteSegment } from '../actionCreators/sagaActions';
import {
  getActiveSegment,
  getEditingLeftState,
  // getUsername,
  getReadOnly,
  shouldLockFormOnTheLeft,
} from '../selectors/app';
import {
  getAnnotationById,
  getClipElementById,
  getClipLayerById,
  getCurrentClip,
} from '../selectors/clips';

import { Annotation, ClipElement, ClipLayer, Segment } from '../types/clips';
import { Relation } from '../types/relations';

const activeColor = lightBlue[500];

const useStyles = makeStyles({
  activeSegment: {
    '& .MuiIconButton-label': {
      // stroke: theme.palette.primary,
      stroke: activeColor,
    },
    '&.MuiIconButton-root': {
      boxShadow: '0 0 8px ' + activeColor,
    },
  },
});

type ElementTypeHere = 'ClipAnnotations' | 'Structure';

const elementTypesHere: ElementTypeHere[] = ['ClipAnnotations', 'Structure'];

const elementFields = {
  ...supportedRelations,
  ClipAnnotations: supportedRelations.Clip,
  MusicLayer: supportedRelations.MusicLayer,
  SoundLayer: supportedRelations.SoundLayer,
  SpeechLayer: supportedRelations.SpeechLayer,
};

const groupAnnots = (annots: Annotation[]) => {
  const byElementAndLayer = annots.reduce((acc, cur) => {
    const element = cur.element || 'ClipAnnotations';
    const layer = cur.layer || 'NoLayer';
    return {
      ...acc,
      [element]: {
        ...acc[element],
        [layer]: [...(acc[element]?.[layer] || []), cur],
      },
    };
  }, {} as Record<string, Record<string, Annotation[]>>);

  return Object.entries(byElementAndLayer).reduce(
    (acc, [elementId, layerId]) => ({
      ...acc,
      [elementId]: Object.entries(layerId).reduce(
        (acc, [layerId, elementAnnots]) => ({
          ...acc,
          [layerId]: elementAnnots.reduce(
            (rAcc, cur) => ({
              ...rAcc,
              [cur.relation]: [...(rAcc[cur.relation] || []), cur._id],
            }),
            {} as Record<Relation, Annotation[]>,
          ),
        }),
        {} as Record<string, Record<Relation, Annotation[]>>,
      ),
    }),
    {} as Record<string, Record<string, Record<Relation, Annotation[]>>>,
  );
};

interface Props {
  segmentProp?: Segment;
}

export const SegmentView: React.FC<Props> = ({ segmentProp }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const segment = segmentProp;
  const readOnlyMode = useSelector(getReadOnly);
  const activeSegment = useSelector(getActiveSegment);
  const isActive = segment?._id === activeSegment?._id;
  // const isUserSegment = useSelector(getUsername) === segment?.createdBy;
  const editingLeftState = useSelector(getEditingLeftState);
  const isEditingSegment = editingLeftState.category === 'Segment';
  const editingExistingSegmentId: string | null = isEditingSegment
    ? editingLeftState.id
    : null;
  const isEditLocked = useSelector(shouldLockFormOnTheLeft);
  const buttonsDisabled: boolean =
    editingLeftState.category !== null || isEditLocked;
  const getA = useSelector(getAnnotationById);
  const getE = useSelector(getClipElementById) as (id: string) => ClipElement;
  const getL = useSelector(getClipLayerById) as (id: string) => ClipLayer;
  const clip = useSelector(getCurrentClip);
  if (segment === undefined) {
    return (
      <Accordion defaultExpanded heading="Interpretation Basic">
        <BasicSegmentForm />
      </Accordion>
    );
  }

  const segmentInterpretationAnnot = () => {
    const interpretationAnnots = clip?.annotations['RInterpretationAnnot']
      .map((annotId: string) => {
        return getA(annotId);
      })
      .filter((annot: Annotation) => {
        return annot.segment === segment._id;
      });

    return {
      RInterpretationAnnot: interpretationAnnots?.map(annot => annot._id),
    };
  };

  const getElementType = (elementId: string) => getE(elementId).type;
  const byElementId = groupAnnots(
    sortBy(
      segment.segmentContains.map(sc => sc.annotation).map(getA),
      a => [a.timecodeStart || -1, a.timecodeEnd || -1, a.created],
      ['asc', 'asc', 'desc'],
    ),
  );

  const byElementType = Object.entries(byElementId).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k === 'ClipAnnotations' ? 'ClipAnnotations' : getElementType(k)]: {
        ...(acc[
          k === 'ClipAnnotations' ? 'ClipAnnotations' : getElementType(k)
        ] || {}),
        [k]: v,
      },
    }),
    {} as Record<
      'ClipAnnotations' | 'Segment' | 'Structure',
      Record<string, Record<Relation, string[]>>
    >,
  );

  return (
    <>
      {editingExistingSegmentId === segment._id ? (
        <BasicSegmentForm segment={segment} />
      ) : (
        <Typography>{segment.description}</Typography>
      )}
      <MetaInfo about={segment} />
      {!readOnlyMode && (
        <ButtonGroup
          disabled={buttonsDisabled}
          disabledTitle="Please finish editing first"
        >
          <PlusButton
            title="Add Interpretation annotation"
            options={supportedRelations.Segment.map(r => ({
              text: getConnectionTypeLabel(r),
              tooltip: getConnectionTypeDefinition(r),
              handleClick: () => {
                dispatch(doCreateConnectionSegment(r, segment._id));
              },
            }))}
          />
          <IconButton
            className={classNames({ [classes.activeSegment]: isActive })}
            title={
              isActive
                ? 'Deactivate'
                : 'Activate to add annotations in sidepanel'
            }
            onClick={() => {
              dispatch(
                isActive
                  ? doDeactivateSegment()
                  : doActivateSegment(segment._id),
              );
            }}
          >
            <PowerIcon />
          </IconButton>
          <IconButton
            title="Edit label and description"
            onClick={() => {
              dispatch(doSetEditingLeft(true, 'Segment', segment._id));
            }}
          >
            <EditIcon />
          </IconButton>
          {/* {isUserSegment && ( */}
          <IconDeleteButton
            onClick={() => {
              dispatch(doDeleteSegment(segment));
            }}
          />
          {/* )} */}
        </ButtonGroup>
      )}
      {clip?.annotations.RInterpretationAnnot && (
        <TableView
          items={getAnnotTableViewItems(
            ['RInterpretationAnnot'],
            segmentInterpretationAnnot(),
          )}
        />
      )}

      {elementTypesHere
        .filter(
          et =>
            byElementType[et] !== undefined &&
            Object.keys(byElementType[et]).length > 0,
        )
        .map(et => {
          return Object.entries(byElementType[et]).map(
            ([elementId, byLayer]) => {
              const heading =
                elementId === 'ClipAnnotations'
                  ? 'Clip Annotations'
                  : `${getE(elementId).label}`;
              return (
                <div key={elementId}>
                  <div>
                    <b>{heading}</b>
                    <IconButton
                      title="Go to"
                      onClick={e => {
                        e.preventDefault();
                        dispatch(doJumpTo(elementId, [et, elementId]));
                      }}
                      size="small"
                    >
                      <LinkIcon />
                    </IconButton>
                  </div>
                  {Object.entries(byLayer).map(([layerId, byRelation]) => {
                    if (layerId === 'NoLayer') {
                      // ClipAnnotations are a special case, they have the explicit marker 'NoLayer' in the data structure
                      return (
                        <div key={layerId}>
                          <TableView
                            items={getAnnotTableViewItems(
                              elementFields['ClipAnnotations'],
                              byRelation as unknown as Record<
                                Relation,
                                string[]
                              >,
                            )}
                          />
                        </div>
                      );
                    }
                    const layer = getL(layerId);
                    const layerHeading = `${layer.label} (${layer.type})`;
                    return (
                      <div key={layerId}>
                        <div>
                          {layerHeading}
                          <IconButton
                            title="Go to"
                            onClick={e => {
                              e.preventDefault();
                              dispatch(
                                doJumpTo(layerId, [et, elementId, layerId]),
                              );
                            }}
                            size="small"
                          >
                            <LinkIcon />
                          </IconButton>
                        </div>
                        <TableView
                          items={getAnnotTableViewItems(
                            elementFields[layer.type],
                            byRelation as unknown as Record<Relation, string[]>,
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            },
          );
        })}
    </>
  );
};
