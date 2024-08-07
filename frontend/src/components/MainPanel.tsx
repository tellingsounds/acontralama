/**
 * Main panel.
 */
import React, { FC, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { useLocation } from 'react-router-dom';

import { ClipList } from './ClipList';
import { ClipOverview } from './ClipOverview';
import { EntityList } from './EntityList';
import { ExploreGraph } from './ExploreGraph';
import { Glossary } from './Glossary';
import { About } from './About';
import { LoginPage } from './LoginPage';
import { QueryLand } from './QueryLand';
import { SearchLand } from './SearchLand';
import { SegmentAlert } from './SegmentAlert';

import { doNewClip, doToggleSidePanel } from '../actionCreators/app';
import { doUnsetCurrentClip } from '../actionCreators/clips';

import { withPathPrefix, withoutPathPrefix } from '../util';

import { history } from '../browserHistory';

import { EmptyObject } from '../types';

// "hacking" the type of props here in order to inject pathname
const useStyles = makeStyles<Theme, { pathname: string }>(theme =>
  createStyles({
    mainPanel: {
      paddingBottom: ({ pathname }) =>
        theme.spacing(
          ['/explore', '/search'].some(s =>
            withoutPathPrefix(pathname).startsWith(s),
          )
            ? 0
            : 48,
        ),
    },
  }),
);

export const MainPanel: FC<EmptyObject> = () => {
  const { pathname } = useLocation();
  const classes = useStyles({ pathname });
  const dispatch = useDispatch();
  useEffect(() => {
    const unlisten = history.listen((location, _action) => {
      if (
        ['/query', '/explore', '/search'].some(p =>
          withoutPathPrefix(location.pathname).startsWith(p),
        )
      ) {
        dispatch(doUnsetCurrentClip());
        // back button
        dispatch(doToggleSidePanel(true));
        return;
      }
      const currentClipId = sessionStorage.getItem('currentClipId');
      const [, clipMaybe, clipId] = withoutPathPrefix(location.pathname).split(
        '/',
      );
      if (clipMaybe === 'clip' && clipId === 'new') {
        dispatch(doNewClip());
        return;
      }
      if (currentClipId && clipId === undefined) {
        dispatch(doUnsetCurrentClip());
      }
      if (clipMaybe === 'clip' && clipId && clipId !== currentClipId) {
        sessionStorage.setItem('currentClipId', clipId);
      }
    });
    return unlisten;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div id="mainPanel" className={classes.mainPanel}>
      <Switch>
        <Route exact path={withPathPrefix('/login')}>
          <LoginPage />
        </Route>
        <Route exact path={withPathPrefix('/')}>
          <ClipList />
        </Route>
        <Route exact path={withPathPrefix('/entities')}>
          <EntityList />
        </Route>
        <Route exact path={withPathPrefix('/query')}>
          <QueryLand />
        </Route>
        <Route
          path={withPathPrefix('/explore/clip/:clipId')}
          render={({ match }) => (
            <ExploreGraph clipId={match.params.clipId as string} />
          )}
        />
        <Route
          path={withPathPrefix('/explore/entity/:entityId')}
          render={({ match }) => (
            <ExploreGraph entityId={match.params.entityId as string} />
          )}
        />
        <Route exact path={withPathPrefix('/search')}>
          <SearchLand />
        </Route>
        <Route exact path={withPathPrefix('/glossary')}>
          <Glossary />
        </Route>
        <Route exact path={withPathPrefix('/about')}>
          <About />
        </Route>
        <Route
          path={withPathPrefix('/clip/:clipId')}
          render={({ match }) => {
            const { clipId } = match.params;
            return (
              <div>
                <SegmentAlert />
                <ClipOverview clipId={clipId === 'new' ? undefined : clipId} />
              </div>
            );
          }}
        />
        <Route>
          <div>Not found.</div>
        </Route>
      </Switch>
    </div>
  );
};
