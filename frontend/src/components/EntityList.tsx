/**
 * Display list of Entities
 */
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GridColDef,
  // GridFilterModel,
  GridSortModel,
  GridValueGetterParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid';
import {
  Button,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Theme,
  Tooltip,
  Typography,
  useTheme,
  withStyles,
} from '@material-ui/core';
import { createStyles, alpha, makeStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import {
  CustomDataGrid as DataGrid,
  // makeHandlePageChange,
  // makeHandlePageSizeChange,
  // makeHandleSortModelChange,
} from './CustomDataGrid';

// import { doAddEntities } from '../actionCreators/entities';
import { doFetchError } from '../actionCreators/app';
import { getReadOnly } from '../selectors/app';
import { getEntityListState } from '../selectors/entityList';

import { allEntityTypes, getTypeLabel } from '../constants/entityTypes';

import { setLocalStorageItem } from '../services/localStorage';

import { AutocompleteEntities } from './AutocompleteEntities';
import { AdditionalTagCheckboxes } from './AdditionalTagCheckboxes';
import { AdditionalTagMarkers } from './AdditionalTagMarkers';
import { Chip } from './Chip';
import { PopoverButton } from './PopoverButton';
import { SearchBoxDebounced as SearchBox } from './SearchBox';

import { getEntities } from '../services/api';

import { formatIsoDate } from '../util';

// import { getFromLocalStorageMaybe } from '../services/localStorage';

import { EmptyObject } from '../types';
import { EntityType } from '../types/entities';
import {
  doUpdateEntityListData,
  doUpdateEntityListConfig,
  doSetEntityListPage,
} from '../actionCreators/entityList';

const L_PAGE_SIZE = 'lama.EntityList.pageSize';
const L_SORT_MODEL = 'lama.EntityList.sortModel';

const useStyles = makeStyles(theme =>
  createStyles({
    searchBox: {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
      },
    },
  }),
);

const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 13,
    maxWidth: theme.spacing(65),
  },
}))(Tooltip);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const columns: GridColDef[] = [
  {
    field: 'label',
    headerName: 'Label',
    disableColumnMenu: true,
    flex: 0.4,
    renderCell: function RenderPlatform(params: GridValueFormatterParams) {
      return <Chip entityId={params.row.id ? (params.row.id as string) : ''} />;
    },
  },
  {
    field: 'type',
    headerName: 'Type',
    disableColumnMenu: true,
    flex: 0.2,
    sortComparator: (v1, v2) =>
      getTypeLabel(v1 as EntityType).localeCompare(
        getTypeLabel(v2 as EntityType),
      ),
    valueFormatter: (params: GridValueGetterParams) =>
      `${getTypeLabel(params.value as EntityType)}`,
  },
  {
    field: 'description',
    headerName: 'Description',
    disableColumnMenu: true,
    flex: 0.5,
    renderCell: function RenderPlatform(params: GridValueFormatterParams) {
      const l = params.value as string;
      return (
        <StyledTooltip placement="bottom-start" title={l}>
          <Typography style={{ fontSize: 14 }}>{l}</Typography>
        </StyledTooltip>
      );
    },
  },
  {
    field: 'associated',
    headerName: 'Associated Entities',
    // width: 260,
    flex: 0.6,
    sortable: false,
    disableColumnMenu: true,
    renderCell: function RenderPlatform(params: GridValueFormatterParams) {
      return params.value
        ? (params.value as string[]).map((v, i) => (
            <Chip entityId={v} key={i} />
          ))
        : '-';
    },
  },
  {
    field: 'date',
    headerName: 'Date',
    // width: 260,
    flex: 0.1,
    disableColumnMenu: true,
    renderCell: function RenderCreationDate(params: GridValueFormatterParams) {
      // this should probably be a component (duplicated in viewFieldInfo)
      return params.value ? (
        <StyledTooltip placement="bottom-start" title={params.value}>
          <Typography style={{ fontSize: '0.8rem' }}>
            <code>{params.value}</code>
          </Typography>
        </StyledTooltip>
      ) : (
        '-'
      );
    },
  },
  {
    field: 'createdBy',
    headerName: 'User',
    disableColumnMenu: true,
    flex: 0.14,
    valueFormatter: (params: GridValueGetterParams) =>
      `${params.value ? (params.value as string) : 'empty'}`,
  },
  {
    field: 'updated',
    headerName: 'Updated on',
    disableColumnMenu: true,
    flex: 0.2,
    valueFormatter: (params: GridValueGetterParams) =>
      `${params.value ? formatIsoDate(params.value as string) : 'empty'}`,
  },
  {
    field: 'usageCount',
    headerName: '#',
    flex: 0.15,
    disableColumnMenu: true,
    description: 'Usage count',
    headerAlign: 'center',
    align: 'center',
  },
];

export const allowedSortFields = [
  'label',
  'type',
  'createdBy',
  'date',
  'updated',
  'usageCount',
];

