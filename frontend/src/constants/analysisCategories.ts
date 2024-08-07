/**
 * Re-exporting analysis categories info and adding color mapping.
 */
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  grey,
} from '@material-ui/core/colors';

import {
  analysisCategories,
  analysisCategoryLabels,
} from '../generated/analysisCategories';

const COLORS = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
];
const BLACK_TEXT_FOR = [7, 10, 11, 12, 13, 14];

type CatInfo = {
  tag: string;
  label: string;
  color: string;
  textColor: string;
};

export const allCats: CatInfo[] = analysisCategories.map((ac, i) => ({
  tag: ac,
  label: analysisCategoryLabels[ac],
  color: (COLORS[i] || grey)[600],
  textColor: BLACK_TEXT_FOR.includes(i) ? '#000' : '#fff',
}));

export const catInfo = allCats.reduce(
  (acc, cur) => ({ ...acc, [cur.tag]: cur }),
  {} as Record<string, CatInfo>,
);
