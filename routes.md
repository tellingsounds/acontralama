## API Routes


### `/annotations`


#### `POST /annotations`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /annotations |
| __Method__ | POST |

#### `PUT /annotations`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /annotations |
| __Method__ | PUT |

#### `DELETE /annotations`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /annotations |
| __Method__ | DELETE |

### `/auth`


#### `POST /auth`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /auth |
| __Method__ | POST |

### `/clips`


#### `GET /clips`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /clips |
| __Method__ | GET |

#### `POST /clips`

Create a new clip

|   | __Route Information__ |
|---|---|
| __Route__ | /clips |
| __Method__ | POST |
| __Request Body__ | a clip basic object |
| __Response__ | a string with the clipId of the newly created clip) |

#### `PUT /clips`

Update basic metadata of an existing clip

|   | __Route Information__ |
|---|---|
| __Route__ | /clips |
| __Method__ | PUT |
| __Request Body__ | a clip basic object |
| __Response__ | a string with the clipId of the updated clip |

#### `GET /clips/<clip_id>`

Get one clip by id

|   | __Route Information__ |
|---|---|
| __Route__ | /clips/<clip_id> |
| __Method__ | GET |
| __Response__ | a [Clip](#Clip) object |

#### `GET /clips/basic/<clip_id>`

Get one clip basic by id

|   | __Route Information__ |
|---|---|
| __Route__ | /clips/basic/<clip_id> |
| __Method__ | GET |
| __Response__ | a [ClipBasic](#ClipBasic) object |

#### `GET /clips/sameShelfmark/<clip_id>`

Get all clip ids of clips with the given shelfmark

|   | __Route Information__ |
|---|---|
| __Route__ | /clips/sameShelfmark/<clip_id> |
| __Method__ | GET |
| __Response__ | List of ClipIds |

### `/elements`


#### `POST /elements`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /elements |
| __Method__ | POST |

#### `PUT /elements`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /elements |
| __Method__ | PUT |

#### `DELETE /elements`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /elements |
| __Method__ | DELETE |

### `/entities`


#### `GET /entities`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /entities |
| __Method__ | GET |

#### `POST /entities`

Create a new entity

|   | __Route Information__ |
|---|---|
| __Route__ | /entities |
| __Method__ | POST |
| __Request Body__ | [Entity](#Entity) data |
| __Response__ | newly created [Entity](#Entity) with Id |

#### `PUT /entities`

Updade existing entity

|   | __Route Information__ |
|---|---|
| __Route__ | /entities |
| __Method__ | PUT |
| __Request Body__ | [Entity](#Entity) data |
| __Response__ | updated [Entity](#Entity) |

#### `DELETE /entities`

Delete existing entity

|   | __Route Information__ |
|---|---|
| __Route__ | /entities |
| __Method__ | DELETE |
| __Request Body__ | [Entity](#Entity) |

#### `GET /entities/<entity_id>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/<entity_id> |
| __Method__ | GET |

#### `POST /entities/byId`

Get entities by Id

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/byId |
| __Method__ | POST |
| __Request Body__ | List of EntityIds |
| __Response__ | List of [Entity](#Entity) objects |

#### `GET /entities/csv`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/csv |
| __Method__ | GET |

#### `GET /entities/match`

Get entities filtered by search text and type

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/match |
| __Method__ | GET |
| __Parameters__ | "q": search Text; "type": comma-separated entity types |
| __Response__ | List of [Entity](#Entity) objects |

#### `POST /entities/relations`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/relations |
| __Method__ | POST |

#### `GET /entities/relations/<entity_id>`

Return the possible entity relations for an Entity

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/relations/<entity_id> |
| __Method__ | GET |
| __Response__ | List of [EntityRelationsData](#EntityRelationsData) |

#### `GET /entities/suggest`

Get entities by Id

|   | __Route Information__ |
|---|---|
| __Route__ | /entities/suggest |
| __Method__ | GET |
| __Parameters__ | "type": comma-separated entity types |
| __Response__ | List of [Entity](#Entity) objects, number: total Number of returned Entities |

### `/export`


#### `GET /export/data`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /export/data |
| __Method__ | GET |

#### `GET /export/events`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /export/events |
| __Method__ | GET |

### `/graph`


#### `GET /graph/clip/<clip_id>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /graph/clip/<clip_id> |
| __Method__ | GET |

#### `GET /graph/entity/<entity_id>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /graph/entity/<entity_id> |
| __Method__ | GET |

### `/guest`


#### `GET /guest`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /guest |
| __Method__ | GET |

### `/id`


#### `GET /id/<id_>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /id/<id_> |
| __Method__ | GET |

### `/login`


#### `POST /login`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /login |
| __Method__ | POST |

### `/logout`


#### `GET /logout`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /logout |
| __Method__ | GET |

### `/query`


#### `POST /query/block`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /query/block |
| __Method__ | POST |

#### `POST /query/entities`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /query/entities |
| __Method__ | POST |

#### `POST /query/intersection`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /query/intersection |
| __Method__ | POST |

### `/search`


#### `GET /search/quotes`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /search/quotes |
| __Method__ | GET |

### `/segments`


#### `POST /segments`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /segments |
| __Method__ | POST |

#### `PUT /segments`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /segments |
| __Method__ | PUT |

#### `DELETE /segments`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /segments |
| __Method__ | DELETE |

#### `PUT /segments/annotations`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /segments/annotations |
| __Method__ | PUT |

### `/users`


#### `GET /users`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users |
| __Method__ | GET |

#### `POST /users`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users |
| __Method__ | POST |

#### `GET /users/<user_id>/favorites`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/<user_id>/favorites |
| __Method__ | GET |

#### `POST /users/<user_id>/favorites`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/<user_id>/favorites |
| __Method__ | POST |

#### `DELETE /users/<user_id>/favorites`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/<user_id>/favorites |
| __Method__ | DELETE |

#### `GET /users/<username>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/<username> |
| __Method__ | GET |

#### `PUT /users/<username>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/<username> |
| __Method__ | PUT |

#### `DELETE /users/<username>`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/<username> |
| __Method__ | DELETE |

#### `GET /users/me`

_no description yet_

|   | __Route Information__ |
|---|---|
| __Route__ | /users/me |
| __Method__ | GET |

## Schemas

### Annotation

| name | type | required | description | pattern |
| --- | --- | --- | --- | --- |
| _id | string | y | Annotation ID. | - |
| type | `Annotation` | y | Always "Annotation". | - |
| clip | string | y | ID of the Clip the Annotation belongs to. | - |
| element | string | n | ID of the associated Element, if applicable. | - |
| relation | `RBroadcastDate, RBroadcastSeries, RContributor, RDateOfCreation, RInstrument, RKeyword, RLyricsQuote, RTextQuote, RMentions, RMusicalQuote, RPerformanceDate, RPerformer, RPieceOfMusic, RProductionTechniquePicture, RProductionTechniqueSound, RQuote, RRecordingDate, RReminiscentOfMusic, RReminiscentOfNoise, RReminiscentOfPicture, RReminiscentOfSpeech, RShot, RShows, RSoundAdjective, RSoundsLike, RSoundsLikeNoise, RSpeaker, RSpeechDescriptionText` | y | The Relation expressed by the Annotation. | - |
| target | string | n | ID of the entity being annotated or of the person associated with a quote. | - |
| quotes | string | n | The text of a quote, if applicable. | - |
| date | string | n | The date being annotated, in EDTF (level 1) format. | - |
| role | string | n | ID of role-Entity (of type VClipContributorRole, VFunctionInClipRole, or VMusicPerformanceRole), if applicable. | - |
| metaDate | string | n | Supplementary date information, for example the year the annotated person was photographed or recorded, in EDTF (level 1) format. | - |
| timecodeStart | integer | n | Starting timecode of Annotation, in seconds from the beginning of the clip. | - |
| timecodeEnd | integer | n | Ending timecode of Annotation, in seconds from the beginning of the clip. | - |
| confidence | `certain, maybe, unsure` | n | Supplementary information about how confident the annotator is about the accuracy of the annotated information. | - |
| attribution | string | n | Supplementary information about the origin of the Annotation's contents, for example a bibliographic reference. | - |
| comment | string | n | Free-form comment, that will be shown in the UI. | - |
| interpretative | boolean | n | Whether the Annotation describes something which is explicitly shown or mentioned, or something that is not present explicitly, but nevertheless inferred by the annotator. | - |
| constitutedBy | array | n | IDs of other Annotations (on the same Clip) which support the interpretative Annotation. | - |
| notablyAbsent | boolean | n | Whether the Annotation is about something that would be expected to be present, but isn't. | - |
| refersTo | string | n | ID of another Annotation (on the same Clip) that the current Annotation applies to. | - |
| created | string | y | Timestamp of the Annotation's creation, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy | string | y | Username of the user who created the Annotation. | - |
| updated | string | n | Timestamp of the Annotation's last update, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy | string | n | Username of the user who last updated the Annotation. | - |

### Clip

| name | type | required | description | pattern |
| --- | --- | --- | --- | --- |
| _id | string | y | Clip ID. | - |
| type | `Clip` | y | Always "Clip". | - |
| effectiveId | string | n | Derived ID used for deduplication purposes. | - |
| title | string | y | The Clip's title, as it appears on the source website. | - |
| label | string | n | Optional user-defined label, in case the original title is too long or unclear. | - |
| subtitle | string | n | The Clip's subtitle, if applicable. | - |
| url | string | y | The URL (preferably permalink) of the website where the Clip can be found. | - |
| platform | string | y | The ID of the platform-Entity (like "Mediathek" or "YouTube") associated with the Clip. | - |
| collections | array | n | IDs of (user-defined) collection-Entities the Clip belongs to. | - |
| fileType | `a, v` | y | Whether the Clip is an audio or video file. | - |
| duration | integer | y | Duration of the Clip in seconds. | - |
| shelfmark | string | n | Shelfmark ("Signatur") of the Clip, if applicable. | - |
| language | array | y | IDs of language-Entities that apply to the Clip. | - |
| clipType | array | y | IDs of ClipType-Entities that best describe the Clip (for example: "Interview"). | - |
| description | string | n | Free-form description, either copied from the source or user-provided. | - |
| created | string | n | Timestamp of the Clips's creation in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy | string | n | Username of the user who created the Clip in the system. | - |
| updated | string | n | Timestamp of the Clips's last update in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy | string | n | Username of the user who last updated the Clip in the system. | - |
| updatedAny | string | n | Timestamp of last update of the Clip or any of its Annotations, in ISO8601 format. | - |
| updatedAnyBy | string | n | Username of the user who last updated the Clip or any of its Annotations. | - |

### Element

| name | type | required | description | pattern |
| --- | --- | --- | --- | --- |
| _id | string | y | The ID of the Element. | - |
| type | `Music, Noise, Picture, Speech` | y | Which aspect/layer/type of phenomenon the Element is about. | - |
| clip | string | y | ID of the Clip the Element belongs to. | - |
| label | string | y | User-provided label. | - |
| description | string | y | User-provided description explaining what the Element is referring to. | - |
| timecodes | array | y | Pairs of start and end timecodes (in seconds) identifying the relevant parts of the Clip. | - |
| created | string | y | Timestamp of the Element's creation in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy | string | y | Username of the user who created the Element in the system. | - |
| updated | string | n | Timestamp of the Element's last update in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy | string | n | Username of the user who last updated the Element in the system. | - |

### Entity

| name | type | required | description | pattern |
| --- | --- | --- | --- | --- |
| _id | string | y | ID of the Entity. | - |
| type | `AnySound, BroadcastSeries, Broadcaster, Collection, CollectiveIdentity, CreativeWork, Event, EventSeries, FictionalCharacter, Genre, Group, LieuDeMemoire, Location, Movement, Organization, Person, PieceOfMusic, Place, Platform, ProductionTechniquePicture, ProductionTechniqueSound, Repertoire, Shot, Station, Thing, TimePeriod, Topic, Topos, VActivity, VAdjective, VClipContributorRole, VFunctionInClipRole, VClipType, VEventType, VInstrument, VLanguage, VMusicArts, VMusicPerformanceRole, VSpeechGenre` | y | The Entity's type. | - |
| label | string | y | Primary label. | - |
| description | string | y | Short description that ideally makes it clear what the Entity is referring to. | - |
| authorityURIs | array | y | Authority URIs, preferably GND, Wikidata, or MusicBrainz (for music). | - |
| analysisCategories | array | n | Analysis-categories assigned to the Entity. | - |
| attributes | object | n | Experimental attributes imported from authority data (Entity-IDs). | - |
| created | string | n | Timestamp of the Entity's creation in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy | string | n | Username of the user who created the Entity in the system. | - |
| updated | string | n | Timestamp of the Entity's last update in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy | string | n | Username of the user who last updated the Entity in the system. | - |

### Segment

| name | type | required | description | pattern |
| --- | --- | --- | --- | --- |
| _id | string | y | Segment ID. | - |
| type | `Segment` | y | Always "Segment". | - |
| clip | string | y | ID of the Clip the Segment belongs to. | - |
| label | string | y | User-provided label. | - |
| description | string | y | User-provided description explaining what the Segment is referring to. | - |
| timecodes | array | y | Pairs of start and end timecodes (in seconds) identifying the relevant parts of the Clip. | - |
| segmentContains | array | y | IDs of Annotations belonging to the Segment, with metadata. | - |
| created | string | y | Timestamp of the Segment's creation in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy | string | y | Username of the user who created the Segment in the system. | - |
| updated | string | n | Timestamp of the Segment's last update in the system, in ISO8601 format. | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy | string | n | Username of the user who last updated the Segment in the system. | - |


