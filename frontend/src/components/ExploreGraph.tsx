/**
 * Display the graph.
 */
import React from 'react';
import ForceGraph2D, {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from 'react-force-graph-2d';
import { useDispatch } from 'react-redux';

import {
  // Input,
  Paper,
  Typography,
  makeStyles,
  createStyles,
  // Select,
} from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

import * as d3 from 'd3-force';

import { debounce } from 'lodash';

import { SearchBoxDebounced as SearchBox } from './SearchBox';

import { substitutionMap } from '../constants/charMap';

import {
  getGraphDataClip,
  getGraphDataEntity,
  GraphData,
} from '../services/api';

import { doFetchError, doToggleSidePanel } from '../actionCreators/app';
import { doShowClipDetails, doShowEntity } from '../actionCreators/sidePanel';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      margin: 0,
    },
    loadingIndicator: {
      position: 'absolute',
      left: 0,
      top: () => getNavBarHeight() + 'px',
      zIndex: 1000000,
    },
    searchBox: {
      backgroundColor: alpha(theme.palette.common.white, 0.5),
      position: 'absolute',
      right: () => getSidePanelWidth() + 'px',
      top: () => getNavBarHeight() + 'px',
      zIndex: 1000000,
    },
  }),
);

function makeColor(hex: string) {
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(h =>
    parseInt(h, 16),
  ) as [number, number, number];
  return function makeColorWithAlpha(alpha: number) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
}

const clipColor = makeColor('#ef5350'); // mui red
const originClipColor = makeColor('#d50000');
const entityColor = makeColor('#1e88e5'); // mui blue
const originEntityColor = makeColor('#1a237e');

const LABEL_TRUNCATE_LIMIT = 32;

const NODE_R = 10;

const getNavBarHeight = (): number =>
  (({ height }) => height)(
    document.getElementById('LamaAppBar')?.getBoundingClientRect() || {
      height: 0,
    },
  );
const getSidePanelWidth = (): number =>
  (({ width }) => width)(
    document.getElementById('LamaSidePanel')?.getBoundingClientRect() || {
      width: 0,
    },
  );

const getMainPanelDimensions = () => ({
  width: window.innerWidth - getSidePanelWidth(),
  height: window.innerHeight - getNavBarHeight(),
});

const baseChars = 'eaioustbcdfghklmnprjvwxyzq';
const simplify = (s: string): string =>
  Array.from(s.toLowerCase())
    .map(c => {
      const lookup = substitutionMap[c];
      if (lookup) {
        return lookup;
      }
      for (let i = 0; i < baseChars.length; i++) {
        const bc = baseChars[i];
        if (c.localeCompare(bc, 'de', { sensitivity: 'base' }) === 0) {
          return bc;
        }
      }
      return c;
    })
    .join('');

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type Link = ArrayElement<GraphData['links']>;
type Node = ArrayElement<GraphData['nodes']> & {
  neighbors?: Node[];
  links?: Link[];
};
interface EnrichedNode extends Node {
  neighbors: EnrichedNode[];
  links: Link[];
  simpleName: string;
}
interface EnrichedGeoNode extends EnrichedNode {
  x: number;
  y: number;
}
interface EnrichedData {
  nodes: EnrichedNode[];
  links: Link[];
}

type Props =
  | {
      clipId: string;
      entityId?: never;
    }
  | {
      clipId?: never;
      entityId: string;
    };

