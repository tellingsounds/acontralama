/**
 * Query component to provide pool of entities to be searched with.
 */
import React from 'react';
import {
  Button,
  TextField as MuiTextField,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid4 } from 'uuid';
import { has, isObject, throttle } from 'lodash';

import { Query, Builder, Utils as QbUtils } from 'react-awesome-query-builder';
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import {
  JsonGroup,
  Config,
  ValueSource,
  FieldOrGroup,
  RuleValue,
  WidgetProps,
  ImmutableTree,
  JsonRule,
  JsonTree,
  JsonRuleGroup,
  JsonRuleGroupExt,
} from 'react-awesome-query-builder'; // types
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css';

import { AutocompleteEntities } from './AutocompleteEntities';
import { EntityQueryBuilderPreview } from './EntityQueryBuilderPreview';

import { withDebounce } from './withDebounce';

import { queryEntities } from '../services/api';

import { getEntityById } from '../selectors/entities';
import { getOpenQbState, getQbState } from '../selectors/query';
import {
  doCloseQb,
  doSetOpenQbLabel,
  doSetOpenQbState,
  doSetQbValue,
} from '../actionCreators/query';

import { allEntityTypes, getTypeLabel } from '../constants/entityTypes';
import {
  analysisCategoryLabels,
  analysisCategories,
  AnalysisCategory,
} from '../generated/analysisCategories';
import { connectionRelationInfo } from '../connectionFormInfo';

import { EmptyObject, AnyObject } from '../types';
import { EntityType } from '../types/entities';

const TextField = withDebounce(MuiTextField);

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      '& .qb-lite': {
        margin: 0,
      },
      '& .query-builder-container': {
        padding: `${theme.spacing(1)}px !important`,
      },
      '& .group': {
        background: '#e8eaf6',
        border: '1px solid #c5cae9',
      },
      '& .query-builder .rule--body': {
        display: 'flex',
        alignItems: 'center',
      },
      '& div.group--actions.group--actions--tr:not(:hover)': {
        opacity: 1, // otherwise not visible by default
      },
    },
  }),
);

const keywordTypes = connectionRelationInfo['RKeyword'].types;

type AutocompleteEntitiesWidgetProps = Pick<
  WidgetProps,
  Exclude<keyof WidgetProps, 'customProps'>
> & { customProps?: { types?: EntityType[] } };

const AutocompleteEntitiesWidget: React.FC<AutocompleteEntitiesWidgetProps> = ({
  setValue,
  value,
  customProps,
}) => (
  <AutocompleteEntities
    label="Select entities"
    onChange={e => {
      if (e.target.value === undefined) {
        return;
      }
      setValue(e.target.value);
    }}
    simpleField
    disableClearable
    types={customProps?.types || []}
    value={value != null && value.length > 0 ? value : []}
  />
);

const getAnalysisCatLabel = (ac: string) =>
  analysisCategoryLabels[ac as AnalysisCategory];

const analysisCategorySelectListValues = analysisCategories.map(a => ({
  value: a,
  title: analysisCategoryLabels[a],
}));

const annotEntityTypes = allEntityTypes.filter(
  t =>
    ![
      'Platform',
      'VClipContributorRole',
      'VFunctionInClipRole',
      'VMusicPerformanceRole',
    ].includes(t),
);

const entityTypeSelectListValues = annotEntityTypes.map(t => ({
  value: t,
  title: getTypeLabel(t),
}));

const notEmpty = (val: RuleValue): string | null => {
  const result =
    val === null || (Array.isArray(val) && val.length === 0 && val[0] !== null)
      ? 'cannot not be empty'
      : null;
  return result;
};

const selectOperators = ['select_any_in', 'select_not_any_in'];

function entitySelect(label: string, types?: string[]): FieldOrGroup {
  return {
    label,
    type: 'select',
    preferWidgets: ['entityselect'],
    valueSources: ['value'] as ValueSource[],
    operators: selectOperators,
    fieldSettings: {
      validateValue: notEmpty,
    },
    widgets: {
      entityselect: {
        widgetProps: { customProps: { types } },
        opProps: {},
        operators: selectOperators,
      },
    },
  };
}

