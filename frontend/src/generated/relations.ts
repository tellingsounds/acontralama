// generated 2024-07-22T14:16:51.051486 by gen_typescript.py - don't make changes here! :)

export type Element =
  | 'Clip'
  | 'Segment'
  | 'Structure'
  | 'MusicLayer'
  | 'SpeechLayer'
  | 'SoundLayer';

export type Relation =
  | 'RAssociatedDate'
  | 'RBroadcastDate'
  | 'RBroadcastSeries'
  | 'RClipType'
  | 'RContributor'
  | 'RDateOfCreation'
  | 'RKeyword'
  | 'RPieceOfMusic'
  | 'RQuote'
  | 'RStation'
  | 'RStatus'
  | 'RTape'
  | 'RSpeaker'
  | 'RContainer'
  | 'RInterpretationAnnot'
  | 'RHasPieceOfMusic'
  | 'RPartM'
  | 'RGenreM'
  | 'RProgrammLyricsM'
  | 'RTempoM'
  | 'RRhythmM'
  | 'RAssocDateM'
  | 'RTimePeriodM'
  | 'RAssocEventM'
  | 'RInstrumentationM'
  | 'RInstrumentM'
  | 'RArticulationM'
  | 'RDynamicsM'
  | 'RReceptionM'
  | 'ROnSiteM'
  | 'RDiegeticM'
  | 'RSoundsLikeM'
  | 'RhasSpeaker'
  | 'RTempoSp'
  | 'RRhythmSp'
  | 'RPausesSp'
  | 'RVolumeSp'
  | 'RPitchSp'
  | 'RTimbreSp'
  | 'RLanguageSp'
  | 'RDialectSp'
  | 'RSociolectSp'
  | 'RAccentSp'
  | 'RPronounSp'
  | 'RAddressingSp'
  | 'RAffectSp'
  | 'RSpeechformSp'
  | 'RQuoteSp'
  | 'RMentionsSp'
  | 'RhasSound'
  | 'RTechnicalAestheticSo'
  | 'RDiegeticSo'
  | 'ROnSiteSo'
  | 'RVolumeSo'
  | 'RPitchSo'
  | 'RTimbreSo';

export type NestedElements = 'MusicLayer' | 'SpeechLayer' | 'SoundLayer';

export type NestedGroupLabels =
  | 'GeneralM'
  | 'TemporalStructureM'
  | 'DateM'
  | 'TimbreM'
  | 'OtherM'
  | 'GeneralSp'
  | 'TimingSp'
  | 'SpeechToneSp'
  | 'LanguageSp'
  | 'AddressingSp'
  | 'OtherSp'
  | 'OtherSo'
  | 'GeneralSo'
  | 'DescriptionSo';

export type AnnotationField =
  | 'attribution'
  | 'comment'
  | 'confidence'
  | 'date'
  | 'metaDate'
  | 'quotes'
  | 'quoteEntities'
  | 'role'
  | 'target'
  | 'timecodeEnd'
  | 'timecodeStart'
  | 'onSite'
  | 'diegetic';

export const allClipRelations = [
  'RAssociatedDate',
  'RStation',
  'RClipType',
  'RBroadcastSeries',
  'RContributor',
  'RQuote',
  'RKeyword',
  'RTape',
  'RStatus',
];

export const allSegmentRelations = ['RInterpretationAnnot'];

export const allStructureRelations = ['RKeyword'];

export const allMusicLayerRelations = [
  'RHasPieceOfMusic',
  'RPartM',
  'RTempoM',
  'RRhythmM',
  'RAssocDateM',
  'RTimePeriodM',
  'RAssocEventM',
  'RGenreM',
  'RInstrumentationM',
  'RInstrumentM',
  'RArticulationM',
  'RDynamicsM',
  'ROnSiteM',
  'RDiegeticM',
  'RProgrammLyricsM',
  'RReceptionM',
  'RSoundsLikeM',
  'RKeyword',
  'RAffectSp',
];

