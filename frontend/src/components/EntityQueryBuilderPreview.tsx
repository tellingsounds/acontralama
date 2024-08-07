/**
 * Shows preview of in EntityQueryBuilder selected Entities.
 */
import React from 'react';
import {
  Button,
  createStyles,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';

import { Chip } from './Chip';

const useStyles = makeStyles(theme =>
  createStyles({
    root: { padding: theme.spacing(1) },
    preview: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(0.7),
      padding: theme.spacing(1),
      margin: theme.spacing(1),
    },
  }),
);

interface Props {
  entityIds: string[];
  loading: boolean;
}

const COUNT = 50;

export const EntityQueryBuilderPreview: React.FC<Props> = ({
  entityIds,
  loading,
}) => {
  const classes = useStyles();
  const [showCount, setShowCount] = React.useState(COUNT);
  React.useEffect(() => {
    setShowCount(COUNT);
  }, [entityIds]);
  if (loading) {
    return (
      <Paper className={classes.root}>
        <Typography>Loading...</Typography>
      </Paper>
    );
  }
  return (
    <Paper className={classes.root}>
      <Typography>
        {entityIds.length === 0 ? 'No' : entityIds.length} result
        {entityIds.length === 1 ? '' : 's'}.
      </Typography>
      {entityIds.length > 0 && (
        <div className={classes.preview}>
          {entityIds.slice(0, showCount).map(eId => (
            <Chip entityId={eId} key={eId} />
          ))}
        </div>
      )}
      {entityIds.length > showCount && (
        <Button
          onClick={() => {
            setShowCount(prev => prev + COUNT);
          }}
        >
          Show more
        </Button>
      )}
    </Paper>
  );
};
