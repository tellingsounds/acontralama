# Relations

## Accent (RAccentSp)

### Definition:

The accent used by a speaker. Characteristics of speech and the resulting - usually unconscious - transfer of pronunciation habits of the dialect or regiolect to the umbrella language or the transfer of pronunciation habits of the first/native language or the primarily used language to a foreign language learnt later.

### Supported Entity Types:

+ Accent (AccentSp)

### Elements:

+ SpeechLayer

## Addressing (RAddressingSp)

### Definition:

How the speaker adresses the listener or interview partners. (e.g. formal, informal, first name, last name, title, ...)

### Supported Entity Types:

+ Adress (AdressSp)

### Elements:

+ SpeechLayer

## Affect/Zustand (RAffectSp)

### Definition:

Which (emotional/affective) state is conveyed/triggered/implied on the language level?

### Supported Entity Types:

+ Affect/Zustand (AffectSp)

### Elements:

+ MusicLayer
+ SpeechLayer

## Articulation (RArticulationM)

### Definition:

How something is played: legato, tenuto, marcato, staccato. Articulation is a musical parameter that determines how a single note or other discrete event is sounded. Articulations primarily structure an event's start and end, determining the length of its sound and the shape of its attack and decay. Can also only affect certain parts of a piece (specify via time code).

### Supported Entity Types:

+ Articulation (ArticulationM)

### Elements:

+ MusicLayer

## Associated Date (RAssociatedDate)

### Definition:

Date or time period that is associated with the clip, either when it was recorded or broadcasted.

### Supported Entity Types:

+ Adress (AdressSp)

### Elements:

+ SpeechLayer

## Associated date (RAssocDateM)

### Definition:

The date associated with a piece of music. for example, the year of origin of the piece of music. Multiple entries are possible (if, for example, you want to enter different years of origin for the lyrics and music). Using the example of the 7th Symphony (Bruckner), the entry here would be '1881-1883'.

### Elements:

+ MusicLayer

## Associated event (RAssocEventM)

### Definition:

An event that is associated with a piece of music that is directly related to its creation or can be associated with it (the degree of association is at the discretion of the person entering the data, to be measured primarily against the research question). Use the comment function to explain context if necessary. In the example of the 7th Symphony (Bruckner) it could be something like (on the occasion of) 'opening of municipal theatre (Stadttheater)', but also (in the same year as) 'death of James A. Garfield'.

### Supported Entity Types:

+ Event (Event)
+ Event series (EventSeries)

### Elements:

+ MusicLayer

## Broadcast date (Sendedatum) (RBroadcastDate)

### Definition:

Date(s) of public broadcast.

### Supported Entity Types:

+ Broadcaster (Broadcaster)

### Elements:


## Broadcast series (RBroadcastSeries)

### Definition:

The broadcast series that material in the clip belongs to.

### Supported Entity Types:

+ Broadcast series (BroadcastSeries)

### Elements:

+ Clip

## Clip status (RStatus)

### Definition:

Status of a Clip, e.g.: digitized.

### Supported Entity Types:

+ Clip status (Status)

### Elements:

+ Clip

## Clip type (RClipType)

### Definition:

The category, a clip is associated with (e.g. documentary, interview).

### Supported Entity Types:

+ Clip type (VClipType)

### Elements:

+ Clip

## Container (RContainer)

### Definition:

Meta construct for categorizing clips for the ACONTRA project.

### Supported Entity Types:

+ Container (Container)

### Elements:


## Contributor (RContributor)

### Definition:

An agent (person, group, organization) who is (or should be) mentioned in the credits.

### Supported Entity Types:

+ Broadcaster (Broadcaster)
+ Group (Group)
+ Organization (Organization)
+ Person (Person)

### Supported Roles:
+ VClipContributorRole

### Elements:

+ Clip

## Date of Creation (Aufnahmedatum) (RDateOfCreation)

### Definition:

The date or time period the primary contents of the clip were created.

### Elements:


## Dialect (RDialectSp)

### Definition:

The dialect used by a speaker. In linguistics, dialect stands for regionally definable language systems that are characterised by strong structural similarity with neighbouring systems and have not been codified or written down (Bussmann). Synonym: Mundart. To be clearly distinguished from accent, as accent only affects pronunciation and intonation, but not - like dialect - other areas of language such as grammar, morphology, syntax, lexis, idioms, etc.