export const allSpeechLayerRelations = [
  'RhasSpeaker',
  'RTempoSp',
  'RRhythmSp',
  'RPausesSp',
  'RVolumeSp',
  'RPitchSp',
  'RTimbreSp',
  'RLanguageSp',
  'RDialectSp',
  'RSociolectSp',
  'RAccentSp',
  'RPronounSp',
  'RAddressingSp',
  'RSpeechformSp',
  'RAffectSp',
  'RMentionsSp',
  'RQuoteSp',
  'RKeyword',
];

export const allSoundLayerRelations = [
  'RhasSound',
  'RTechnicalAestheticSo',
  'RDiegeticSo',
  'ROnSiteSo',
  'RVolumeSo',
  'RPitchSo',
  'RTimbreSo',
  'RKeyword',
];

export type ClipRelation =
  | 'RAssociatedDate'
  | 'RStation'
  | 'RClipType'
  | 'RBroadcastSeries'
  | 'RContributor'
  | 'RQuote'
  | 'RKeyword'
  | 'RTape'
  | 'RStatus';

export type SegmentRelation = 'RInterpretationAnnot';

export type StructureRelation = 'RKeyword';

export type MusicLayerRelation =
  | 'RHasPieceOfMusic'
  | 'RPartM'
  | 'RTempoM'
  | 'RRhythmM'
  | 'RAssocDateM'
  | 'RTimePeriodM'
  | 'RAssocEventM'
  | 'RGenreM'
  | 'RInstrumentationM'
  | 'RInstrumentM'
  | 'RArticulationM'
  | 'RDynamicsM'
  | 'ROnSiteM'
  | 'RDiegeticM'
  | 'RProgrammLyricsM'
  | 'RReceptionM'
  | 'RSoundsLikeM'
  | 'RKeyword'
  | 'RAffectSp';

export type SpeechLayerRelation =
  | 'RhasSpeaker'
  | 'RTempoSp'
  | 'RRhythmSp'
  | 'RPausesSp'
  | 'RVolumeSp'
  | 'RPitchSp'
  | 'RTimbreSp'
  | 'RLanguageSp'
  | 'RDialectSp'
  | 'RSociolectSp'
  | 'RAccentSp'
  | 'RPronounSp'
  | 'RAddressingSp'
  | 'RSpeechformSp'
  | 'RAffectSp'
  | 'RMentionsSp'
  | 'RQuoteSp'
  | 'RKeyword';

export type SoundLayerRelation =
  | 'RhasSound'
  | 'RTechnicalAestheticSo'
  | 'RDiegeticSo'
  | 'ROnSiteSo'
  | 'RVolumeSo'
  | 'RPitchSo'
  | 'RTimbreSo'
  | 'RKeyword';

export const supportedRelations = {
  Clip: [
    'RAssociatedDate',
    'RStation',
    'RClipType',
    'RBroadcastSeries',
    'RContributor',
    'RQuote',
    'RKeyword',
    'RTape',
    'RStatus',
  ],
  Segment: ['RInterpretationAnnot'],
  Structure: ['RKeyword'],
  MusicLayer: [
    'RHasPieceOfMusic',
    'RPartM',
    'RTempoM',
    'RRhythmM',
    'RAssocDateM',
    'RTimePeriodM',
    'RAssocEventM',
    'RGenreM',
    'RInstrumentationM',
    'RInstrumentM',
    'RArticulationM',
    'RDynamicsM',
    'ROnSiteM',
    'RDiegeticM',
    'RProgrammLyricsM',
    'RReceptionM',
    'RSoundsLikeM',
    'RKeyword',
    'RAffectSp',
  ],
  SpeechLayer: [
    'RhasSpeaker',
    'RTempoSp',
    'RRhythmSp',
    'RPausesSp',
    'RVolumeSp',
    'RPitchSp',
    'RTimbreSp',
    'RLanguageSp',
    'RDialectSp',
    'RSociolectSp',
    'RAccentSp',
    'RPronounSp',
    'RAddressingSp',
    'RSpeechformSp',
    'RAffectSp',
    'RMentionsSp',
    'RQuoteSp',
    'RKeyword',
  ],
  SoundLayer: [
    'RhasSound',
    'RTechnicalAestheticSo',
    'RDiegeticSo',
    'ROnSiteSo',
    'RVolumeSo',
    'RPitchSo',
    'RTimbreSo',
    'RKeyword',
  ],
};

