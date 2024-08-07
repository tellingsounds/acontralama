/**
 * LoginPage for either logging in or to activate read-only mode.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Paper,
  createStyles,
  makeStyles,
  alpha,
  Typography,
  Divider,
} from '@material-ui/core';

import { LoginForm } from './LoginForm';

import { LamaIcon } from './LamaIcon';

import { doReadOnly } from '../actionCreators/sagaActions';
import { getAuthStatus } from '../selectors/app';

import { withoutPathPrefix } from '../util';

import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    outerPaper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      padding: theme.spacing(1),
      marginTop: '4em',
    },
    lamaPaper: {
      // maxWidth: theme.spacing(80),
      // marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    aboutpaper: {
      maxWidth: theme.spacing(90),
      marginTop: theme.spacing(2),
      // marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // boxShadow: theme.shadows[4],
    },
    aboutheading: {
      color: alpha(process.env.APPBAR_COLOR || '#ddd', 1),
      padding: theme.spacing(1),
    },
    aboutcontent: {
      padding: theme.spacing(1),
      textAlign: 'justify',
    },
    content: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    readPaper: {
      padding: theme.spacing(1),
    },
    or: {
      marginTop: theme.spacing(1),
      color: '#777',
      fontStyle: 'italic',
      fontSize: theme.typography.fontSize * 0.9,
    },
    formLamas: {
      display: 'flex',
    },
    lamaIcon: {
      color: alpha(process.env.APPBAR_COLOR || '#ddd', 0.7),
      fontSize: theme.spacing(20),
      margin: theme.spacing(3),
      '&:first-child': {
        transform: 'scaleX(-1)',
      },
    },
    buttonColor: {
      color: process.env.APPBAR_COLOR || '#ddd',
    },
    aboutbuttonColor: {
      color: alpha(process.env.APPBAR_COLOR || '#ddd', 1),
    },
  }),
);

export const LoginPage: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const isAuthenticated = useSelector(getAuthStatus);
  const location = useLocation();
  const state = location.state as { fromPath?: string } | undefined;
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
  const handleReadOnly = () => {
    dispatch(
      doReadOnly(
        handleLoading,
        withoutPathPrefix(location.pathname),
        withoutPathPrefix(state?.fromPath || ''),
      ),
    );
  };
  const handleRedirectAboutWithReadOnly = () => {
    dispatch(
      doReadOnly(
        handleLoading,
        withoutPathPrefix(location.pathname),
        withoutPathPrefix(state?.fromPath || 'about'),
      ),
    );
  };
  if (isAuthenticated) {
    return <Typography>You are logged in already.</Typography>;
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.outerPaper}>
        <div className={classes.lamaPaper}>
          <LamaIcon className={classes.lamaIcon} />
          <div className={classes.content}>
            <div className={classes.formLamas}>
              <LoginForm />
            </div>
            <Typography className={classes.or}>- OR -</Typography>
            <div className={classes.readPaper}>
              <div className={classes.formLamas}>
                <Button
                  onClick={handleReadOnly}
                  className={classes.buttonColor}
                >
                  {loading ? (
                    <CircularProgress
                      style={{ color: process.env.APPBAR_COLOR }}
                      size={24}
                    />
                  ) : (
                    'Continue Read-only'
                  )}
                </Button>
              </div>
            </div>
          </div>
          <LamaIcon className={classes.lamaIcon} />
        </div>
        <Divider
          variant="middle"
          style={{
            width: '60%',
            backgroundColor: alpha(process.env.APPBAR_COLOR || '#ddd', 0.5),
          }}
        />
        <div className={classes.aboutpaper}>
          <Typography variant="h6" className={classes.aboutheading}>
            About the project
          </Typography>
          <Typography className={classes.aboutcontent} variant="body1">
            <p>
              The ACONTRA-LAMA platform was developed as part of the project The
              Affective Construction Of National Temporalities in Austrian
              Post-War Radio (ACONTRA), a collaborative project between the
              University of Music and Performing Arts, the University of Vienna,
              and the House of Austrian History. ACONTRA focuses on the role of
              radio as a mass medium in the process of constructing national
              consciousness during the early years of the Second Republic
              (1945-1955).
            </p>{' '}
            <p>
              Auditory primary sources for this period have so far been poorly
              catalogued or not at all: The collections are highly fragmented
              and so diverse in structure and content that they must first be
              made accessible for (scientific) processing. Through the further
              development of the annotation software LAMA (Linking Annotations
              for Media Analysis), which was conceived in the predecessor
              project Telling Sounds, existing collections are recorded, merged,
              and finally, connections between the documents are established at
              both the production and content levels. For this purpose, a corpus
              had to be researched and defined from the existing collections.
              The existing metadata of the documents were standardized.
              Additionally, the documents were annotated to varying degrees with
              both descriptive and interpretative annotations. This enables the
              preparation of the material with regard to specific research
              questions.{' '}
            </p>
            <div>
              More information about the project can be found here:
              <Button
                onClick={handleRedirectAboutWithReadOnly}
                className={classes.aboutbuttonColor}
                size="small"
              >
                {loading ? (
                  <CircularProgress
                    style={{ color: process.env.APPBAR_COLOR }}
                    size={24}
                  />
                ) : (
                  'About the project'
                )}
              </Button>
            </div>
          </Typography>
        </div>
      </Paper>
    </div>
  );
};
