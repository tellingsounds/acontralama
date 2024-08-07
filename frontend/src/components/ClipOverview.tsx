/**
 * Displays a Clip
 */
import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { indigo, purple } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import { ClipBasicForm } from './ClipBasicForm';
import { BasicSegmentForm } from './BasicSegmentForm';
import { BasicElementForm } from './BasicElementForm';
import { BasicLayerForm } from './BasicLayerForm';
import {
  TableView,
  getBasicTableViewItems,
  getAnnotTableViewItems,
} from './TableView';
import { Timecodes } from './Timecodes';
import { SegmentView } from './SegmentView';
import { MetaInfo } from './MetaInfo';
import { PlusButton } from './PlusButton';
import { PlusButtonNested } from './PlusButtonNested';
import { ButtonGroup } from './CustomButtonGroup';
import { IconDeleteButton } from './DeleteButton';
import { Timeline } from './Timeline';

import {
  getClipAccordionsState,
  getEditingLeftState,
  getReadOnly,
  // getUsername,
  shouldLockFormOnTheLeft,
} from '../selectors/app';
import {
  getAnnotationById,
  getClipElementById,
  getClipLayerById,
  getLayerIdsFromElementId,
  getCurrentClip,
  getElementLayerSegmentIds,
  getSegmentById,
} from '../selectors/clips';
import {
  doSetClipAccordions,
  doNewClip,
  doSetEditingLeft,
} from '../actionCreators/app';
import { doCreateConnection } from '../actionCreators/sidePanel';
import {
  doClipOverviewRendered,
  doDeleteClip,
  doDeleteElement,
  doDeleteLayer,
  doFetchCurrentClip,
  doJumpTo,
} from '../actionCreators/sagaActions';

import {
  getNestedElementLabel,
  getNestedElementRelations,
  supportedRelations,
  getConnectionTypeLabel,
  getConnectionTypeDefinition,
} from '../connectionFormInfo';
import { getMetaInfo, withoutPathPrefix, withPathPrefix } from '../util';

import { BasicField } from '../viewFieldInfo';
import { ClipElement, ClipLayer, ElementType, LayerType } from '../types/clips';
import { ClipRelation, NestedGroupLabels, Relation } from '../types/relations';
import { nestedGroupElements } from '../generated/relations';

const orderOfElementTypes: ElementType[] = [
  // 'Music',
  // 'Speech',
  // 'Noise',
  // 'Picture',
  'Structure',
];
const orderOfLayerTypes: LayerType[] = [
  'MusicLayer',
  'SpeechLayer',
  'SoundLayer',
];

const basicFields: BasicField[] = [
  'title',
  'subtitle',
  'label',
  'url',
  'platform',
  'collections',
  'shelfmark',
  'fileType',
  'duration',
  'language',
  'clipType',
  'offsetTimecode',
  'description',
];

export const clipRelations: ClipRelation[] =
  supportedRelations.Clip as ClipRelation[];

const relationsByElementType = supportedRelations;

const useStyles = makeStyles(_theme =>
  createStyles({
    categoryHeadingE: {
      backgroundColor: indigo[200],
      fontSize: '1.1rem',
      display: 'flex',
      flexDirection: 'row',
    },
    categoryHeadingL: {
      backgroundColor: purple[100],
      fontSize: '1.1rem',
      display: 'flex',
      flexDirection: 'row',
    },
    accordionButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    innerAccordion: {
      display: 'block',
      padding: 0,
    },
    nestedLabels: {
      padding: '16px 0 8px 0',
    },
    itemSummaryE: {
      backgroundColor: indigo[100],
      fontSize: '1.1rem',
      '& .MuiAccordionSummary-content': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
    },
    itemSummaryL: {
      backgroundColor: purple[50],
      fontSize: '1.1rem',
      '& .MuiAccordionSummary-content': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
    },
    topAccordion: {
      margin: '8px 0 0 0',
      '&.Mui-expanded': {
        margin: '8px 0 16px 0',
      },
    },
    basicForm: {
      marginBottom: '8px',
      padding: '8px 16px 16px',
      position: 'relative', // relevant for overlay
    },
    topButtons: {
      display: 'flex',
      '& :last-child': {
        marginLeft: 'auto',
      },
    },
  }),
);