export const EntityList: FC<EmptyObject> = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const readOnlyMode = useSelector(getReadOnly);
  const entityListState = useSelector(getEntityListState);
  const {
    entityIds,
    matchAll,
    pageBeforeAfter,
    catFilters,
    selectedTypes,
    pageSize,
    searchText,
    sortModel,
  } = entityListState.config;
  const { firstLastIndex, page, rows, totalCount } = entityListState.data;
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    let active = true;
    const [pageBefore, pageAfter] = pageBeforeAfter;
    (async () => {
      try {
        setLoading(true);
        const data = await getEntities({
          entityIds: entityIds.length > 0 ? entityIds : undefined,
          entitiesAll: matchAll || undefined,
          match: searchText,
          type: selectedTypes.length > 0 ? selectedTypes : undefined,
          cats: catFilters.length > 0 ? catFilters : undefined,
          pageSize,
          pageAfter,
          pageBefore,
          sortBy: sortModel.length > 0 ? sortModel : undefined,
        });
        if (!active) {
          return;
        }
        dispatch(doUpdateEntityListData(data));
        setLoading(false);
      } catch (e) {
        dispatch(doFetchError(e));
      }
    })();
    return () => {
      active = false;
    };
  }, [
    dispatch,
    entityIds,
    matchAll,
    pageBeforeAfter,
    pageSize,
    searchText,
    selectedTypes,
    sortModel,
    catFilters,
  ]);

  const handleSortModelChange = React.useCallback(
    function (model: GridSortModel) {
      const newSortModel = [
        ...model,
        ...sortModel
          .filter(sortItem => allowedSortFields.includes(sortItem.field))
          .filter(sortItem => sortItem.field !== model[0]?.field),
      ];
      dispatch(
        doUpdateEntityListConfig({
          sortModel: newSortModel,
          pageBeforeAfter: [undefined, undefined],
        }),
      );
      setLocalStorageItem(L_SORT_MODEL, newSortModel);
    },
    [dispatch, sortModel],
  );
  const handlePageSizeChange = React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const newPageSize = Number(event.target.value);
      dispatch(doUpdateEntityListConfig({ pageSize: newPageSize }));
      setLocalStorageItem(L_PAGE_SIZE, newPageSize);
    },
    [dispatch],
  );
  const handlePageChange = React.useCallback(
    function (_event: any, newPage: number) {
      dispatch(doSetEntityListPage(newPage));
    },
    [dispatch],
  );

  const handleSelectedTypesChange = React.useCallback(
    function (event: React.ChangeEvent<{ value: unknown }>) {
      dispatch(
        doUpdateEntityListConfig({
          selectedTypes: event.target.value as EntityType[],
          pageBeforeAfter: [undefined, undefined],
        }),
      );
    },
    [dispatch],
  );
  const handleClearSelectedTypes = React.useCallback(
    function () {
      dispatch(
        doUpdateEntityListConfig({
          selectedTypes: [],
          pageBeforeAfter: [undefined, undefined],
        }),
      );
    },
    [dispatch],
  );
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(doUpdateEntityListConfig({ searchText: event.target.value }));
  };
  const handleCatFilterChange = React.useCallback(
    function (newValue: string[]) {
      const catFilters = newValue;
      dispatch(
        doUpdateEntityListConfig({
          catFilters: catFilters,
          pageBeforeAfter: [undefined, undefined],
        }),
      );
    },
    [dispatch],
  );
  // const handleFilterModelChange = React.useCallback(
  //   function (model: GridFilterModel) {
  //     const newFilterUserValue =
  //       model.items.find(fm => fm.columnField === 'createdBy')?.value || '';
  //     dispatch(
  //       doUpdateEntityListConfig({
  //         filterUser: newFilterUserValue,
  //       }),
  //     );
  //   },
  //   [dispatch],
  // );

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '4px 4px 4px 0px',
        }}
      >
        <Paper
          elevation={2}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            paddingLeft: '0px',
            // paddingLeft: '12px', // needed, when catFilter is there
            flexShrink: 2,
          }}
        >
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <PopoverButton icon={<CheckIcon />} label="A.C.">
              <AdditionalTagCheckboxes
                onChange={handleCatFilterChange}
                value={catFilters}
              />
            </PopoverButton>
            <AdditionalTagMarkers selectedTags={catFilters} />
          </span>
        </Paper>
        <Paper
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 4,
            marginRight: 4,
          }}
        >
          <Select
            fullWidth
            style={{
              maxWidth: '100%',
            }}
            multiple
            value={selectedTypes}
            onChange={handleSelectedTypesChange}
            input={<Input />}
            displayEmpty
            renderValue={_selected => (
              <span
                style={{
                  padding: '4px',
                  paddingLeft: '4px',
                }}
              >
                {selectedTypes.length === 0
                  ? 'Filter by type...'
                  : selectedTypes.map(getTypeLabel).join(', ')}
              </span>
            )}
            MenuProps={MenuProps}
          >
            {allEntityTypes.map(et => (
              <MenuItem
                key={et}
                value={et}
                style={{
                  fontWeight: selectedTypes.includes(et)
                    ? theme.typography.fontWeightBold
                    : theme.typography.fontWeightRegular,
                }}
              >
                {getTypeLabel(et)}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            onClick={() => {
              handleClearSelectedTypes();
            }}
            style={{ padding: '8px' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Paper>
        <Paper
          className={classes.searchBox}
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            marginLeft: !readOnlyMode ? 8 : 4,
            marginRight: !readOnlyMode ? 12 : 4,
          }}
        >
          <Button
            onClick={() => {
              dispatch(
                doUpdateEntityListConfig({
                  matchAll: !matchAll,
                }),
              );
            }}
            title="Match ALL or ANY"
          >
            {matchAll ? 'ALL' : 'ANY'}
          </Button>
          <AutocompleteEntities
            simpleField
            label="Filter associated entities..."
            types={[]}
            onChange={function (e) {
              dispatch(doUpdateEntityListConfig({ entityIds: e.target.value }));
            }}
            value={entityIds}
          />
        </Paper>
        <SearchBox
          placeholder="Label or description contains..."
          onChange={handleSearchChange}
          value={searchText}
        />
      </div>
      <DataGrid
        columns={columns}
        disableColumnFilter
        loading={loading}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        // onFilterModelChange={handleFilterModelChange}
        onSortModelChange={handleSortModelChange}
        page={page}
        pageSize={pageSize}
        rowCount={totalCount}
        rowIndexFirst={firstLastIndex[0]}
        rowIndexLast={firstLastIndex[1]}
        rows={rows}
      />
    </>
  );
};
