/**
 * Wrapper for the generated glossary.md file.
 */
import React from 'react';
import { MarkdownText } from './MarkdownText';

import markdown from '../help/about.md';

import { EmptyObject } from 'types';
import {
  Button,
  Typography,
  alpha,
  createStyles,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    outer: {
      margin: theme.spacing(2),
    },
    heading: {
      marginBottom: theme.spacing(1),
    },
    button: {
      color: alpha(process.env.APPBAR_COLOR || '#ddd', 1),
    },
  }),
);

export const About: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  return (
    <div className={classes.outer}>
      <Typography variant="h3" className={classes.heading}>
        About ACONTRA
      </Typography>
      <Button
        className={classes.button}
        onClick={() => {
          fetch('https://lama.mdw.ac.at/favicon.ico')
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'favicon.ico';
              document.body.appendChild(a);
              a.click();
              a.remove();
            })
            .catch(error => console.error('Error downloading the PDF:', error));
        }}
        // download="ACONTRA_Handreichung.pdf"
      >
        download text as pdf
      </Button>
      <MarkdownText source={markdown}></MarkdownText>
    </div>
  );
};
