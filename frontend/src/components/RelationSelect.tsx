/**
 * Select for relations (used in QueryBuilder).
 */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { flatten, sortBy } from 'lodash';

import {
  connectionRelationInfo,
  supportedRelations,
} from '../generated/relations';

import { Relation } from '../types/relations';

const options = sortBy(
  flatten(
    Object.entries(supportedRelations).map(([elementType, allowedRelations]) =>
      allowedRelations.map((r: string) => ({
        relation: r,
        label: connectionRelationInfo[r as Relation].label,
        elementType: elementType.replace('Noise', 'Other Sounds'),
      })),
    ),
  ),
  o => [o.elementType, o.label],
);

interface Props {
  onChange: (selectedRelations: string[]) => void;
  value: string[];
}

export const RelationSelect: React.FC<Props> = ({ onChange, value = [] }) => {
  return (
    <Autocomplete
      filterSelectedOptions
      groupBy={option => option.elementType}
      getOptionLabel={option => option.label}
      getOptionSelected={(option, value) => option.relation === value.relation}
      multiple
      onChange={function (_event, newValue, _reason) {
        onChange(newValue.map(v => v.relation));
      }}
      renderInput={params => (
        <TextField {...params} label="With Relation(s)" variant="outlined" />
      )}
      options={options}
      value={value.map(r => options.find(o => o.relation === r)!)}
    />
  );
};