const InitialConfig = MaterialConfig;
export const config: Config = {
  ...InitialConfig,
  settings: {
    ...InitialConfig.settings,
    showErrorMessage: true,
  },
  fields: {
    _id: entitySelect('Is', annotEntityTypes),
    type: {
      label: 'Type',
      type: 'select',
      preferWidgets: ['multiselect'],
      fieldSettings: {
        listValues: entityTypeSelectListValues,
        validateValue: notEmpty,
      },
      valueSources: ['value'],
      operators: selectOperators,
    },
    analysisCategories: {
      label: 'Analysekategorie',
      type: 'select',
      preferWidgets: ['multiselect'],
      fieldSettings: {
        listValues: analysisCategorySelectListValues,
        validateValue: notEmpty,
      },
      valueSources: ['value'],
      operators: selectOperators,
    },
    attributes: {
      label: 'Attribute',
      type: '!struct',
      subfields: {
        // composer: entitySelect('Composer', ['Person']),
        // lyricist: entitySelect('Lyricist', ['Person']),
        // dateOfCreation: entitySelect('DateOfCreation', ['Date']), // TODO: Edtf-Date! where do I filter this?
        associatedWith: entitySelect('associated with', keywordTypes), // TODO: all the EntityTypes!
      },
    },
  },
  types: {
    ...InitialConfig.types,
    select: {
      ...InitialConfig.types.select,
      defaultOperator: 'select_any_in',
    },
  },
  widgets: {
    ...InitialConfig.widgets,
    entityselect: {
      ...InitialConfig.widgets.multiselect,
      // no idea yet why this type doesn't fit
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      factory: props => <AutocompleteEntitiesWidget {...props} />,
      formatValue: vals => vals.map(JSON.stringify),
      type: 'multiselect',
    },
  },
};

const newTree = (): JsonGroup => {
  const groupId = uuid4();
  // const ruleId = uuid4();
  return {
    id: groupId,
    type: 'group',
    // path: [groupId],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    children1: {},
    // children1: {
    //   [ruleId]: {
    //     type: 'rule',
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     id: ruleId,
    //     properties: {
    //       field: 'entityType',
    //       operator: 'multiselect_equals',
    //       value: [null],
    //       valueSrc: ['value'],
    //       operatorOptions: null,
    //       valueType: ['multiselect'],
    //     },
    //     path: [groupId, ruleId],
    //   },
    // },
  };
};

const isCompleteRule = (rule: JsonRule): boolean => {
  const { field, value } = rule.properties;
  return !(
    !field ||
    !value ||
    (Array.isArray(value) && (value.length === 0 || !value[0]))
  );
};

const getFirstRule = (jsTree: JsonTree): JsonRule | null => {
  const rules = Object.values(jsTree.children1 || {}).filter(
    c => c.type === 'rule',
  );
  if (rules.length !== 1) {
    return null;
  }
  return rules[0] as JsonRule;
};

function getRules(obj: JsonGroup | JsonRuleGroup | JsonRuleGroupExt) {
  let foundRules: JsonRule[] = [];
  if (isObject(obj) && has(obj, 'children1')) {
    Object.values(obj.children1 || {}).forEach(function (child) {
      if (child.type === 'rule') {
        foundRules.push(child);
      } else if (has(child, 'children1')) {
        foundRules = [...foundRules, ...getRules(child)];
      }
    });
  }
  return foundRules;
}

function allRulesHaveValues(obj: JsonGroup) {
  return getRules(obj).every(isCompleteRule);
}

// export interface Props {
//   handleCancel: () => void;
//   handleChange: (newTree: ImmutableTree) => void;
//   handleSave: (qbId: string, label: string, logic: string) => void;
//   qbId: string;
//   tree: ImmutableTree;
// }

