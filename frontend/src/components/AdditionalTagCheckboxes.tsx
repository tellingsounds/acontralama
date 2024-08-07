/**
 * Colored checkboxes used for selecting Analysis Categories.
 */
import React from 'react';

import { FCLCheckbox } from './FCLCheckbox';

import * as AC from '../constants/analysisCategories';

const updateTags = (
  prevTags: string[],
  tag: string,
  checked: boolean,
): string[] => [...prevTags.filter(t => t !== tag), ...(checked ? [tag] : [])];

interface Props {
  onChange: (newValue: string[]) => void;
  value: string[];
}

export const AdditionalTagCheckboxes: React.FC<Props> = ({
  onChange,
  value,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '14px',
      }}
    >
      {AC.allCats.map(t => (
        <FCLCheckbox
          key={t.tag}
          style={{ color: t.color }}
          label={t.label}
          checked={value.includes(t.tag)}
          onChange={event => {
            onChange(updateTags(value, t.tag, event.target.checked));
          }}
        />
      ))}
    </div>
  );
};