### Supported Entity Types:

+ Dialect (DialectSp)

### Elements:

+ SpeechLayer

## Diegetic (RDiegeticM)

### Definition:

Is the piece of music in the Clip diegetic? Is the 'source' of the music in the 'narrated world' of the clip, or is it an insert?

### Supported Entity Types:

+ Diegetic (Diegetic)

### Elements:

+ MusicLayer

## Diegetic (Sound) (RDiegeticSo)

### Definition:

Are the sounds part of the world/location transmitted in the programme?

### Supported Entity Types:

+ Diegetic (Diegetic)

### Elements:

+ SoundLayer

## Dynamics (RDynamicsM)

### Definition:

The dynamics or change in volume of a piece of music. Controlled vocabulary eg.: piano, forte, ...

### Supported Entity Types:

+ Dynamics (DynamicsM)

### Elements:

+ MusicLayer

## Genre (RGenreM)

### Definition:

The genre of a piece of music, controlled vocabulary (roughly) based on Wikipedia article about major music genres.

### Supported Entity Types:

+ Genre (MusicLayer) (GenreM)

### Elements:

+ MusicLayer

## Has Instrument (RInstrumentM)

### Definition:

The sound of specific musical instruments that can prominently be heard and/or identified. Can also only affect certain parts of a piece (specify via time code).

### Supported Entity Types:

+ Instrument (InstrumentM)
+ Thing (Thing)

### Elements:

+ MusicLayer

## Instrumentation (RInstrumentationM)

### Definition:

The instrumentation of a piece of music. Controlled vocabulary, eg. band, choir...

### Supported Entity Types:

+ Instrumentation (InstrumentationM)

### Elements:

+ MusicLayer

## Interpretation (RInterpretationAnnot)

### Definition:

The Topic or Topos that most essentially describes this interpretation. Is shown in the Clip annotation section.

### Supported Entity Types:

+ Topic (Topic)
+ Topos (Topos)

### Elements:

+ Interpretation

## Is Piece of Music (RPieceOfMusic)

### Definition:

The piece of music this Music has been identified as.

### Supported Entity Types:

+ Piece of Music (PieceOfMusic)

### Elements:


## Keyword (RKeyword)

### Definition:

Anything appearing in the clip that seems noteworthy. It is also possible to make note of absent things via the notably absent field (a checkbox).

### Supported Entity Types:

+ Activity (VActivity)
+ Any sound (AnySound)
+ Broadcast series (BroadcastSeries)
+ Broadcaster (Broadcaster)
+ Collective identity (CollectiveIdentity)
+ Creative work (CreativeWork)
+ Event (Event)
+ Event series (EventSeries)
+ Fictional character (FictionalCharacter)
+ Genre (Genre)
+ Group (Group)
+ Language (VLanguage)
+ Location (Location)
+ Movement (Movement)
+ Organization (Organization)
+ Person (Person)
+ Piece of Music (PieceOfMusic)
+ Place (Place)
+ Repertoire (Repertoire)
+ Thing (Thing)
+ Time period (TimePeriod)
+ Topic (Topic)
+ Topos (Topos)

### Elements:

+ Clip
+ Structure
+ MusicLayer
+ SpeechLayer
+ SoundLayer

## Language (RLanguageSp)

### Definition:

The language used by a speaker. Here we want to define individual languages and varieties. In this context, we understand a single language to be German, English, Japanese, etc.; in linguistics, a variety is understood to be a specific form of such a single language. In our case, we mainly want to note spatial varieties of German (Austrian German, Federal German, etc.).

### Supported Entity Types:

+ Language (VLanguage)

### Elements:

+ SpeechLayer

## Mentions (RMentionsSp)

### Definition:

The content of a Speech, what is mentioned in the Speech. Specify keywords (Topic, Person, etc.).

### Supported Entity Types:

