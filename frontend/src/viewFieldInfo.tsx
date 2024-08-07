/**
 * Render functions and field-mappings thereof.
 */
import React, { FC } from 'react';

import { Chip } from './components/Chip';
import { ExternalLink } from './components/ExternalLink';
import { Timecodes as TimecodesComponent } from './components/Timecodes';

import { secondsToString } from './util';

import { Annotation } from './types/clips';
import { Relation } from './types/relations';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export type AorV = 'a' | 'v';
type BasicRenderer<T> = FC<{ value: T }>;
type AnyBasicRenderer = BasicRenderer<any>;
type AnnotRenderer = FC<{ value: Annotation }>;

const useStyles = makeStyles(theme => ({
  outerContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const multi = (
  RenderComponent: BasicRenderer<string>,
): BasicRenderer<string[]> => {
  return function Multi(props: { value: string[] }) {
    const values = props.value;
    return (
      <>
        {values.map((v, i) => (
          <RenderComponent key={i} value={v} />
        ))}
      </>
    );
  };
};

const Literally: BasicRenderer<string> = ({ value }) => <>{value}</>;
// const Link: BasicRenderer = ({ value }) => <>{value as string}</>; // implement
const LiterallyWithNewLines: BasicRenderer<string> = ({ value }) => (
  <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
);
const Link: BasicRenderer<string> = ({ value }) => (
  <>{<ExternalLink href={value}>{value}</ExternalLink>}</>
);
const AudioVideo: BasicRenderer<AorV> = ({ value }) => (
  <>{value === 'a' ? 'Audio' : 'Video'}</>
);
const Timecode: BasicRenderer<number> = ({ value }) => (
  <>{secondsToString(value)}</>
);
const Timecodes: BasicRenderer<Array<[number, number]>> = ({ value }) => (
  <TimecodesComponent timecodes={value} />
);
const SimpleChip: BasicRenderer<string> = ({ value }) => (
  <Chip entityId={value} />
);

const AnnotDate: AnnotRenderer = ({ value }) => {
  const a = value as Annotation;
  return (
    <>
      <Typography style={{ fontSize: '0.8rem' }}>
        <code>{a.date}</code>
      </Typography>
      {a.target && (
        <>
          &#160;&#160;
          <Chip entityId={a.target} />
        </>
      )}
    </>
  );
};

const AnnotQuote: AnnotRenderer = ({ value }) => {
  const classes = useStyles();
  const a = value as Annotation;
  return (
    <div className={classes.outerContainer}>
      <>
        <Typography style={{ fontSize: '0.9rem', textAlign: 'left' }}>
          &quot;{a.quotes}&quot;
        </Typography>
      </>
      <div
        style={{
          display: 'block',
          width: '100%',
          margin: '0.1em',
        }}
      ></div>
      {a.target && (
        <>
          <Typography style={{ fontSize: '0.8rem' }}>Target:&#160;</Typography>
          <Chip entityId={a.target} />
        </>
      )}
      {a.quoteEntities?.length > 0 && (
        <>
          <Typography style={{ fontSize: '0.8rem' }}>
            &#160;Quote Entities:
          </Typography>
          {a.quoteEntities.map((v, i) => (
            <Chip key={i} entityId={v} />
          ))}
        </>
      )}
    </div>
  );
};

const AnnotChip: AnnotRenderer = ({ value }) => {
  const annot = value as Annotation;
  return <Chip entityId={annot.target} />;
};

const AnnotChipRole: AnnotRenderer = ({ value }) => {
  const a = value as Annotation;
  return (
    <>
      <Chip entityId={a.target} />
      {a.role && <Chip entityId={a.role} />}
    </>
  );
};

export type BasicField =
  | 'title'
  | 'subtitle'
  | 'label'
  | 'url'
  | 'platform'
  | 'collections'
  | 'shelfmark'
  | 'fileType'
  | 'duration'
  | 'language'
  | 'clipType'
  | 'description'
  | 'timecodes'
  | 'timecodeStart'
  | 'timecodeEnd'
  | 'annotationCount'
  | 'offsetTimecode';

export const basicLabels: Record<BasicField, string> = {
  title: 'Title',
  subtitle: 'Subtitle',
  label: 'Label',
  url: 'URL',
  platform: 'Platform',
  collections: 'Collections',
  shelfmark: 'Shelfmark',
  fileType: 'File type',
  duration: 'Duration',
  language: 'Language',
  clipType: 'Clip type',
  description: 'Description',
  timecodes: 'Timecodes',
  timecodeStart: 'Start',
  timecodeEnd: 'End',
  annotationCount: 'Annotations',
  offsetTimecode: 'Timecode offset',
};

export const basicRenderers: Record<BasicField, AnyBasicRenderer> = {
  title: Literally,
  subtitle: Literally,
  label: Literally,
  url: Link,
  platform: SimpleChip,
  collections: multi(SimpleChip),
  shelfmark: Literally,
  fileType: AudioVideo,
  duration: Timecode,
  language: multi(SimpleChip),
  clipType: multi(SimpleChip),
  description: LiterallyWithNewLines,
  timecodes: Timecodes,
  timecodeStart: Timecode,
  timecodeEnd: Timecode,
  annotationCount: Literally,
  offsetTimecode: Timecode,
};

export const annotRenderers: Record<Relation, AnnotRenderer> = {
  RBroadcastDate: AnnotDate,
  RAssociatedDate: AnnotDate,
  RBroadcastSeries: AnnotChip,
  RContributor: AnnotChipRole,
  RDateOfCreation: AnnotDate,
  RContainer: AnnotChip,
  RKeyword: AnnotChip,
  RPieceOfMusic: AnnotChip,
  RQuote: AnnotQuote,
  RSpeaker: AnnotChip,
  RStatus: AnnotChip,
  RInterpretationAnnot: AnnotChip,
  RTape: AnnotChip,
  RClipType: AnnotChip,
  RStation: AnnotChip,
  RPartM: AnnotChip,
  RHasPieceOfMusic: AnnotChip,
  RTempoM: AnnotChip,
  RRhythmM: AnnotChip,
  RAssocDateM: AnnotDate,
  RTimePeriodM: AnnotChip,
  RAssocEventM: AnnotChip,
  RGenreM: AnnotChip,
  RInstrumentationM: AnnotChip,
  RInstrumentM: AnnotChip,
  RArticulationM: AnnotChip,
  RDynamicsM: AnnotChip,
  ROnSiteM: AnnotChip,
  RDiegeticM: AnnotChip,
  RProgrammLyricsM: AnnotQuote,
  RReceptionM: AnnotQuote,
  RSoundsLikeM: AnnotChip,
  RTempoSp: AnnotChip,
  RRhythmSp: AnnotChip,
  RPausesSp: AnnotChip,
  RVolumeSp: AnnotChip,
  RTimbreSp: AnnotChip,
  RMentionsSp: AnnotChip,
  RQuoteSp: AnnotQuote,
  RhasSound: AnnotChip,
  RhasSpeaker: AnnotChip,
  RPitchSp: AnnotChip,
  RLanguageSp: AnnotChip,
  RDialectSp: AnnotChip,
  RSociolectSp: AnnotChip,
  RAccentSp: AnnotChip,
  RPronounSp: AnnotChip,
  RAddressingSp: AnnotChip,
  RAffectSp: AnnotChip,
  RSpeechformSp: AnnotChip,
  RTechnicalAestheticSo: AnnotChip,
  RDiegeticSo: AnnotChip,
  ROnSiteSo: AnnotChip,
  RVolumeSo: AnnotChip,
  RPitchSo: AnnotChip,
  RTimbreSo: AnnotChip,
};
