/**
 * Style a timecode that either consists of only start or start and end.
 */
import React from 'react';

import { secondsToString } from '../util';

interface Props {
  start: number;
  end?: number;
}

export const TimecodeStartMaybeEnd: React.FC<Props> = ({ start, end }) => (
  <React.Fragment>
    {end !== undefined
      ? `${secondsToString(start)}-${secondsToString(end)}`
      : secondsToString(start)}
  </React.Fragment>
);