+ Activity (VActivity)
+ Any sound (AnySound)
+ Broadcast series (BroadcastSeries)
+ Broadcaster (Broadcaster)
+ Collective identity (CollectiveIdentity)
+ Creative work (CreativeWork)
+ Event (Event)
+ Event series (EventSeries)
+ Fictional character (FictionalCharacter)
+ Genre (Genre)
+ Group (Group)
+ Language (VLanguage)
+ Location (Location)
+ Movement (Movement)
+ Organization (Organization)
+ Person (Person)
+ Piece of Music (PieceOfMusic)
+ Place (Place)
+ Repertoire (Repertoire)
+ Thing (Thing)
+ Time period (TimePeriod)
+ Topic (Topic)
+ Topos (Topos)

### Elements:

+ SpeechLayer

## On site (ROnSiteM)

### Definition:

Has the Piece of Music been recorded on site? Only select if the piece of music is clearly played 'on-site' in a report or live broadcast.

### Supported Entity Types:

+ On site (OnSite)

### Elements:

+ MusicLayer

## On site (Sound) (ROnSiteSo)

### Definition:

Has the Sound been recorded on site or has it been added in post production?

### Supported Entity Types:

+ On site (OnSite)

### Elements:

+ SoundLayer

## Part (RPartM)

### Definition:

Which part of a piece of music is used, for example: intro, chorus, verse, main theme, first movement etc.

### Supported Entity Types:

+ Part (PartM)

### Elements:

+ MusicLayer

## Pauses (RPausesSp)

### Definition:

The subjective impression of the pauses in a Speech. The same applies here as for rhythm: there is no clear terminology for describing pauses in speech. A controlled vocabulary should be used here to describe impressions: 'many pauses/few', 'long/short', 'purposeful', etc.

### Supported Entity Types:

+ Pauses (Speech) (PausesSp)

### Elements:

+ SpeechLayer

## Piece Of Music (RHasPieceOfMusic)

### Definition:

A piece of music that is part of the clip.

### Supported Entity Types:

+ Piece of Music (PieceOfMusic)

### Elements:

+ MusicLayer

## Pitch (RPitchSp)

### Definition:

The subjective impression of the pitch of a Speech: 'high/low'.

### Supported Entity Types:

+ Pitch (Pitch)

### Elements:

+ SpeechLayer

## Pitch (RPitchSo)

### Definition:

The subjective impression of the pitch of a Sound: 'high/low'.

### Supported Entity Types:

+ Pitch (Pitch)

### Elements:

+ SoundLayer

## Programm lyrics (RProgrammLyricsM)

### Definition:

The programm or lyrics of a piece of music. Text elements that belong to the piece of music in the broadest sense are recorded here. Lyrics are recorded here, but also titles or programmes. Input the text as a quote, but also topics/other entities which belong to the quotes, can be added.

### Supported Entity Types:

+ Piece of Music (PieceOfMusic)

### Elements:

+ MusicLayer

## Pronoun (RPronounSp)

### Definition:

The aim here is to record whether the addressing of the audience using pronouns is formal or informal. In addition, it is also be possible to record whether moderators frequently use the first person ('I').

### Supported Entity Types:

+ Pronoun (PronounSp)

### Elements:

+ SpeechLayer

## Quote (RQuote)

### Definition:

A verbatim quote appearing in the clip.

### Supported Entity Types:

+ Fictional character (FictionalCharacter)
+ Person (Person)

### Elements:

+ Clip

## Quote (RQuoteSp)

### Definition:

A verbatim quote from the Speech, individual quotations can be emphasised and should be linked to a comment on the content (abstraction) via a keyword.

### Supported Entity Types:

+ Fictional character (FictionalCharacter)
+ Person (Person)

### Elements:

+ SpeechLayer

## Radio station (RStation)

### Definition:

A Radio station associated with a clip or the station, a clip was broadcasted on.

### Supported Entity Types:

+ Broadcaster (Broadcaster)

### Elements:

+ Clip

## Reception (RReceptionM)

### Definition:

Keywords and quotes are used to record everything that is relevant to the research question with regard to the reception of the piece of music. Here, keywords and quotations are used to record everything that is relevant to the research question with regard to the reception of the piece of music described. These can be historical uses / appropriations, references to secondary literature, noteworthy attributions and interpretations, etc. Using the example of 'Les Préludes' (Franz Liszt): 'Russian Fanfare' as a 'Piece of Music', i.e., historical use in the newsreel during the time of the German-Soviet War (1941-45); 'Feierlich und weihevoll' as a quote from the security service of the Reichsführer of the SS.

