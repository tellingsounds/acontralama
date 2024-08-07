/**
 * Displays an Entity (for example in the Sidepanel)
 */
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useHistory, useLocation } from 'react-router-dom';

import {
  Button,
  Grid,
  Typography,
  Chip as MuiChip,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import { Chip } from './Chip';
import { ExternalLink } from './ExternalLink';
import { DeleteButton } from './DeleteButton';
import { AdditionalTagMarkers } from './AdditionalTagMarkers';

import { getIsEditingLeft, getReadOnly } from '../selectors/app';
import { getInspectorState } from '../selectors/sidePanel';
import { doEditEntity } from '../actionCreators/sidePanel';
import { doDeleteEntity } from '../actionCreators/sagaActions';

import { catInfo } from '../constants/analysisCategories';

import { getTypeLabel } from '../constants/entityTypes';
import { getMetaInfo, withPathPrefix, withoutPathPrefix } from '../util';

import { withLoadingEntity } from './withLoadingEntity';

import { EntityResp } from '../types/entities';

interface Props {
  entity?: EntityResp;
  loading?: boolean;
}

const useStyles = makeStyles(theme =>
  createStyles({
    acChip: { margin: '2px' },
    title: {
      fontSize: 18,
    },
    buttonsContainer: {
      marginBottom: theme.spacing(1),
    },
  }),
);

const EntityView: FC<Props> = ({ entity, loading }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const isEditingLeft = useSelector(getIsEditingLeft);
  const readOnlyMode = useSelector(getReadOnly);
  const { isEditingConnection } = useSelector(getInspectorState);

  // ensure, that already existing entities have the new attributes
  entity &&
    !entity.attributes &&
    (entity.attributes = {
      composer: [],
      lyricist: [],
      dateOfCreation: '',
      associatedWith: [],
    });

  entity &&
    entity.attributes &&
    !entity.attributes.associatedWith &&
    (entity.attributes.associatedWith = []);

  if (loading || entity === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <Grid container spacing={1} direction="column" wrap="wrap">
      {![
        'VClipType',
        'Collection',
        'Platform',
        'VFunctionInClipRole',
        'VClipContributorRole',
        'VMusicPerformanceRole',
      ].includes(entity.type) &&
        !(
          withoutPathPrefix(location.pathname).startsWith('/explore') &&
          withoutPathPrefix(location.pathname).endsWith(entity._id)
        ) && (
          <Grid item>
            <div className={classes.buttonsContainer}>
              <Button
                onClick={function () {
                  history.push(withPathPrefix(`/explore/entity/${entity._id}`));
                }}
              >
                Explore
              </Button>
            </div>
          </Grid>
        )}
      <Grid item>
        <Grid container direction="row">
          <Grid item md={12}>
            <Typography
              component="div"
              className={classes.title}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {entity.label}

              <AdditionalTagMarkers
                selectedTags={entity.analysisCategories || []}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item md={2}>
            <Typography color="textSecondary">Type:</Typography>
          </Grid>
          <Grid item md={10}>
            {getTypeLabel(entity.type)}
          </Grid>
        </Grid>
        {entity.attributes?.dateOfCreation && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary">D.o.C.:</Typography>
            </Grid>
            <Grid item md={10}>
              <code>{entity.attributes?.dateOfCreation}</code>
            </Grid>
          </Grid>
        )}
        {entity.attributes?.associatedWith &&
          entity.attributes?.associatedWith.length > 0 && (
            <Grid container direction="row">
              <Grid item md={2}>
                <Typography color="textSecondary">Assoc.w.:</Typography>
              </Grid>
              <Grid item md={10}>
                {entity.attributes?.associatedWith.map(a => (
                  <Chip key={a} entityId={a} />
                ))}
              </Grid>
            </Grid>
          )}
        {entity.description && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary">Descr.:</Typography>
            </Grid>
            <Grid item md={10}>
              {entity.description}
            </Grid>
          </Grid>
        )}
        {entity.authorityURIs && entity.authorityURIs.length > 0 && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary">URIs:</Typography>
            </Grid>
            <Grid item md={9}>
              {entity.authorityURIs.map(u => (
                <Typography key={u}>
                  <ExternalLink key={u} href={u}>
                    {u}
                  </ExternalLink>
                </Typography>
              ))}
            </Grid>
          </Grid>
        )}
        {entity.analysisCategories && entity.analysisCategories.length > 0 && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary">A.C.:</Typography>
            </Grid>
            <Grid item md={9}>
              {entity.analysisCategories.map(ac => (
                <MuiChip
                  key={ac}
                  className={classes.acChip}
                  style={{
                    color: catInfo[ac].textColor,
                    backgroundColor: catInfo[ac].color,
                  }}
                  size="small"
                  label={catInfo[ac].label}
                />
              ))}
            </Grid>
          </Grid>
        )}
        {entity.attributes?.composer && entity.attributes.composer.length > 0 && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary">Composer:</Typography>
            </Grid>
            <Grid item md={9}>
              {entity.attributes.composer.map(personId => (
                <Chip entityId={personId} key={personId} />
              ))}
            </Grid>
          </Grid>
        )}
        {entity.attributes?.lyricist && entity.attributes.lyricist.length > 0 && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary">Lyricist:</Typography>
            </Grid>
            <Grid item md={9}>
              {entity.attributes.lyricist.map(personId => (
                <Chip entityId={personId} key={personId} />
              ))}
            </Grid>
          </Grid>
        )}
        {entity.usageCount !== undefined && (
          <Grid container direction="row">
            <Grid item md={2}>
              <Typography color="textSecondary"># Used:</Typography>
            </Grid>
            <Grid item md={9}>
              {entity.usageCount}
            </Grid>
          </Grid>
        )}
        {entity.created && (
          <Grid container direction="row">
            <Grid item md={12}>
              <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
                ID: &quot;{entity._id}&quot;
              </Typography>
              <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
                {getMetaInfo(entity)}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
      {!readOnlyMode && (
        <Grid item>
          <Button
            disabled={isEditingLeft || isEditingConnection}
            onClick={() => dispatch(doEditEntity(entity._id))}
          >
            Edit
          </Button>
          <DeleteButton
            onClick={() => {
              dispatch(doDeleteEntity(entity));
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

const WrappedEntityView = withLoadingEntity(EntityView);
export { WrappedEntityView as EntityView };
