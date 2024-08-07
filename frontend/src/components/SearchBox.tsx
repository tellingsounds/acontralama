/**
 * SearchBox for AnnotationsList.
 */
import React from 'react';
import {
  IconButton,
  InputBase,
  InputBaseProps,
  Paper,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { createStyles, alpha, makeStyles } from '@material-ui/core/styles';
import { withDebounce } from './withDebounce';

const useStyles = makeStyles(theme =>
  createStyles({
    searchBox: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.black, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
      },
      height: '2.3rem',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      marginLeft: 8,
    },
    searchBoxInner: {
      height: '100%',
    },
    paddedLikeButton: {
      padding: '12px 8px',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
    },
  }),
);

interface Props extends InputBaseProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export const SearchBox: React.FC<Props> = props => {
  const classes = useStyles();
  return (
    <Paper className={classes.searchBox}>
      <InputBase
        style={{ width: '100%' }}
        className={classes.searchBoxInner}
        placeholder={props.placeholder || 'Search...'}
        inputProps={{ 'aria-label': 'search', ...props.inputProps }}
        {...props}
        startAdornment={
          <div className={classes.paddedLikeButton}>
            <SearchIcon />
          </div>
        }
        endAdornment={
          <IconButton
            title="Clear"
            onClick={_event => {
              if (props.onChange) {
                props.onChange({
                  target: { value: '' },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <BackspaceIcon />
          </IconButton>
        }
      />
    </Paper>
  );
};

export const SearchBoxDebounced = withDebounce(SearchBox);
