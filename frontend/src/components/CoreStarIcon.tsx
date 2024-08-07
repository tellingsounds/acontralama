/**
 * Indicator in EntityChip to display an Entities Analysis Categories.
 */
import React from 'react';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import { StyledTooltip } from '../util';

interface Props {
  color: string;
  small?: boolean;
  style?: React.CSSProperties;
  title: string;
}

export const CoreStarIcon: React.FC<Props> = ({
  color,
  small = false,
  style,
  title,
}) => {
  return (
    <StyledTooltip title={title}>
      <DotIcon
        style={{ color: color, ...style }}
        fontSize={small ? 'small' : 'medium'}
      />
    </StyledTooltip>
  );
};