export const ExploreGraph: React.FC<Props> = ({ clipId, entityId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = React.useState('');
  React.useEffect(() => {
    dispatch(doToggleSidePanel(true));
    return () => {
      dispatch(doToggleSidePanel(false));
    };
  }, [dispatch]);
  const [loading, setLoading] = React.useState(false);
  const [graphData, setGraphData] = React.useState<GraphData | null>(null);
  const fgRef = React.useRef<ForceGraphMethods | undefined>(undefined);
  const startId = clipId || entityId;
  const params = 'RStatus';
  React.useEffect(
    function () {
      if (!startId) {
        return;
      }
      (async function () {
        try {
          setLoading(true);
          let fetchingFunc;
          if (clipId) {
            fetchingFunc = getGraphDataClip;
          } else if (entityId) {
            fetchingFunc = getGraphDataEntity;
          } else {
            return;
          }
          const fetchedData = await fetchingFunc(startId, params);
          setGraphData(fetchedData);
          if (clipId) {
            dispatch(doShowClipDetails(clipId));
          } else if (entityId) {
            dispatch(doShowEntity(entityId));
          }
        } catch (err) {
          dispatch(doFetchError(err));
        } finally {
          setTimeout(function () {
            setLoading(false);
          }, 250); // make sure we don't get "empty white screen"
        }
      })();
    },
    [dispatch, startId, clipId, entityId],
  );
  const [wh, setWh] = React.useState<{ width: number; height: number } | null>(
    null,
  );
  React.useEffect(function () {
    setTimeout(() => {
      const newDimensions = getMainPanelDimensions();
      setWh(newDimensions);
    }, 0);
  }, []);
  const enrichedData = React.useMemo(() => {
    if (!graphData) {
      return { nodes: [], links: [] };
    }
    const newData = { ...graphData };
    const nodesById = newData.nodes.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {} as Record<string, Node>,
    );
    newData.nodes.forEach(node => {
      (node as EnrichedNode).simpleName = simplify(node.name);
    });
    newData.links.forEach(link => {
      const a = nodesById[link.source];
      const b = nodesById[link.target];
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);
      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });
    return newData as EnrichedData;
  }, [graphData]);
  const matchingNodeIds = React.useMemo(() => {
    if (!searchText) {
      return new Set();
    }
    const st = simplify(searchText);
    return new Set(
      enrichedData.nodes.filter(n => n.simpleName.includes(st)).map(n => n.id),
    );
  }, [enrichedData, searchText]);
  React.useEffect(
    function () {
      if (fgRef.current) {
        fgRef.current.zoom(1.5);
      }
    },
    [enrichedData],
  );
  const [highlightNodes, setHighlightNodes] = React.useState(new Set());
  const [highlightLinks, setHighlightLinks] = React.useState(new Set());
  const [hoverNode, setHoverNode] = React.useState<EnrichedNode | null>(null);
  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: NodeObject | null) => {
    highlightNodes.clear();
    highlightLinks.clear();
    const n = node as EnrichedNode | null;
    if (n) {
      highlightNodes.add(n);
      n.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      n.links.forEach(link => highlightLinks.add(link));
    }
    setHoverNode(n || null);
    updateHighlight();
  };

  const handleLinkHover = (link: LinkObject | null) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const paintRing = React.useCallback(
    (node, ctx, globalScale) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(
        node.x,
        node.y,
        (NODE_R / globalScale) * 1.33,
        0,
        2 * Math.PI,
        false,
      );
      ctx.fillStyle = node === hoverNode ? 'purple' : 'orange';
      ctx.fill();
    },
    [hoverNode],
  );

  const handleClick = React.useCallback(
    function (node) {
      if (node.type === 'clip') {
        dispatch(doShowClipDetails(node.id));
      } else {
        dispatch(doShowEntity(node.id));
      }
    },
    [dispatch],
  );

  // const handleFilterChange = React.useCallback(
  //   function (event: React.ChangeEvent<{ value: unknown }>) {
  //     dispatch(
  //       doUpdateEntityListConfig({
  //         selectedTypes: event.target.value as EntityType[],
  //         pageBeforeAfter: [undefined, undefined],
  //       }),
  //     );
  //   },
  //   [dispatch],
  // );

  React.useEffect(function () {
    const fg = fgRef.current;
    if (!fg) {
      return;
    }
    const mbf = d3.forceManyBody();
    mbf.strength(-500);
    mbf.distanceMin(70);
    mbf.distanceMax(400);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (incompatible typings)
    fg.d3Force('charge', mbf);
    const resume = function () {
      // console.log('resuming');
      fg.resumeAnimation();
    };
    const pause = function () {
      // console.log('pausing');
      fg.pauseAnimation();
    };
    const handleResize = debounce(function () {
      // console.log('resized');
      setWh(getMainPanelDimensions());
    }, 500);
    window.addEventListener('focus', resume, false);
    window.addEventListener('blur', pause, false);
    window.addEventListener('resize', handleResize, false);
    return function () {
      window.removeEventListener('focus', resume, false);
      window.removeEventListener('blur', pause, false);
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);
  return (
    <div className={classes.root}>
      {loading && (
        <Typography className={classes.loadingIndicator}>Loading...</Typography>
      )}
      <Paper
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          marginLeft: 4,
          marginRight: 4,
        }}
      >
        {/* <Select
          fullWidth
          style={{
            maxWidth: '100%',
          }}
          multiple
          value={params}
          onChange={handleFilterChange}
          input={<Input />}
          displayEmpty
          renderValue={_selected => (
            <span
              style={{
                padding: '4px',
                paddingLeft: '4px',
              }}
            >
              {params.length === 0
                ? 'Filter by type...'
                : params.map(getTypeLabel).join(', ')}
            </span>
          )}
          MenuProps={MenuProps}
        ></Select> */}
      </Paper>
      <div className={classes.searchBox}>
        <SearchBox
          onChange={e => {
            setSearchText(e.target.value);
          }}
          value={searchText}
        />
      </div>
      <ForceGraph2D
        ref={fgRef}
        {...wh}
        graphData={enrichedData}
        backgroundColor="#fff"
        linkColor={link => (highlightLinks.has(link) ? '#bbb' : '#ccc')}
        linkWidth={link => (highlightLinks.has(link) ? 3 : 1)}
        nodeLabel={node => {
          const n = node as EnrichedNode;
          return `${n.name} (${
            n.entityType || n.type.slice(0, 1).toUpperCase() + n.type.slice(1)
          })`;
        }}
        onNodeClick={handleClick}
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
        autoPauseRedraw={false}
        nodeCanvasObject={(nodeObj, ctx, globalScale) => {
          const node = nodeObj as EnrichedGeoNode;
          if (highlightNodes.has(node)) {
            paintRing(node, ctx, globalScale);
          }
          const getColor =
            node.type === 'clip'
              ? node.id === clipId
                ? originClipColor
                : clipColor
              : node.id === entityId
              ? originEntityColor
              : entityColor;
          const colorWithOpacity = getColor(
            !searchText || matchingNodeIds.has(node.id) ? 1 : 0.4,
          );
          ctx.fillStyle = colorWithOpacity;
          ctx.beginPath();
          ctx.arc(node.x, node.y, NODE_R / globalScale, 0, 2 * Math.PI, false);
          ctx.fill();
          const fullLabel = node.name.trim();
          const label =
            fullLabel.length > LABEL_TRUNCATE_LIMIT
              ? fullLabel.slice(0, 32).trim() + '...'
              : fullLabel;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            n => n + fontSize * 0.2,
          ) as [number, number]; // some padding
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions,
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = colorWithOpacity;
          ctx.fillText(label, node.x, node.y);
        }}
      />
    </div>
  );
};
