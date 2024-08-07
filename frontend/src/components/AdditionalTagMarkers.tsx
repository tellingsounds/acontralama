/**
 * Colored circles used to indicate Analysis Categories.
 */
import React from 'react';

import { CoreStarIcon } from './CoreStarIcon';

import * as AC from '../constants/analysisCategories';

interface Props {
  selectedTags: string[];
  small?: boolean;
}

export const AdditionalTagMarkers: React.FC<Props> = ({
  selectedTags,
  small = false,
}) => {
  return (
    <span
      style={{
        display: 'inherit',
        marginRight: selectedTags.length > 0 ? '14px' : 0,
      }}
    >
      {AC.allCats
        .filter(t => selectedTags.includes(t.tag))
        .map(t => (
          <CoreStarIcon
            key={t.tag}
            color={t.color}
            title={t.label}
            small={small}
            style={{ marginRight: '-14px' }}
          />
        ))}
    </span>
  );
};
