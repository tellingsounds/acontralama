/**
 * Display an Annotation (for example in the Sidepanel)
 */
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { secondsToString, getMetaInfo } from '../util';
import { getConnectionTypeLabel } from '../connectionFormInfo';

import {
  getIsEditingLeft,
  // getUsername,
  getReadOnly,
  hasActiveClip,
} from '../selectors/app';
import { getInspectorState } from '../selectors/sidePanel';

import { doDeleteAnnotation } from '../actionCreators/sagaActions';
import {
  doClearAnnotationInspector,
  doEditConnection,
} from '../actionCreators/sidePanel';

import { AnnotationList } from './AnnotationList';
import { Chip } from './Chip';
import { CompactAnnotation } from './CompactAnnotation';
import { DeleteButton } from './DeleteButton';

import { Annotation } from '../types/clips';

const useStyles = makeStyles({
  title: {
    fontSize: 18,
  },
});

interface Props {
  annotation: Annotation;
}

export const ConnectionView: FC<Props> = props => {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const currentUser = useSelector(getUsername);
  const isEditingLeft = useSelector(getIsEditingLeft);
  const readOnlyMode = useSelector(getReadOnly);
  const { isEditingEntity } = useSelector(getInspectorState);
  const inClip = useSelector(hasActiveClip);
  const annot = props.annotation;
  React.useEffect(() => {
    return () => {
      dispatch(doClearAnnotationInspector());
    };
  }, [dispatch]);
  return (
    <Grid container spacing={1} direction="column" wrap="wrap">
      <Grid item>
        <Grid container direction="row">
          <Grid item md={12}>
            <Typography gutterBottom className={classes.title}>
              Relation: {getConnectionTypeLabel(annot.relation)}
            </Typography>
          </Grid>
        </Grid>
        {annot.interpretative && (
          <Grid container direction="row">
            <Grid item md={12}>
              <Typography>
                <strong>Interpretative / implied</strong>
              </Typography>
            </Grid>
          </Grid>
        )}
        {annot.notablyAbsent && (
          <Grid container direction="row">
            <Grid item md={12}>
              <Typography>
                <strong>Notably absent</strong>
              </Typography>
            </Grid>
          </Grid>
        )}
        {annot.interpretative && annot.refersTo && (
          <Grid container direction="row" style={{ paddingBottom: 8 }}>
            <Grid item md={12}>
              <Typography color="textSecondary">Refers to:</Typography>
            </Grid>
            <Grid item md={12}>
              <CompactAnnotation withDetails annotationId={annot.refersTo} />
            </Grid>
          </Grid>
        )}
        {annot.interpretative &&
          annot.constitutedBy &&
          annot.constitutedBy.length > 0 && (
            <Grid container direction="row">
              <Grid item md={12}>
                <Typography color="textSecondary">Constituted by:</Typography>
              </Grid>
              <Grid item md={12}>
                <AnnotationList
                  annotationIds={annot.constitutedBy}
                  searchBox={false}
                />
              </Grid>
            </Grid>
          )}
        {annot.fromPlatformMetadata && (
          <Grid container direction="row">
            <Grid item md={12}>
              <Alert variant="outlined" severity="info">
                Platform Metadata
              </Alert>
            </Grid>
          </Grid>
        )}
        {annot.target && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Target:
              </Typography>
            </Grid>
            <Grid item md={9}>
              <Chip entityId={annot.target} />
            </Grid>
          </Grid>
        )}
        {annot.role !== undefined && annot.role && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Role:
              </Typography>
            </Grid>
            <Grid item md={9}>
              {<Chip entityId={annot.role} />}
            </Grid>
          </Grid>
        )}
        {annot.quotes && (
          <>
            <Grid container direction="row">
              <Grid item md={3}>
                <Typography gutterBottom color="textSecondary">
                  Quote:
                </Typography>
              </Grid>
              <Grid item md={9}>
                {annot.quotes}
              </Grid>
            </Grid>
          </>
        )}
        {annot.quoteEntities && annot.quoteEntities.length > 0 && (
          <>
            <Grid container direction="row">
              <Grid item md={3}>
                <Typography gutterBottom color="textSecondary">
                  Quote Entities:
                </Typography>
              </Grid>
              <Grid item md={9}>
                {annot.quoteEntities.map((v, i) => (
                  <Chip key={i} entityId={v} />
                ))}
              </Grid>
            </Grid>
          </>
        )}
        {annot.instrument !== undefined && annot.instrument && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Instrument:
              </Typography>
            </Grid>
            <Grid item md={9}>
              {annot?.instrument}
            </Grid>
          </Grid>
        )}
        {annot.date !== undefined && annot.date && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Date:
              </Typography>
            </Grid>
            <Grid item md={9}>
              <code>{annot.date}</code>
            </Grid>
          </Grid>
        )}
        {annot.metaDate !== undefined && annot.metaDate && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Meta date:
              </Typography>
            </Grid>
            <Grid item md={9}>
              <code>{annot.metaDate}</code>
            </Grid>
          </Grid>
        )}
        {annot.timecodeStart !== undefined && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Timecode:
              </Typography>
            </Grid>
            <Grid item md={9}>
              {annot.timecodeEnd !== undefined
                ? secondsToString(annot.timecodeStart) +
                  ' - ' +
                  secondsToString(annot.timecodeEnd)
                : secondsToString(annot.timecodeStart)}
            </Grid>
          </Grid>
        )}
        {annot.confidence !== undefined && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Confidence:
              </Typography>
            </Grid>
            <Grid item md={9}>
              {annot.confidence}
            </Grid>
          </Grid>
        )}
        {annot.comment !== undefined && annot.comment && (
          <Grid container direction="row">
            <Grid item md={3}>
              <Typography gutterBottom color="textSecondary">
                Comment:
              </Typography>
            </Grid>
            <Grid item md={9}>
              {annot.comment}
            </Grid>
          </Grid>
        )}
        {annot.attribution && (
          <>
            <Grid container direction="row">
              <Grid item md={3}>
                <Typography gutterBottom color="textSecondary">
                  Attribution:
                </Typography>
              </Grid>
              <Grid item md={9}>
                {annot.attribution}
              </Grid>
            </Grid>
          </>
        )}
        {annot.created && (
          <Grid container direction="row">
            <Grid item md={12}>
              <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
                {getMetaInfo(annot)}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
      {inClip && !readOnlyMode && (
        <Grid item>
          <Button
            disabled={isEditingLeft || isEditingEntity}
            onClick={() => dispatch(doEditConnection())}
          >
            Edit
          </Button>
          {/* {currentUser === annot.createdBy && ( */}
          <DeleteButton
            onClick={() => {
              dispatch(doDeleteAnnotation(annot));
            }}
          />
          {/* )} */}
        </Grid>
      )}
    </Grid>
  );
};
