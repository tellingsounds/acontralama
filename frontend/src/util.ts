/**
 * Utility functions used in various locations.
 */
import { MetaMeta } from './types/clips';
import { Theme, Tooltip, withStyles } from '@material-ui/core';

export const secondsToString = (secs: number, compact = false): string => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor(secs / 60) % 60;
  const actualSeconds = secs % 60;
  return [!compact || hours > 0 ? hours : -1, minutes, actualSeconds]
    .filter(n => n >= 0)
    .map(n => n.toString().padStart(2, '0'))
    .join(':');
};

export const dateToString = (date: Date): string => {
  const dy = date.getUTCFullYear();
  const dm = date.getUTCMonth();
  const dd = date.getUTCDate();
  return [dd, dm + 1, dy].map(n => n.toString().padStart(2, '0')).join('.');
};

export const isoDateToString = (isoStringDate: string) =>
  dateToString(new Date(isoStringDate));

export const isEmpty = (v: any) => v === undefined || v === null || v === '';

export const getMetaInfo = (info: MetaMeta) => {
  let metaInfo = '';
  metaInfo = `Created ${info.created && formatIsoDate(info.created)} by ${
    info.createdBy
  }`;
  if (info.updated && info.updatedBy) {
    metaInfo += `; updated ${info.updated && formatIsoDate(info.updated)} by ${
      info.updatedBy
    }`;
  }
  metaInfo += '.';
  return metaInfo;
};

export const formatIsoDate = (dateIn: string) => {
  const date = new Date(dateIn);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const datePart = [dt, month, year]
    .map(n => n.toString().padStart(2, '0'))
    .join('.');
  const timePart = [hours, minutes, seconds]
    .map(n => n.toString().padStart(2, '0'))
    .join(':');

  return datePart + ' ' + timePart;
};

export const filterObjectKeys = <T>(o: T, allowedKeys: Array<keyof T>): T =>
  Object.entries(o as Record<string, unknown>)
    .filter(([k, _v]) => allowedKeys.includes(k as keyof T))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as T);

export const allKeysSet = (keys: string[], value: boolean) =>
  keys.reduce((acc, cur) => ({ ...acc, [cur]: value }), {});

export const someKeysSet = <T>(
  obj: Record<string, T>,
  newValue: T,
  keysToSet?: string[],
) =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]:
        keysToSet !== undefined
          ? keysToSet.includes(k)
            ? newValue
            : v
          : newValue,
    }),
    {} as Record<string, T>,
  );

export const keysSetIfUndefined = <T>(
  existing: Record<string, T>,
  newValue: T,
  keysToSet: string[],
) =>
  keysToSet.reduce(
    (acc, k) => ({
      ...acc,
      [k]: acc[k] === undefined ? newValue : acc[k],
    }),
    existing,
  );

export const getHeight = (elementId: string): number =>
  document.getElementById(elementId)?.getBoundingClientRect().height || 0;

export const remToPx = (px: number) =>
  parseInt(getComputedStyle(document.documentElement).fontSize) * px;

const PREFIX = process.env.PATH_PREFIX || ('' as string);

export const withPathPrefix = (s: string) => PREFIX + s;

export const withoutPathPrefix = (s: string) =>
  !PREFIX ? s : s.replace(new RegExp(`^${PREFIX}`), '');

export const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 13,
  },
}))(Tooltip);
