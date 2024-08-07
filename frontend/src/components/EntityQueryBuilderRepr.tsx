/**
 * Chip-like representation of EntityQueryBuilder with Tooltip that shows the query.
 */
import React from 'react';
import {
  Button,
  FormControl,
  Tooltip,
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import BuildIcon from '@material-ui/icons/Build';
import ClearIcon from '@material-ui/icons/Clear';
import { toSvg } from 'jdenticon';
import classNames from 'classnames';

import { QbData } from '../types/query';

const activeColor = lightBlue[500];

const useStyles = makeStyles(theme =>
  createStyles({
    deleteButton: {
      display: 'flex',
      minWidth: 0,
      padding: theme.spacing(0.5),
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    },
    repr: {
      boxShadow: '0 0 4px grey',
      minHeight: '32px',
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: '6px',
      paddingLeft: '4px',
      // paddingLeft: (props: Props) => (props.value ? '4px' : '8px'),
      '& .MuiButton-startIcon': {
        marginRight: 0,
        // marginRight: (props: Props) => (props.value ? 0 : '4px'),
      },
      '&.Mui-disabled': {
        boxShadow: '0 0 8px ' + activeColor,
        '& .MuiButton-label': {
          color: activeColor,
        },
      },
    },
    root: {
      margin: `${theme.spacing(0.5)}px`,
    },
    wrench: {
      padding: '0 4px',
      fill: '#777',
      '.Mui-disabled &': {
        fill: activeColor,
      },
    },
  }),
);

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 12,
    maxWidth: 'none', // maybe revisit at some point
  },
}))(Tooltip);

type AnyObject = Record<string, unknown>;

enum Conjunctions {
  AND = 'and',
  OR = 'or',
}
type Negatable<T> = T | { '!': T };
type ActualRule = { in: [{ var: string }, string[]] };
type Rule = Negatable<ActualRule>;
type Group = Negatable<{
  [conj in Conjunctions]: Array<Rule | Group>;
}>;

const INDENT = 2;
const indent = (level: number) => ' '.repeat(level * INDENT);
const nextLevel = (tree: AnyObject): [string, any] => {
  const key = Object.keys(tree)[0];
  const childTree = tree[key];
  return [key, childTree];
};
const maybeNegated = (tree: Rule | Group): [boolean, Rule | Group] => {
  const [key, childTree] = nextLevel(tree);
  const isNegated = key === '!';
  return [isNegated, isNegated ? childTree : tree];
};
const isRule = (tree: Rule | Group): boolean => {
  const [_isNegated, actualTree] = maybeNegated(tree);
  const [key, _childTree] = nextLevel(actualTree);
  return !['and', 'or'].includes(key);
};
const ruleToString = (tree: Rule, indentLevel: number): string => {
  let result = '';
  const [isNegated, ruleItems] = maybeNegated(tree) as [boolean, ActualRule];
  // const [_all, ruleItems] = nextLevel(actualTree);
  const {
    in: [{ var: varName }, values],
  } = ruleItems;
  result += indent(indentLevel);
  result += isNegated ? 'NOT ' : '';
  result += `${varName} IN ${values.join(', ')}`;
  return result;
};
const groupToString = (tree: Group, indentLevel = 0): string => {
  let result = '';
  const [isNegated, actualTree] = maybeNegated(tree);
  const [conj, groupItems] = nextLevel(actualTree);
  result += indent(indentLevel);
  result += conj.toUpperCase() + ' ';
  result += isNegated ? 'NOT ' : '';
  result += '\n';
  result += (groupItems as Array<Rule | Group>)
    .map(ruleOrGroup =>
      isRule(ruleOrGroup)
        ? ruleToString(ruleOrGroup as Rule, indentLevel + 1)
        : groupToString(ruleOrGroup as Group, indentLevel + 1),
    )
    .join('\n');
  return result;
};

interface VisualizerProps {
  value: string;
}

const QueryVisualizer: React.FC<VisualizerProps> = ({ value }) => {
  const queryData = JSON.parse(value);
  const { label, logic } = queryData;
  const logicTree: Group = JSON.parse(logic);
  return (
    <div>
      <div>{label}</div>
      <pre>{groupToString(logicTree)}</pre>
    </div>
  );
};

interface Props {
  handleClick: () => void;
  handleRemove?: () => void;
  qbData?: QbData;
  active?: boolean;
}

export const EntityQueryBuilderRepr: React.FC<Props> = ({
  active = false,
  handleClick,
  handleRemove,
  qbData,
}) => {
  const classes = useStyles();
  const label = qbData?.label;
  const logic = qbData?.logic;
  return (
    <LightTooltip
      title={
        logic ? (
          <QueryVisualizer value={JSON.stringify({ label, logic })} />
        ) : (
          ''
        )
      }
    >
      <FormControl className={classes.root}>
        <Button
          className={classes.repr}
          onClick={handleClick}
          startIcon={
            logic ? (
              <span
                style={{ display: 'flex', alignItems: 'center' }}
                dangerouslySetInnerHTML={{ __html: toSvg(logic, 32) }}
              ></span>
            ) : (
              <BuildIcon className={classes.wrench} />
            )
          }
          disabled={!logic || active}
          endIcon={
            handleRemove &&
            !active &&
            logic && (
              <div
                onClick={e => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className={classNames(
                  'MuiButton-root',
                  'MuiIconButton-root',
                  classes.deleteButton,
                )}
              >
                <ClearIcon />
              </div>
            )
          }
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ textTransform: 'none' }}>
              {logic ? label : 'New...'}
            </span>
          </div>
        </Button>
      </FormControl>
    </LightTooltip>
  );
};
