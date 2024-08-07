from enum import Enum, unique, auto

from lama.errors import MissingInfoError


@unique
class EntityTypes(Enum):
    AnySound = auto()
    Broadcaster = auto()
    BroadcastSeries = auto()
    Collection = auto()
    CollectiveIdentity = auto()
    CreativeWork = auto()
    Event = auto()
    EventSeries = auto()
    FictionalCharacter = auto()
    Genre = auto()
    Group = auto()
    Location = auto()
    Movement = auto()
    Organization = auto()
    Person = auto()
    PieceOfMusic = auto()
    Place = auto()
    Platform = auto()
    Repertoire = auto()
    Status = auto()
    Tape = auto()
    Thing = auto()
    TimePeriod = auto()
    Topic = auto()
    Topos = auto()
    VActivity = auto()
    VClipContributorRole = auto()
    VClipType = auto()
    VLanguage = auto()
    Volume = auto()
    Pitch = auto()
    Timbre = auto()
    OnSite = auto()
    Diegetic = auto()
    Container = auto()

    # music specific
    PartM = auto()
    GenreM = auto()
    # kontrolled vocab: Contemporary classical music (Post-1945), Historical classical music (Pre-1945), International popular music, Folk music (traditionelle Volksmusik), Electronic music, Schlager (German popular Music), Jazz
    TempoM = auto()
    RhythmM = auto()
    InstrumentationM = auto()
    InstrumentM = auto()
    ArticulationM = auto()
    DynamicsM = auto()

    # speech specific
    TempoSp = auto()
    RhythmSp = auto()
    PausesSp = auto()
    # LanguageSp = auto()
    DialectSp = auto()
    SociolectSp = auto()
    AccentSp = auto()
    PronounSp = auto()
    AdressSp = auto()
    SpeechformSp = auto()
    AffectSp = auto()

    # sound specific
    TechnicalAestheticSo = auto()

    # deprecated/unused/renamed
    # Shot = auto() # unused
    # Station = auto()
    # ProductionTechniquePicture = auto() # unused
    # ProductionTechniqueSound = auto() # unused
    # LieuDeMemoire = auto() # unused
    # VAdjective = auto() # unused
    # VFunctionInClipRole = auto() # unused
    # VEventType = auto() # unused
    # VInstrument = auto()  # unused

    # VMusicArts = auto() # unused
    # VMusicPerformanceRole = auto() # unused
    # VSpeechGenre = auto() # unused


E = EntityTypes

