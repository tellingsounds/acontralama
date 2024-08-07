/**
 * Display an Annotation in Chip-like style
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ButtonBase,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  withStyles,
  Theme,
} from '@material-ui/core';
import { orange, grey, pink } from '@material-ui/core/colors';
import LinkIcon from '@material-ui/icons/Link';

import { annotRenderers } from '../viewFieldInfo';

import { getAnnotationById, getClipElementById } from '../selectors/clips';
import { doShowConnection } from '../actionCreators/sidePanel';
import { doJumpTo } from '../actionCreators/sagaActions';

import { getConnectionTypeLabel } from '../connectionFormInfo';

import { getMetaInfo } from '../util';

import { TimecodeStartMaybeEnd } from './TimecodeStartMaybeEnd';

import { Annotation, ClipElement } from '../types/clips';

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: grey[100],
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[2],
    fontSize: 16,
    padding: theme.spacing(2),
  },
}))(Tooltip);

const AnnotationPreview: React.FC<{
  annotation: Annotation;
}> = ({ annotation }) => (
  <Grid container direction="column">
    {annotation.timecodeStart !== undefined && (
      <Grid item>
        <TimecodeStartMaybeEnd
          start={annotation.timecodeStart}
          end={annotation.timecodeEnd}
        />
      </Grid>
    )}
    <Grid item>
      <Typography component="span" color="textSecondary">
        Comment:
      </Typography>
      {!annotation.comment && <Typography component="span"> - </Typography>}
    </Grid>
    {annotation.comment && (
      <Grid item>
        <Typography>{annotation.comment}</Typography>
      </Grid>
    )}
    <Grid item>
      <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
        {getMetaInfo(annotation)}
      </Typography>
    </Grid>
  </Grid>
);

const getBackground = (a: Annotation): string => {
  switch (true) {
    case a.notablyAbsent && !a.interpretative:
      return pink[100];
    case !a.notablyAbsent && a.interpretative:
      return orange[100];
    case a.notablyAbsent && a.interpretative:
      const c1 = pink[100];
      const c2 = orange[100];
      return `repeating-linear-gradient(-35deg, ${c1}, ${c1} 6px, ${c2} 6px, ${c2} 12px)`;
    default:
      return grey[100];
  }
};

interface Props {
  annotationId: string;
  getAnnotationData?: (annotationId: string) => Annotation;
  getElementData?: (elementId: string) => Pick<ClipElement, 'label' | 'type'>;
  withDetails?: boolean;
  withSegmentLink?: boolean;
}

export const CompactAnnotation: React.FC<Props> = ({
  annotationId,
  getAnnotationData,
  getElementData,
  withDetails = false,
  withSegmentLink = false,
}) => {
  const dispatch = useDispatch();
  const getAnnotationDataGlobal = useSelector(getAnnotationById);
  const getA = getAnnotationData || getAnnotationDataGlobal;
  const annotation = getA(annotationId);
  const getElementDataGlobal = useSelector(getClipElementById);
  const getE = getElementData || getElementDataGlobal;
  const element = annotation.element ? getE(annotation.element) : undefined;
  const segmentId = annotation.segment ? annotation.segment : undefined;
  const color = annotation.notablyAbsent
    ? pink
    : annotation.interpretative
    ? orange
    : grey;
  return (
    <>
      <LightTooltip title={<AnnotationPreview annotation={annotation} />}>
        <ButtonBase
          style={{
            background: getBackground(annotation),
            borderRadius: 5,
            border: 'solid 1px',
            borderColor: color[300],
            boxSizing: 'border-box',
            minHeight: 30,
            padding: 2,
            paddingLeft: 5,
            paddingRight: 5,
            margin: 2,
          }}
          onClick={_event => {
            dispatch(doShowConnection(annotation));
          }}
        >
          {annotRenderers[annotation.relation]({ value: annotation })}
          {withSegmentLink && segmentId && (
            <IconButton
              title="Go to Segment"
              onClick={e => {
                e.preventDefault();
                dispatch(doJumpTo(segmentId, ['Segment', segmentId]));
              }}
              size="small"
            >
              <LinkIcon />
            </IconButton>
          )}
        </ButtonBase>
      </LightTooltip>
      {withDetails && (
        <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
          <strong>{getConnectionTypeLabel(annotation.relation)}</strong>
          {element && (
            <>
              {' '}
              on <strong>{element.label}</strong>
            </>
          )}
        </Typography>
      )}
    </>
  );
};
