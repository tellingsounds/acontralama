/**
 * Re-exporting entity types generated from "truth".
 */
import { sortBy } from 'lodash';

import { entityTypes, entityTypeLabels } from '../generated/entityTypes';
import { EntityType } from '../types/entities';

export const getTypeLabel = (t: keyof typeof entityTypeLabels): string =>
  entityTypeLabels[t] || t;

export const allEntityTypes: EntityType[] = sortBy(
  entityTypes.map(et => ({ value: et, label: entityTypeLabels[et] })),
  'label',
).map(({ value }) => value) as EntityType[];
