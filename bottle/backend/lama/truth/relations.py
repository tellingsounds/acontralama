from enum import Enum, auto, unique

from lama.errors import MissingInfoError
from lama.truth.annotations import AnnotationFields
from lama.truth.entitytypes import EntityTypes
from lama.util import sorted_enums


@unique
class Relations(Enum):
    RAssociatedDate = auto()
    RBroadcastDate = auto()
    RBroadcastSeries = auto()
    RClipType = auto()
    RContributor = auto()
    RDateOfCreation = auto()
    RKeyword = auto()
    RPieceOfMusic = auto()
    RQuote = auto()
    RStation = auto()
    RStatus = auto()
    RTape = auto()
    RSpeaker = auto()
    RContainer = auto()

    RInterpretationAnnot = auto()

    # music layer
    RHasPieceOfMusic = auto()
    RPartM = auto()
    RGenreM = auto()
    RProgrammLyricsM = auto()
    # temporale Binnenstruktur
    RTempoM = auto()
    RRhythmM = auto()
    # Entstehungs-Zeitpunkt-/Kontext
    RAssocDateM = auto()
    RTimePeriodM = auto()
    RAssocEventM = auto()
    # Klangfarbe
    RInstrumentationM = auto()
    RInstrumentM = auto()
    RArticulationM = auto()
    RDynamicsM = auto()
    # Other Categories
    RReceptionM = auto()
    ROnSiteM = auto()
    RDiegeticM = auto()
    RSoundsLikeM = auto()

    # speech layer
    RhasSpeaker = auto()
    # Timing
    RTempoSp = auto()
    RRhythmSp = auto()
    RPausesSp = auto()
    # Speech tone
    RVolumeSp = auto()
    RPitchSp = auto()
    RTimbreSp = auto()
    # Language/language variety (Sprache/Sprachvarietät)
    RLanguageSp = auto()
    RDialectSp = auto()
    RSociolectSp = auto()
    RAccentSp = auto()
    # Addressing
    RPronounSp = auto()
    RAddressingSp = auto()
    # Other Categories
    RAffectSp = auto()
    RSpeechformSp = auto()
    RQuoteSp = auto()
    RMentionsSp = auto()

    # sound layer
    RhasSound = auto()
    # General
    RTechnicalAestheticSo = auto()
    RDiegeticSo = auto()
    ROnSiteSo = auto()
    # Sound description
    RVolumeSo = auto()
    RPitchSo = auto()
    RTimbreSo = auto()

    # rest/old
    # RInstrument = auto()
    # RLyricsQuote = auto()
    # RMentions = auto()
    # RMusicalQuote = auto()
    # RPerformanceDate = auto()
    # RPerformer = auto()
    # RProductionTechniquePicture = auto()
    # RProductionTechniqueSound = auto()
    # RRecordingDate = auto()
    # RReminiscentOfMusic = auto()
    # RReminiscentOfNoise = auto()
    # RReminiscentOfPicture = auto()
    # RReminiscentOfSpeech = auto()
    # RShot = auto()
    # RShows = auto()
    # RSoundAdjective = auto()
    # RSoundsLikeNoise = auto()
    # RSpeechDescriptionText = auto()
    # RTextQuote = auto()


@unique
class Elements(Enum):
    Clip = auto()
    Segment = auto()
    Structure = auto()
    # Music = auto()
    # Speech = auto()
    # Noise = auto()
    # Picture = auto()
    MusicLayer = auto()
    SpeechLayer = auto()
    SoundLayer = auto()


class NestedElements(Enum):
    MusicLayer = auto()
    SpeechLayer = auto()
    SoundLayer = auto()


class NestedGroupLabels(Enum):
    GeneralM = auto()
    TemporalStructureM = auto()
    DateM = auto()
    TimbreM = auto()
    OtherM = auto()
    GeneralSp = auto()
    TimingSp = auto()
    SpeechToneSp = auto()
    LanguageSp = auto()
    AddressingSp = auto()
    OtherSp = auto()
    OtherSo = auto()
    GeneralSo = auto()
    DescriptionSo = auto()


R = Relations
A = AnnotationFields
T = EntityTypes
E = Elements
N = NestedElements
L = NestedGroupLabels


