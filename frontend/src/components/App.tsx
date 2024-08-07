/**
 * Basic structure of the app.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, makeStyles } from '@material-ui/core';

import { useLocation } from 'react-router-dom';

import { NavBar } from './NavBar';
import { Notifications } from './Notifications';
import { MainPanel } from './MainPanel';
import { SidePanel } from './SidePanel';
import { LoadingOverlay } from './LoadingOverlay';

import {
  getDidInitialize,
  getIsSidePanelOpen,
  getLoadingState,
} from '../selectors/app';
import { getCurrentClipTitle } from '../selectors/clips';
import { doFetchUser } from '../actionCreators/sagaActions';

import { withoutPathPrefix } from '../util';

import { EmptyObject } from '../types';

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
  },
  container: {
    margin: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    /* for Firefox */
    minHeight: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    /* for Firefox */
    minHeight: 0,
  },
  main: {
    overflow: 'auto',
    flex: 2,
    /* for Firefox */
    minHeight: 0,
  },
  side: {
    overflow: 'auto',
    flex: 1,
    /* for Firefox */
    minHeight: 0,
  },
});

const titles: Record<string, string> = {
  '/entities': 'LAMA :: Entities',
  '/explore': 'LAMA :: Explore',
  '/login': 'LAMA :: Login',
  '/query': 'LAMA :: Query',
  '/search': 'LAMA :: Search',
};

export const App: React.FC<EmptyObject> = () => {
  const isSidePanelOpen = useSelector(getIsSidePanelOpen);
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentClipTitle = useSelector(getCurrentClipTitle);
  const { pathname } = useLocation();
  const didInitialize = useSelector(getDidInitialize);
  const isLoading = useSelector(getLoadingState);
  React.useEffect(() => {
    dispatch(doFetchUser());
  }, [dispatch]);
  React.useEffect(() => {
    document.title = titles[withoutPathPrefix(pathname)] || currentClipTitle;
  }, [currentClipTitle, pathname]);
  if (!didInitialize && withoutPathPrefix(pathname) !== '/login') {
    return (
      <div id="app">
        <LoadingOverlay />
      </div>
    );
  }
  return (
    <Typography className={classes.root} component="div" id="app">
      <div className={classes.container}>
        <div className={classes.section}>
          <NavBar />
          <div className={classes.content}>
            {isLoading && <LoadingOverlay />}
            <div id="LamaMainPanel" className={classes.main}>
              <MainPanel />
            </div>
            {isSidePanelOpen && (
              <div id="LamaSidePanel" className={classes.side}>
                <SidePanel />
              </div>
            )}
          </div>
        </div>
      </div>
      <Notifications />
    </Typography>
  );
};
