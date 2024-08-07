/**
 * Typing information for "clips".
 */
import {
  CLIPS_SET_CURRENT,
  CLIPS_UNSET_CURRENT,
  CLIPS_UPDATE_SEGMENT,
} from '../constants/actionTypes';

import { LookupById } from './index';
import {
  ClipRelation,
  // MusicRelation,
  // SpeechRelation,
  // NoiseRelation,
  // PictureRelation,
  StructureRelation,
  Relation,
} from './relations';

interface HasId {
  _id: string;
}

export interface MetaMeta {
  created?: string;
  createdBy?: string;
  updated?: string;
  updatedBy?: string;
}

export interface ClipBasic extends HasId, MetaMeta {
  type: 'Clip';
  title: string;
  subtitle: string;
  // label: string;
  description: string;
  url: string;
  platform: string;
  collections: string[];
  fileType: 'a' | 'v' | '';
  duration: number;
  shelfmark: string;
  // language: string[];
  // clipType: string[];
  offsetTimecode: number;
  updatedAny?: string;
  updatedAnyBy?: string;
  labelTitle?: string;
}

export interface ClipBasicResp extends ClipBasic {
  created: string;
  createdBy: string;
  updatedAny: string;
  updatedAnyBy: string;
  labelTitle: string;
  isFavorite: boolean;
  annotationCount: number;
  associatedDate?: string;
}

export interface Annotation extends HasId, MetaMeta {
  type: 'Annotation';
  clip: string;
  element?: string;
  layer?: string;
  segment?: string;
  relation: Relation;
  target: string;
  quotes: string;
  quoteEntities: string[];
  date?: string;
  role?: string;
  instrument?: string;
  metaDate?: string;
  timecodeStart?: number;
  timecodeEnd?: number;
  confidence?: 'certain' | 'unsure' | 'maybe' | ''; // tbd
  // review Franziska uncertainty stuff before making decision here
  attribution?: string;
  // attribution?: {
  //   zoteroId: string;
  //   locator?: string;
  //   attributionComment?: string;
  // };
  comment?: string; // we want comment threads, right?
  fromPlatformMetadata?: boolean;
  interpretative?: boolean;
  constitutedBy?: string[]; // annotation ids... autocomplete w relation and target/data
  refersTo?: string; // annotation id ("Der Handshake ist ein symbolischer Akt")
  // flags: Flag[];
  notablyAbsent?: boolean;
  // onSite?: boolean;
  // diegetic?: boolean;
}

// more nuanced solution needed... needs to support comments...
// probably separate type in db
// FPlatformMetadata, FMaybe fundamentally different, more like "implied"
// in the sense that the original annotator is supplying them
// type Flag = 'FPlatformMetadata' | 'FMaybe' | 'FDoubtful' | 'FWrong' | 'FDoesAnybodyKnow' | 'FWiderspruch' | 'FResearchOpportunity' | 'FInterestingHere';

// seems promising
// export interface AnnotationMarker extends HasId, MetaMeta {
//   clip: string; // id
//   annotation: string; // id
//   markerType: string; // id... like relation
//   comment: string;
//   attribution: string;
// }

export type ClipAdditionalMetaData = Record<
  ClipRelation | 'RInterpretationAnnot',
  string[]
>;

interface ClipConstruct extends HasId, MetaMeta {
  clip: string;
  label: string;
  description: string;
  timecodes: Array<[number, number]>;
}

// export interface MusicBasic extends ClipConstruct {
//   type: 'Music';
// }

// export interface Music extends MusicBasic {
//   annotations: Record<MusicRelation, string[]>;
// }

// export interface SpeechBasic extends ClipConstruct {
//   type: 'Speech';
// }

// export interface Speech extends SpeechBasic {
//   annotations: Record<SpeechRelation, string[]>;
// }

// export interface NoiseBasic extends ClipConstruct {
//   type: 'Noise';
// }

// export interface Noise extends NoiseBasic {
//   annotations: Record<NoiseRelation, string[]>;
// }

// export interface PictureBasic extends ClipConstruct {
//   type: 'Picture';
// }

// export interface Picture extends PictureBasic {
//   annotations: Record<PictureRelation, string[]>;
// }

export interface StructureBasic extends ClipConstruct {
  type: 'Structure';
}

export interface Structure extends StructureBasic {
  annotations: Record<StructureRelation, string[]>;
}

// interface SegmentContains {
//   [elementId: string]: { [relation: string]: SegmentMember[] };
// }

export interface SegmentMember {
  added: string;
  addedBy: string;
  annotation: string; // annotation id
}

export type ElementType =
  | 'Segment'
  // | 'Music'
  // | 'Speech'
  // | 'Noise'
  // | 'Picture'
  | 'Structure';

export type LayerType = 'MusicLayer' | 'SpeechLayer' | 'SoundLayer';

export interface ClipElement extends ClipConstruct {
  type: ElementType;
  clip: string;
}

export interface ClipLayer extends ClipConstruct {
  type: LayerType;
  element: string;
  clip: string;
}

export interface Segment extends ClipElement {
  type: 'Segment';
  timecodes: Array<[number, number]>;
  segmentContains: SegmentMember[];
}

// interface LayersById {
//   [key: string]: Record<LayerType, string[]>;
// }

export interface Clip extends ClipBasic {
  annotations: ClipAdditionalMetaData;
  elements: Record<ElementType, string[]>;
  layers: Record<string, Record<LayerType, string[]>>; // TODO: fix type!!
  segments: string[];
}

export interface ClipData {
  clip: Clip;
  clipElements: LookupById<ClipElement>;
  clipLayers: LookupById<ClipLayer>;
  clipAnnotations: LookupById<Annotation>;
  clipSegments: LookupById<Segment>;
}

export interface ClipState {
  currentClip: Clip | null;
  clipElements: LookupById<ClipElement>;
  clipLayers: LookupById<ClipLayer>;
  clipAnnotations: LookupById<Annotation>;
  clipSegments: LookupById<Segment>;
}

export interface ClipsSetCurrentAction {
  type: typeof CLIPS_SET_CURRENT;
  payload: ClipData;
}

export interface ClipsUnsetCurrentAction {
  type: typeof CLIPS_UNSET_CURRENT;
}

export interface ClipsUpdateSegmentAction {
  type: typeof CLIPS_UPDATE_SEGMENT;
  payload: { segment: Segment };
}

export type ClipAction =
  | ClipsSetCurrentAction
  | ClipsUnsetCurrentAction
  | ClipsUpdateSegmentAction;