all_keywords = sorted_enums(
    [
        T.AnySound,
        T.Broadcaster,
        T.BroadcastSeries,
        T.CollectiveIdentity,
        T.CreativeWork,
        T.Event,
        T.EventSeries,
        T.FictionalCharacter,
        T.Genre,
        T.Group,
        T.Location,
        T.Movement,
        T.Organization,
        T.Person,
        T.PieceOfMusic,
        T.Place,
        T.Repertoire,
        T.Thing,
        T.TimePeriod,
        T.Topic,
        T.Topos,
        T.VActivity,
        T.VLanguage,
    ]
)

basic_fields = sorted_enums([A.attribution, A.comment, A.confidence])
timecode = sorted_enums(
    [
        A.timecodeEnd,
        A.timecodeStart,
    ]
)
just_timecode = sorted_enums([*basic_fields, *timecode])
just_target = sorted_enums([*basic_fields, A.target])
target_timecode = sorted_enums(
    [
        *just_target,
        *timecode,
    ]
)
target_timecode_metadate = sorted_enums(
    [
        *target_timecode,
        A.metaDate,
    ]
)
just_date = sorted_enums(
    [
        *basic_fields,
        A.date,
    ]
)

relation_info = {
    R.RContainer: {
        "label": "Container",
        "definition": "Meta construct for categorizing clips for the ACONTRA project.",
        "multi": True,
        "types": [T.Container],
        "roles": [],
        "allowed": [*just_target],
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RStatus: {
        "label": "Clip status",
        "definition": "Status of a Clip, e.g.: digitized.",
        "multi": True,
        "types": [T.Status],
        "roles": [],
        "allowed": [*just_target],
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RStation: {
        "label": "Radio station",
        "definition": "A Radio station associated with a clip or the station, a clip was broadcasted on.",
        "multi": False,
        "types": [T.Broadcaster],
        "roles": [],
        "allowed": [*just_target],
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RClipType: {
        "label": "Clip type",
        "definition": "The category, a clip is associated with (e.g. documentary, interview).",
        "multi": True,
        "types": [T.VClipType],
        "roles": [],
        "allowed": [*just_target],
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RTape: {
        "label": "Tape",
        "definition": "The tape where the clip was found on.",
        "multi": False,
        "types": [T.Tape],
        "roles": [],
        "allowed": [*just_target],
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RBroadcastDate: {
        "label": "Broadcast date (Sendedatum)",
        "definition": "Date(s) of public broadcast.",
        "multi": True,
        "types": [T.Broadcaster],
        "roles": [],
        "allowed": [*just_date, A.target],
        "required": [A.date],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RBroadcastSeries: {
        "label": "Broadcast series",
        "definition": "The broadcast series that material in the clip belongs to.",
        "multi": False,
        "types": [T.BroadcastSeries],
        "roles": [],
        "allowed": just_target,
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RContributor: {
        "label": "Contributor",
        "definition": "An agent (person, group, organization) who is (or should be) mentioned in the credits.",
        "multi": True,
        "types": [T.Person, T.Group, T.Organization, T.Broadcaster],
        "roles": [T.VClipContributorRole],
        "allowed": [*target_timecode_metadate, A.role],
        "required": [A.role, A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RAssociatedDate: {
        "label": "Associated Date",
        "definition": "Date or time period that is associated with the clip, either when it was recorded or broadcasted.",
        "multi": True,
        "types": [T.Broadcaster],
        "roles": [],
        "allowed": [*just_date, A.target],
        "required": [A.date],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RDateOfCreation: {
        "label": "Date of Creation (Aufnahmedatum)",
        "definition": "The date or time period the primary contents of the clip were created.",
        "multi": False,
        "types": [],
        "roles": [],
        "allowed": just_date,
        "required": [A.date],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    R.RInterpretationAnnot: {
        "label": "Interpretation",
        "definition": "The Topic or Topos that most essentially describes this interpretation. Is shown in the Clip annotation section.",
        "multi": False,
        "types": [T.Topic, T.Topos],
        "roles": [],
        "allowed": just_target,
        "required": [A.target],
        "interpretAbsent": False,
        "canCreateNew": True,
    },
    # R.RRecordingDate: {
    #     "label": "Recording date",
    #     "definition": "The date or time period the material was recorded.",
    #     "multi": False,
    #     "types": [],
    #     "roles": [],
    #     "allowed": just_date,
    #     "required": [A.date],
    #     "interpretAbsent": False,
    # },
    R.RQuote: {
        "label": "Quote",
        "definition": "A verbatim quote appearing in the clip.",
        "multi": True,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [],
        "allowed": [*target_timecode_metadate, A.quotes],
        "required": [A.quotes],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RSpeaker: {
        "label": "Speaker",
        "definition": "A person that is speaking. The exact moment can additionally be specified via time code(s).",
        "multi": True,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [T.VClipContributorRole],
        "allowed": target_timecode_metadate,
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RInstrumentM: {
        "label": "Has Instrument",
        "definition": "The sound of specific musical instruments that can prominently be heard and/or identified. Can also only affect certain parts of a piece (specify via time code).",
        "multi": True,
        "types": [T.InstrumentM, T.Thing],
        "roles": [],
        "allowed": [*target_timecode_metadate],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RKeyword: {
        "label": "Keyword",
        "definition": "Anything appearing in the clip that seems noteworthy. It is also possible to make note of absent things via the notably absent field (a checkbox).",
        "multi": True,
        "types": all_keywords,
        "roles": [],
        "allowed": [*target_timecode_metadate],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RPieceOfMusic: {
        "label": "Is Piece of Music",
        "definition": "The piece of music this Music has been identified as.",
        "multi": False,
        "types": [T.PieceOfMusic],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RSoundsLikeM: {
        "label": "Sounds like",
        "definition": "(Other) music or sounds that this Music, Speech, Sound or section is sharing characteristics with, e.g.: sounds like birdsong in the flute (specify exact moment via time code).",
        "multi": True,
        "types": [
            T.PieceOfMusic,
            T.Genre,
            T.Repertoire,
            T.CreativeWork,
            T.AnySound,
            T.Repertoire,
        ],
        "roles": [],
        "allowed": [*target_timecode_metadate],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RhasSpeaker: {
        "label": "Speaker",
        "definition": "A person that is speaking in this section.",
        "multi": False,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [T.VClipContributorRole],
        "allowed": [*target_timecode_metadate],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RhasSound: {
        "label": "Sound",
        "definition": "Best description (or guess) of what the sound actually is.",
        "multi": True,
        "types": [
            T.AnySound,
            T.Thing,
            T.VActivity,
        ],
        "roles": [],
        "allowed": [*target_timecode_metadate],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RHasPieceOfMusic: {
        "label": "Piece Of Music",
        "definition": "A piece of music that is part of the clip.",
        "multi": False,
        "types": [T.PieceOfMusic],
        "roles": [],
        "allowed": [*target_timecode_metadate],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RPartM: {
        "label": "Part",
        "definition": "Which part of a piece of music is used, for example: intro, chorus, verse, main theme, first movement etc.",
        "multi": True,
        "types": [T.PartM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RTempoM: {
        "label": "Tempo",
        "definition": "The tempo of a piece of music, a choice can be made between 'uptempo', 'midtempo' or 'slow', but if the concrete tempo indication from the notation of the piece is known, this can be added additionally.",
        "multi": True,
        "types": [T.TempoM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RRhythmM: {
        "label": "Rhythm",
        "definition": "The general rhythmic feel of a piece of music. What time signature is it 4/4, 3/4, 6/8, etc.? Can a distinctive rhythm/accentuation, e.g. waltz, march, swing, lullaby, be heard?",
        "multi": True,
        "types": [T.RhythmM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RAssocDateM: {
        "label": "Associated date",
        "definition": "The date associated with a piece of music. for example, the year of origin of the piece of music. Multiple entries are possible (if, for example, you want to enter different years of origin for the lyrics and music). Using the example of the 7th Symphony (Bruckner), the entry here would be '1881-1883'.",
        "multi": True,
        "types": [],
        "roles": [],
        "allowed": just_date,
        "required": [A.date],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RTimePeriodM: {
        "label": "Time period",
        "definition": "A time period associated with a piece of music. Larger time spans or repertoires are noted here; multiple entries are possible. This is intended to make it possible to compare/group the origins of different pieces of music beyond individual years. Using the example of the 7th Symphony (Bruckner), the entry here would be 'Romanticism' and/or '19th century'.",
        "multi": True,
        "types": [T.TimePeriod, T.Repertoire],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RAssocEventM: {
        "label": "Associated event",
        "definition": "An event that is associated with a piece of music that is directly related to its creation or can be associated with it (the degree of association is at the discretion of the person entering the data, to be measured primarily against the research question). Use the comment function to explain context if necessary. In the example of the 7th Symphony (Bruckner) it could be something like (on the occasion of) 'opening of municipal theatre (Stadttheater)', but also (in the same year as) 'death of James A. Garfield'.",
        "multi": True,
        "types": [T.Event, T.EventSeries],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RGenreM: {
        "label": "Genre",
        "definition": "The genre of a piece of music, controlled vocabulary (roughly) based on Wikipedia article about major music genres.",
        "multi": True,
        "types": [T.GenreM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RInstrumentationM: {
        "label": "Instrumentation",
        "definition": "The instrumentation of a piece of music. Controlled vocabulary, eg. band, choir...",
        "multi": True,
        "types": [T.InstrumentationM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RArticulationM: {
        "label": "Articulation",
        "definition": "How something is played: legato, tenuto, marcato, staccato. Articulation is a musical parameter that determines how a single note or other discrete event is sounded. Articulations primarily structure an event's start and end, determining the length of its sound and the shape of its attack and decay. Can also only affect certain parts of a piece (specify via time code).",
        "multi": True,
        "types": [T.ArticulationM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RDynamicsM: {
        "label": "Dynamics",
        "definition": "The dynamics or change in volume of a piece of music. Controlled vocabulary eg.: piano, forte, ...",
        "multi": True,
        "types": [T.DynamicsM],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.ROnSiteM: {
        # Boolean, neither false nor true can be default!
        "label": "On site",
        "definition": "Has the Piece of Music been recorded on site? Only select if the piece of music is clearly played 'on-site' in a report or live broadcast.",
        "multi": False,
        "types": [T.OnSite],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RDiegeticM: {
        # Boolean, neither false nor true can be default!
        "label": "Diegetic",
        "definition": "Is the piece of music in the Clip diegetic? Is the 'source' of the music in the 'narrated world' of the clip, or is it an insert?",
        "multi": False,
        "types": [T.Diegetic],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RProgrammLyricsM: {
        "label": "Programm lyrics",
        "definition": "The programm or lyrics of a piece of music. Text elements that belong to the piece of music in the broadest sense are recorded here. Lyrics are recorded here, but also titles or programmes. Input the text as a quote, but also topics/other entities which belong to the quotes, can be added.",
        "multi": True,
        "types": [T.PieceOfMusic],
        "roles": [],
        "quoteEntities": [*all_keywords],
        "allowed": [*target_timecode_metadate, A.quotes, A.quoteEntities],
        "required": [A.quotes],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RReceptionM: {
        "label": "Reception",
        "definition": "Keywords and quotes are used to record everything that is relevant to the research question with regard to the reception of the piece of music. Here, keywords and quotations are used to record everything that is relevant to the research question with regard to the reception of the piece of music described. These can be historical uses / appropriations, references to secondary literature, noteworthy attributions and interpretations, etc. Using the example of 'Les Préludes' (Franz Liszt): 'Russian Fanfare' as a 'Piece of Music', i.e., historical use in the newsreel during the time of the German-Soviet War (1941-45); 'Feierlich und weihevoll' as a quote from the security service of the Reichsführer of the SS.",
        "multi": True,
        "types": [*all_keywords],
        "roles": [],
        "quoteEntities": [*all_keywords],
        "allowed": [*target_timecode_metadate, A.quotes, A.quoteEntities],
        "required": [A.quotes],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RTempoSp: {
        "label": "Tempo",
        "definition": "The subjective impression of the tempo of a Speech. Speech speed is usually measured in words per minute (whereby the average in Austria is around 120 words per minute for a lecture, cf. Christian Bensel 2016). The only important thing for us here is actually the subjective impression: slow, neutral or fast.",
        "multi": True,
        "types": [T.TempoSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RRhythmSp: {
        "label": "Rhythm",
        "definition": "The subjective impression of the rhythm of a Speech. Rhythm is understood as an 'individual, linguistic realisation of the metrical scheme' (Hans Lösener 1999, 41). However, the further theoretical definition, localisation and, above all, description of rhythm as a prosodic element is not yet complete. In our context, we again limit ourselves to subjective impressions and essentially differentiate between 'inconspicuous/melodic' and 'conspicuous/unmelodic'. If the rhythm is 'conspicuous/unmelodic', it can be additionally specified: 'bumpy', 'stuttering', etc.",
        "multi": True,
        "types": [T.RhythmSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RTimbreSp: {
        "label": "Timbre",
        "definition": "The subjective impression of the timbre of a Speech, for example: dark/bright; sharp/soft; clear/unclear; feminine/masculine",
        "multi": True,
        "types": [T.Timbre],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RMentionsSp: {
        "label": "Mentions",
        "definition": "The content of a Speech, what is mentioned in the Speech. Specify keywords (Topic, Person, etc.).",
        "multi": True,
        "types": [*all_keywords],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RQuoteSp: {
        "label": "Quote",
        "definition": "A verbatim quote from the Speech, individual quotations can be emphasised and should be linked to a comment on the content (abstraction) via a keyword.",
        "multi": True,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [],
        "quoteEntities": [*all_keywords],
        "allowed": [*target_timecode_metadate, A.quotes, A.quoteEntities],
        "required": [A.quotes],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RPausesSp: {
        "label": "Pauses",
        "definition": "The subjective impression of the pauses in a Speech. The same applies here as for rhythm: there is no clear terminology for describing pauses in speech. A controlled vocabulary should be used here to describe impressions: 'many pauses/few', 'long/short', 'purposeful', etc.",
        "multi": True,
        "types": [T.PausesSp],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RVolumeSp: {
        "label": "Volume",
        "definition": "The subjective impression of the volume/loudness of a Speech: 'loud/quiet'.",
        "multi": True,
        "types": [T.Volume],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RPitchSp: {
        "label": "Pitch",
        "definition": "The subjective impression of the pitch of a Speech: 'high/low'.",
        "multi": True,
        "types": [T.Pitch],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RLanguageSp: {
        "label": "Language",
        "definition": "The language used by a speaker. Here we want to define individual languages and varieties. In this context, we understand a single language to be German, English, Japanese, etc.; in linguistics, a variety is understood to be a specific form of such a single language. In our case, we mainly want to note spatial varieties of German (Austrian German, Federal German, etc.).",
        "multi": True,
        "types": [T.VLanguage],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RDialectSp: {
        "label": "Dialect",
        "definition": "The dialect used by a speaker. In linguistics, dialect stands for regionally definable language systems that are characterised by strong structural similarity with neighbouring systems and have not been codified or written down (Bussmann). Synonym: Mundart. To be clearly distinguished from accent, as accent only affects pronunciation and intonation, but not - like dialect - other areas of language such as grammar, morphology, syntax, lexis, idioms, etc.",
        "multi": True,
        "types": [T.DialectSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RSociolectSp: {
        "label": "Sociolect",
        "definition": "The Social (group) variety of language used by a speaker. Language of social classes, also professional and specialised languages as well as special languages such as youth language, languages of hobby groups or crook language.",
        "multi": True,
        "types": [T.SociolectSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RAccentSp: {
        "label": "Accent",
        "definition": "The accent used by a speaker. Characteristics of speech and the resulting - usually unconscious - transfer of pronunciation habits of the dialect or regiolect to the umbrella language or the transfer of pronunciation habits of the first/native language or the primarily used language to a foreign language learnt later.",
        "multi": True,
        "types": [T.AccentSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RPronounSp: {
        "label": "Pronoun",
        "definition": "The aim here is to record whether the addressing of the audience using pronouns is formal or informal. In addition, it is also be possible to record whether moderators frequently use the first person ('I').",
        "multi": True,
        "types": [T.PronounSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RAddressingSp: {
        "label": "Addressing",
        "definition": "How the speaker adresses the listener or interview partners. (e.g. formal, informal, first name, last name, title, ...)",
        "multi": True,
        "types": [T.AdressSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RAffectSp: {
        "label": "Affect/Zustand",
        "definition": "Which (emotional/affective) state is conveyed/triggered/implied on the language level?",
        "multi": True,
        "types": [T.AffectSp],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RSpeechformSp: {
        "label": "Speechform",
        "definition": "distinguish whether it is a monlogue or dialogue, whether it is a read (pre-formulated) or freely (spontaneously) spoken text.",
        "multi": True,
        "types": [T.SpeechformSp],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RTechnicalAestheticSo: {
        "label": "Technical aesthetic",
        "definition": "Sound engineering conspicuities: Overdrive, noise, proximity and distance to the microphone, reverb/space, fade outs, ...",
        "multi": True,
        "types": [T.TechnicalAestheticSo],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": True,
    },
    R.RDiegeticSo: {
        "label": "Diegetic (Sound)",
        "definition": "Are the sounds part of the world/location transmitted in the programme?",
        "multi": False,
        "types": [T.Diegetic],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.ROnSiteSo: {
        "label": "On site (Sound)",
        "definition": "Has the Sound been recorded on site or has it been added in post production?",
        "multi": False,
        "types": [T.OnSite],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RVolumeSo: {
        "label": "Volume",
        "definition": "The subjective impression of the volume of a Sound: 'loud/quiet'.",
        "multi": True,
        "types": [T.Volume],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RPitchSo: {
        "label": "Pitch",
        "definition": "The subjective impression of the pitch of a Sound: 'high/low'.",
        "multi": True,
        "types": [T.Pitch],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
    R.RTimbreSo: {
        "label": "Timbre",
        "definition": "The subjective impression of the timbre of a Sound: 'dark/bright'; 'sharp/soft; 'clear/blurred'; feminine/masculine'",
        "multi": True,
        "types": [T.Timbre],
        "roles": [],
        "allowed": [*target_timecode],
        "required": [A.target],
        "interpretAbsent": True,
        "canCreateNew": False,
    },
}


supported_relations = {
    E.Clip: [
        R.RAssociatedDate,
        R.RStation,
        R.RClipType,
        R.RBroadcastSeries,
        R.RContributor,
        R.RQuote,
        R.RKeyword,
        R.RTape,
        R.RStatus,
    ],
    E.Segment: [R.RInterpretationAnnot],
    E.Structure: [R.RKeyword],
    E.MusicLayer: [
        R.RHasPieceOfMusic,
        R.RPartM,
        R.RTempoM,
        R.RRhythmM,
        R.RAssocDateM,
        R.RTimePeriodM,
        R.RAssocEventM,
        R.RGenreM,
        R.RInstrumentationM,
        R.RInstrumentM,
        R.RArticulationM,
        R.RDynamicsM,
        R.ROnSiteM,
        R.RDiegeticM,
        R.RProgrammLyricsM,
        R.RReceptionM,
        R.RSoundsLikeM,
        R.RKeyword,
        R.RAffectSp,
    ],
    E.SpeechLayer: [
        R.RhasSpeaker,
        R.RTempoSp,
        R.RRhythmSp,
        R.RPausesSp,
        R.RVolumeSp,
        R.RPitchSp,
        R.RTimbreSp,
        R.RLanguageSp,
        R.RDialectSp,
        R.RSociolectSp,
        R.RAccentSp,
        R.RPronounSp,
        R.RAddressingSp,
        R.RSpeechformSp,
        R.RAffectSp,
        R.RMentionsSp,
        R.RQuoteSp,
        R.RKeyword,
    ],
    E.SoundLayer: [
        R.RhasSound,
        R.RTechnicalAestheticSo,
        R.RDiegeticSo,
        R.ROnSiteSo,
        R.RVolumeSo,
        R.RPitchSo,
        R.RTimbreSo,
        R.RKeyword,
    ],
}

nested_elements = {
    N.MusicLayer: [
        L.GeneralM,
        L.TemporalStructureM,
        L.DateM,
        L.TimbreM,
        L.OtherM,
    ],
    N.SpeechLayer: [
        L.GeneralSp,
        L.TimingSp,
        L.SpeechToneSp,
        L.LanguageSp,
        L.AddressingSp,
        L.OtherSp,
    ],
    N.SoundLayer: [
        L.GeneralSo,
        L.DescriptionSo,
        L.OtherSo,
    ],
}

nested_elements_labels = {
    L.GeneralM: {
        "label": "General",
        "definition": "General information about the music in a Layer.",
        "relations": [
            R.RHasPieceOfMusic,
            R.RPartM,
            R.RGenreM,
            R.RProgrammLyricsM,
        ],
    },
    L.TemporalStructureM: {
        "label": "Temporal structure",
        "definition": "Information about the temporal structure of a Layer.",
        "relations": [
            R.RTempoM,
            R.RRhythmM,
        ],
    },
    L.DateM: {
        "label": "Entstehungs-Zeitpunkte/-Kontext",
        "definition": "Im Entstehungs-Zeitpunkt-/Kontext sollen drei Arten der Eingabe möglich sein (and/or): Jahreszahl, Zeitspanne/allgemeine Angabe, und Event. Generell soll hier alles erfasst werden können, was in Bezug auf den Entstehungszeitpunkt und -kontext der im Clip vorliegenden Musikstück-Version für die Forschungsfrage relevant ist.",
        "relations": [
            R.RAssocDateM,
            R.RTimePeriodM,
            R.RAssocEventM,
        ],
    },
    L.TimbreM: {
        "label": "Klangfarbe/Timbre",
        "definition": "Information about the timbre in a Layer.",
        "relations": [
            R.RInstrumentationM,
            R.RInstrumentM,
            R.RArticulationM,
            R.RDynamicsM,
        ],
    },
    L.OtherM: {
        "label": "Other Categories",
        "definition": "Other aspects of a music in a Layer.",
        "relations": [
            R.ROnSiteM,
            R.RDiegeticM,
            R.RReceptionM,
            R.RAffectSp,
            R.RSoundsLikeM,
            R.RKeyword,
        ],
    },
    L.GeneralSp: {
        "label": "General",
        "definition": "General information about the speech in a Layer.",
        "relations": [
            R.RhasSpeaker,
        ],
    },
    L.TimingSp: {
        "label": "Timing",
        "definition": "Timing: Als prosodisches Element der Sprache (prosodisch = lautliche Eigenschaften) setzt sich das Timing, oder die wahrgenommene Sprechgeschwindigkeit, aus drei Elementen zusammen: Tempo, Rhythmus und Pausen.",
        "relations": [
            R.RTempoSp,
            R.RRhythmSp,
            R.RPausesSp,
        ],
    },
    L.SpeechToneSp: {
        "label": "Sprachton-/klang",
        "definition": "Als 'Sprachklang' fassen wir auditive Qualitäten wie Lautstärke (Amplitude; laut/leise), Tonhöhe (Grundfrequenz; hoch/tief) und Klangfarbe (dunkel/hell; scharf/sanft; deutlich/undeutlich; freies Feld).",
        "relations": [
            R.RVolumeSp,
            R.RPitchSp,
            R.RTimbreSp,
        ],
    },
    L.LanguageSp: {
        "label": "Sprache/Sprachvarietät",
        "definition": "Information about the language or dialect etc. used in a Speech Layer.",
        "relations": [
            R.RLanguageSp,
            R.RDialectSp,
            R.RSociolectSp,
            R.RAccentSp,
        ],
    },
    L.AddressingSp: {
        "label": "Adressierung",
        "definition": "Unter dem Punkt der Adressierung wollen wir vor allem (linguistische) Indikatoren der Intimitätserzeugung festhalten",
        "relations": [
            R.RPronounSp,
            R.RAddressingSp,
        ],
    },
    L.OtherSp: {
        "label": "Other",
        "definition": "Other aspects about the Speech Layer.",
        "relations": [
            R.RSpeechformSp,
            R.RAffectSp,
            R.RMentionsSp,
            R.RQuoteSp,
            R.RKeyword,
        ],
    },
    L.GeneralSo: {
        "label": "General",
        "definition": "General information about the sound layer.",
        "relations": [
            R.RhasSound,
            R.RTechnicalAestheticSo,
            R.RDiegeticSo,
            R.ROnSiteSo,
        ],
    },
    L.DescriptionSo: {
        "label": "Sound description",
        "definition": "General information about the piece of music.",
        "relations": [
            R.RVolumeSo,
            R.RPitchSo,
            R.RTimbreSo,
        ],
    },
    L.OtherSo: {
        "label": "Other",
        "definition": "Other aspects about the Sound Layer.",
        "relations": [
            R.RKeyword,
        ],
    },
}


missing_info = [r for r in Relations if r not in relation_info]
if len(missing_info) > 0:
    raise MissingInfoError(missing_info)