export const nestedGroupElements = {
  MusicLayer: ['GeneralM', 'TemporalStructureM', 'DateM', 'TimbreM', 'OtherM'],
  SpeechLayer: [
    'GeneralSp',
    'TimingSp',
    'SpeechToneSp',
    'LanguageSp',
    'AddressingSp',
    'OtherSp',
  ],
  SoundLayer: ['GeneralSo', 'DescriptionSo', 'OtherSo'],
};

export const nestedElementsLabels = {
  GeneralM: {
    label: 'General',
    definition: 'General information about the music in a Layer.',
    relations: ['RHasPieceOfMusic', 'RPartM', 'RGenreM', 'RProgrammLyricsM'],
  },
  TemporalStructureM: {
    label: 'Temporal structure',
    definition: 'Information about the temporal structure of a Layer.',
    relations: ['RTempoM', 'RRhythmM'],
  },
  DateM: {
    label: 'Entstehungs-Zeitpunkte/-Kontext',
    definition:
      'Im Entstehungs-Zeitpunkt-/Kontext sollen drei Arten der Eingabe m\u00f6glich sein (and/or): Jahreszahl, Zeitspanne/allgemeine Angabe, und Event. Generell soll hier alles erfasst werden k\u00f6nnen, was in Bezug auf den Entstehungszeitpunkt und -kontext der im Clip vorliegenden Musikst\u00fcck-Version f\u00fcr die Forschungsfrage relevant ist.',
    relations: ['RAssocDateM', 'RTimePeriodM', 'RAssocEventM'],
  },
  TimbreM: {
    label: 'Klangfarbe/Timbre',
    definition: 'Information about the timbre in a Layer.',
    relations: [
      'RInstrumentationM',
      'RInstrumentM',
      'RArticulationM',
      'RDynamicsM',
    ],
  },
  OtherM: {
    label: 'Other Categories',
    definition: 'Other aspects of a music in a Layer.',
    relations: [
      'ROnSiteM',
      'RDiegeticM',
      'RReceptionM',
      'RAffectSp',
      'RSoundsLikeM',
      'RKeyword',
    ],
  },
  GeneralSp: {
    label: 'General',
    definition: 'General information about the speech in a Layer.',
    relations: ['RhasSpeaker'],
  },
  TimingSp: {
    label: 'Timing',
    definition:
      'Timing: Als prosodisches Element der Sprache (prosodisch = lautliche Eigenschaften) setzt sich das Timing, oder die wahrgenommene Sprechgeschwindigkeit, aus drei Elementen zusammen: Tempo, Rhythmus und Pausen.',
    relations: ['RTempoSp', 'RRhythmSp', 'RPausesSp'],
  },
  SpeechToneSp: {
    label: 'Sprachton-/klang',
    definition:
      "Als 'Sprachklang' fassen wir auditive Qualit\u00e4ten wie Lautst\u00e4rke (Amplitude; laut/leise), Tonh\u00f6he (Grundfrequenz; hoch/tief) und Klangfarbe (dunkel/hell; scharf/sanft; deutlich/undeutlich; freies Feld).",
    relations: ['RVolumeSp', 'RPitchSp', 'RTimbreSp'],
  },
  LanguageSp: {
    label: 'Sprache/Sprachvariet\u00e4t',
    definition:
      'Information about the language or dialect etc. used in a Speech Layer.',
    relations: ['RLanguageSp', 'RDialectSp', 'RSociolectSp', 'RAccentSp'],
  },
  AddressingSp: {
    label: 'Adressierung',
    definition:
      'Unter dem Punkt der Adressierung wollen wir vor allem (linguistische) Indikatoren der Intimit\u00e4tserzeugung festhalten',
    relations: ['RPronounSp', 'RAddressingSp'],
  },
  OtherSp: {
    label: 'Other',
    definition: 'Other aspects about the Speech Layer.',
    relations: [
      'RSpeechformSp',
      'RAffectSp',
      'RMentionsSp',
      'RQuoteSp',
      'RKeyword',
    ],
  },
  GeneralSo: {
    label: 'General',
    definition: 'General information about the sound layer.',
    relations: [
      'RhasSound',
      'RTechnicalAestheticSo',
      'RDiegeticSo',
      'ROnSiteSo',
    ],
  },
  DescriptionSo: {
    label: 'Sound description',
    definition: 'General information about the piece of music.',
    relations: ['RVolumeSo', 'RPitchSo', 'RTimbreSo'],
  },
  OtherSo: {
    label: 'Other',
    definition: 'Other aspects about the Sound Layer.',
    relations: ['RKeyword'],
  },
};