entity_type_info = {
    E.AnySound: {
        "label": "Any sound",
        "definition": "An identifiable sound, most often from nature or everyday life (e.g. birdsong).",
    },
    E.BroadcastSeries: {
        "label": "Broadcast series",
        "definition": "A recurring TV or radio program (e.g. Ö1 Mittagsjournal).",
    },
    E.Broadcaster: {
        "label": "Broadcaster",
        "definition": "A broadcasting organization (e.g. ORF) or a broadcasting station (e.g. Ö1).",
    },
    E.Collection: {
        "label": "Collection",
        "definition": "An existing collection of clips (e.g. Wiener Video Rekorder / Mediathek).",
    },
    E.CollectiveIdentity: {
        "label": "Collective identity",
        "definition": "A group of people with something in common (e.g. Youth, Nazis, Police).",
    },
    E.Container: {
        "label": "Container",
        "definition": "A meta construct for categorizing the clips for the ACONTRA project.",
    },
    E.CreativeWork: {
        "label": "Creative work",
        "definition": "An identifiable creative work that is not a piece of music (e.g. a book or a film).",
    },
    E.Event: {
        "label": "Event",
        "definition": "A concrete event at a certain time and location that can actually be attended (e.g. a concert).",
    },
    E.EventSeries: {
        "label": "Event series",
        "definition": "A recurring series of events (e.g. Wiener Festwochen).",
    },
    E.FictionalCharacter: {
        "label": "Fictional character",
        "definition": "A fictional character (e.g. Donald Duck).",
    },
    E.Genre: {
        "label": "Genre",
        "definition": "A subcategory of creative production (e.g. Heavy Metal).",
    },
    E.Group: {
        "label": "Group",
        "definition": "A group where all members are (or could be) known by name (e.g. The Beatles).",
    },
    E.VLanguage: {
        "label": "Language",
        "definition": "An official language (e.g. Finnish).",
    },
    E.Location: {
        "label": "Location",
        "definition": "A place with known GPS coordinates, address, or borders (e.g. Wiener Konzerthaus).",
    },
    E.Movement: {
        "label": "Movement",
        "definition": "A political, cultural, or artistic movement (e.g. Marxism, Dadaism).",
    },
    E.Organization: {
        "label": "Organization",
        "definition": "An organization (e.g. United Nations).",
    },
    E.Person: {
        "label": "Person",
        "definition": "An actual person, living or dead (e.g. Johannes Chrysostomus Wolfgangus Theophilus Mozart).",
    },
    E.PieceOfMusic: {
        "label": "Piece of Music",
        "definition": "Any identifiable piece of music (e.g. Donauwalzer, My Way).",
    },
    E.Place: {
        "label": "Place",
        "definition": "A generic type of place (e.g. the street, a church).",
    },
    E.Platform: {
        "label": "Platform",
        "definition": "A website or institution where clips are to be found (e.g. Österreichische Mediathek).",
    },
    E.Repertoire: {
        "label": "Repertoire",
        "definition": "A musical subcategory (e.g. Wiener Klassik).",
    },
    E.Status: {
        "label": "Clip status",
        "definition": "The digitalization status of a clip, eg. 'digitized with online access'",
    },
    E.Tape: {
        "label": "Tape",
        "definition": "The name of a collection of clips on a tape ('Bandl').",
    },
    E.Thing: {
        "label": "Thing",
        "definition": "Any thing appearing in the wide world (e.g. Cigarette).",
    },
    E.TimePeriod: {
        "label": "Time period",
        "definition": "A timespan or period with historical significance.",
    },
    E.Topic: {
        "label": "Topic",
        "definition": "Any (intangible) concept not fitting any other category.",
    },
    E.Topos: {"label": "Topos", "definition": "Topos."},
    E.VClipType: {
        "label": "Clip type",
        "definition": "A category describing a clip's form of presentation (e.g. documentary, interview).",
    },
    E.VClipContributorRole: {
        "label": "Contributor role",
        "definition": "The function ascribed to a contributor in the credits (e.g. director, presenter).",
    },
    E.VActivity: {
        "label": "Activity",
        "definition": "An activity that is being shown or heard (e.g. clapping).",
    },
    E.PartM: {
        "label": "Part",
        "definition": "A part of a musical work, e.g.: 'Intro', 'Main theme', 'Outro'.",
    },
    E.TempoM: {
        "label": "Tempo (Music)",
        "definition": "The tempo of a musical work. Either the tempo description of the piece or 'uptempo', 'midttempo' or 'downtempo'.",
    },
    E.RhythmM: {
        "label": "Rhythm (Music)",
        "definition": "Rhythm of a musical work (e.g. 3/4, 6/8 or 'Walz', 'Marsch').",
    },
    E.GenreM: {
        "label": "Genre (MusicLayer)",
        "definition": "A genre of a musical work (fixed vocabulary: Contemporary classical music (Post-1945), Historical classical music (Pre-1945), International popular music, Folk music (traditionelle Volksmusik), Electronic music, Schlager (German popular Music), Jazz).",
    },
    E.InstrumentationM: {
        "label": "Instrumentation",
        "definition": "An instrumentation of a musical work (e.g. Piano, Orchestra).",
    },
    E.InstrumentM: {
        "label": "Instrument",
        "definition": "An instrument used in a musical work (e.g. Piano, Violin).",
    },
    E.ArticulationM: {
        "label": "Articulation",
        "definition": "An articulation used in a musical work (e.g. Legato, Staccato).",
    },
    E.DynamicsM: {
        "label": "Dynamics",
        "definition": "A dynamics of a musical work (e.g. Forte, Piano).",
    },
    E.TempoSp: {
        "label": "Tempo (Speech)",
        "definition": "Tempo of a speech: slow or fast.",
    },
    E.RhythmSp: {
        "label": "Rhythm (Speech)",
        "definition": "Distinction between 'inconspicuous/melodic' and 'conspicuous/unmelodic'. If the rhythm is 'conspicuous/unmelodic', it can be further specified: 'bumpy', 'stuttering', etc..",
    },
    E.PausesSp: {
        "label": "Pauses (Speech)",
        "definition": "Subjective observation of the pauses: 'many', 'few', 'long', 'short'.",
    },
    E.Volume: {
        "label": "Volume",
        "definition": "Volume: 'loud' or 'quiet'.",
    },
    E.Pitch: {
        "label": "Pitch",
        "definition": "Pitch: 'low' or 'high'.",
    },
    E.Timbre: {
        "label": "Timbre",
        "definition": "Timbre : dark/bright, sharp/soft, clear/blurred feminine/masculine.",
    },
    # E.FunctionSo: {
    #     "label": "Function",
    #     "definition": "Generated: The function of a sound (e.g. background, foreground).",
    # },
    # E.ProductionTechniqueSound: {
    #     "label": "Production technique (sound)",
    #     "definition": "A production technique on the auditory level (e.g. fade-out).",
    # },
    # E.LanguageSp: {
    #     "label": "Language",
    #     "definition": "A language of a speech.",
    # },
    E.DialectSp: {
        "label": "Dialect",
        "definition": "The dialect of a speech.",
    },
    E.SociolectSp: {
        "label": "Sociolect",
        "definition": "The sociolect of a speech.",
    },
    E.AccentSp: {
        "label": "Accent",
        "definition": "The accent of a speech.",
    },
    E.PronounSp: {
        "label": "Pronoun",
        "definition": "The pronoun of a speech (formal, informal, first person).",
    },
    E.AdressSp: {
        "label": "Adress",
        "definition": "The adress of a speech. Is the listener addressed directly or not?",
    },
    E.AffectSp: {
        "label": "Affect/Zustand",
        "definition": "The affect of a speech (e.g. angry, happy).",
    },
    E.SpeechformSp: {
        "label": "Form",
        "definition": "The speechform of a speech (Monolog, Dialog, free, read).",
    },
    E.TechnicalAestheticSo: {
        "label": "Technical aesthetic",
        "definition": "The technical aesthetic of a sound (Overdrive, noise, proximity and distance to the microphone, reverb/space, fade outs, ...).",
    },
    E.OnSite: {
        "label": "On site",
        "definition": "Information about the type of recording (e.g. live, studio).",
    },
    E.Diegetic: {
        "label": "Diegetic",
        "definition": "Is a sound/speech diegetic or non-diegetic?",
    },
}


missing_info = [e for e in EntityTypes if e not in entity_type_info]
if len(missing_info) > 0:
    raise MissingInfoError(missing_info)
