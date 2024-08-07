/**
 * Displays a list of Clips
 */
import React from 'react';
import { Button, IconButton, Paper, Typography } from '@material-ui/core';
import {
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridValueGetterParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid';
import { createStyles, alpha, makeStyles } from '@material-ui/core/styles';

import FilterListIcon from '@material-ui/icons/FilterList';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';

import { useDispatch, useSelector } from 'react-redux';

import { CustomDataGrid as DataGrid } from './CustomDataGrid';

import { Chip } from './Chip';
import { FCLCheckbox } from './FCLCheckbox';
import { Link } from './Link';
import { AutocompleteEntities } from './AutocompleteEntities';
import { SearchBoxDebounced as SearchBox } from './SearchBox';
import { PopoverButton } from './PopoverButton';

import { getClips } from '../services/api';

import { getUsername, getReadOnly } from '../selectors/app';
import { getClipListState } from '../selectors/clipList';
import { doFetchError } from '../actionCreators/app';
import {
  doSetClipListPage,
  doUpdateClipListConfig,
  doUpdateClipListData,
} from '../actionCreators/clipList';
import { allowedSortFields } from '../generated/clipList';
import { doSetFavoriteClip } from '../actionCreators/sagaActions';

import {
  secondsToString,
  formatIsoDate,
  withPathPrefix,
  StyledTooltip,
} from '../util';
import { setLocalStorageItem } from '../services/localStorage';

import { EmptyObject } from '../types';
import { DateInputWithoutBlur } from './formComponents';

const L_PAGE_SIZE = 'lama.ClipList.pageSize';
const L_SORT_MODEL = 'lama.ClipList.sortModel';

const useStyles = makeStyles(theme =>
  createStyles({
    searchBox: {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
      },
      flexGrow: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'row',
      marginLeft: 8,
    },
    dateSearch: {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
      },
      flexGrow: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'row',
      maxHeight: '2.3em',
      marginLeft: 8,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: alpha(theme.palette.common.black, 0.05),
        },
        '&.Mui-focused fieldset': {
          borderColor: alpha(theme.palette.common.black, 0.1),
        },
      },
    },
  }),
);

const columns: GridColDef[] = [
  {
    field: 'labelTitle',
    headerName: 'Title/Label',
    // width: 550,
    flex: 1,
    disableColumnMenu: true,
    renderCell: function RenderTitle(params: GridValueFormatterParams) {
      const l = params.value as string;
      return (
        <Link to={withPathPrefix(`/clip/${params.row.id}`)}>
          <StyledTooltip title={l} placement="bottom-start">
            <Typography>{l}</Typography>
          </StyledTooltip>
        </Link>
      );
    },
  },
  {
    field: 'fileType',
    headerName: 'A/V',
    // width: 60,
    flex: 0.15,
    disableColumnMenu: true,
    valueFormatter: (params: GridValueGetterParams) =>
      `${(params.row.fileType as string).toUpperCase()}`,
  },
  {
    field: 'duration',
    headerName: 'Duration',
    // width: 90,
    flex: 0.25,
    disableColumnMenu: true,
    valueFormatter: (params: GridValueGetterParams) =>
      `${secondsToString(params.row.duration as number)}`,
  },
  {
    field: 'platform',
    headerName: 'Platform',
    // width: 260,
    flex: 0.25,
    disableColumnMenu: true,
    renderCell: function RenderPlatform(params: GridValueFormatterParams) {
      return <Chip entityId={params.value as string} />;
    },
  },
  {
    field: 'associatedDate',
    headerName: 'Date',
    // width: 260,
    flex: 0.25,
    disableColumnMenu: true,
    renderCell: function RenderDate(params: GridValueFormatterParams) {
      // this should probably be a component (duplicated in viewFieldInfo)
      return params.value ? (
        <Typography style={{ fontSize: '0.8rem' }}>
          <code>{params.value}</code>
        </Typography>
      ) : (
        '-'
      );
    },
  },
  {
    field: 'createdBy',
    headerName: 'User',
    // width: 120,
    flex: 0.2,
    renderCell: function RenderUser(params: GridValueFormatterParams) {
      return (
        <StyledTooltip
          title={`created ${formatIsoDate(params.row.created as string)}`}
        >
          <Typography>{params.row.createdBy as string}</Typography>
        </StyledTooltip>
      );
    },
  },

  {
    field: 'updatedAny',
    headerName: 'Updated',
    // width: 170,
    flex: 0.35,
    disableColumnMenu: true,
    renderCell: function RenderUpdated(params: GridValueFormatterParams) {
      return (
        <StyledTooltip title={`by ${params.row.updatedAnyBy as string}`}>
          <Typography>{formatIsoDate(params.value as string)}</Typography>
        </StyledTooltip>
      );
    },
  },
  {
    field: 'annotationCount',
    headerName: '#',
    flex: 0.15,
    disableColumnMenu: true,
    description: 'Annotation count',
    headerAlign: 'center',
    align: 'center',
  },
];

const favoriteColumn = {
  field: 'isFavorite',
  headerName: 'Star',
  flex: 0.15,
  disableColumnMenu: true,
  sortable: false,
  renderCell: function RenderFavorite(params: GridValueFormatterParams) {
    const dispatch = useDispatch();
    const isFavorite = params.value as boolean;
    return (
      <StyledTooltip title="Favorite">
        <IconButton
          onClick={() => {
            dispatch(doSetFavoriteClip(params.row.id as string, !isFavorite));
            // reload clips? nope, update rows accordingly.
          }}
        >
          {isFavorite ? (
            <StarIcon style={{ fill: 'gold' }} />
          ) : (
            <StarOutlineIcon />
          )}
        </IconButton>
      </StyledTooltip>
    );
  },
};

