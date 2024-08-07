/**
 * Displays the results of the explore button of a QueryBlock.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { LinearProgress, Typography } from '@material-ui/core';
import {
  DataGrid,
  GridOverlay,
  GridValueFormatterParams,
} from '@material-ui/data-grid';
import { grey } from '@material-ui/core/colors';

import { QueryResultData } from '../types/query';
import { CompactAnnotation } from './CompactAnnotation';
import { ButtonLink } from './Link';

import { getConnectionTypeLabel } from '../connectionFormInfo';

import { doShowClipDetails } from '../actionCreators/sidePanel';

import { Relation } from '../types/relations';
import { StyledTooltip } from '../util';

const CustomLoadingOverlay = () => (
  <GridOverlay
    style={{
      backgroundColor: grey[300],
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        width: '100%',
      }}
    >
      <LinearProgress />
    </div>
  </GridOverlay>
);

const rowsFromResults = (blockId: string, resultData: QueryResultData) => {
  const { annotationData, clipData, elementData } = resultData;
  return (resultData.blockAnnotations[blockId] || [])
    .map(annotId => annotationData[annotId])
    .map(a => ({
      id: a._id,
      clipId: a.clip,
      clipLabel: clipData[a.clip].labelTitle,
      elementId: a.element,
      elementLabel: a.element
        ? elementData[a.element].type.replace('Noise', 'Other Sounds') +
          ': ' +
          elementData[a.element].label
        : '-',
      relationLabel: getConnectionTypeLabel(a.relation as Relation),
      annotationId: a._id,
    }));
};

interface Props {
  blockId: string;
  loading: boolean;
  resultData: QueryResultData;
}

export const QueryBlockResultGrid: React.FC<Props> = ({
  blockId,
  loading,
  resultData,
}) => {
  const dispatch = useDispatch();
  const cols = React.useMemo(
    () => [
      {
        field: 'clipLabel',
        headerName: 'Clip',
        flex: 0.3,
        filterable: false,
        renderCell: function RenderTitle(params: GridValueFormatterParams) {
          const l = params.value as string;
          return (
            <ButtonLink
              onClick={() => {
                dispatch(doShowClipDetails(params.row.clipId));
              }}
            >
              <StyledTooltip title={l} placement="bottom-start">
                <Typography>{l}</Typography>
              </StyledTooltip>
            </ButtonLink>
          );
        },
      },
      {
        field: 'elementLabel',
        headerName: 'Element',
        flex: 0.2,
      },
      {
        field: 'relationLabel',
        headerName: 'Relation',
        flex: 0.07,
      },
      {
        field: 'annotationId',
        headerName: 'Annotation',
        flex: 0.2,
        filterable: false,
        renderCell: function RenderAnnotation(
          params: GridValueFormatterParams,
        ) {
          return <CompactAnnotation annotationId={params.value as string} />;
        },
      },
    ],
    [dispatch],
  );
  const rows = rowsFromResults(blockId, resultData);
  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={cols}
      pageSize={25}
      rowsPerPageOptions={[25]}
      components={{
        LoadingOverlay: CustomLoadingOverlay,
      }}
    />
  );
};
