/**
 * SidePanel, home of a variety of Inspectors.
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, createStyles, makeStyles } from '@material-ui/core';

import { Accordion } from './Accordion';
import { InspectorEntity } from './InspectorEntity';
import { AnnotationView, AnnotationForm } from './InspectorAnnotation';
import { InspectorAnnotationsList } from './InspectorAnnotationsList';
import { InspectorClip } from './InspectorClip';
import { InspectorSegmentAnnotationsList } from './InspectorSegmentAnnotationsList';
import { InspectorShelfmarksList } from './InspectorShelfmarksList';
import { EntityQueryBuilder } from './EntityQueryBuilder';
// import { EntityQueryBuilderTemplatesView } from './EntityQueryBuilderTemplatesView';

import { doToggleSidePanel } from '../actionCreators/app';
import { doToggleAccordion } from '../actionCreators/sidePanel';
import { getActiveSegment } from '../selectors/app';
import { getCurrentClip } from '../selectors/clips';
import { getQbState, getQueryResults } from '../selectors/query';
import {
  getInspectorState,
  getSidePanelAccordionState,
} from '../selectors/sidePanel';

import { withoutPathPrefix } from '../util';

import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    sidePanel: {
      paddingBottom: theme.spacing(48),
    },
    noFlex: { display: 'block' },
  }),
);

export const SidePanel: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const { isEditingConnection, isEditingEntity, isEditingSegment } =
    useSelector(getInspectorState);
  const accordionState = useSelector(getSidePanelAccordionState);
  const isClipActive = useSelector(getCurrentClip) !== null;
  const activeSegment = useSelector(getActiveSegment);
  const { qbIsOpen } = useSelector(getQbState);
  const queryResultData = useSelector(getQueryResults);
  const hasQueryResult =
    Object.keys(queryResultData.intersectionByClip || {}).length > 0 ||
    Object.values(queryResultData.blockAnnotations).some(
      annotationIds => annotationIds.length > 0,
    );
  const dispatch = useDispatch();
  const location = useLocation();
  return (
    <div className={classes.sidePanel}>
      {!isClipActive &&
        ['/', '/entities'].some(
          p => p === withoutPathPrefix(location.pathname),
        ) && (
          <Button
            onClick={() => {
              dispatch(doToggleSidePanel(false));
            }}
          >
            Hide Side Panel
          </Button>
        )}
      {isClipActive && isEditingConnection && (
        <Accordion
          heading="Create / Edit Annotation"
          expanded={accordionState.connectionFormInspector}
          onChange={(_event, newExpanded) => {
            if (isEditingConnection && !newExpanded) {
              alert('Please finish editing first!');
            } else {
              dispatch(doToggleAccordion('connectionFormInspector'));
            }
          }}
        >
          <AnnotationForm />
        </Accordion>
      )}
      <Accordion
        heading="Entity Inspector"
        expanded={accordionState.entityInspector}
        onChange={(_event, newExpanded) => {
          if (isEditingEntity && !newExpanded) {
            alert('Please finish editing first!');
          } else {
            dispatch(doToggleAccordion('entityInspector'));
          }
        }}
      >
        <InspectorEntity />
      </Accordion>
      {['/explore', '/search', '/query'].some(s =>
        withoutPathPrefix(location.pathname).startsWith(s),
      ) && (
        <Accordion
          heading="Clip Inspector"
          expanded={accordionState.clipInspector}
          onChange={(_event, _newExpanded) => {
            dispatch(doToggleAccordion('clipInspector'));
          }}
        >
          <InspectorClip />
        </Accordion>
      )}
      {/* {location.pathname.startsWith('/query') && (
        <Accordion
          heading="Entity Query Templates"
          expanded={accordionState.entityQbTemplates}
          onChange={(_event, _newExpanded) => {
            dispatch(doToggleAccordion('entityQbTemplates'));
          }}
        >
          <EntityQueryBuilderTemplatesView />
        </Accordion>
      )} */}
      {qbIsOpen && withoutPathPrefix(location.pathname).startsWith('/query') && (
        <Accordion
          className={classes.noFlex}
          heading="Entity Query Builder"
          expanded={accordionState.entityQb}
          onChange={(_event, newExpanded) => {
            if (qbIsOpen && !newExpanded) {
              alert('Please finish editing first!');
            } else {
              dispatch(doToggleAccordion('entityQb'));
            }
          }}
        >
          <EntityQueryBuilder />
        </Accordion>
      )}
      {(isClipActive ||
        hasQueryResult ||
        withoutPathPrefix(location.pathname).startsWith('/search')) && (
        <Accordion
          heading="Annotation Inspector"
          expanded={accordionState.connectionViewInspector}
          onChange={() => {
            dispatch(doToggleAccordion('connectionViewInspector'));
          }}
        >
          <AnnotationView />
        </Accordion>
      )}
      {activeSegment !== undefined && (
        <Accordion
          heading="Interpretation Annotations"
          expanded={accordionState.segmentAnnotationsList}
          onChange={(_event, newExpanded) => {
            if (isEditingSegment && !newExpanded) {
              alert('Please finish editing first!');
            } else {
              dispatch(doToggleAccordion('segmentAnnotationsList'));
            }
          }}
        >
          <InspectorSegmentAnnotationsList segmentId={activeSegment._id} />
        </Accordion>
      )}
      {isClipActive && (
        <Accordion
          heading="Clip Annotations"
          expanded={accordionState.annotationsList}
          onChange={() => {
            dispatch(doToggleAccordion('annotationsList'));
          }}
          unmountContentsIfClosed
        >
          <InspectorAnnotationsList />
        </Accordion>
      )}
      {isClipActive && (
        <Accordion
          heading="Shelfmark Inspector"
          expanded={accordionState.shelfmarkList}
          onChange={() => {
            dispatch(doToggleAccordion('shelfmarkList'));
          }}
          // unmountContentsIfClosed
        >
          <InspectorShelfmarksList />
        </Accordion>
      )}
    </div>
  );
};