export const ClipList: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUsername);
  const readOnlyMode = useSelector(getReadOnly);
  const columnsToUse = React.useMemo(
    function () {
      return readOnlyMode ? columns : [...columns, favoriteColumn];
    },
    [readOnlyMode],
  );
  const clipListState = useSelector(getClipListState);
  const {
    entityIds,
    favoritesOnly,
    filterUser,
    matchAll,
    matchNot,
    myClipsOnly,
    pageBeforeAfter,
    pageSize,
    searchText,
    dateSearch,
    sortModel,
  } = clipListState.config;
  const { firstLastIndex, page, rows, totalCount } = clipListState.data;
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    const [pageBefore, pageAfter] = pageBeforeAfter;
    (async () => {
      try {
        setLoading(true);
        const data = await getClips({
          entityIds: entityIds.length > 0 ? entityIds : undefined,
          entitiesAll: matchAll || undefined,
          matchNot: matchNot,
          favoritesOnly,
          match: searchText,
          matchDate: dateSearch,
          pageSize,
          pageAfter,
          pageBefore,
          createdBy: filterUser ? filterUser : undefined,
          sortBy: sortModel.length > 0 ? sortModel : undefined,
        });
        if (!active) {
          return;
        }
        dispatch(doUpdateClipListData(data));
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
    favoritesOnly,
    filterUser,
    matchAll,
    matchNot,
    pageBeforeAfter,
    pageSize,
    searchText,
    dateSearch,
    sortModel,
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
        doUpdateClipListConfig({
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
      dispatch(doUpdateClipListConfig({ pageSize: newPageSize }));
      setLocalStorageItem(L_PAGE_SIZE, newPageSize);
    },
    [dispatch],
  );
  const handlePageChange = React.useCallback(
    function (_event: any, newPage: number) {
      dispatch(doSetClipListPage(newPage));
    },
    [dispatch],
  );
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(doUpdateClipListConfig({ searchText: event.target.value }));
  };

  const handleDateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(doUpdateClipListConfig({ dateSearch: event.target.value }));
  };

  const handleMyClipsOnlyChange = React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const checked: boolean = event.target.checked;
      dispatch(
        doUpdateClipListConfig({
          myClipsOnly: checked,
          pageBeforeAfter: [undefined, undefined],
          filterUser: checked ? (currentUser as string) : '',
        }),
      );
    },
    [currentUser, dispatch],
  );
  const handleFavoritesOnlyChange = React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const checked: boolean = event.target.checked;
      dispatch(
        doUpdateClipListConfig({
          favoritesOnly: checked,
          pageBeforeAfter: [undefined, undefined],
        }),
      );
    },
    [dispatch],
  );
  const handleFilterModelChange = React.useCallback(
    function (model: GridFilterModel) {
      const newFilterUserValue =
        model.items.find(fm => fm.columnField === 'createdBy')?.value || '';
      dispatch(
        doUpdateClipListConfig({
          filterUser: newFilterUserValue,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 4,
        }}
      >
        {!readOnlyMode && (
          <Paper
            elevation={2}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PopoverButton
              icon={<FilterListIcon />}
              isActive={myClipsOnly || favoritesOnly}
              label="Filter"
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: '14px',
                }}
              >
                <FCLCheckbox
                  label="My Clips Only"
                  checked={myClipsOnly}
                  onChange={handleMyClipsOnlyChange}
                  color="primary"
                />
                <FCLCheckbox
                  label="Favorites Only"
                  checked={favoritesOnly}
                  onChange={handleFavoritesOnlyChange}
                  color="primary"
                />
              </div>
            </PopoverButton>
          </Paper>
        )}
        <Paper className={classes.searchBox}>
          <Button
            onClick={() => {
              dispatch(
                doUpdateClipListConfig({
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
            label="Filter by entities..."
            types={[]}
            onChange={e => {
              dispatch(doUpdateClipListConfig({ entityIds: e.target.value }));
            }}
            value={entityIds}
          />
          {/* New Button for Excluding Entities */}
          <Button
            onClick={() => {
              // Assuming `excludeEntities` is part of your clip list config
              dispatch(
                doUpdateClipListConfig({
                  matchNot: !matchNot, // Toggle the exclusion state
                }),
              );
            }}
            title="Toggle entity exclusion"
            style={{
              fontWeight: matchNot ? 'bold' : 'normal', // Bold when matchNot is true
              textShadow: matchNot
                ? '0 0 8px rgba(255, 255, 255, 0.9)'
                : 'none', // Glowing effect when matchNot is true
              backgroundColor: matchNot ? 'rgba(255, 100, 100, 0.6)' : '', // Red background when matchNot is true
            }}
          >
            {matchNot ? 'NOT' : 'NOT'}
          </Button>
        </Paper>
        {/* Needs EDTF validation (see DateInput, but that needs to be modified as well) */}
        <Paper className={classes.dateSearch}>
          <DateInputWithoutBlur
            label="Filter by EDTF date"
            name="dateSearch"
            value={dateSearch}
            onChange={(event: any) => handleDateInputChange(event)}
            variant="outlined"
            size="small"
          />
        </Paper>
        <SearchBox
          placeholder="Title contains..."
          onChange={handleSearchChange}
          value={searchText}
          style={{ minWidth: 500 }}
        />
      </div>
      <DataGrid
        columns={columnsToUse}
        loading={loading}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        onFilterModelChange={handleFilterModelChange}
        onSortModelChange={handleSortModelChange}
        page={page}
        pageSize={pageSize}
        rowCount={totalCount}
        rowIndexFirst={firstLastIndex[0]}
        rowIndexLast={firstLastIndex[1]}
        rows={rows}
      />
    </div>
  );
};