### Supported Entity Types:

+ Activity (VActivity)
+ Any sound (AnySound)
+ Broadcast series (BroadcastSeries)
+ Broadcaster (Broadcaster)
+ Collective identity (CollectiveIdentity)
+ Creative work (CreativeWork)
+ Event (Event)
+ Event series (EventSeries)
+ Fictional character (FictionalCharacter)
+ Genre (Genre)
+ Group (Group)
+ Language (VLanguage)
+ Location (Location)
+ Movement (Movement)
+ Organization (Organization)
+ Person (Person)
+ Piece of Music (PieceOfMusic)
+ Place (Place)
+ Repertoire (Repertoire)
+ Thing (Thing)
+ Time period (TimePeriod)
+ Topic (Topic)
+ Topos (Topos)

### Elements:

+ MusicLayer

## Rhythm (RRhythmM)

### Definition:

The general rhythmic feel of a piece of music. What time signature is it 4/4, 3/4, 6/8, etc.? Can a distinctive rhythm/accentuation, e.g. waltz, march, swing, lullaby, be heard?

### Supported Entity Types:

+ Rhythm (Music) (RhythmM)

### Elements:

+ MusicLayer

## Rhythm (RRhythmSp)

### Definition:

The subjective impression of the rhythm of a Speech. Rhythm is understood as an 'individual, linguistic realisation of the metrical scheme' (Hans Lösener 1999, 41). However, the further theoretical definition, localisation and, above all, description of rhythm as a prosodic element is not yet complete. In our context, we again limit ourselves to subjective impressions and essentially differentiate between 'inconspicuous/melodic' and 'conspicuous/unmelodic'. If the rhythm is 'conspicuous/unmelodic', it can be additionally specified: 'bumpy', 'stuttering', etc.

### Supported Entity Types:

+ Rhythm (Speech) (RhythmSp)

### Elements:

+ SpeechLayer

## Sociolect (RSociolectSp)

### Definition:

The Social (group) variety of language used by a speaker. Language of social classes, also professional and specialised languages as well as special languages such as youth language, languages of hobby groups or crook language.

### Supported Entity Types:

+ Sociolect (SociolectSp)

### Elements:

+ SpeechLayer

## Sound (RhasSound)

### Definition:

Best description (or guess) of what the sound actually is.

### Supported Entity Types:

+ Activity (VActivity)
+ Any sound (AnySound)
+ Thing (Thing)

### Elements:

+ SoundLayer

## Sounds like (RSoundsLikeM)

### Definition:

(Other) music or sounds that this Music, Speech, Sound or section is sharing characteristics with, e.g.: sounds like birdsong in the flute (specify exact moment via time code).

### Supported Entity Types:

+ Any sound (AnySound)
+ Creative work (CreativeWork)
+ Genre (Genre)
+ Piece of Music (PieceOfMusic)
+ Repertoire (Repertoire)
+ Repertoire (Repertoire)

### Elements:

+ MusicLayer

## Speaker (RSpeaker)

### Definition:

A person that is speaking. The exact moment can additionally be specified via time code(s).

### Supported Entity Types:

+ Fictional character (FictionalCharacter)
+ Person (Person)

### Supported Roles:
+ VClipContributorRole

### Elements:


## Speaker (RhasSpeaker)

### Definition:

A person that is speaking in this section.

### Supported Entity Types:

+ Fictional character (FictionalCharacter)
+ Person (Person)

### Supported Roles:
+ VClipContributorRole

### Elements:

+ SpeechLayer

## Speechform (RSpeechformSp)

### Definition:

distinguish whether it is a monlogue or dialogue, whether it is a read (pre-formulated) or freely (spontaneously) spoken text.

### Supported Entity Types:

+ Form (SpeechformSp)

### Elements:

+ SpeechLayer

## Tape (RTape)

### Definition:

The tape where the clip was found on.

### Supported Entity Types:

+ Tape (Tape)

### Elements:

+ Clip

## Technical aesthetic (RTechnicalAestheticSo)

### Definition:

