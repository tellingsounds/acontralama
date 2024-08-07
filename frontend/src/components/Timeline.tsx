/**
 * Shows all Segments and Elements with timecode of a clip in a timeline.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tooltip,
  createStyles,
  makeStyles,
  withStyles,
  alpha,
} from '@material-ui/core';
import {
  // lightBlue,
  lightGreen,
  lime,
  // purple,
  grey,
} from '@material-ui/core/colors';

import {
  getCurrentClip,
  getClipElementById,
  getSegmentById,
  // getClipLayerById,
} from '../selectors/clips';
import { doJumpTo } from '../actionCreators/sagaActions';

import { secondsToString } from '../util';
import { EmptyObject } from '../types';
import {
  ClipElement,
  Segment,
  // ClipLayer
} from '../types/clips';

const useStyles = makeStyles(_theme =>
  createStyles({
    trackOuter: {
      display: 'flex',
      flexDirection: 'row',
      height: '3.6rem',
      maxHeight: '3.6rem',
      '&:nth-child(odd)': {
        backgroundColor: grey[300],
        '& $trackHeader': { backgroundColor: grey[400] },
      },
      '&:nth-child(even)': {
        backgroundColor: grey[200],
        '& $trackHeader': { backgroundColor: grey[300] },
      },
    },
    trackInner: {
      flexGrow: 1,
      position: 'relative',
    },
    trackHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRight: '1px solid black',
      padding: '6px',
      width: '12px',
    },
    region: {
      border: 'solid 1px',
      borderRadius: '0.22rem',
      bottom: '0.3rem',
      boxShadow: '1px 1px 3px ' + grey[600],
      boxSizing: 'border-box',
      cursor: 'pointer',
      fontSize: 'small',
      height: '3.0rem',
      overflow: 'hidden',
      paddingLeft: '0.2rem',
      position: 'absolute',
      textOverflow: 'ellipsis',
      top: '0.3rem',
      whiteSpace: 'nowrap',
    },
    labelsOuter: {
      display: 'flex',
      flexDirection: 'row',
      height: '1.5rem',
    },
    labelsInner: {
      flexGrow: 1,
      position: 'relative',
      '& span': {
        position: 'absolute',
        color: alpha('#000', 0.6),
      },
    },
  }),
);

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: theme.typography.fontSize,
  },
}))(Tooltip);

const COLORS = {
  Segment: lightGreen,
  // Music: lightGreen,
  // Speech: lime,
  // Noise: lightBlue,
  // Picture: purple,
  Structure: lime,
};
const LIGHT = 300;
const DARKER = 600;

const formatPercentage = (ratio: number) => `${(ratio * 100).toFixed(2)}%`;

const getLabelInterval = (duration: number) => {
  switch (true) {
    case duration <= 10:
      return 1;
    case duration <= 30:
      return 5;
    case duration <= 60:
      return 10;
    case duration <= 120:
      return 15;
    case duration <= 180:
      return 20;
    case duration <= 300:
      return 30;
    case duration <= 600:
      return 60;
    case duration <= 900:
      return 120;
    case duration <= 1800:
      return 300;
    case duration <= 3600:
      return 600;
    case duration <= 7200:
      return 900;
    case duration <= 10800:
      return 1800;
    default:
      return 3600;
  }
};

const range = (n: number): Array<number> => Array.from(Array(n).keys());

const TimelineLabels: React.FC<{ duration: number }> = ({ duration }) => {
  const classes = useStyles();
  const labelInterval = getLabelInterval(duration);
  return (
    <div className={classes.labelsOuter}>
      <div className={classes.trackHeader}>&nbsp;</div>
      <div className={classes.labelsInner}>
        {range(Math.floor(duration / labelInterval) + 1)
          .map(x => x * labelInterval)
          .filter(secs => secs < duration)
          .map(secs => (
            <span
              key={secs}
              style={{
                left: formatPercentage(secs / duration),
              }}
            >
              {secondsToString(secs, true)}
            </span>
          ))}
      </div>
    </div>
  );
};

const TRACKLABELS = [
  'Interpretation',
  'Structure',
  // 'MusicLayer',
  // 'SpeechLayer',
  // 'SoundLayer',
];

export const Timeline: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const getE = useSelector(getClipElementById) as (id: string) => ClipElement;
  // const getL = useSelector(getClipLayerById) as (id: string) => ClipLayer;
  const getS = useSelector(getSegmentById) as (id: string) => Segment;
  const clip = useSelector(getCurrentClip);
  const [highlightedElement, setHighlightedElement] = React.useState<
    string | null
  >(null);
  if (!clip) {
    return <div>Error: only works with a clip</div>;
  }
  const duration = clip.duration;
  const baseTracks = [
    clip.segments.map(getS),
    clip.elements.Structure.map(getE),
  ].map(elements =>
    elements.filter(
      (t: ClipElement) => t.timecodes !== undefined && t.timecodes.length > 0,
    ),
  );

  // const layers = Object.values(clip.layers).map(m => {
  //   const a = [];
  //   a.push(m.MusicLayer.map(getL));
  //   a.push(m.SpeechLayer.map(getL));
  //   a.push(m.SoundLayer.map(getL));
  //   a.map(elements => elements.filter(t => t.timecodes.length > 0));
  //   return a;
  // });

  const tracks = baseTracks.filter(track => track.length > 0);
  // layers.map(layer => {
  //   layer.map(l => (l.length > 0 ? tracks.push(l) : null));
  // });

  const trackLabels = TRACKLABELS.filter((_l, i) => baseTracks[i].length > 0);
  if (tracks.every(t => t.length === 0)) {
    return (
      <p style={{ padding: '8px', paddingLeft: '16px' }}>
        Nothing to see here.
      </p>
    );
  }
  return (
    <div>
      {tracks.map((track, i) => (
        <div key={i} className={classes.trackOuter}>
          <div className={classes.trackHeader} title={trackLabels[i]}>
            {trackLabels[i].slice(0, 2)}
          </div>
          <div className={classes.trackInner}>
            {track.map((element, _j) =>
              element.timecodes.map(([start, end], k) => (
                <LightTooltip
                  key={k}
                  placement="top"
                  title={
                    <div>
                      {element.label} (
                      {element.type === 'Segment'
                        ? 'Interpretation'
                        : element.type}
                      ){' '}
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {secondsToString(start, true)}-
                        {secondsToString(end, true)}
                      </span>
                    </div>
                  }
                >
                  <div
                    onMouseEnter={() => {
                      setHighlightedElement(element._id);
                    }}
                    onMouseLeave={() => {
                      if (highlightedElement === element._id) {
                        setHighlightedElement(null);
                      }
                    }}
                    className={classes.region}
                    style={{
                      left: formatPercentage(start / duration),
                      right: formatPercentage(1 - end / duration),
                      backgroundColor: alpha(
                        COLORS[element.type][
                          highlightedElement === element._id ? DARKER : LIGHT
                        ],
                        highlightedElement === element._id ? 0.8 : 0.67,
                      ),
                      zIndex: 1000 + k,
                    }}
                    onClick={() => {
                      dispatch(
                        doJumpTo(element._id, [element.type, element._id]),
                      );
                    }}
                  >
                    {element.label}
                  </div>
                </LightTooltip>
              )),
            )}
          </div>
        </div>
      ))}
      <TimelineLabels duration={duration} />
    </div>
  );
};
