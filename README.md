# ACONTRA

## How is national affiliation negotiated in Austrian post-war radio?

_ACONTRA_ is a cooperative project of the University of Music and Performing Arts, the University of Vienna, and the Haus der Geschichte Österreich. It examines the role of radio as a mass medium in the process of constructing national consciousness in the early years of the Second Republic. The starting point for these investigations are auditory sources from Austrian broadcasting institutions: using existing program recordings, the project analyzes how imaginations and projections of the country's past and future are affectively conveyed through the auditory level, and how the medium thus contributes to structuring national temporality and belonging. An important focus lies on examining the relationship to the official taboo, but implicitly present Nazi past.

Although the radio stations of the early Second Republic almost exclusively employed Austrian actors, the stations were officially under Allied administration. The struggle of the Allied administrations for ideological influence on the most important mass medium of the time has been well researched by contemporary historical studies. However, comprehensive analyses of the auditory sources and recorded program recordings are hardly available so far. This is primarily because these primary sources were not or only very poorly catalogued. It wasn't until the 1990s that the Austrian Mediathek acquired an estate of 215 original tapes from the "American" station Rot-Weiß-Rot, most of which have been digitized. As part of the digitization of the ORF archive, 620 tapes of the Russian-controlled RAVAG have also become available; further individual contributions can be found in the DokuFunk archive. The total of 835 tapes from the ORF archive and the Austrian Mediathek were added to the UNESCO World Heritage List in 2016.

