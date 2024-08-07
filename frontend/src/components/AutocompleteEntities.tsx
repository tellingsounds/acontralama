/**
 * Autocomplete for Entities
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  InputBase,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { debounce, isEqual } from 'lodash';
import useConstant from 'use-constant';

import { AdditionalTagMarkers } from './AdditionalTagMarkers';
import { Chip } from './Chip';
import { FCLCheckbox } from './FCLCheckbox';
import { PureTextField as TextField } from './formComponents/TextField';

import { withFormikErrors } from './formComponents/withFormikErrors';

import { matchEntities, suggestEntities } from '../services/api';

import { getErrorState } from '../selectors/app';
import { getEntityById } from '../selectors/entities';
import { doFetchError } from '../actionCreators/app';
import { doAddEntity } from '../actionCreators/entities';
import { doCreateEntity } from '../actionCreators/sidePanel';

import { getTypeLabel } from '../constants/entityTypes';

import { EntityResp, EntityType } from '../types/entities';

const OPTIONS_MAX = 50;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      minWidth: theme.spacing(24),
    },
    paper: {
      ...theme.typography.body1,
      overflow: 'hidden',
      margin: '4px 0',
      minWidth: theme.spacing(36),
    },
  }),
);

interface ChangeEvent<T> {
  type?: string;
  target: { name: string; value: T };
}

export interface Props {
  autoFocus?: boolean;
  canCreateNew?: boolean; // allow creation of a new entry
  disableClearable?: boolean; // passed on to MuiAutocomplete
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label: string;
  name?: string;
  onBlur?: (event: { type: string; target: { name: string } }) => void;
  onChange: (event: ChangeEvent<string[]>) => void;
  required?: boolean;
  simpleField?: boolean; // if true do not use filledInput styling, but more simple version
  singleValue?: boolean; // if true, only one item can be selected
  types: EntityType[]; // allowed EntityTypes in the list
  value: string[]; // ids of selected Entities
}

interface SelectOption extends EntityResp {
  inputValue?: string;
}

const areEqual = (prevProps: Props, nextProps: Props) =>
  isEqual(prevProps.types, nextProps.types) &&
  isEqual(prevProps.value, nextProps.value) &&
  prevProps.disabled === nextProps.disabled &&
  prevProps.error === nextProps.error &&
  prevProps.helperText === nextProps.helperText &&
  prevProps.required === nextProps.required;

export const AutocompleteEntities: React.FC<Props> = React.memo(
  function AutoCompleteEntitiesInner({
    autoFocus = false,
    canCreateNew = false,
    disableClearable = false,
    disabled = false,
    error = false,
    helperText,
    label,
    name,
    onBlur,
    onChange,
    required = false,
    simpleField = false,
    singleValue = false,
    types,
    value = [],
  }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const fetchError = useSelector(getErrorState);
    const getE = useSelector(getEntityById) as (
      entityId: string,
    ) => SelectOption;
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<SelectOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [catsOnly, setCatsOnly] = React.useState(false);
    const canReallyCreateNew = canCreateNew && !catsOnly;

    const handleBlur = () => {
      if (name && onBlur) {
        onBlur({ type: 'blur', target: { name } });
      }
    };
    const handleChange = (newValues: string[]) => {
      onChange({
        target: {
          name: name || '',
          value: newValues,
        },
      });
      if (singleValue) {
        setTimeout(handleBlur, 0); // avoid validation timing issues
      }
      setInputValue('');
    };

    const fetch = useConstant(() =>
      debounce(
        (
          request: { input: string; types?: EntityType[]; catsOnly?: boolean },
          callback: (results?: EntityResp[]) => void,
        ) => {
          setLoading(true);
          const fetchingFunc =
            request.input.length > 0 ? matchEntities : suggestEntities;
          fetchingFunc(request)
            .then(callback)
            .catch(error => {
              dispatch(doFetchError(error));
            })
            .finally(() => {
              setLoading(false);
            });
        },
        250,
        { leading: false, trailing: true },
      ),
    );

    // don't fetch on mount but only after the input has been focused
    const [focusedOnce, setFocusedOnce] = React.useState(false);
    // don't fetch again if input value hasn't changed
    const lastFetchInputValueRef = React.useRef<string | null>(null);
    // cache "suggest" options for one minute
    const suggestOptionsRef = React.useRef<SelectOption[] | null>(null);
    // only show "no results" message if we have fetched data
    const fetchedOnceRef = React.useRef(false);
    React.useEffect(() => {
      if (!focusedOnce) {
        setOptions(value.map(getE));
        return undefined;
      }
      if (inputValue === lastFetchInputValueRef.current) {
        return undefined;
      }
      let active = true;
      let suggestCacheTimeout: ReturnType<typeof setTimeout>;

      if (fetchError !== undefined) {
        setLoading(false);
        return undefined;
      }

      if (inputValue.length === 0 && suggestOptionsRef.current !== null) {
        setOptions([...value.map(getE), ...suggestOptionsRef.current]);
        return undefined;
      }
      fetch(
        { input: inputValue, types, catsOnly },
        (results?: EntityResp[]) => {
          if (active) {
            let newOptions = [] as SelectOption[];
            if (value) {
              newOptions = value.map(getE);
            }
            if (results) {
              newOptions = [...newOptions, ...results];
            }
            setOptions(newOptions);
            if (results && inputValue.length === 0) {
              suggestOptionsRef.current = results;
            }
            lastFetchInputValueRef.current = inputValue;
            suggestCacheTimeout = setTimeout(function () {
              suggestOptionsRef.current = null;
            }, 60000);
            fetchedOnceRef.current = true;
          }
        },
      );

      return () => {
        clearTimeout(suggestCacheTimeout);
        active = false;
      };
    }, [
      focusedOnce,
      inputValue,
      types,
      catsOnly,
      value,
      fetch,
      fetchError,
      getE,
    ]);

    const addNewlyCreated = (entityId: string) => {
      handleChange([...(singleValue ? [] : value), entityId]);
    };
    const handleCreateNew = (startingValue: string) => {
      dispatch(doCreateEntity(startingValue, types, addNewlyCreated));
    };
    const toggleCatsOnly = () => {
      lastFetchInputValueRef.current = null;
      suggestOptionsRef.current = null;
      setCatsOnly(prev => !prev);
    };
    return (
      <Autocomplete
        onFocus={function () {
          if (!focusedOnce) {
            setFocusedOnce(true);
          }
        }}
        onBlur={handleBlur}
        className={classes.root}
        disableClearable={disableClearable}
        autoComplete
        clearOnBlur={false}
        openOnFocus
        onClose={function (_event, reason) {
          if (reason === 'escape' && inputValue.length === 0) {
            // potentially trigger validation so cancel button isn't "blocked"
            handleBlur();
          }
        }}
        includeInputInList
        filterSelectedOptions
        loading={loading}
        fullWidth
        getOptionLabel={option => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.label;
        }}
        filterOptions={(options, params) => {
          return params.inputValue !== '' && canReallyCreateNew
            ? [
                ...options,
                {
                  inputValue: params.inputValue,
                  label: `Create "${params.inputValue}"`,
                  _id: '',
                } as SelectOption,
              ]
            : options;
        }}
        options={options}
        freeSolo
        multiple
        value={value.map(getE)}
        onChange={(_event, newValue, reason) => {
          if (Array.isArray(newValue) && newValue.length === 0) {
            // clear
            handleChange([]);
            return;
          }
          if (reason === 'remove-option') {
            // backspace
            handleChange((newValue as EntityResp[]).map(e => e._id));
            return;
          }
          const [newItem] = newValue.slice(-1);
          if (typeof newItem === 'string') {
            // hitting enter after typing a "new" value
            if (canReallyCreateNew) {
              handleCreateNew(newItem);
            }
          } else if (newItem && newItem.inputValue) {
            // clicking "Create <value>"
            if (canReallyCreateNew) {
              handleCreateNew(newItem.inputValue);
            }
          } else {
            if (newItem?._id) {
              // selecting existing item
              const entityId = newItem._id;
              const entity = newItem;
              dispatch(doAddEntity(entity));
              handleChange([
                ...value.filter(eid => eid !== entityId && !singleValue),
                entityId,
              ]);
              setOptions([entity, ...options.filter(o => o._id !== entityId)]);
            } else {
              // eslint-disable-next-line no-console
              console.warn('else/undefined in Autocomplete onChange!');
            }
          }
        }}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason !== 'input') {
            return;
          }
          setInputValue(newInputValue);
        }}
        renderInput={params => {
          if (simpleField) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { InputProps, InputLabelProps, ...otherParams } = params;
            return (
              <InputBase
                {...otherParams}
                {...InputProps}
                inputProps={{
                  ...params.inputProps,
                  style: {
                    paddingTop: '9px',
                  },
                }}
                fullWidth
                placeholder={value.length === 0 ? label : ''}
              />
            );
          } else {
            return (
              <TextField
                {...params}
                autoFocus={autoFocus}
                error={error}
                helperText={helperText}
                label={label || ''}
                required={required}
                disabled={disabled}
                fullWidth
              />
            );
          }
        }}
        renderOption={option => {
          const entity = option as EntityResp;
          return (
            <div>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {entity.label}
                <AdditionalTagMarkers
                  small
                  selectedTags={entity.analysisCategories || []}
                />
              </span>
              <Typography color="textSecondary">
                {' '}
                {getTypeLabel(entity.type)}
              </Typography>
            </div>
          );
        }}
        renderTags={_values => {
          return value.map((x, i) => (
            <Chip
              key={x}
              entityId={x}
              data-tag-index={i}
              onDelete={() => {
                handleChange(value.filter(v => v !== x));
              }}
            />
          ));
        }}
        PaperComponent={({ children }) => (
          <Paper className={classes.paper} elevation={3}>
            <div
              style={{
                padding: '8px 0px 0px 16px',
              }}
            >
              {(types.length === 0 || types.includes('Topic')) &&
                options.length > value.length && (
                  <FCLCheckbox
                    color="primary"
                    label="A.C. only"
                    onMouseDown={e => {
                      e.preventDefault(); // prevent closing of the popup
                      toggleCatsOnly();
                    }}
                    checked={catsOnly}
                  />
                )}
              {options.length >= OPTIONS_MAX && (
                <Typography color="textSecondary">
                  There may be more options...{' '}
                  {inputValue.length > 0 ? 'Keep' : 'Start'} typing to filter
                  the list.
                </Typography>
              )}
              {fetchedOnceRef.current && options.length === 0 && (
                <Typography color="textSecondary">No results.</Typography>
              )}
            </div>
            {children}
          </Paper>
        )}
      />
    );
  },
  areEqual,
);

export const AutocompleteEntitiesFormik =
  withFormikErrors(AutocompleteEntities);

interface SingleProps
  extends Pick<
    Props,
    Exclude<keyof Props, 'value' | 'onChange' | 'singleValue'>
  > {
  onChange: (event: ChangeEvent<string>) => void;
  value: string;
}

export const AutocompleteEntitiesSingle: React.FC<SingleProps> = ({
  onChange,
  value,
  ...props
}) => (
  <AutocompleteEntities
    {...props}
    singleValue
    onChange={(event: ChangeEvent<string[]>) => {
      const [newValue] = event.target.value;
      onChange({
        type: 'change',
        target: { name: props.name!, value: newValue },
      });
    }}
    value={value ? [value] : []}
  />
);

export const AutocompleteEntitiesSingleFormik = withFormikErrors(
  AutocompleteEntitiesSingle,
);