interface CategoryAccordionProps {
  categoryId: string;
  children: React.ReactNode;
  label: string;
  expanded: boolean;
  itemIds: string[];
  toggleAll: (isOpen: boolean, accordionIds?: string[]) => void;
  toggleOne: (accordionId: string, open: boolean) => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categoryId,
  children,
  expanded,
  itemIds,
  label,
  toggleAll,
  toggleOne,
}) => {
  const classes = useStyles();
  return (
    <MuiAccordion
      expanded={expanded}
      onChange={(_event, open) => {
        toggleOne(categoryId, open);
      }}
    >
      <AccordionSummary
        id={categoryId}
        className={
          label === 'MusicLayer' ||
          label === 'SpeechLayer' ||
          label === 'SoundLayer'
            ? classes.categoryHeadingL
            : classes.categoryHeadingE
        }
        expandIcon={<ExpandMoreIcon />}
      >
        <span style={{ flexGrow: 1 }}>
          {label} ({itemIds.length})
        </span>
        <span>
          <IconButton
            title="Expand all"
            style={{ padding: '0 6px' }}
            onClick={event => {
              toggleAll(true, [...itemIds, categoryId]);
              event.stopPropagation();
            }}
          >
            <UnfoldMoreIcon fontSize="small" />
          </IconButton>
          <IconButton
            title="Collapse all"
            style={{ padding: '0 6px' }}
            onClick={event => {
              toggleAll(false, itemIds);
              event.stopPropagation();
            }}
          >
            <UnfoldLessIcon fontSize="small" />
          </IconButton>
        </span>
      </AccordionSummary>
      <AccordionDetails className={classes.innerAccordion}>
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

const unmountContentsIfClosed = { TransitionProps: { unmountOnExit: true } };

const createNewLayer =
  (
    category: 'MusicLayer' | 'SpeechLayer' | 'SoundLayer',
    dispatch: Dispatch,
    parentId: string,
  ) =>
  () => {
    dispatch(doSetEditingLeft(true, category, null, parentId));
    dispatch(doJumpTo(category, [category]));
  };

interface Props {
  clipId?: string;
}

export const ClipOverview: React.FC<Props> = ({ clipId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // const currentUser = useSelector(getUsername);
  const clip = useSelector(getCurrentClip);
  const readOnlyMode = useSelector(getReadOnly);
  const isEditLocked = useSelector(shouldLockFormOnTheLeft);
  const editingLeftState = useSelector(getEditingLeftState);
  const isEditingNewClip =
    clip === null && editingLeftState.category === 'Clip';
  const isEditingExistingClip =
    clip !== null && editingLeftState.category === 'Clip';
  const isEditingElement = ![
    'Clip',
    'Segment',
    'MusicLayer',
    'SpeechLayer',
    'SoundLayer',
    null,
  ].includes(editingLeftState.category);
  const isEditingLayer = ![
    'Clip',
    'Segment',
    // 'Music',
    // 'Speech',
    // 'Noise',
    null,
  ].includes(editingLeftState.category);

  const getA = useSelector(getAnnotationById);

  const segmentInterpretationAnnot = () => {
    const interpretationAnnots = clip?.annotations['RInterpretationAnnot'].map(
      (annotId: string) => {
        return getA(annotId);
      },
    );
    return {
      RInterpretationAnnot: interpretationAnnots?.map(annot => annot._id),
    };
  };

  const editingNewElLaySegCategory: string | null =
    !['Clip', null].includes(editingLeftState.category) &&
    editingLeftState.id === null
      ? editingLeftState.category
      : null;
  const editingExistingElementId: string | null = isEditingElement
    ? editingLeftState.id
    : null;
  const editingExistingLayerId: string | null = isEditingLayer
    ? editingLeftState.id
    : null;
  // const currentElementId: string | null = useSelector(getCurrentElementId);
  const buttonsDisabled: boolean =
    editingLeftState.category !== null || isEditLocked;
  const getE = useSelector(getClipElementById) as (id: string) => ClipElement;
  const getL = useSelector(getClipLayerById) as (id: string) => ClipLayer;
  const getLayerIdsFromId = useSelector(getLayerIdsFromElementId) as (
    id: string,
    lt: LayerType,
  ) => string[];
  const getS = useSelector(getSegmentById);
  const categoryIds = [
    'Clip',
    'Segment',
    ...orderOfElementTypes,
    ...orderOfLayerTypes,
  ];
  const elementLayerSegmentIds = useSelector(getElementLayerSegmentIds);
  const accordionState = useSelector(getClipAccordionsState);
  const handleAccordionToggle = (
    accordionId: string,
    isOpen: boolean,
    parentId?: string,
  ) => {
    const accordionIdsToSet =
      parentId !== undefined && isOpen
        ? [accordionId, parentId]
        : [accordionId];
    dispatch(doSetClipAccordions(isOpen, accordionIdsToSet));
  };
  const setAccordions = (isOpen: boolean, accordionIds?: string[]) => {
    dispatch(doSetClipAccordions(isOpen, accordionIds));
  };
  React.useEffect(() => {
    if (withoutPathPrefix(location.pathname) === '/clip/new') {
      dispatch(doNewClip());
    }
  }, [dispatch]);
  React.useEffect(() => {
    if (clipId) {
      dispatch(doFetchCurrentClip(clipId));
    }
  }, [clipId, dispatch]);
  React.useEffect(() => {
    dispatch(doClipOverviewRendered());
  }, [clip, dispatch]);
  if (isEditingNewClip) {
    return (
      <Paper className={classes.basicForm}>
        <ClipBasicForm />
      </Paper>
    );
  }
  return (
    <div>
      <Paper id="Clip" className={classes.basicForm}>
        {isEditingExistingClip ? (
          <ClipBasicForm />
        ) : (
          clip !== null && (
            <div>
              <div className={classes.topButtons}>
                {!readOnlyMode && (
                  <ButtonGroup
                    disabled={buttonsDisabled}
                    disabledTitle="Please finish editing first"
                  >
                    <IconButton
                      title="Edit"
                      onClick={() => {
                        dispatch(doSetEditingLeft(true, 'Clip'));
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    {clipId && (
                      <IconDeleteButton
                        onClick={() => {
                          dispatch(doDeleteClip(clip));
                        }}
                      />
                    )}
                  </ButtonGroup>
                )}
                <Button
                  onClick={function () {
                    history.push(withPathPrefix(`/explore/clip/${clipId}`));
                  }}
                >
                  Explore
                </Button>
              </div>
              <TableView
                items={getBasicTableViewItems(basicFields, clip)}
                extraInfo={getMetaInfo(clip)}
              />
            </div>
          )
        )}
      </Paper>
      <div className={classes.accordionButtons}>
        {(!categoryIds.every(c => accordionState[c]) ||
          elementLayerSegmentIds.some(x => accordionState[x])) && (
          <Button
            startIcon={<UnfoldMoreIcon />}
            onClick={() => {
              setAccordions(true, [
                'ClipAnnotations',
                ...categoryIds,
                'Timeline',
              ]);
              setAccordions(false, elementLayerSegmentIds);
            }}
          >
            Expand Categories
          </Button>
        )}
        <Button
          startIcon={<UnfoldMoreIcon />}
          onClick={() => {
            setAccordions(true);
          }}
        >
          Expand All
        </Button>
        <Button
          startIcon={<UnfoldLessIcon />}
          onClick={() => {
            setAccordions(false);
          }}
        >
          Collapse All
        </Button>
      </div>
      {clip !== null && (
        <>
          {/* Clip Annotations */}
          <MuiAccordion
            className={classes.topAccordion}
            expanded={accordionState.ClipAnnotations}
            onChange={(_event, open) => {
              handleAccordionToggle('ClipAnnotations', open);
            }}
          >
            <AccordionSummary
              id="ClipAnnotations"
              className={classes.categoryHeadingE}
              expandIcon={<ExpandMoreIcon />}
            >
              Clip Annotations
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
              {!readOnlyMode && (
                <ButtonGroup
                  disabled={buttonsDisabled}
                  disabledTitle="Please finish editing first"
                >
                  <PlusButton
                    title="Add annotation"
                    options={supportedRelations.Clip.map(r => ({
                      text: getConnectionTypeLabel(r),
                      tooltip: getConnectionTypeDefinition(r),
                      handleClick: () => {
                        dispatch(doCreateConnection(r));
                      },
                    }))}
                  />
                </ButtonGroup>
              )}
              <TableView
                items={getAnnotTableViewItems(clipRelations, clip.annotations)}
              />
              {clip?.annotations['RInterpretationAnnot'] && (
                <TableView
                  items={getAnnotTableViewItems(
                    ['RInterpretationAnnot'],
                    segmentInterpretationAnnot(),
                    true, // withSegmentLink=true
                  )}
                />
              )}
            </AccordionDetails>
          </MuiAccordion>
          {/* Interpretations Accordion */}
          {/* Interpretations used to be called Segments, but this new name fits better now.
          Renaming Segments in the whole codebase would be rather dangerous and is not necessary.*/}
          {(clip.segments.length > 0 ||
            editingNewElLaySegCategory === 'Segment') && (
            <CategoryAccordion
              categoryId="Segment"
              expanded={accordionState['Segment']}
              itemIds={clip.segments}
              label="Interpretations"
              toggleAll={setAccordions}
              toggleOne={handleAccordionToggle}
            >
              {editingNewElLaySegCategory === 'Segment' && (
                <Paper className={classes.basicForm}>
                  <BasicSegmentForm />
                </Paper>
              )}
              {clip.segments
                .map(segmentId => getS(segmentId))
                .map(segment => {
                  return (
                    <MuiAccordion
                      key={segment._id}
                      expanded={accordionState[segment._id]}
                      onChange={(_event, open) => {
                        handleAccordionToggle(segment._id, open);
                      }}
                      {...unmountContentsIfClosed}
                    >
                      <AccordionSummary
                        id={segment._id}
                        className={classes.itemSummaryE}
                        expandIcon={<ExpandMoreIcon />}
                      >
                        <span>{segment.label}</span>
                        &#160;
                        <Typography component="span" color="textSecondary">
                          <Timecodes timecodes={segment.timecodes} />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails style={{ display: 'block' }}>
                        <SegmentView segmentProp={segment} />
                      </AccordionDetails>
                    </MuiAccordion>
                  );
                })}
            </CategoryAccordion>
          )}
          {/* Element Accordions */}
          {orderOfElementTypes.map(et => {
            if (
              clip.elements[et].length === 0 &&
              editingNewElLaySegCategory !== et
            ) {
              return null;
            }
            return (
              <CategoryAccordion
                key={et}
                categoryId={et}
                expanded={accordionState[et]}
                itemIds={clip.elements[et]}
                label={
                  et === 'Structure' ? 'Structure (Detailed Analysis)' : et
                }
                // label={et}
                toggleAll={setAccordions}
                toggleOne={handleAccordionToggle}
              >
                {editingNewElLaySegCategory === et && (
                  <Paper className={classes.basicForm}>
                    <BasicElementForm />
                  </Paper>
                )}
                {clip.elements[et].map(getE).map(element => (
                  <MuiAccordion
                    key={element._id}
                    expanded={accordionState[element._id]}
                    onChange={(_event, open) => {
                      handleAccordionToggle(element._id, open);
                    }}
                    {...unmountContentsIfClosed}
                  >
                    <AccordionSummary
                      id={element._id}
                      className={classes.itemSummaryE}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <span>{element.label}</span>
                      &#160;
                      <Typography component="span" color="textSecondary">
                        <Timecodes timecodes={element.timecodes} />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'block' }}>
                      {editingExistingElementId === element._id ? (
                        <BasicElementForm element={element} />
                      ) : (
                        <Typography>{element.description}</Typography>
                      )}
                      <MetaInfo about={element} />
                      {!readOnlyMode && (
                        <ButtonGroup
                          disabled={buttonsDisabled}
                          disabledTitle="Please finish editing first"
                        >
                          <PlusButton
                            title="Add Layer"
                            options={[
                              {
                                text: 'Music Layer',
                                icon: MusicNoteIcon,
                                tooltip: 'Add a music layer.',
                                handleClick: createNewLayer(
                                  'MusicLayer',
                                  dispatch,
                                  element._id,
                                ),
                              },
                              {
                                text: 'Speech Layer',
                                icon: ChatBubbleOutlineIcon,
                                tooltip: 'Add a speech layer.',
                                handleClick: createNewLayer(
                                  'SpeechLayer',
                                  dispatch,
                                  element._id,
                                ),
                              },
                              {
                                text: 'Sound Layer',
                                icon: VolumeUpIcon,
                                tooltip: 'Add a sound layer.',
                                handleClick: createNewLayer(
                                  'SoundLayer',
                                  dispatch,
                                  element._id,
                                ),
                              },
                            ]}
                          />
                          <IconButton
                            title="Edit"
                            onClick={() => {
                              dispatch(doSetEditingLeft(true, et, element._id));
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          {/* {element.createdBy === currentUser && ( */}
                          <IconDeleteButton
                            onClick={() => {
                              dispatch(doDeleteElement(element));
                            }}
                          />
                          {/* )} */}
                        </ButtonGroup>
                      )}
                      <TableView
                        items={getAnnotTableViewItems(
                          relationsByElementType[et],
                          (
                            element as ClipElement & {
                              annotations: Record<
                                Relation,
                                string[] | undefined
                              >;
                            }
                          ).annotations,
                        )}
                      />

                      {/* Layer Accordions */}
                      {orderOfLayerTypes.map(lt => {
                        if (
                          element._id === undefined &&
                          clip.layers[element._id] === undefined &&
                          clip.layers[element._id][lt] === undefined
                        ) {
                          return null;
                        }
                        if (
                          clip.layers[element._id][lt].length === 0 &&
                          editingNewElLaySegCategory !== lt &&
                          editingLeftState.category !== lt
                        ) {
                          return null;
                        }
                        return (
                          <CategoryAccordion
                            key={lt + '_' + element._id}
                            categoryId={lt}
                            expanded={accordionState[lt]}
                            itemIds={getLayerIdsFromId(element._id, lt)}
                            label={lt}
                            toggleAll={setAccordions}
                            toggleOne={handleAccordionToggle}
                          >
                            {editingLeftState.parentId === element._id &&
                              editingNewElLaySegCategory === lt && (
                                <Paper className={classes.basicForm}>
                                  <BasicLayerForm elementId={element._id} />
                                </Paper>
                              )}
                            {clip.layers[element._id][lt]
                              .map(getL)
                              .map(layer => (
                                <MuiAccordion
                                  key={layer._id}
                                  expanded={accordionState[layer._id]}
                                  onChange={(_event, open) => {
                                    handleAccordionToggle(layer._id, open);
                                  }}
                                  {...unmountContentsIfClosed}
                                >
                                  <AccordionSummary
                                    id={layer._id}
                                    className={classes.itemSummaryL}
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <span>{layer.label}</span>
                                    &#160;
                                    <Typography
                                      component="span"
                                      color="textSecondary"
                                    >
                                      <Timecodes
                                        key={layer._id}
                                        timecodes={layer.timecodes}
                                      />
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails
                                    style={{ display: 'block' }}
                                  >
                                    {editingExistingLayerId === layer._id ? (
                                      <BasicLayerForm
                                        layer={layer}
                                        elementId={element._id}
                                      />
                                    ) : (
                                      <Typography>
                                        {layer.description}
                                      </Typography>
                                    )}
                                    <MetaInfo about={layer} />
                                    {!readOnlyMode && (
                                      <ButtonGroup
                                        disabled={buttonsDisabled}
                                        disabledTitle="Please finish editing first"
                                      >
                                        <PlusButtonNested
                                          title="Add Annotation"
                                          options={nestedGroupElements[lt]}
                                          eId={element._id}
                                          lId={layer._id}
                                        />
                                        <IconButton
                                          title="Edit"
                                          onClick={() => {
                                            dispatch(
                                              doSetEditingLeft(
                                                true,
                                                lt,
                                                layer._id,
                                              ),
                                            );
                                          }}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        {/* {layer.createdBy === currentUser && ( */}
                                        <IconDeleteButton
                                          onClick={() => {
                                            dispatch(doDeleteLayer(layer));
                                          }}
                                        />
                                        {/* )} */}
                                      </ButtonGroup>
                                    )}
                                    {(
                                      nestedGroupElements[
                                        lt
                                      ] as NestedGroupLabels[]
                                    ).map((e, i) => {
                                      const layerElementRelations =
                                        getNestedElementRelations(e);
                                      const items = getAnnotTableViewItems(
                                        layerElementRelations,
                                        (
                                          layer as ClipLayer & {
                                            annotations: Record<
                                              Relation,
                                              string[] | undefined
                                            >;
                                          }
                                        ).annotations,
                                      );
                                      return items.length > 0 ? (
                                        <>
                                          <Typography
                                            className={classes.nestedLabels}
                                            key={i}
                                          >
                                            {getNestedElementLabel(e)}:
                                          </Typography>
                                          <TableView items={items} />
                                        </>
                                      ) : (
                                        ''
                                      );
                                    })}
                                  </AccordionDetails>
                                </MuiAccordion>
                              ))}
                          </CategoryAccordion>
                        );
                      })}
                    </AccordionDetails>
                  </MuiAccordion>
                ))}
              </CategoryAccordion>
            );
          })}
          {/* Timeline Accordion */}
          <MuiAccordion
            expanded={accordionState.Timeline}
            onChange={(_event, open) => {
              handleAccordionToggle('Timeline', open);
            }}
          >
            <AccordionSummary
              id="Timeline"
              className={classes.categoryHeadingE}
              expandIcon={<ExpandMoreIcon />}
            >
              Timeline
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block', padding: 0 }}>
              <Timeline />
            </AccordionDetails>
          </MuiAccordion>
        </>
      )}
    </div>
  );
};