Sound engineering conspicuities: Overdrive, noise, proximity and distance to the microphone, reverb/space, fade outs, ...

### Supported Entity Types:

+ Technical aesthetic (TechnicalAestheticSo)

### Elements:

+ SoundLayer

## Tempo (RTempoM)

### Definition:

The tempo of a piece of music, a choice can be made between 'uptempo', 'midtempo' or 'slow', but if the concrete tempo indication from the notation of the piece is known, this can be added additionally.

### Supported Entity Types:

+ Tempo (Music) (TempoM)

### Elements:

+ MusicLayer

## Tempo (RTempoSp)

### Definition:

The subjective impression of the tempo of a Speech. Speech speed is usually measured in words per minute (whereby the average in Austria is around 120 words per minute for a lecture, cf. Christian Bensel 2016). The only important thing for us here is actually the subjective impression: slow, neutral or fast.

### Supported Entity Types:

+ Tempo (Speech) (TempoSp)

### Elements:

+ SpeechLayer

## Timbre (RTimbreSp)

### Definition:

The subjective impression of the timbre of a Speech, for example: dark/bright; sharp/soft; clear/unclear; feminine/masculine

### Supported Entity Types:

+ Timbre (Timbre)

### Elements:

+ SpeechLayer

## Timbre (RTimbreSo)

### Definition:

The subjective impression of the timbre of a Sound: 'dark/bright'; 'sharp/soft; 'clear/blurred'; feminine/masculine'

### Supported Entity Types:

+ Timbre (Timbre)

### Elements:

+ SoundLayer

## Time period (RTimePeriodM)

### Definition:

A time period associated with a piece of music. Larger time spans or repertoires are noted here; multiple entries are possible. This is intended to make it possible to compare/group the origins of different pieces of music beyond individual years. Using the example of the 7th Symphony (Bruckner), the entry here would be 'Romanticism' and/or '19th century'.

### Supported Entity Types:

+ Repertoire (Repertoire)
+ Time period (TimePeriod)

### Elements:

+ MusicLayer

## Volume (RVolumeSp)

### Definition:

The subjective impression of the volume/loudness of a Speech: 'loud/quiet'.

### Supported Entity Types:

+ Volume (Volume)

### Elements:

+ SpeechLayer

## Volume (RVolumeSo)

### Definition:

The subjective impression of the volume of a Sound: 'loud/quiet'.

### Supported Entity Types:

+ Volume (Volume)

### Elements:

+ SoundLayer

# Entity Types
## Accent [AccentSp]

### Definition:

The accent of a speech.

### Allowed for:

+ Accent (RAccentSp)


## Activity [VActivity]

### Definition:

An activity that is being shown or heard (e.g. clapping).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Sound (RhasSound)


## Adress [AdressSp]

### Definition:

The adress of a speech. Is the listener addressed directly or not?

### Allowed for:

+ Addressing (RAddressingSp)


## Affect/Zustand [AffectSp]

### Definition:

The affect of a speech (e.g. angry, happy).

### Allowed for:

+ Affect/Zustand (RAffectSp)


## Any sound [AnySound]

### Definition:

An identifiable sound, most often from nature or everyday life (e.g. birdsong).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Sound (RhasSound)
+ Sounds like (RSoundsLikeM)


## Articulation [ArticulationM]

### Definition:

An articulation used in a musical work (e.g. Legato, Staccato).

### Allowed for:

+ Articulation (RArticulationM)


## Broadcast series [BroadcastSeries]

### Definition:

A recurring TV or radio program (e.g. Ö1 Mittagsjournal).

### Allowed for:

+ Broadcast series (RBroadcastSeries)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Broadcaster [Broadcaster]

### Definition:

A broadcasting organization (e.g. ORF) or a broadcasting station (e.g. Ö1).

### Allowed for:

+ Associated Date (RAssociatedDate)
+ Broadcast date (Sendedatum) (RBroadcastDate)
+ Contributor (RContributor)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Radio station (RStation)
+ Reception (RReceptionM)


## Clip status [Status]

### Definition:

The digitalization status of a clip, eg. 'digitized with online access'

### Allowed for:

+ Clip status (RStatus)


## Clip type [VClipType]

### Definition:

