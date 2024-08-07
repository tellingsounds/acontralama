/**
 * Search panel (atm only features searchable quotes).
 */
import React from 'react';
import {
  Button,
  TextField,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import { useDispatch } from 'react-redux';

import { AutocompleteEntities } from './AutocompleteEntities';
import { QuoteSearchResultsView } from './QuoteSearchResultsView';

import { LamaIcon } from './LamaIcon';

import { doToggleSidePanel } from '../actionCreators/app';

import { getQuoteSearch, SearchResult } from '../services/api';

import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
    searchInputs: {
      display: 'flex',
      flexDirection: 'row',
    },
    textInput: {
      flex: 2,
    },
    autocomplete: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    searchButton: {
      background: '#c5cae9',
    },
    results: {
      // height: theme.spacing(88),
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    lamaIcon: {
      color: '#e8eaf6',
      marginTop: theme.spacing(7),
      fontSize: 800,
    },
  }),
);

export const SearchLand: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const textFieldRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    dispatch(doToggleSidePanel(true));
    return () => {
      dispatch(doToggleSidePanel(false));
    };
  }, [dispatch]);
  React.useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);
  const [searchStr, setSearchStr] = React.useState('');
  const [personIds, setPersonIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchResult | null>(
    null,
  );
  const handleSearch = function () {
    (async function () {
      try {
        setLoading(true);
        const result = await getQuoteSearch(searchStr, personIds);
        setSearchResults(result);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  };
  return (
    <div className={classes.root}>
      <div className={classes.searchInputs}>
        <TextField
          inputRef={textFieldRef}
          placeholder="Search in quotes..."
          className={classes.textInput}
          value={searchStr}
          onChange={function (e) {
            setSearchStr(e.target.value);
          }}
          onKeyUp={function (e) {
            e.preventDefault();
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <span className={classes.autocomplete}>
          <AutocompleteEntities
            simpleField
            label="with speaker(s)"
            types={['Person']}
            onChange={function (e) {
              setPersonIds(e.target.value);
            }}
            value={personIds}
          />
        </span>
        <Button className={classes.searchButton} onClick={handleSearch}>
          Search
        </Button>
      </div>
      {loading && <Typography>Loading...</Typography>}
      {searchResults === null && (
        <div className={classes.results}>
          <LamaIcon className={classes.lamaIcon} />
        </div>
      )}
      {searchResults && (
        <div className={classes.results}>
          <div>
            <QuoteSearchResultsView resultData={searchResults} />
          </div>
        </div>
      )}
    </div>
  );
};
