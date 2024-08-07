/**
 * Style timecodes.
 */
import React from 'react';

import { secondsToString } from '../util';

interface Props {
  timecodes: Array<[number, number]>;
}

export const Timecodes: React.FC<Props> = ({ timecodes }) => {
  return (
    <React.Fragment>
      {timecodes.map(([start, end], i) => (
        <React.Fragment key={i}>
          <span style={{ whiteSpace: 'nowrap' }}>
            {secondsToString(start)}-{secondsToString(end)}
            {i < timecodes.length - 1 ? ',' : ''}
          </span>
          {i < timecodes.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