export const connectionRelationInfo = {
  RContainer: {
    label: 'Container',
    definition:
      'Meta construct for categorizing clips for the ACONTRA project.',
    multi: true,
    types: ['Container'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RStatus: {
    label: 'Clip status',
    definition: 'Status of a Clip, e.g.: digitized.',
    multi: true,
    types: ['Status'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RStation: {
    label: 'Radio station',
    definition:
      'A Radio station associated with a clip or the station, a clip was broadcasted on.',
    multi: false,
    types: ['Broadcaster'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RClipType: {
    label: 'Clip type',
    definition:
      'The category, a clip is associated with (e.g. documentary, interview).',
    multi: true,
    types: ['VClipType'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RTape: {
    label: 'Tape',
    definition: 'The tape where the clip was found on.',
    multi: false,
    types: ['Tape'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RBroadcastDate: {
    label: 'Broadcast date (Sendedatum)',
    definition: 'Date(s) of public broadcast.',
    multi: true,
    types: ['Broadcaster'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date', 'target'],
    required: ['date'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RBroadcastSeries: {
    label: 'Broadcast series',
    definition: 'The broadcast series that material in the clip belongs to.',
    multi: false,
    types: ['BroadcastSeries'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RContributor: {
    label: 'Contributor',
    definition:
      'An agent (person, group, organization) who is (or should be) mentioned in the credits.',
    multi: true,
    types: ['Person', 'Group', 'Organization', 'Broadcaster'],
    roles: ['VClipContributorRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'role',
    ],
    required: ['role', 'target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RAssociatedDate: {
    label: 'Associated Date',
    definition:
      'Date or time period that is associated with the clip, either when it was recorded or broadcasted.',
    multi: true,
    types: ['Broadcaster'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date', 'target'],
    required: ['date'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RDateOfCreation: {
    label: 'Date of Creation (Aufnahmedatum)',
    definition:
      'The date or time period the primary contents of the clip were created.',
    multi: false,
    types: [],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date'],
    required: ['date'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RInterpretationAnnot: {
    label: 'Interpretation',
    definition:
      'The Topic or Topos that most essentially describes this interpretation. Is shown in the Clip annotation section.',
    multi: false,
    types: ['Topic', 'Topos'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
    interpretAbsent: false,
    canCreateNew: true,
  },
  RQuote: {
    label: 'Quote',
    definition: 'A verbatim quote appearing in the clip.',
    multi: true,
    types: ['Person', 'FictionalCharacter'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
    ],
    required: ['quotes'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RSpeaker: {
    label: 'Speaker',
    definition:
      'A person that is speaking. The exact moment can additionally be specified via time code(s).',
    multi: true,
    types: ['Person', 'FictionalCharacter'],
    roles: ['VClipContributorRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RInstrumentM: {
    label: 'Has Instrument',
    definition:
      'The sound of specific musical instruments that can prominently be heard and/or identified. Can also only affect certain parts of a piece (specify via time code).',
    multi: true,
    types: ['InstrumentM', 'Thing'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RKeyword: {
    label: 'Keyword',
    definition:
      'Anything appearing in the clip that seems noteworthy. It is also possible to make note of absent things via the notably absent field (a checkbox).',
    multi: true,
    types: [
      'AnySound',
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VLanguage',
    ],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RPieceOfMusic: {
    label: 'Is Piece of Music',
    definition: 'The piece of music this Music has been identified as.',
    multi: false,
    types: ['PieceOfMusic'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RSoundsLikeM: {
    label: 'Sounds like',
    definition:
      '(Other) music or sounds that this Music, Speech, Sound or section is sharing characteristics with, e.g.: sounds like birdsong in the flute (specify exact moment via time code).',
    multi: true,
    types: [
      'PieceOfMusic',
      'Genre',
      'Repertoire',
      'CreativeWork',
      'AnySound',
      'Repertoire',
    ],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RhasSpeaker: {
    label: 'Speaker',
    definition: 'A person that is speaking in this section.',
    multi: false,
    types: ['Person', 'FictionalCharacter'],
    roles: ['VClipContributorRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RhasSound: {
    label: 'Sound',
    definition: 'Best description (or guess) of what the sound actually is.',
    multi: true,
    types: ['AnySound', 'Thing', 'VActivity'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RHasPieceOfMusic: {
    label: 'Piece Of Music',
    definition: 'A piece of music that is part of the clip.',
    multi: false,
    types: ['PieceOfMusic'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RPartM: {
    label: 'Part',
    definition:
      'Which part of a piece of music is used, for example: intro, chorus, verse, main theme, first movement etc.',
    multi: true,
    types: ['PartM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RTempoM: {
    label: 'Tempo',
    definition:
      "The tempo of a piece of music, a choice can be made between 'uptempo', 'midtempo' or 'slow', but if the concrete tempo indication from the notation of the piece is known, this can be added additionally.",
    multi: true,
    types: ['TempoM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RRhythmM: {
    label: 'Rhythm',
    definition:
      'The general rhythmic feel of a piece of music. What time signature is it 4/4, 3/4, 6/8, etc.? Can a distinctive rhythm/accentuation, e.g. waltz, march, swing, lullaby, be heard?',
    multi: true,
    types: ['RhythmM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RAssocDateM: {
    label: 'Associated date',
    definition:
      "The date associated with a piece of music. for example, the year of origin of the piece of music. Multiple entries are possible (if, for example, you want to enter different years of origin for the lyrics and music). Using the example of the 7th Symphony (Bruckner), the entry here would be '1881-1883'.",
    multi: true,
    types: [],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date'],
    required: ['date'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RTimePeriodM: {
    label: 'Time period',
    definition:
      "A time period associated with a piece of music. Larger time spans or repertoires are noted here; multiple entries are possible. This is intended to make it possible to compare/group the origins of different pieces of music beyond individual years. Using the example of the 7th Symphony (Bruckner), the entry here would be 'Romanticism' and/or '19th century'.",
    multi: true,
    types: ['TimePeriod', 'Repertoire'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RAssocEventM: {
    label: 'Associated event',
    definition:
      "An event that is associated with a piece of music that is directly related to its creation or can be associated with it (the degree of association is at the discretion of the person entering the data, to be measured primarily against the research question). Use the comment function to explain context if necessary. In the example of the 7th Symphony (Bruckner) it could be something like (on the occasion of) 'opening of municipal theatre (Stadttheater)', but also (in the same year as) 'death of James A. Garfield'.",
    multi: true,
    types: ['Event', 'EventSeries'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RGenreM: {
    label: 'Genre',
    definition:
      'The genre of a piece of music, controlled vocabulary (roughly) based on Wikipedia article about major music genres.',
    multi: true,
    types: ['GenreM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RInstrumentationM: {
    label: 'Instrumentation',
    definition:
      'The instrumentation of a piece of music. Controlled vocabulary, eg. band, choir...',
    multi: true,
    types: ['InstrumentationM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RArticulationM: {
    label: 'Articulation',
    definition:
      "How something is played: legato, tenuto, marcato, staccato. Articulation is a musical parameter that determines how a single note or other discrete event is sounded. Articulations primarily structure an event's start and end, determining the length of its sound and the shape of its attack and decay. Can also only affect certain parts of a piece (specify via time code).",
    multi: true,
    types: ['ArticulationM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RDynamicsM: {
    label: 'Dynamics',
    definition:
      'The dynamics or change in volume of a piece of music. Controlled vocabulary eg.: piano, forte, ...',
    multi: true,
    types: ['DynamicsM'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  ROnSiteM: {
    label: 'On site',
    definition:
      "Has the Piece of Music been recorded on site? Only select if the piece of music is clearly played 'on-site' in a report or live broadcast.",
    multi: false,
    types: ['OnSite'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RDiegeticM: {
    label: 'Diegetic',
    definition:
      "Is the piece of music in the Clip diegetic? Is the 'source' of the music in the 'narrated world' of the clip, or is it an insert?",
    multi: false,
    types: ['Diegetic'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RProgrammLyricsM: {
    label: 'Programm lyrics',
    definition:
      'The programm or lyrics of a piece of music. Text elements that belong to the piece of music in the broadest sense are recorded here. Lyrics are recorded here, but also titles or programmes. Input the text as a quote, but also topics/other entities which belong to the quotes, can be added.',
    multi: true,
    types: ['PieceOfMusic'],
    roles: [],
    quoteEntities: [
      'AnySound',
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VLanguage',
    ],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
      'quoteEntities',
    ],
    required: ['quotes'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RReceptionM: {
    label: 'Reception',
    definition:
      "Keywords and quotes are used to record everything that is relevant to the research question with regard to the reception of the piece of music. Here, keywords and quotations are used to record everything that is relevant to the research question with regard to the reception of the piece of music described. These can be historical uses / appropriations, references to secondary literature, noteworthy attributions and interpretations, etc. Using the example of 'Les Pr\u00e9ludes' (Franz Liszt): 'Russian Fanfare' as a 'Piece of Music', i.e., historical use in the newsreel during the time of the German-Soviet War (1941-45); 'Feierlich und weihevoll' as a quote from the security service of the Reichsf\u00fchrer of the SS.",
    multi: true,
    types: [
      'AnySound',
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VLanguage',
    ],
    roles: [],
    quoteEntities: [
      'AnySound',
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VLanguage',
    ],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
      'quoteEntities',
    ],
    required: ['quotes'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RTempoSp: {
    label: 'Tempo',
    definition:
      'The subjective impression of the tempo of a Speech. Speech speed is usually measured in words per minute (whereby the average in Austria is around 120 words per minute for a lecture, cf. Christian Bensel 2016). The only important thing for us here is actually the subjective impression: slow, neutral or fast.',
    multi: true,
    types: ['TempoSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RRhythmSp: {
    label: 'Rhythm',
    definition:
      "The subjective impression of the rhythm of a Speech. Rhythm is understood as an 'individual, linguistic realisation of the metrical scheme' (Hans L\u00f6sener 1999, 41). However, the further theoretical definition, localisation and, above all, description of rhythm as a prosodic element is not yet complete. In our context, we again limit ourselves to subjective impressions and essentially differentiate between 'inconspicuous/melodic' and 'conspicuous/unmelodic'. If the rhythm is 'conspicuous/unmelodic', it can be additionally specified: 'bumpy', 'stuttering', etc.",
    multi: true,
    types: ['RhythmSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RTimbreSp: {
    label: 'Timbre',
    definition:
      'The subjective impression of the timbre of a Speech, for example: dark/bright; sharp/soft; clear/unclear; feminine/masculine',
    multi: true,
    types: ['Timbre'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RMentionsSp: {
    label: 'Mentions',
    definition:
      'The content of a Speech, what is mentioned in the Speech. Specify keywords (Topic, Person, etc.).',
    multi: true,
    types: [
      'AnySound',
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VLanguage',
    ],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RQuoteSp: {
    label: 'Quote',
    definition:
      'A verbatim quote from the Speech, individual quotations can be emphasised and should be linked to a comment on the content (abstraction) via a keyword.',
    multi: true,
    types: ['Person', 'FictionalCharacter'],
    roles: [],
    quoteEntities: [
      'AnySound',
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VLanguage',
    ],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
      'quoteEntities',
    ],
    required: ['quotes'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RPausesSp: {
    label: 'Pauses',
    definition:
      "The subjective impression of the pauses in a Speech. The same applies here as for rhythm: there is no clear terminology for describing pauses in speech. A controlled vocabulary should be used here to describe impressions: 'many pauses/few', 'long/short', 'purposeful', etc.",
    multi: true,
    types: ['PausesSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RVolumeSp: {
    label: 'Volume',
    definition:
      "The subjective impression of the volume/loudness of a Speech: 'loud/quiet'.",
    multi: true,
    types: ['Volume'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RPitchSp: {
    label: 'Pitch',
    definition:
      "The subjective impression of the pitch of a Speech: 'high/low'.",
    multi: true,
    types: ['Pitch'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RLanguageSp: {
    label: 'Language',
    definition:
      'The language used by a speaker. Here we want to define individual languages and varieties. In this context, we understand a single language to be German, English, Japanese, etc.; in linguistics, a variety is understood to be a specific form of such a single language. In our case, we mainly want to note spatial varieties of German (Austrian German, Federal German, etc.).',
    multi: true,
    types: ['VLanguage'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RDialectSp: {
    label: 'Dialect',
    definition:
      'The dialect used by a speaker. In linguistics, dialect stands for regionally definable language systems that are characterised by strong structural similarity with neighbouring systems and have not been codified or written down (Bussmann). Synonym: Mundart. To be clearly distinguished from accent, as accent only affects pronunciation and intonation, but not - like dialect - other areas of language such as grammar, morphology, syntax, lexis, idioms, etc.',
    multi: true,
    types: ['DialectSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RSociolectSp: {
    label: 'Sociolect',
    definition:
      'The Social (group) variety of language used by a speaker. Language of social classes, also professional and specialised languages as well as special languages such as youth language, languages of hobby groups or crook language.',
    multi: true,
    types: ['SociolectSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RAccentSp: {
    label: 'Accent',
    definition:
      'The accent used by a speaker. Characteristics of speech and the resulting - usually unconscious - transfer of pronunciation habits of the dialect or regiolect to the umbrella language or the transfer of pronunciation habits of the first/native language or the primarily used language to a foreign language learnt later.',
    multi: true,
    types: ['AccentSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RPronounSp: {
    label: 'Pronoun',
    definition:
      "The aim here is to record whether the addressing of the audience using pronouns is formal or informal. In addition, it is also be possible to record whether moderators frequently use the first person ('I').",
    multi: true,
    types: ['PronounSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RAddressingSp: {
    label: 'Addressing',
    definition:
      'How the speaker adresses the listener or interview partners. (e.g. formal, informal, first name, last name, title, ...)',
    multi: true,
    types: ['AdressSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RAffectSp: {
    label: 'Affect/Zustand',
    definition:
      'Which (emotional/affective) state is conveyed/triggered/implied on the language level?',
    multi: true,
    types: ['AffectSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RSpeechformSp: {
    label: 'Speechform',
    definition:
      'distinguish whether it is a monlogue or dialogue, whether it is a read (pre-formulated) or freely (spontaneously) spoken text.',
    multi: true,
    types: ['SpeechformSp'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RTechnicalAestheticSo: {
    label: 'Technical aesthetic',
    definition:
      'Sound engineering conspicuities: Overdrive, noise, proximity and distance to the microphone, reverb/space, fade outs, ...',
    multi: true,
    types: ['TechnicalAestheticSo'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: true,
  },
  RDiegeticSo: {
    label: 'Diegetic (Sound)',
    definition:
      'Are the sounds part of the world/location transmitted in the programme?',
    multi: false,
    types: ['Diegetic'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  ROnSiteSo: {
    label: 'On site (Sound)',
    definition:
      'Has the Sound been recorded on site or has it been added in post production?',
    multi: false,
    types: ['OnSite'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RVolumeSo: {
    label: 'Volume',
    definition:
      "The subjective impression of the volume of a Sound: 'loud/quiet'.",
    multi: true,
    types: ['Volume'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RPitchSo: {
    label: 'Pitch',
    definition:
      "The subjective impression of the pitch of a Sound: 'high/low'.",
    multi: true,
    types: ['Pitch'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
  RTimbreSo: {
    label: 'Timbre',
    definition:
      "The subjective impression of the timbre of a Sound: 'dark/bright'; 'sharp/soft; 'clear/blurred'; feminine/masculine'",
    multi: true,
    types: ['Timbre'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
    interpretAbsent: true,
    canCreateNew: false,
  },
};
