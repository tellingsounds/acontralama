/**
 * Login form (used on login page and in Navbar.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  Button,
  CircularProgress,
  TextField,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import { doLogin } from '../actionCreators/sagaActions';

import { withoutPathPrefix } from '../util';
import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    formWrapper: {
      display: 'flex',
      marginTop: theme.spacing(2),
      flexDirection: 'column',
      '& > div.MuiTextField-root': {
        marginBottom: theme.spacing(1),
      },
    },
    buttonColor: {
      color: process.env.APPBAR_COLOR || '#ddd',
    },
    errorMessage: {
      color: red[600],
    },
  }),
);

// interface Props {
// }

export const LoginForm: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as { fromPath?: string } | undefined;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  // prevent state update on unmounted component
  const isActiveRef = React.useRef(false);
  React.useEffect(function () {
    isActiveRef.current = true;
    return function () {
      isActiveRef.current = false;
    };
  }, []);
  const handleLoading = (isLoading: boolean) => {
    if (isActiveRef.current) {
      setLoading(isLoading);
    }
  };
  const handleLogin = () => {
    dispatch(
      doLogin(
        username,
        password,
        setMessage,
        handleLoading,
        withoutPathPrefix(location.pathname),
        withoutPathPrefix(state?.fromPath || ''),
      ),
    );
  };
  return (
    <div className={classes.formWrapper}>
      <TextField
        autoFocus
        disabled={loading}
        placeholder="Username"
        value={username}
        onChange={e => {
          setUsername(e.target.value);
          setMessage('');
        }}
      />
      <TextField
        disabled={loading}
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
          setMessage('');
        }}
        onKeyUp={function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (e.key === 'Enter') {
            handleLogin();
          }
        }}
      />
      <Button
        className={classes.buttonColor}
        onClick={handleLogin}
        disabled={!(username && password) || loading}
      >
        {loading ? (
          <CircularProgress
            style={{ color: process.env.APPBAR_COLOR }}
            size={24}
          />
        ) : (
          'Login'
        )}
      </Button>
      <Typography className={classes.errorMessage}>{message}</Typography>
    </div>
  );
};