A category describing a clip's form of presentation (e.g. documentary, interview).

### Allowed for:

+ Clip type (RClipType)


## Collection [Collection]

### Definition:

An existing collection of clips (e.g. Wiener Video Rekorder / Mediathek).


## Collective identity [CollectiveIdentity]

### Definition:

A group of people with something in common (e.g. Youth, Nazis, Police).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Container [Container]

### Definition:

A meta construct for categorizing the clips for the ACONTRA project.

### Allowed for:

+ Container (RContainer)


## Contributor role [VClipContributorRole]

### Definition:

The function ascribed to a contributor in the credits (e.g. director, presenter).


## Creative work [CreativeWork]

### Definition:

An identifiable creative work that is not a piece of music (e.g. a book or a film).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Sounds like (RSoundsLikeM)


## Dialect [DialectSp]

### Definition:

The dialect of a speech.

### Allowed for:

+ Dialect (RDialectSp)


## Diegetic [Diegetic]

### Definition:

Is a sound/speech diegetic or non-diegetic?

### Allowed for:

+ Diegetic (RDiegeticM)
+ Diegetic (Sound) (RDiegeticSo)


## Dynamics [DynamicsM]

### Definition:

A dynamics of a musical work (e.g. Forte, Piano).

### Allowed for:

+ Dynamics (RDynamicsM)


## Event [Event]

### Definition:

A concrete event at a certain time and location that can actually be attended (e.g. a concert).

### Allowed for:

+ Associated event (RAssocEventM)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Event series [EventSeries]

### Definition:

A recurring series of events (e.g. Wiener Festwochen).

### Allowed for:

+ Associated event (RAssocEventM)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Fictional character [FictionalCharacter]

### Definition:

A fictional character (e.g. Donald Duck).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Quote (RQuote)
+ Quote (RQuoteSp)
+ Reception (RReceptionM)
+ Speaker (RSpeaker)
+ Speaker (RhasSpeaker)


## Form [SpeechformSp]

### Definition:

The speechform of a speech (Monolog, Dialog, free, read).

### Allowed for:

+ Speechform (RSpeechformSp)


## Genre [Genre]

### Definition:

A subcategory of creative production (e.g. Heavy Metal).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Sounds like (RSoundsLikeM)


## Genre (MusicLayer) [GenreM]

### Definition:

A genre of a musical work (fixed vocabulary: Contemporary classical music (Post-1945), Historical classical music (Pre-1945), International popular music, Folk music (traditionelle Volksmusik), Electronic music, Schlager (German popular Music), Jazz).

### Allowed for:

+ Genre (RGenreM)


## Group [Group]

### Definition:

A group where all members are (or could be) known by name (e.g. The Beatles).

### Allowed for:

+ Contributor (RContributor)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Instrument [InstrumentM]

### Definition:

An instrument used in a musical work (e.g. Piano, Violin).

### Allowed for:

+ Has Instrument (RInstrumentM)


## Instrumentation [InstrumentationM]

### Definition:

An instrumentation of a musical work (e.g. Piano, Orchestra).

### Allowed for:

+ Instrumentation (RInstrumentationM)


## Language [VLanguage]

### Definition:

An official language (e.g. Finnish).

### Allowed for:

+ Keyword (RKeyword)
+ Language (RLanguageSp)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Location [Location]

### Definition:

A place with known GPS coordinates, address, or borders (e.g. Wiener Konzerthaus).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Movement [Movement]

### Definition:

A political, cultural, or artistic movement (e.g. Marxism, Dadaism).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## On site [OnSite]

### Definition:

Information about the type of recording (e.g. live, studio).

### Allowed for:

+ On site (ROnSiteM)
+ On site (Sound) (ROnSiteSo)


## Organization [Organization]

### Definition:

An organization (e.g. United Nations).

### Allowed for:

+ Contributor (RContributor)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Part [PartM]

### Definition:

A part of a musical work, e.g.: 'Intro', 'Main theme', 'Outro'.

### Allowed for:

+ Part (RPartM)


## Pauses (Speech) [PausesSp]

### Definition:

Subjective observation of the pauses: 'many', 'few', 'long', 'short'.

### Allowed for:

+ Pauses (RPausesSp)


