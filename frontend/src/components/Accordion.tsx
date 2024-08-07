/**
 * "Simple", single-component version of MUI Accordion.
 */
import React, { FC, ReactNode } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props {
  children: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  heading: string;
  onChange?: (event: React.ChangeEvent<any>, expanded: boolean) => void;
  unmountContentsIfClosed?: boolean;
}

const useStyles = makeStyles(theme =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    accordionWrapper: {
      backgroundColor: '#eeeeee',
    },
  }),
);
const CustomAccordion: FC<Props> = ({
  children,
  className,
  defaultExpanded = false,
  disabled = false,
  expanded,
  heading,
  onChange,
  unmountContentsIfClosed = false,
}) => {
  const classes = useStyles();
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disabled={disabled}
      expanded={expanded}
      onChange={onChange}
      TransitionProps={{ unmountOnExit: unmountContentsIfClosed }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{heading}</Typography>
      </AccordionSummary>
      <AccordionDetails className={className}>{children}</AccordionDetails>
    </Accordion>
  );
};

export { CustomAccordion as Accordion };