However, these holdings are highly fragmented and structurally and content-wise so diverse that they must first be made (scientifically) workable. Using the annotation software LAMA (Linking Annotations for Media Analysis) developed in the Telling Sounds project, connections between the documents are now being established on both production-technical and content-related levels using a Linked Open Data and Semantic Web strategy. This enables the preparation of the material for detailed analyses with regard to the outlined questions. However, through our development and the linking with authority files, the sources and the newly generated standardized metadata will also be made productive for future research.
Further information about the sources and the corpus that has been annotated in the LAMA can be found here: [Handreichung](https://link-to-handreichung-to-be-added).


## About LAMA... Linked Annotations for Media Analysis

LAMA (Linked Annotations for Media Analysis) has been developed in the research project [_Telling Sounds_](https://mdw.ac.at/imi/tellingsounds). LAMA is a research software for capturing and visualizing the interaction of music and its contexts, and it aims to provide a collaborative means of building a corpus of relevant audio material, as well as adding metadata about the contents. Music, Speech, and Other Sounds appearing in a Clip can be described in detail. "Segments" can be used to add structural information about a Clip or single out sections and group annotations. Annotations can be about People, Places, Pieces of Music or historical periods but also political ideologies.

The main concept used to enter information in the system are Annotations. They are used for capturing the various persons, topics, pieces of music and other points of interest ("entities") that appear in the Clips. Besides the relevant Entity (quotes or dates are also supported), an Annotation includes a Relation (in which way something appears in the clip; e.g. "mentioned") and timecodes.
Furthermore, Annotations can be marked as "interpretative", indicating that the annotated Entity does not appear directly but is nevertheless perceived to be present implicitly by the researcher.
Annotations can be grouped either by the sub-element of a clip (Music, Speech etc.) they're describing or by generic, user-defined Segments, which can also be used to describe the various sections of a clip.

LAMA also offers querying capabilities, including combining queries and grouping the results by what is appearing together in the same clip, for example which pieces of music appear together with a specific topic or keyword.
Moreover, connections between clips and entities can be visualized as a network, starting either from a clip or an entity.

## About the application

LAMA is a web application implemented in TypeScript (React, Material UI), with a REST-backend implemented in Python (Bottle), developed in the _Telling Sounds_ project at the mdw Vienna by Julia Jaklin and Peter Provaznik and has been adapted to suite the needs of the _ACONTRA_ project by Julia Jaklin.
All user actions that produce changes are stored in an event log (a SQLite database).
This provides a full history, makes restoring past states or undoing unwanted actions simple, while also providing flexibility regarding changes in data representation.
The data from the event log is fed into a MongoDB server, making the current application state available for querying and retrieval.
This means that the event log is the source of truth for the system, from which the MongoDB representation is created. This can be done with the `reset_from_eventlog.py` script, either restoring the state from the current events database, or providing an exported (`lama.importexport`) XML file.

## Local manual build

### Prerequisites

+ Python 3.8 or newer
+ current Node.js (last version used was v16.15.0)
+ MongoDB 4.4 server running at `localhost:27017`

### Building

+ `cd` to the project root
+ we recommend creating virtualenv: `$ python3 -m venv .venv`
+ activate virtualenv (or use `.venv/bin/python`): `$ . .venv/bin/activate`
+ install python packages: `$ pip install -e backend/`
+ `$ cd frontend/`
+ install npm packages: `$ npm install`
+ compile JavaScript: `$ API_URL="http://localhost:3333" WS_URL="ws://localhost:3333/ws" npm run build:production` (ignore warnings/errors)

### Setup

+ `cd` back to project root: `$ cd ..`
+ create user: `$ python scripts/lamaherder.py createuser admin --privileges a --password Admin123`
+ optionally import data: `$ python scripts/replace_mongo_data.py full.json` (or `PhA.json`)

### Running

+ (use two separate terminal windows)
+ start MongoDB if you haven't already
+ start backend (again use virtualenv): `$ python -m lama.server --cors`
+ frontend needs a web server to work properly, for example: `$ (cd frontend/dist/ && python -m http.server)`
+ point your web browser at `http://localhost:8000` (if using the above command)

## Local development

+ build and setup are identical to local build, no need to compile JS though
+ start backend: `$ python -m lama.server --dev`
+ start frontend dev server: `$ (cd frontend/ && npm run start)`
+ (the dev server provides live reloading; on Linux, if you get an error about too many open files, you could try: `$ sysctl fs.inotify.max_user_watches=524288 && sysctl -p`)

## Additional notes for development

+ Whenever the word "Connection" appears in the code, it should probably be "Annotation".
+ Unfortunately, the code is not well-documented (sorry!); looking at the Props of React components and their type can really help.
+ If you're seriously going to do something with this, we suggest you reach out to the developers for support.


## User management

User data is stored in a separate SQLite DB (default: `lama_users.db`). Users can be managed through either a CLI-script (`scripts/lamaherder.py`) or the API (`/users`). However, if there are no existing users, an (probably admin) user will have to be created using the script.

    usage: lamaherder.py [-h] [--password [PASSWORD]] [--email EMAIL] [--privileges rwa] [--active yn]
                         [--reauth yn]
                         {showusers,createuser,deleteuser,updateuser} [username]

For example: `$ python3 scripts/lamaherder.py createuser admin --privileges a --password MyPass234`

(Usernames need to be 2-12 lowercase letters; passwords need to be 8-16 letters/numbers with at least one uppercase/lowercase/number.)

Once a user has been created, these credentials can be used to obtain an access token.

    $ curl -Ss -H 'Content-type: application/json' -d '{"username": "admin", "password": "MyPass234"}' <backend_url>/auth

Response:

    {
      "username": "admin",
      "privileges": "a",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDAwOTg1MjAsInVzciI6InBwcm92YXpuaWsiLCJwcnYiOiJhIn0.KxIjvVYQpD_ffc6wfP-_dMXyPAMESYFlWeQlIOeq0DY",
      "expires": "2021-12-21T14:55:20+00:00"
    }

Then create users via API:

    $ curl -Ss -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDAwOTg1MjAsInVzciI6InBwcm92YXpuaWsiLCJwcnYiOiJhIn0.KxIjvVYQpD_ffc6wfP-_dMXyPAMESYFlWeQlIOeq0DY' -H 'Content-type: application/json' -X POST -d '{"username": "testuser"}' <backend_url>/users

Response:

    {"password": "RjJ4BBVtKqoq"}

If no password is set, it will be generated. See the `/users` routes in `server.py` for details.


## API Routes


### `/annotations`


#### `POST /annotations`

Create an annotation

|                  | __Route Information__                       |
| ---------------- | ------------------------------------------- |
| __Route__        | /annotations                                |
| __Method__       | POST                                        |
| __Request Body__ | [Entity](#Entity)                           |
| __Response__     | the newly created [Annotation](#Annotation) |

#### `PUT /annotations`

Update an annotation

|                  | __Route Information__                 |
| ---------------- | ------------------------------------- |
| __Route__        | /annotations                          |
| __Method__       | PUT                                   |
| __Request Body__ | [Entity](#Entity)                     |
| __Response__     | the updated [Annotation](#Annotation) |

#### `DELETE /annotations`

Delete an annotation

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /annotations          |
| __Method__ | DELETE                |

### `/auth`


#### `POST /auth`

Get Auth Token

|                  | __Route Information__ |
| ---------------- | --------------------- |
| __Route__        | /auth                 |
| __Method__       | POST                  |
| __Request Body__ | Username, Password    |
| __Response__     | Auth Token            |

### `/clips`


#### `GET /clips`

Get all clips

|              | __Route Information__                      |
| ------------ | ------------------------------------------ |
| __Route__    | /clips                                     |
| __Method__   | GET                                        |
| __Response__ | [Clips](#Clips) and pagination information |

#### `POST /clips`

Create a new clip

|                  | __Route Information__                     |
| ---------------- | ----------------------------------------- |
| __Route__        | /clips                                    |
| __Method__       | POST                                      |
| __Request Body__ | a [Clip](#Clip)Basic object               |
| __Response__     | ClipId of the newly created [Clip](#Clip) |

#### `PUT /clips`

Update basic Metadata of an existing clip

|                  | __Route Information__               |
| ---------------- | ----------------------------------- |
| __Route__        | /clips                              |
| __Method__       | PUT                                 |
| __Request Body__ | a [Clip](#Clip)Basic object         |
| __Response__     | ClipId of the updated [Clip](#Clip) |

#### `GET /clips/<clip_id>`

Get one clip by id

|              | __Route Information__  |
| ------------ | ---------------------- |
| __Route__    | /clips/<clip_id>       |
| __Method__   | GET                    |
| __Response__ | a [Clip](#Clip) object |

#### `GET /clips/basic/<clip_id>`

Get one clip basic by id

|              | __Route Information__  |
| ------------ | ---------------------- |
| __Route__    | /clips/basic/<clip_id> |
| __Method__   | GET                    |
| __Response__ | a [Clip](#Clip) object |

#### `GET /clips/sameShelfmark/<clip_id>`

Get all clip ids of clips with the given shelfmark

|              | __Route Information__          |
| ------------ | ------------------------------ |
| __Route__    | /clips/sameShelfmark/<clip_id> |
| __Method__   | GET                            |
| __Response__ | List of ClipIds                |

### `/elements`


#### `POST /elements`

Create an Element

|                  | __Route Information__           |
| ---------------- | ------------------------------- |
| __Route__        | /elements                       |
| __Method__       | POST                            |
| __Request Body__ | [Element](#Element)             |
| __Response__     | Id of the newly created Element |

#### `PUT /elements`

Update an Element

|                  | __Route Information__     |
| ---------------- | ------------------------- |
| __Route__        | /elements                 |
| __Method__       | PUT                       |
| __Request Body__ | [Element](#Element)       |
| __Response__     | Id of the updated Element |

#### `DELETE /elements`

Delete an Element

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /elements             |
| __Method__ | DELETE                |

### `/entities`


#### `GET /entities`

Get all entities

|              | __Route Information__               |
| ------------ | ----------------------------------- |
| __Route__    | /entities                           |
| __Method__   | GET                                 |
| __Response__ | Entities and pagination information |

#### `POST /entities`

Create a new entity

|                  | __Route Information__                   |
| ---------------- | --------------------------------------- |
| __Route__        | /entities                               |
| __Method__       | POST                                    |
| __Request Body__ | [Entity](#Entity) data                  |
| __Response__     | newly created [Entity](#Entity) with Id |

#### `PUT /entities`

Updade existing entity

|                  | __Route Information__     |
| ---------------- | ------------------------- |
| __Route__        | /entities                 |
| __Method__       | PUT                       |
| __Request Body__ | [Entity](#Entity) data    |
| __Response__     | updated [Entity](#Entity) |

#### `DELETE /entities`

Delete existing entity

|                  | __Route Information__ |
| ---------------- | --------------------- |
| __Route__        | /entities             |
| __Method__       | DELETE                |
| __Request Body__ | [Entity](#Entity)     |

#### `GET /entities/<entity_id>`

Get one Entity by id

|              | __Route Information__ |
| ------------ | --------------------- |
| __Route__    | /entities/<entity_id> |
| __Method__   | GET                   |
| __Response__ | [Entity](#Entity)     |

#### `POST /entities/byId`

Get certain entities by Id

|                  | __Route Information__             |
| ---------------- | --------------------------------- |
| __Route__        | /entities/byId                    |
| __Method__       | POST                              |
| __Request Body__ | List of EntityIds                 |
| __Response__     | List of [Entity](#Entity) objects |

#### `GET /entities/csv`

Download Entities as csv

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /entities/csv         |
| __Method__ | GET                   |

#### `GET /entities/match`

Get entities filtered by search text and type

|                | __Route Information__                                  |
| -------------- | ------------------------------------------------------ |
| __Route__      | /entities/match                                        |
| __Method__     | GET                                                    |
| __Parameters__ | "q": search Text; "type": comma-separated entity types |
| __Response__   | List of [Entity](#Entity) objects                      |

#### `POST /entities/relations`

Add a relation to an Entity

|              | __Route Information__       |
| ------------ | --------------------------- |
| __Route__    | /entities/relations         |
| __Method__   | POST                        |
| __Response__ | List of EntityRelationsData |

#### `GET /entities/relations/<entity_id>`

Return the possible entity relations for an Entity

|              | __Route Information__           |
| ------------ | ------------------------------- |
| __Route__    | /entities/relations/<entity_id> |
| __Method__   | GET                             |
| __Response__ | List of EntityRelationsData     |

#### `GET /entities/suggest`

Get entities by Id for an empty Autocomplete Component

|                | __Route Information__                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| __Route__      | /entities/suggest                                                            |
| __Method__     | GET                                                                          |
| __Parameters__ | "type": comma-separated entity types                                         |
| __Response__   | List of [Entity](#Entity) objects, number: total Number of returned Entities |

### `/export`


#### `GET /export/data`

Export mongo data

|              | __Route Information__         |
| ------------ | ----------------------------- |
| __Route__    | /export/data                  |
| __Method__   | GET                           |
| __Response__ | All data from the mongo store |

#### `GET /export/events`

Export events as xml

|              | __Route Information__ |
| ------------ | --------------------- |
| __Route__    | /export/events        |
| __Method__   | GET                   |
| __Response__ | Events in xml         |

### `/graph`


#### `GET /graph/clip/<clip_id>`

Get the data for the graph view (for a Clip)

|              | __Route Information__           |
| ------------ | ------------------------------- |
| __Route__    | /graph/clip/<clip_id>           |
| __Method__   | GET                             |
| __Response__ | Graph data for the given ClipId |

#### `GET /graph/entity/<entity_id>`

Get the data for the graph view (for an Entity)

|              | __Route Information__             |
| ------------ | --------------------------------- |
| __Route__    | /graph/entity/<entity_id>         |
| __Method__   | GET                               |
| __Response__ | Graph data for the given EntityId |

### `/guest`


#### `GET /guest`

Set privileges for the read only version

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /guest                |
| __Method__ | GET                   |

### `/id`


#### `GET /id/<id_>`

Get Clip, Element (Music, Speech, Noise, Picture), Segment or Entity by id

|              | __Route Information__                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| __Route__    | /id/<id_>                                                                                                    |
| __Method__   | GET                                                                                                          |
| __Response__ | [Clip](#Clip), [Element](#Element) (Music, Speech, Noise, Picture), [Segment](#Segment) or [Entity](#Entity) |

### `/login`


#### `POST /login`

Login a given User

|                  | __Route Information__ |
| ---------------- | --------------------- |
| __Route__        | /login                |
| __Method__       | POST                  |
| __Request Body__ | Username, Password    |

### `/logout`


#### `GET /logout`

Logout

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /logout               |
| __Method__ | GET                   |

### `/query`


#### `POST /query/block`

Results for a query block

|                  | __Route Information__      |
| ---------------- | -------------------------- |
| __Route__        | /query/block               |
| __Method__       | POST                       |
| __Request Body__ | Query block                |
| __Response__     | Results of the query block |

#### `POST /query/entities`

Query entities

|                  | __Route Information__               |
| ---------------- | ----------------------------------- |
| __Route__        | /query/entities                     |
| __Method__       | POST                                |
| __Request Body__ | query: a query string               |
| __Response__     | List of matching [Entity](#Entity)s |

#### `POST /query/intersection`

Results for a intersected query

|                  | __Route Information__            |
| ---------------- | -------------------------------- |
| __Route__        | /query/intersection              |
| __Method__       | POST                             |
| __Request Body__ | block results                    |
| __Response__     | Results of the intersected query |

### `/search`


#### `GET /search/quotes`

Search through quotes

|              | __Route Information__               |
| ------------ | ----------------------------------- |
| __Route__    | /search/quotes                      |
| __Method__   | GET                                 |
| __Response__ | Quotes, where search string matched |

### `/segments`


#### `POST /segments`

Create a new Segment

|                  | __Route Information__           |
| ---------------- | ------------------------------- |
| __Route__        | /segments                       |
| __Method__       | POST                            |
| __Request Body__ | [Segment](#Segment)             |
| __Response__     | Id of the newly created Segment |

#### `PUT /segments`

Update the Basic Info of a Segment

|                  | __Route Information__     |
| ---------------- | ------------------------- |
| __Route__        | /segments                 |
| __Method__       | PUT                       |
| __Request Body__ | [Segment](#Segment)       |
| __Response__     | Id of the updated Segment |

#### `DELETE /segments`

Delete a Segment

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /segments             |
| __Method__ | DELETE                |

#### `PUT /segments/annotations`

Update the List of Annotations belonging to a Segment

|                  | __Route Information__                                     |
| ---------------- | --------------------------------------------------------- |
| __Route__        | /segments/annotations                                     |
| __Method__       | PUT                                                       |
| __Request Body__ | [Segment](#Segment)Id, List of [Annotation](#Annotation)s |
| __Response__     | Id of the updated Segment                                 |

### `/users`


#### `GET /users`

Get all users

|              | __Route Information__ |
| ------------ | --------------------- |
| __Route__    | /users                |
| __Method__   | GET                   |
| __Response__ | List of all users     |

#### `POST /users`

Create new user

|              | __Route Information__                                      |
| ------------ | ---------------------------------------------------------- |
| __Route__    | /users                                                     |
| __Method__   | POST                                                       |
| __Response__ | User and newly generated password if no password was given |

#### `GET /users/<user_id>/favorites`

Get favorites from a user

|              | __Route Information__                           |
| ------------ | ----------------------------------------------- |
| __Route__    | /users/<user_id>/favorites                      |
| __Method__   | GET                                             |
| __Response__ | userId, favoriteClips: List of [Clip](#Clip)Ids |

#### `POST /users/<user_id>/favorites`

Set or unset a favorite clip

|            | __Route Information__      |
| ---------- | -------------------------- |
| __Route__  | /users/<user_id>/favorites |
| __Method__ | POST                       |

#### `DELETE /users/<user_id>/favorites`

Set or unset a favorite clip

|            | __Route Information__      |
| ---------- | -------------------------- |
| __Route__  | /users/<user_id>/favorites |
| __Method__ | DELETE                     |

#### `GET /users/<username>`

Get user by username

|              | __Route Information__ |
| ------------ | --------------------- |
| __Route__    | /users/<username>     |
| __Method__   | GET                   |
| __Response__ | User                  |

#### `PUT /users/<username>`

Update user

|              | __Route Information__                         |
| ------------ | --------------------------------------------- |
| __Route__    | /users/<username>                             |
| __Method__   | PUT                                           |
| __Response__ | newly generated password, if no new was given |

#### `DELETE /users/<username>`

Delete user

|            | __Route Information__ |
| ---------- | --------------------- |
| __Route__  | /users/<username>     |
| __Method__ | DELETE                |

#### `GET /users/me`

Get username of currently loggend in user

|              | __Route Information__ |
| ------------ | --------------------- |
| __Route__    | /users/me             |
| __Method__   | GET                   |
| __Response__ | username, privileges  |

## Schemas

### Annotation

| name           | type                                                                                                                                                                                                                                                                                                                                                                                                                                                              | required | description                                                                                                                                                                 | pattern                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| _id            | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | y        | Annotation ID.                                                                                                                                                              | -                                                                            |
| type           | `Annotation`                                                                                                                                                                                                                                                                                                                                                                                                                                                      | y        | Always "Annotation".                                                                                                                                                        | -                                                                            |
| clip           | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | y        | ID of the Clip the Annotation belongs to.                                                                                                                                   | -                                                                            |
| element        | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | ID of the associated Element, if applicable.                                                                                                                                | -                                                                            |
| relation       | `RBroadcastDate, RBroadcastSeries, RContributor, RDateOfCreation, RInstrument, RKeyword, RLyricsQuote, RTextQuote, RMentions, RMusicalQuote, RPerformanceDate, RPerformer, RPieceOfMusic, RProductionTechniquePicture, RProductionTechniqueSound, RQuote, RRecordingDate, RReminiscentOfMusic, RReminiscentOfNoise, RReminiscentOfPicture, RReminiscentOfSpeech, RShot, RShows, RSoundAdjective, RSoundsLike, RSoundsLikeNoise, RSpeaker, RSpeechDescriptionText` | y        | The Relation expressed by the Annotation.                                                                                                                                   | -                                                                            |
| target         | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | ID of the entity being annotated or of the person associated with a quote.                                                                                                  | -                                                                            |
| quotes         | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | The text of a quote, if applicable.                                                                                                                                         | -                                                                            |
| date           | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | The date being annotated, in EDTF (level 1) format.                                                                                                                         | -                                                                            |
| role           | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | ID of role-Entity (of type VClipContributorRole, VFunctionInClipRole, or VMusicPerformanceRole), if applicable.                                                             | -                                                                            |
| metaDate       | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | Supplementary date information, for example the year the annotated person was photographed or recorded, in EDTF (level 1) format.                                           | -                                                                            |
| timecodeStart  | integer                                                                                                                                                                                                                                                                                                                                                                                                                                                           | n        | Starting timecode of Annotation, in seconds from the beginning of the clip.                                                                                                 | -                                                                            |
| timecodeEnd    | integer                                                                                                                                                                                                                                                                                                                                                                                                                                                           | n        | Ending timecode of Annotation, in seconds from the beginning of the clip.                                                                                                   | -                                                                            |
| confidence     | `certain, maybe, unsure`                                                                                                                                                                                                                                                                                                                                                                                                                                          | n        | Supplementary information about how confident the annotator is about the accuracy of the annotated information.                                                             | -                                                                            |
| attribution    | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | Supplementary information about the origin of the Annotation's contents, for example a bibliographic reference.                                                             | -                                                                            |
| comment        | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | Free-form comment, that will be shown in the UI.                                                                                                                            | -                                                                            |
| interpretative | boolean                                                                                                                                                                                                                                                                                                                                                                                                                                                           | n        | Whether the Annotation describes something which is explicitly shown or mentioned, or something that is not present explicitly, but nevertheless inferred by the annotator. | -                                                                            |
| constitutedBy  | array                                                                                                                                                                                                                                                                                                                                                                                                                                                             | n        | IDs of other Annotations (on the same Clip) which support the interpretative Annotation.                                                                                    | -                                                                            |
| notablyAbsent  | boolean                                                                                                                                                                                                                                                                                                                                                                                                                                                           | n        | Whether the Annotation is about something that would be expected to be present, but isn't.                                                                                  | -                                                                            |
| refersTo       | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | ID of another Annotation (on the same Clip) that the current Annotation applies to.                                                                                         | -                                                                            |
| created        | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | y        | Timestamp of the Annotation's creation, in ISO8601 format.                                                                                                                  | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy      | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | y        | Username of the user who created the Annotation.                                                                                                                            | -                                                                            |
| updated        | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | Timestamp of the Annotation's last update, in ISO8601 format.                                                                                                               | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy      | string                                                                                                                                                                                                                                                                                                                                                                                                                                                            | n        | Username of the user who last updated the Annotation.                                                                                                                       | -                                                                            |

### Clip

| name         | type    | required | description                                                                             | pattern                                                                      |
| ------------ | ------- | -------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| _id          | string  | y        | Clip ID.                                                                                | -                                                                            |
| type         | `Clip`  | y        | Always "Clip".                                                                          | -                                                                            |
| effectiveId  | string  | n        | Derived ID used for deduplication purposes.                                             | -                                                                            |
| title        | string  | y        | The Clip's title, as it appears on the source website.                                  | -                                                                            |
| label        | string  | n        | Optional user-defined label, in case the original title is too long or unclear.         | -                                                                            |
| subtitle     | string  | n        | The Clip's subtitle, if applicable.                                                     | -                                                                            |
| url          | string  | y        | The URL (preferably permalink) of the website where the Clip can be found.              | -                                                                            |
| platform     | string  | y        | The ID of the platform-Entity (like "Mediathek" or "YouTube") associated with the Clip. | -                                                                            |
| collections  | array   | n        | IDs of (user-defined) collection-Entities the Clip belongs to.                          | -                                                                            |
| fileType     | `a, v`  | y        | Whether the Clip is an audio or video file.                                             | -                                                                            |
| duration     | integer | y        | Duration of the Clip in seconds.                                                        | -                                                                            |
| shelfmark    | string  | n        | Shelfmark ("Signatur") of the Clip, if applicable.                                      | -                                                                            |
| language     | array   | y        | IDs of language-Entities that apply to the Clip.                                        | -                                                                            |
| clipType     | array   | y        | IDs of ClipType-Entities that best describe the Clip (for example: "Interview").        | -                                                                            |
| description  | string  | n        | Free-form description, either copied from the source or user-provided.                  | -                                                                            |
| created      | string  | n        | Timestamp of the Clips's creation in the system, in ISO8601 format.                     | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy    | string  | n        | Username of the user who created the Clip in the system.                                | -                                                                            |
| updated      | string  | n        | Timestamp of the Clips's last update in the system, in ISO8601 format.                  | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy    | string  | n        | Username of the user who last updated the Clip in the system.                           | -                                                                            |
| updatedAny   | string  | n        | Timestamp of last update of the Clip or any of its Annotations, in ISO8601 format.      | -                                                                            |
| updatedAnyBy | string  | n        | Username of the user who last updated the Clip or any of its Annotations.               | -                                                                            |

### Element

| name        | type                            | required | description                                                                               | pattern                                                                      |
| ----------- | ------------------------------- | -------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| _id         | string                          | y        | The ID of the Element.                                                                    | -                                                                            |
| type        | `Music, Noise, Picture, Speech` | y        | Which aspect/layer/type of phenomenon the Element is about.                               | -                                                                            |
| clip        | string                          | y        | ID of the Clip the Element belongs to.                                                    | -                                                                            |
| label       | string                          | y        | User-provided label.                                                                      | -                                                                            |
| description | string                          | y        | User-provided description explaining what the Element is referring to.                    | -                                                                            |
| timecodes   | array                           | y        | Pairs of start and end timecodes (in seconds) identifying the relevant parts of the Clip. | -                                                                            |
| created     | string                          | y        | Timestamp of the Element's creation in the system, in ISO8601 format.                     | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy   | string                          | y        | Username of the user who created the Element in the system.                               | -                                                                            |
| updated     | string                          | n        | Timestamp of the Element's last update in the system, in ISO8601 format.                  | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy   | string                          | n        | Username of the user who last updated the Element in the system.                          | -                                                                            |

### Entity

| name               | type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | required | description                                                                    | pattern                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| _id                | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | y        | ID of the Entity.                                                              | -                                                                            |
| type               | `AnySound, BroadcastSeries, Broadcaster, Collection, CollectiveIdentity, CreativeWork, Event, EventSeries, FictionalCharacter, Genre, Group, LieuDeMemoire, Location, Movement, Organization, Person, PieceOfMusic, Place, Platform, ProductionTechniquePicture, ProductionTechniqueSound, Repertoire, Shot, Station, Thing, TimePeriod, Topic, Topos, VActivity, VAdjective, VClipContributorRole, VFunctionInClipRole, VClipType, VEventType, VInstrument, VLanguage, VMusicArts, VMusicPerformanceRole, VSpeechGenre` | y        | The Entity's type.                                                             | -                                                                            |
| label              | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | y        | Primary label.                                                                 | -                                                                            |
| description        | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | y        | Short description that ideally makes it clear what the Entity is referring to. | -                                                                            |
| authorityURIs      | array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | y        | Authority URIs, preferably GND, Wikidata, or MusicBrainz (for music).          | -                                                                            |
| analysisCategories | array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | n        | Analysis-categories assigned to the Entity.                                    | -                                                                            |
| attributes         | object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | n        | Experimental attributes imported from authority data (Entity-IDs).             | -                                                                            |
| created            | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | n        | Timestamp of the Entity's creation in the system, in ISO8601 format.           | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy          | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | n        | Username of the user who created the Entity in the system.                     | -                                                                            |
| updated            | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | n        | Timestamp of the Entity's last update in the system, in ISO8601 format.        | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy          | string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | n        | Username of the user who last updated the Entity in the system.                | -                                                                            |

### Segment

| name            | type      | required | description                                                                               | pattern                                                                      |
| --------------- | --------- | -------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| _id             | string    | y        | Segment ID.                                                                               | -                                                                            |
| type            | `Segment` | y        | Always "Segment".                                                                         | -                                                                            |
| clip            | string    | y        | ID of the Clip the Segment belongs to.                                                    | -                                                                            |
| label           | string    | y        | User-provided label.                                                                      | -                                                                            |
| description     | string    | y        | User-provided description explaining what the Segment is referring to.                    | -                                                                            |
| timecodes       | array     | y        | Pairs of start and end timecodes (in seconds) identifying the relevant parts of the Clip. | -                                                                            |
| segmentContains | array     | y        | IDs of Annotations belonging to the Segment, with metadata.                               | -                                                                            |
| created         | string    | y        | Timestamp of the Segment's creation in the system, in ISO8601 format.                     | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| createdBy       | string    | y        | Username of the user who created the Segment in the system.                               | -                                                                            |
| updated         | string    | n        | Timestamp of the Segment's last update in the system, in ISO8601 format.                  | `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{6})?\+00:00$` |
| updatedBy       | string    | n        | Username of the user who last updated the Segment in the system.                          | -                                                                            |