export const EntityQueryBuilder: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { openQbId } = useSelector(getQbState);
  const { label, tree } = useSelector(getOpenQbState);
  const getE = useSelector(getEntityById);
  const getEntityLabel = (entityId: string) => getE(entityId)?.label || 'GHOST';
  const firstRule = tree !== null ? getFirstRule(QbUtils.getTree(tree)) : null;
  const [labelSet, setLabelSet] = React.useState(
    tree !== null && firstRule !== null && isCompleteRule(firstRule),
  );
  React.useEffect(
    function () {
      if (tree === null) {
        dispatch(doSetOpenQbState(QbUtils.loadTree(newTree())));
      }
    },
    [dispatch, tree],
  );
  const handleChange = throttle((immutableTree: ImmutableTree) => {
    const checkedTree = QbUtils.checkTree(immutableTree, config);
    dispatch(doSetOpenQbState(checkedTree));
    // try to automatically set label the first time around
    if (labelSet) {
      return;
    }
    const jsTree = QbUtils.getTree(checkedTree);
    const rule1 = getFirstRule(jsTree);
    if (rule1 === null || !isCompleteRule(rule1)) {
      return;
    }
    const { field, value } = rule1.properties;
    if (!field || !value) {
      return;
    }
    const labelMap: Record<string, string> = {
      _id: '',
      type: 'T: ',
      analysisCategories: 'A: ',
      'attributes.composer': 'C: ',
      'attributes.lyricist': 'L: ',
      'attributes.dateOfCreation': 'D: ',
      'attributes.associatedWith': 'assoc. with: ',
    };
    const valueGetterMap: Record<string, (id: string) => string> = {
      _id: getEntityLabel,
      type: getTypeLabel,
      analysisCategories: getAnalysisCatLabel,
      'attributes.composer': getEntityLabel,
      'attributes.lyricist': getEntityLabel,
      'attributes.dateOfCreation': getEntityLabel,
      'attributes.associatedWith': getEntityLabel,
    };
    const autoLabel = labelMap[field] + valueGetterMap[field](value[0]);
    dispatch(doSetOpenQbLabel(autoLabel));
    setLabelSet(true);
  }, 250);
  const handleLabelChange = (newLabel: string) => {
    dispatch(doSetOpenQbLabel(newLabel));
  };
  const [result, setResult] = React.useState<string[] | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
  if (tree === null) {
    return <div>Loading...</div>;
  }
  const qbIsValid = () => {
    const checkedTree = QbUtils.checkTree(tree, config);
    return (
      QbUtils.isValidTree(checkedTree) &&
      allRulesHaveValues(QbUtils.getTree(checkedTree)) &&
      QbUtils.jsonLogicFormat(checkedTree, config)?.logic !== undefined
    );
  };
  return (
    <div className={classes.root}>
      <TextField
        label="Query label"
        value={label}
        onChange={e => {
          handleLabelChange(e.target.value);
        }}
      />
      <Query
        {...config}
        value={tree}
        onChange={handleChange}
        renderBuilder={props => (
          <div className="query-builder-container" style={{ padding: '10px' }}>
            <div className="query-builder qb-lite">
              <Builder {...props} />
            </div>
          </div>
        )}
      />
      <Button
        disabled={!qbIsValid()}
        onClick={() => {
          const checkedTree = QbUtils.checkTree(tree, config);
          if (qbIsValid()) {
            dispatch(
              doSetQbValue(
                openQbId || 'qbe_' + uuid4(),
                label,
                JSON.stringify(
                  QbUtils.jsonLogicFormat(checkedTree, config).logic,
                ),
                QbUtils.mongodbFormat(tree, config) as AnyObject,
              ),
            );
            dispatch(doCloseQb());
          }
        }}
      >
        Ok
      </Button>
      <Button
        onClick={() => {
          dispatch(doCloseQb());
        }}
      >
        Cancel
      </Button>
      <Button
        disabled={!qbIsValid()}
        onClick={() => {
          const { logic } = QbUtils.jsonLogicFormat(tree, config);
          if (logic) {
            setIsPreviewLoading(true);
            queryEntities({ query: QbUtils.mongodbFormat(tree, config) })
              .then(setResult)
              .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
              })
              .finally(() => {
                setIsPreviewLoading(false);
              });
          }
        }}
      >
        Preview
      </Button>
      {/* <Button
        disabled={!qbIsValid()}
        onClick={() => {
          dispatch(
            doSaveQbTemplate(
              label,
              QbUtils.getTree(QbUtils.checkTree(tree, config)),
            ),
          );
        }}
      >
        Save as template
      </Button> */}
      {(result || isPreviewLoading) && (
        <>
          <hr />
          <EntityQueryBuilderPreview
            entityIds={result || []}
            loading={isPreviewLoading}
          />
        </>
      )}
    </div>
  );
};