## Person [Person]

### Definition:

An actual person, living or dead (e.g. Johannes Chrysostomus Wolfgangus Theophilus Mozart).

### Allowed for:

+ Contributor (RContributor)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Quote (RQuote)
+ Quote (RQuoteSp)
+ Reception (RReceptionM)
+ Speaker (RSpeaker)
+ Speaker (RhasSpeaker)


## Piece of Music [PieceOfMusic]

### Definition:

Any identifiable piece of music (e.g. Donauwalzer, My Way).

### Allowed for:

+ Is Piece of Music (RPieceOfMusic)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Piece Of Music (RHasPieceOfMusic)
+ Programm lyrics (RProgrammLyricsM)
+ Reception (RReceptionM)
+ Sounds like (RSoundsLikeM)


## Pitch [Pitch]

### Definition:

Pitch: 'low' or 'high'.

### Allowed for:

+ Pitch (RPitchSp)
+ Pitch (RPitchSo)


## Place [Place]

### Definition:

A generic type of place (e.g. the street, a church).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Platform [Platform]

### Definition:

A website or institution where clips are to be found (e.g. Österreichische Mediathek).


## Pronoun [PronounSp]

### Definition:

The pronoun of a speech (formal, informal, first person).

### Allowed for:

+ Pronoun (RPronounSp)


## Repertoire [Repertoire]

### Definition:

A musical subcategory (e.g. Wiener Klassik).

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Sounds like (RSoundsLikeM)
+ Sounds like (RSoundsLikeM)
+ Time period (RTimePeriodM)


## Rhythm (Music) [RhythmM]

### Definition:

Rhythm of a musical work (e.g. 3/4, 6/8 or 'Walz', 'Marsch').

### Allowed for:

+ Rhythm (RRhythmM)


## Rhythm (Speech) [RhythmSp]

### Definition:

Distinction between 'inconspicuous/melodic' and 'conspicuous/unmelodic'. If the rhythm is 'conspicuous/unmelodic', it can be further specified: 'bumpy', 'stuttering', etc..

### Allowed for:

+ Rhythm (RRhythmSp)


## Sociolect [SociolectSp]

### Definition:

The sociolect of a speech.

### Allowed for:

+ Sociolect (RSociolectSp)


## Tape [Tape]

### Definition:

The name of a collection of clips on a tape ('Bandl').

### Allowed for:

+ Tape (RTape)


## Technical aesthetic [TechnicalAestheticSo]

### Definition:

The technical aesthetic of a sound (Overdrive, noise, proximity and distance to the microphone, reverb/space, fade outs, ...).

### Allowed for:

+ Technical aesthetic (RTechnicalAestheticSo)


## Tempo (Music) [TempoM]

### Definition:

The tempo of a musical work. Either the tempo description of the piece or 'uptempo', 'midttempo' or 'downtempo'.

### Allowed for:

+ Tempo (RTempoM)


## Tempo (Speech) [TempoSp]

### Definition:

Tempo of a speech: slow or fast.

### Allowed for:

+ Tempo (RTempoSp)


## Thing [Thing]

### Definition:

Any thing appearing in the wide world (e.g. Cigarette).

### Allowed for:

+ Has Instrument (RInstrumentM)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Sound (RhasSound)


## Timbre [Timbre]

### Definition:

Timbre : dark/bright, sharp/soft, clear/blurred feminine/masculine.

### Allowed for:

+ Timbre (RTimbreSp)
+ Timbre (RTimbreSo)


## Time period [TimePeriod]

### Definition:

A timespan or period with historical significance.

### Allowed for:

+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)
+ Time period (RTimePeriodM)


## Topic [Topic]

### Definition:

Any (intangible) concept not fitting any other category.

### Allowed for:

+ Interpretation (RInterpretationAnnot)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Topos [Topos]

### Definition:

Topos.

### Allowed for:

+ Interpretation (RInterpretationAnnot)
+ Keyword (RKeyword)
+ Mentions (RMentionsSp)
+ Reception (RReceptionM)


## Volume [Volume]

### Definition:

Volume: 'loud' or 'quiet'.

### Allowed for:

+ Volume (RVolumeSp)
+ Volume (RVolumeSo)

