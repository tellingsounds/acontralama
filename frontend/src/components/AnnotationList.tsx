/**
 * Used to show Annotations in a List.
 * Note the optional getAnnotationData and getElementData (see QueryIntersectionResultView.tsx for a useage example.
 */
import React, { ChangeEvent, ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  IconButton,
  List,
  ListItem,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { flatten, groupBy, sortBy } from 'lodash';

import { CompactAnnotation } from './CompactAnnotation';
import { SearchBox } from './SearchBox';
import { getConnectionTypeLabel } from '../connectionFormInfo';

import { getAnnotationById } from '../selectors/clips';
import { getEntityById } from '../selectors/entities';

import { Annotation, ClipElement } from '../types/clips';
import { Entity } from '../types/entities';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: '100%',
      // minWidth: theme.spacing(32),
      maxWidth: theme.spacing(80),
      maxHeight: (props: Props) => theme.spacing(props.height || 30),
      overflow: 'auto',
      overflowX: 'hidden',
    },
    listItem: {
      display: 'inherit',
      paddingLeft: theme.spacing(1),
    },
    searchBox: {
      maxWidth: '100%',
    },
  }),
);

interface Props {
  annotationIds: string[];
  getAnnotationData?: (annotationId: string) => Annotation;
  getElementData?: (elementId: string) => Pick<ClipElement, 'label' | 'type'>;
  height?: number;
  leftButtonProps?: {
    icon: ReactNode;
    onClick: (annotationId: string) => void;
  };
  searchBox?: boolean;
}

export const AnnotationList = React.forwardRef(function AnnotationListRenderer(
  props: Props,
  ref: React.Ref<HTMLDivElement>,
) {
  const isSearchBoxShown = !(props.searchBox === false);
  const classes = useStyles(props);
  const getA = useSelector(getAnnotationById);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setFilterText(event.target.value);
  };
  const getEntity = useSelector(getEntityById) as (entityId: string) => Entity;
  const annotContains = React.useCallback(
    (annot: Annotation, text: string): boolean => {
      const targetLabel = annot.target ? getEntity(annot.target).label : '';
      const roleLabel = annot.role ? getEntity(annot.role).label : '';
      const quoteText = annot.quotes ? annot.quotes : '';
      const relationLabel = getConnectionTypeLabel(annot.relation);
      const dateText = annot.date || '';
      return [targetLabel, roleLabel, dateText, quoteText, relationLabel]
        .join(' ')
        .toLowerCase()
        .trim()
        .includes(text.toLowerCase());
    },
    [getEntity],
  );
  const filteredAnnots = props.annotationIds
    .map(props.getAnnotationData || getA)
    .filter(a => (filterText ? annotContains(a, filterText) : true));
  // group annotations by element
  const annotsToShow = flatten(
    Object.values(
      groupBy(
        sortBy(filteredAnnots, a => [
          getConnectionTypeLabel(a.relation),
          a.timecodeStart,
          a.timecodeEnd,
          a.element,
        ]),
        a => a.element || '__Clip',
      ),
    ),
  );

  const { leftButtonProps } = props;
  const hasLeftButton = Boolean(leftButtonProps);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      {isSearchBoxShown && (
        <SearchBox
          className={classes.searchBox}
          onChange={handleFilterTextChange}
        />
      )}
      <List className={classes.root}>
        {annotsToShow.length === 0 && (
          <ListItem role={undefined} dense className={classes.listItem}>
            <Typography color="textSecondary">No items.</Typography>
          </ListItem>
        )}
        {annotsToShow.map(annot => {
          return (
            <ListItem
              key={annot._id}
              role={undefined}
              dense
              className={classes.listItem}
            >
              <Grid container direction="row">
                {hasLeftButton && (
                  <Grid item>
                    <IconButton
                      onClick={() => leftButtonProps!.onClick(annot._id)}
                    >
                      {leftButtonProps!.icon}
                    </IconButton>
                  </Grid>
                )}
                <Grid item md={hasLeftButton ? 10 : 12}>
                  <CompactAnnotation
                    withDetails
                    annotationId={annot._id}
                    getAnnotationData={props.getAnnotationData}
                    getElementData={props.getElementData}
                  />
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
});
