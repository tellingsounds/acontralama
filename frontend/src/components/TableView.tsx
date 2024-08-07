/**
 * Display ClipBasic, Entity or Annotation in Table-like fashion.
 */
import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';

import { CompactAnnotation } from './CompactAnnotation';
import { PlusButton } from './PlusButton';

import { shouldLockFormOnTheLeft } from '../selectors/app';
import { doSetEditingLeft } from '../actionCreators/app';
import { doCreateConnection } from '../actionCreators/sidePanel';

import { connectionRelationInfo } from '../connectionFormInfo';
import {
  AorV,
  BasicField,
  basicLabels,
  basicRenderers,
} from '../viewFieldInfo';
import { isEmpty } from '../util';

import { Relation } from '../types/relations';

export interface TableViewItemProps {
  label: string;
  contents: ReactNode;
  use39?: boolean;
}

const TableViewItem: React.FC<TableViewItemProps> = ({
  label,
  contents,
  use39 = false,
}) => {
  return (
    <Grid container direction="row" alignItems="flex-start">
      <Grid item md={use39 ? 3 : 2}>
        <Typography color="textSecondary">{label}:</Typography>
      </Grid>
      <Grid item md={use39 ? 9 : 10}>
        {contents}
      </Grid>
    </Grid>
  );
};

export const getBasicTableViewItems = (
  fields: BasicField[],
  data: {
    [F in BasicField]?:
      | string
      | string[]
      | number
      | AorV
      | Array<[number, number]>;
  },
) =>
  fields
    .filter(f =>
      Array.isArray(data[f])
        ? (data[f] as Array<string>).length > 0
        : !isEmpty(data[f]),
    )
    .map(f => {
      const value = data[f];
      const renderer = basicRenderers[f];
      const label = basicLabels[f];
      const RenderComponent = renderer;
      return {
        label,
        // contents: <RenderComponent value={value} />,
        contents: RenderComponent({ value }),
      };
    });

export const getAnnotTableViewItems = (
  relations: Relation[],
  data: { [R in Relation]?: string[] },
  withSegmentLink?: boolean,
) => {
  // console.log('getAnnotTableViewItems', relations, data);

  return relations
    .filter(r => data[r] && data[r]!.length > 0)
    .map(r => {
      const annotIds = data[r]!;
      const label = connectionRelationInfo[r].label;
      return {
        label,
        contents: (
          <>
            {annotIds.map(annotId => (
              <CompactAnnotation
                key={annotId}
                annotationId={annotId}
                withSegmentLink={withSegmentLink}
              />
            ))}
          </>
        ),
      };
    });
};

interface Props {
  items: TableViewItemProps[];
  extraInfo?: string;
  editButton?: boolean;
  extraButtonRight?: ReactNode;
  plusButtonOptions?: Relation[];
  use39?: boolean; // small version (for SidePanel)
}

export const TableView: React.FC<Props> = ({
  items,
  extraInfo,
  editButton = false,
  extraButtonRight,
  plusButtonOptions = [],
  use39 = false,
}) => {
  const dispatch = useDispatch();
  const isEditLocked = useSelector(shouldLockFormOnTheLeft);
  return (
    <Grid container spacing={2} direction="column" wrap="nowrap">
      <Grid item>
        {(editButton || extraButtonRight) && (
          <Grid container direction="row" justifyContent="flex-end">
            {editButton && (
              <Grid item>
                <Button
                  onClick={() => {
                    if (!isEditLocked) {
                      dispatch(doSetEditingLeft(true));
                    } else {
                      alert('Please finish your other edits first!');
                    }
                  }}
                >
                  Edit
                </Button>
              </Grid>
            )}
            {extraButtonRight && <Grid item>{extraButtonRight}</Grid>}
          </Grid>
        )}
        {plusButtonOptions.length > 0 && (
          <Grid container direction="row">
            <Grid item>
              <PlusButton
                options={plusButtonOptions.map(r => ({
                  text: connectionRelationInfo[r].label,
                  handleClick: () => {
                    dispatch(doCreateConnection(r));
                  },
                }))}
              />
            </Grid>
          </Grid>
        )}
        <Grid container direction="column" spacing={1} wrap="nowrap">
          {items.map((item, i) => (
            <Grid item key={i}>
              <TableViewItem {...item} use39={use39} />
            </Grid>
          ))}
        </Grid>
        {extraInfo && (
          <Grid container direction="row">
            <Grid item style={{ marginTop: '16px' }}>
              <Typography color="textSecondary" style={{ fontSize: 'smaller' }}>
                {extraInfo}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
