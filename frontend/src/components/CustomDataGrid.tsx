/**
 * Data grid for displaying a list of Clips
 * handles pagination
 */
import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridOverlay,
  GridSortModel,
} from '@material-ui/data-grid';
import { LinearProgress, TablePagination } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

import { setLocalStorageItem } from '../services/localStorage';

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

interface Props {
  columns: GridColDef[];
  disableColumnFilter?: boolean;
  loading: boolean;
  onChangePage: (_event: any, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterModelChange?: (model: GridFilterModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
  page: number;
  pageSize: number;
  rowCount: number;
  rowIndexFirst: number;
  rowIndexLast: number;
  rows: Array<{ [key: string]: any }>;
}

export const CustomDataGrid: React.FC<Props> = ({
  columns,
  disableColumnFilter = false,
  loading,
  onChangePage,
  onChangeRowsPerPage,
  onFilterModelChange,
  onSortModelChange,
  page,
  pageSize,
  rowCount,
  rowIndexFirst,
  rowIndexLast,
  rows,
}) => {
  return (
    <DataGrid
      disableColumnFilter={disableColumnFilter}
      rowCount={rowCount}
      loading={loading}
      rows={rows}
      columns={columns}
      pagination
      paginationMode="server"
      pageSize={pageSize}
      sortingOrder={['desc', 'asc']}
      sortingMode="server"
      onSortModelChange={onSortModelChange}
      filterMode="server"
      onFilterModelChange={onFilterModelChange}
      autoHeight
      components={{
        LoadingOverlay: CustomLoadingOverlay,
        Pagination: function CustomPagination() {
          return (
            <TablePagination
              component="div"
              rowsPerPageOptions={[16, 32, 64]}
              page={page}
              onPageChange={onChangePage}
              rowsPerPage={pageSize}
              onRowsPerPageChange={onChangeRowsPerPage}
              count={rowCount}
              labelDisplayedRows={({ count }) =>
                `Row ${Math.min(rowIndexFirst + 1, count)}-${
                  rowIndexLast + 1
                } of ${count}`
              }
              backIconButtonProps={{ disabled: loading || page <= 0 }}
              nextIconButtonProps={{
                disabled: loading || page >= Math.ceil(rowCount / pageSize) - 1,
              }}
            />
          );
        },
      }}
    />
  );
};

export const makeHandlePageChange =
  (
    rows: Array<{ [key: string]: any }>,
    setPageState: React.Dispatch<React.SetStateAction<number>>,
    setPageBeforeAfterState: React.Dispatch<
      React.SetStateAction<[string | undefined, string | undefined]>
    >,
  ) =>
  (_event: any, newPage: number) => {
    setPageState(prevPage => {
      if (newPage > prevPage) {
        setPageBeforeAfterState([undefined, rows[rows.length - 1].id]);
      } else if (newPage < prevPage) {
        setPageBeforeAfterState([rows[0].id, undefined]);
      }
      return Math.max(newPage, 0);
    });
  };

export const makeHandlePageSizeChange =
  (
    setPageSizeState: React.Dispatch<React.SetStateAction<number>>,
    localStorageKey: string,
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = Number(event.target.value);
    setLocalStorageItem(localStorageKey, newPageSize);
    setPageSizeState(newPageSize);
  };

export const makeHandleSortModelChange =
  (
    setSortModelState: React.Dispatch<React.SetStateAction<GridSortModel>>,
    allowedSortFields: string[],
    localStorageKey: string,
  ) =>
  (model: GridSortModel) => {
    setSortModelState(prevSortModel => {
      const newSortModel = [
        ...model,
        ...prevSortModel
          .filter(sortItem => allowedSortFields.includes(sortItem.field))
          .filter(sortItem => sortItem.field !== model[0]?.field),
      ];
      setLocalStorageItem(localStorageKey, newSortModel);
      return newSortModel;
    });
  };
