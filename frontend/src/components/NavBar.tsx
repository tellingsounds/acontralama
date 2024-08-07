/**
 * NavBar displayed on the top of the page.
 */
import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MovieIcon from '@material-ui/icons/Movie';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SearchIcon from '@material-ui/icons/FindInPage';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MapIcon from '@material-ui/icons/Map';

import { LamaIcon } from './LamaIcon';
import { SegmentIcon } from './SegmentIcon';

import { ClipTitle } from './ClipTitle';
import { PlusButton } from './PlusButton';
import { PopoverButton } from './PopoverButton';

import { LoginForm } from './LoginForm';

import { withPathPrefix } from '../util';

import { history } from '../browserHistory';
import { getCurrentClip } from '../selectors/clips';
import {
  getEditingLeftState,
  getReadOnly,
  getUsername,
  getAuthStatus,
} from '../selectors/app';
import { doSetEditingLeft } from '../actionCreators/app';
import { doJumpTo, doLogout } from '../actionCreators/sagaActions';

import { EmptyObject } from '../types';
import { noop } from 'lodash';

const BAR_COLOR = process.env.APPBAR_COLOR;

const getNewClipPlusItem = () => ({
  text: 'Clip',
  icon: MovieIcon,
  handleClick: () => {
    history.push(withPathPrefix('/clip/new')); // should be saga?
  },
});

const useStyles = makeStyles(theme =>
  createStyles({
    username: {
      padding: 12,
    },
    loginLogout: { padding: 12, color: '#fff' },
    loginPopover: {
      padding: theme.spacing(2),
    },
    lamaicon: {
      padding: 0,
      margin: '0 8px 0 0',
    },
  }),
);

const createNewElementSegment =
  (category: 'Segment' | 'Structure', dispatch: Dispatch) => () => {
    dispatch(doSetEditingLeft(true, category));
    dispatch(doJumpTo(category, [category]));
  };

const getAdditionalPlusItems = (dispatch: Dispatch) => [
  {
    text: 'Interpretation',
    icon: SegmentIcon,
    handleClick: createNewElementSegment('Segment', dispatch),
  },
  {
    text: 'Structure',
    icon: AllInboxIcon,
    handleClick: createNewElementSegment('Structure', dispatch),
  },
];

const getLamaButtonOptions = () => [
  {
    text: 'Home/Clips',
    icon: HomeIcon,
    handleClick: () => {
      history.push(withPathPrefix('/'));
    },
  },
  {
    text: 'Entities',
    icon: ShoppingCartIcon,
    handleClick: () => {
      history.push(withPathPrefix('/entities'));
    },
  },
  {
    text: 'Query',
    icon: QuestionAnswerIcon,
    handleClick: () => {
      history.push(withPathPrefix('/query'));
    },
  },
  {
    text: 'Search',
    icon: SearchIcon,
    handleClick: () => {
      history.push(withPathPrefix('/search'));
    },
  },
  {
    text: 'Glossary',
    icon: MenuBookIcon,
    handleClick: () => {
      history.push(withPathPrefix('/glossary'));
    },
  },
  {
    text: 'About ACONTRA',
    icon: MapIcon,
    handleClick: () => {
      history.push(withPathPrefix('/about'));
    },
  },
];

export const NavBar: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentClip = useSelector(getCurrentClip);
  const isAuthenticated = useSelector(getAuthStatus);
  const username = useSelector(getUsername);
  const readOnlyMode = useSelector(getReadOnly);
  const newClipPlusItem = getNewClipPlusItem();
  const newLamaButton = getLamaButtonOptions();
  const pictureButton = currentClip?.fileType == 'v';
  const editingLeftState = useSelector(getEditingLeftState);
  const activeEditCategory = editingLeftState.category;
  const activeEditId = editingLeftState.id;
  return (
    <AppBar
      id="LamaAppBar"
      position="relative"
      style={{ backgroundColor: BAR_COLOR }}
    >
      <Toolbar variant="dense">
        <Grid container wrap="nowrap">
          <Grid item md={9}>
            <Grid container alignItems="center" wrap="nowrap">
              {(readOnlyMode || username) && isAuthenticated && (
                <Grid item>
                  <PlusButton forBar icon={LamaIcon} options={newLamaButton} />
                </Grid>
              )}
              {!isAuthenticated && (
                <Grid item>
                  <IconButton
                    title="LAMA"
                    color="inherit"
                    onClick={() => noop}
                    className={classes.lamaicon}
                  >
                    <LamaIcon fontSize="large" />
                  </IconButton>
                </Grid>
              )}
              {!readOnlyMode && username && (
                <Grid item>
                  <PlusButton
                    title="Add new"
                    forBar
                    options={
                      currentClip
                        ? pictureButton
                          ? [
                              newClipPlusItem,
                              ...getAdditionalPlusItems(dispatch),
                            ]
                          : [
                              newClipPlusItem,
                              ...getAdditionalPlusItems(dispatch),
                            ]
                        : [newClipPlusItem]
                    }
                  />
                </Grid>
              )}
              <Grid item style={{ maxWidth: '100%', padding: '8px' }}>
                <ClipTitle />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3}>
            <Grid container justifyContent="flex-end">
              {activeEditCategory !== null && (
                <Grid item>
                  <IconButton
                    title="Go to active edit"
                    color="inherit"
                    onClick={() => {
                      dispatch(
                        doJumpTo(
                          activeEditId || activeEditCategory,
                          [activeEditId, activeEditCategory].filter(
                            x => x !== null,
                          ) as string[],
                        ),
                      );
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <Typography
                  className={classes.username}
                  title={process.env.GIT_AUTHOR_DATE}
                  style={{ color: '#ccc' }}
                >
                  {process.env.GIT_VERSION}
                </Typography>
              </Grid>
              {username && (
                <Grid item>
                  <Typography className={classes.username}>
                    {username}
                  </Typography>
                </Grid>
              )}
              {(username ||
                (isAuthenticated &&
                  process.env.NODE_ENV === 'development')) && (
                <Grid item>
                  <Button
                    className={classes.loginLogout}
                    onClick={() => {
                      dispatch(doLogout());
                    }}
                  >
                    Logout
                  </Button>
                </Grid>
              )}
              {readOnlyMode && (
                <Grid item>
                  <PopoverButton
                    label="Login"
                    anchorToBottom
                    className={classes.loginLogout}
                  >
                    <div className={classes.loginPopover}>
                      <LoginForm />
                    </div>
                  </PopoverButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
