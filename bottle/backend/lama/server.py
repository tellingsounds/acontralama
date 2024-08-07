"""Main entrypoint for the backend application (bottle.py)."""

import argparse
import json
import logging
import math
import os
from datetime import datetime, timezone

import bottle
from bottle import abort, hook, request, response, route

# from bottle.ext.websocket import GeventWebSocketServer
# from bottle.ext.websocket import websocket
# from geventwebsocket.exceptions import WebSocketError

import jwt

from lama.config import app_port
from lama.truth.commands_events import Commands
from lama.commands import process_command
from lama.database import (
    db,
    get_document_by_id,
    get_mongo_data,
    init_db,
    ASC,
    DESC,
)
from lama.entities import (
    get_entity_by_id,
    get_entities_by_id,
    get_entities,
    make_entity_stats_csv,
)
from lama.importexport import get_events_xml
from lama.entity_relations import get_entity_relations
from lama.clips import (
    get_clip_by_id,
    get_basic_clip_by_id,
    get_clips,
    get_favorite_clip_ids,
)
from lama.fuzzy import fuzzy_map
from lama.query import (
    get_clips_containing_entities,
    get_clips_excluding_entities,
    get_clips_with_date,
)
from lama.entity_zoo import EntityZoo

from lama.query_entities_mongo import find_matching_entities
from lama.query_blocks import get_block_result, get_intersection_by_clip

from lama.graph import get_graph_data_clip, get_graph_data_entity

from lama.text_search import quote_search

from lama.errors import (
    IdNotFoundError,
    SomethingWentWrongError,
    ValidationError,
)

from lama.userstore import (
    check_credentials,
    check_status,
    create_user,
    delete_user,
    update_user,
    get_users,
    Privileges as P,
    generate_password,
    UsernameError,
    PasswordError,
    UserAuthenticationError,
    UserStoreError,
)

# sockets = set()


# def _ws_broadcast(d):
#     message = json.dumps(d)
#     print("Broadcasting", message)
#     sockets_to_remove = set()
#     for s in sockets:
#         try:
#             s.send(message)
#         except WebSocketError:
#             sockets_to_remove.add(s)
#     for s in sockets_to_remove:
#         sockets.remove(s)


GIT_REVISION = "dev"  # set on startup in production
LOCALHOST_CORS = False


def _get_allowed_origin():
    from urllib.parse import urlparse

    request_origin = request.headers.get("Origin", "")
    if urlparse(request_origin).netloc.startswith("localhost"):
        return request_origin
    return ""


def handle_error(http_error: bottle.HTTPError):
    response.content_type = "application/json"
    if GIT_REVISION == "dev" or LOCALHOST_CORS:
        enable_cors()
    logging.exception("%s\n", http_error.traceback)
    return json.dumps({"message": http_error.body})


def return_error(message="something went wrong", status_code=500):
    raise bottle.HTTPError(
        body=message,
        status=status_code,
        headers={"Content-type": "application/json"},
    )


@hook("before_request")
def ensure_revisions_match() -> None:
    if request.fullpath in ["/ws", "/entities/csv"]:
        return
    client_revision = request.headers.get("LAMA-Revision")
    if (
        client_revision is not None
        and GIT_REVISION is not None
        and GIT_REVISION != "dev"
        and request.method != "OPTIONS"
        and client_revision != GIT_REVISION
    ):
        return_error("Client is out of date, please reload the app!", 400)


@hook("before_request")
def require_json() -> None:
    if request.method in ("POST", "PUT", "PATCH"):
        try:
            if request.json is None:
                raise ValueError
        except (json.decoder.JSONDecodeError, TypeError, ValueError):
            return_error("valid JSON content is required", 400)


@hook("after_request")
def enable_cors():
    # response.headers["Access-Control-Allow-Origin"] = "*"

    if GIT_REVISION == "dev" or LOCALHOST_CORS:
        response.headers["Access-Control-Allow-Origin"] = _get_allowed_origin()
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers["Access-Control-Allow-Headers"] = (
            "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token, LAMA-Revision"
        )
        response.headers["Access-Control-Allow-Credentials"] = "true"


# @route("/clients", "GET")
# def get_sockets():
#     from hashlib import sha256
#     return {
#         "clients": [sha256(str(s).encode()).hexdigest()[:7] for s in sockets]
#     }


@route("<:re:.*>", "OPTIONS")
def enable_options_route():
    pass


LAMA_USERNAME = "lama.username"
LAMA_PRIVILEGES = "lama.privileges"


def get_user_id() -> str:
    return request[LAMA_USERNAME]


def get_user_privileges() -> str:
    return request[LAMA_PRIVILEGES]  # r w a


def handle_command(command_name, additional_payload={}):
    # careful, there are 2 kinds of "error" scenarios:
    # 1. command gets rejected because invalid etc.
    # 2. command accepted, but something goes wrong
    # processing the ensuing event(s)
    # in the case of 2., the command / event should
    # still be rejected and no changes made
    try:
        payload = {
            **request.json,
            **additional_payload,
        }
        return process_command(command_name, payload, get_user_id())
    except json.JSONDecodeError:
        abort(400, "invalid JSON")
    except ValidationError as ve:
        abort(400, str(ve))
    except IdNotFoundError as infe:
        abort(404, str(infe))
    except SomethingWentWrongError as swwe:
        abort(500, str(swwe))


@route("/users/me", "GET")
def get_current_username():
    """Get username of currently loggend in user
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: username, privileges
    """
    return {"username": get_user_id(), "privileges": get_user_privileges()}


@route("/users/<user_id>/favorites", ["POST", "DELETE"])
def handle_set_favorite_clip(user_id):
    """Set or unset a favorite clip
    Method: POST | DELETE
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    if user_id != get_user_id() and get_user_privileges() != P.a.name:
        abort(403, "not authorized")  # can only edit your own favorites
    handle_command(
        Commands.SetClipFavoriteStatus,
        {"is_favorite": request.method == "POST", "user_id": user_id},
    )


@route("/id/<id_>", "GET")
def get_anything_by_id(id_):
    """Get Clip, Element (Music, Speech, Noise, Picture), Layer, Segment or Entity by id
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: {{Clip}}, {{Element}} (Music, Speech, Noise, Picture), {{Layer}}, {{Segment}} or {{Entity}}
    """
    try:
        return get_document_by_id(id_)
    except IdNotFoundError as e:
        abort(404, str(e))


@route("/entities/<entity_id>", "GET")
def get_one_entity(entity_id):
    """Get one Entity by id
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: {{Entity}}
    """
    try:
        return get_entity_by_id(entity_id)
    except IdNotFoundError as e:
        abort(404, str(e))


@route("/entities/csv", "GET")
def download_entities_csv():
    """Download Entities as csv
    Method: GET
    Produces: .csv-file
    Parameters: -
    Request body: -
    Response: -
    """
    from datetime import datetime
    import os

    basepath = "/tmp"
    filename = (
        "entities_" + datetime.now().strftime("%Y%m%d-%H%M%S") + "utc.csv"
    )
    fullpath = os.path.join(basepath, filename)
    with open(fullpath, "w", encoding="utf-8") as f:
        f.write(make_entity_stats_csv())
    return bottle.static_file(filename, root=basepath, download=filename)


ORDERING = {
    "asc": ASC,
    "desc": DESC,
}

CLIP_SORT_FIELDS = {
    "createdBy",
    "duration",
    "fileType",
    "labelTitle",
    "platform",
    "updatedAny",
    "annotationCount",
    "associatedDate",
}


def _find_index(items_with_id, item_id):
    for i, x in enumerate(items_with_id):
        if x["_id"] == item_id:
            return i
    raise ValueError(f"id not found: {item_id}")


def _handle_pagination_params():
    try:
        page_size = int(request.query.get("pageSize", 16))
        page_after = request.query.get("pageAfter")
        page_before = request.query.get("pageBefore")
    except ValueError:  # invalid page size
        abort(400, "pageSize must be an integer")
    if page_after is not None and page_before is not None:
        abort(400, "can only specify one of pageBefore and pageAfter")
    return (page_size, page_after, page_before)


# new pagination logic using ids
def _get_pagination(items, page_size, last_id=None, first_id=None):
    if last_id is not None:
        page_start_index = _find_index(items, last_id) + 1
        page_end_index = min(len(items), page_start_index + page_size)
    elif first_id is not None:
        page_end_index = max(_find_index(items, first_id), page_size)
        page_start_index = max(page_end_index - page_size, 0)
    else:
        page_start_index = 0
        page_end_index = min(len(items), page_size)
    page_number = max(math.ceil(page_end_index / page_size) - 1, 0)
    paginated_slice = items[page_start_index:page_end_index]
    return (paginated_slice, page_start_index, page_end_index, page_number)


def _handle_sort_params(allowed_fields):
    sort_by_q = request.query.get("sortBy", "")
    # sort_pairs = [
    #     pair.split(".") for pair in sort_by_q.strip().split(",") if pair
    # ]
    sort_pairs = []
    for pair in sort_by_q.strip().split(","):
        if pair:
            field, ordering = pair.split(".")
            if field == "date":
                field = "attributes.dateOfCreation"
            sort_pairs.append((field, ordering))
    if any(
        field not in allowed_fields or ordering not in ORDERING
        for field, ordering in sort_pairs
    ):
        abort(
            400,
            f"invalid sortBy parameter; use <{'|'.join(allowed_fields)}>.<asc|desc>, separated by commas",
        )
        print("INVALID SORT PARAMS", field, ordering, sort_pairs)
    return [(field, ORDERING[ordering]) for field, ordering in sort_pairs]


@route("/users/<user_id>/favorites", "GET")
def get_my_favorite_clips(user_id):
    """Get favorites from a user
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: userId, favoriteClips: List of {{Clip}}Ids
    """
    if user_id != get_user_id() and get_user_privileges() != P.a.name:
        abort(403, "not authorized")
    return {"userId": user_id, "favoriteClips": get_favorite_clip_ids(user_id)}


# params:
# createdBy=<username>
# sortBy=<field>.<ordering>(,<field.ordering>)*
# pageAfter=<clip id>
# pageBefore=<clip id>
# pageSize=<number>
# entityIds=<entityId>(,<entityId>)*
# entitiesAll=(0|1)
# match=<text>
# matchDate=<edtf-date as String>
# favoritesOnly=(0|1)
@route("/clips", "GET")
def get_the_clips():
    """Get all clips
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: {{Clips}} and pagination information
    """
    # collect and validate params
    sort_by = _handle_sort_params(CLIP_SORT_FIELDS)
    page_size, page_after, page_before = _handle_pagination_params()
    created_by_q = request.query.get("createdBy")
    entity_ids_q = request.query.get("entityIds", "")
    match_not_q = request.query.get("matchNot", "0")
    favorites_only = bool(int(request.query.get("favoritesOnly", "0")))
    match_all_q = request.query.get("entitiesAll")
    text_match_q = request.query.getunicode("match")
    date_match_q = request.query.get("matchDate")
    # get the data
    entity_ids = [eid for eid in entity_ids_q.split(",") if eid]
    entity_filter_active = len(entity_ids) > 0
    match_all = match_all_q == "1"
    match_not = match_not_q == "true"

    if entity_filter_active:
        if match_not:
            # Adjust this function to fetch clips that do NOT contain the specified entity_ids
            matching_clip_ids = get_clips_excluding_entities(entity_ids)
        else:
            # This remains unchanged, fetching clips that contain the specified entity_ids
            matching_clip_ids = get_clips_containing_entities(
                entity_ids, match_all
            )
    else:
        matching_clip_ids = []

    # matching_clip_ids = (
    #     get_clips_containing_entities(entity_ids, match_all)
    #     if entity_filter_active
    #     else []
    # )
    entity_filter_clip_ids = matching_clip_ids if entity_filter_active else None
    favorite_clip_ids = get_favorite_clip_ids(get_user_id())
    favorite_filter_clip_ids = favorite_clip_ids if favorites_only else None
    filter_clip_ids = None

    if entity_filter_clip_ids is not None and favorite_filter_clip_ids is None:
        filter_clip_ids = entity_filter_clip_ids
    elif (
        entity_filter_clip_ids is None and favorite_filter_clip_ids is not None
    ):
        filter_clip_ids = favorite_filter_clip_ids
    elif (
        entity_filter_clip_ids is not None
        and favorite_filter_clip_ids is not None
    ):
        filter_clip_ids = list(
            set.intersection(
                set(entity_filter_clip_ids), set(favorite_filter_clip_ids)
            )
        )
    clips = get_clips(
        favorite_ids=favorite_clip_ids,
        sort_by=sort_by,
        filter_created_by=created_by_q,
        filter_clip_ids=filter_clip_ids,
    )

    result = clips

    # text filter
    if text_match_q:
        query = text_match_q
        choices_map = {c["_id"]: c["labelTitle"] for c in clips}
        cutoff = 100
        matching_clip_ids = set(fuzzy_map(choices_map, query, cutoff=cutoff))
        result = [c for c in result if c["_id"] in matching_clip_ids]

    # date filter
    if date_match_q:
        date_matching_clip_ids = get_clips_with_date(date_match_q)
        result = [c for c in result if c["_id"] in date_matching_clip_ids]

    # pagination
    (
        paginated_slice,
        page_start_index,
        page_end_index,
        page_number,
    ) = _get_pagination(result, page_size, page_after, page_before)
    # done
    return {
        "clips": paginated_slice,
        "pageSize": page_size,
        "page": page_number,
        "totalCount": len(result),
        "firstIndex": page_start_index,
        "lastIndex": page_end_index - 1,
    }


@route("/clips/<clip_id>", "GET")
def get_one_clip(clip_id):
    """Get one clip by id
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: a {{Clip}} object
    """
    try:
        return get_clip_by_id(clip_id)
    except IdNotFoundError as e:
        abort(404, str(e))


@route("/clips/basic/<clip_id>", "GET")
def get_one_clip_basically(clip_id):
    """Get one clip basic by id
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: a {{Clip}} object
    """
    try:
        return get_basic_clip_by_id(clip_id)
    except IdNotFoundError as e:
        abort(404, str(e))


@route("/clips", "POST")
def create_new_clip():
    """Create a new clip
    Method: POST
    Produces: -
    Parameters: -
    Request body: a {{Clip}}Basic object
    Response: ClipId of the newly created {{Clip}}
    """
    result = handle_command(Commands.CreateClip)
    new_clip_id = result["id"]
    return {"_id": new_clip_id}


@route("/clips", "PUT")
def update_existing_clip():
    """Update basic Metadata of an existing clip
    Method: PUT
    Produces: -
    Parameters: -
    Request body: a {{Clip}}Basic object
    Response: ClipId of the updated {{Clip}}
    """
    result = handle_command(Commands.UpdateClip)
    clip_id = result["id"]
    return {"_id": clip_id}


@route("/clips", "DELETE")
def delete_existing_clip():
    """Delete existing clip
    Method: DELETE
    Produces: application/json
    Parameters: -
    Request body: {{clipId}}
    Response: -
    """
    handle_command(Commands.DeleteClip)
    response.status = 204


@route("/clips/sameShelfmark/<clip_id>", "GET")
def get_all_clips_with_same_shelfmark(clip_id):
    """Get all clip ids of clips with the given shelfmark
    Method: GET
    Produces: -
    Parameters: -
    Request body: -
    Response: List of ClipIds
    """
    try:
        clip = get_basic_clip_by_id(clip_id)
    except IdNotFoundError as e:
        abort(404, str(e))

    try:
        shelfmark = clip["shelfmark"]
    except KeyError:
        return {"clips": []}

    clips_with_same_shelfmark = [clip]
    for c in db.clips.find({"shelfmark": shelfmark}):
        if c is not None and clip["_id"] != c["_id"]:
            clips_with_same_shelfmark.append(c)
    return {"clips": clips_with_same_shelfmark}


ENTITIES_SORT_FIELDS = [
    "label",
    "type",
    "description",
    "attributes.dateOfCreation",
    "createdBy",
    "updated",
    "usageCount",
]


# sortBy=<field>.<ordering>(,<field.ordering>)*
# cats=<ac>(,<ac2>)*
# type=<type>(,<type>)*
# match=<text>
# entitiesAll=(0|1)
# pageAfter=<clip id>
# pageBefore=<clip id>
# pageSize=<number>
@route("/entities", "GET")
def get_the_entities():
    """Get all entities
    Method: GET
    Produces: application/json
    Parameters: sort, cats,type, match, entitiesAll, pageAfter, pageBefore, pageSize
    Request body: -
    Response: Entities and pagination information
    """
    cats = [t for t in request.query.get("cats", "").split(",") if t] or None
    types = [t for t in request.query.get("type", "").split(",") if t] or None
    sort_by = _handle_sort_params(ENTITIES_SORT_FIELDS)
    page_size, page_after, page_before = _handle_pagination_params()
    assoc_entities_filter = [
        t for t in request.query.get("entityIds", "").split(",") if t
    ] or None
    match_all_q = request.query.get("entitiesAll")
    match_all = match_all_q == "1"
    entities = get_entities(
        filter_cats=cats,
        filter_types=types,
        sort_by=sort_by,
        filter_associated_with=assoc_entities_filter,
        match_all=match_all,
    )
    # text filter
    text_match_q = request.query.getunicode("match")
    if text_match_q:
        query = text_match_q
        choices_map = {e["_id"]: e["label"] for e in entities}
        cutoff = 100
        matching_entity_ids = set(fuzzy_map(choices_map, query, cutoff=cutoff))
        result = [e for e in entities if e["_id"] in matching_entity_ids]
    else:
        result = entities
    # pagination
    (
        paginated_slice,
        page_start_index,
        page_end_index,
        page_number,
    ) = _get_pagination(result, page_size, page_after, page_before)
    return {
        "entities": paginated_slice,
        "pageSize": page_size,
        "page": page_number,
        "totalCount": len(result),
        "firstIndex": page_start_index,
        "lastIndex": page_end_index - 1,
    }


@route("/entities/byId", "POST")
def get_certain_entities():
    """Get certain entities by Id
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: List of EntityIds
    Response: List of {{Entity}} objects
    """
    entity_ids = request.json.get("entityIds")
    try:
        return {"entities": get_entities_by_id(entity_ids)}
    except IdNotFoundError as e:
        abort(404, str(e))


# params:
# q... search text
# type... comma-separated entity types
@route("/entities/match", "GET")
def get_entities_autocomplete():
    """Get entities filtered by search text and type
    Method: GET
    Produces: application/json
    Parameters: "q": search Text; "type": comma-separated entity types
    Request body: -
    Response: List of {{Entity}} objects
    """
    match_q = request.query.getunicode("q")
    if not match_q:
        abort(400, "no query")
    types = [t for t in request.query.get("type", "").split(",") if t] or None
    cats_only = bool(request.query.get("catsOnly"))
    query = match_q
    ez = EntityZoo.get_instance()
    result = ez.fuzzy_match_entities(query, types=types, cats_only=cats_only)
    return {"matches": result, "totalCount": len(result)}


# params:
# type... comma-separated entity types
@route("/entities/suggest", "GET")
def get_entities_autocomplete_empty():
    """Get entities by Id for an empty Autocomplete Component
    Method: GET
    Produces: application/json
    Parameters: "type": comma-separated entity types
    Request body: -
    Response: List of {{Entity}} objects, number: total Number of returned Entities
    """
    types = [t for t in request.query.get("type", "").split(",") if t] or None
    cats_only = bool(request.query.get("catsOnly"))
    ez = EntityZoo.get_instance()
    entities = list(ez.get_entities(types=types, cats_only=cats_only, limit=50))
    return {"matches": entities, "totalCount": len(entities)}


@route("/entities", "POST")
def create_new_entity():
    """Create a new entity
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: {{Entity}} data
    Response: newly created {{Entity}} with Id
    """
    result = handle_command(Commands.CreateEntity)
    new_entity_id = result["id"]
    return get_entity_by_id(new_entity_id)


@route("/entities", "PUT")
def update_existing_entity():
    """Updade existing entity
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: {{Entity}} data
    Response: updated {{Entity}}
    """
    result = handle_command(Commands.UpdateEntity)
    entity_id = result["id"]
    # _ws_broadcast(
    #     {"messageType": "ENTITY_UPDATED", "payload": {"entityId": entity_id}}
    # )
    return get_entity_by_id(entity_id)


@route("/entities", "DELETE")
def delete_existing_entity():
    """Delete existing entity
    Method: DELETE
    Produces: application/json
    Parameters: -
    Request body: {{Entity}}
    Response: -
    """
    handle_command(Commands.DeleteEntity)
    response.status = 204


@route("/entities/relations/<entity_id>", "GET")
def get_entity_relations_for_entity(entity_id):
    """Return the possible entity relations for an Entity
    Method: GET
    Produces: application/json
    Parameters: -
    Request: -
    Response: List of EntityRelationsData
    """
    return get_entity_relations(entity_id)


@route("/entities/relations", "POST")
def add_entities_relation():
    """Add a relation to an Entity
    Method: POST
    Produces: application/json
    Parameters: -
    Request: -
    Response: List of EntityRelationsData
    """
    entity_id = request.json["_id"]
    handle_command(Commands.AddEntityRelation)
    return get_entity_relations(entity_id)


@route("/annotations", "POST")
def create_annotation():
    """Create an annotation
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: {{Entity}}
    Response: the newly created {{Annotation}}
    """
    result = handle_command(Commands.CreateAnnotation)
    new_annot_id = result["id"]
    return get_document_by_id(new_annot_id)


@route("/annotations", "PUT")
def update_annotation():
    """Update an annotation
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: {{Entity}}
    Response: the updated {{Annotation}}
    """
    result = handle_command(Commands.UpdateAnnotation)
    annot_id = result["id"]
    return get_document_by_id(annot_id)


@route("/annotations", "DELETE")
def delete_annotation():
    """Delete an annotation
    Method: DELETE
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    handle_command(Commands.DeleteAnnotation)
    response.status = 204


@route("/elements", "POST")
def create_element():
    """Create an Element
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: {{Element}}
    Response: Id of the newly created Element
    """
    result = handle_command(Commands.CreateElement)
    new_element_id = result["id"]
    return {"_id": new_element_id}


@route("/elements", "PUT")
def update_element():
    """Update an Element
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: {{Element}}
    Response: Id of the updated Element
    """
    result = handle_command(Commands.UpdateElement)
    element_id = result["id"]
    return {"_id": element_id}


@route("/elements", "DELETE")
def delete_element():
    """Delete an Element
    Method: DELETE
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    handle_command(Commands.DeleteElement)
    response.status = 204


@route("/layers", "POST")
def create_layer():
    """Create a Layer
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: {{Layer}}
    Response: Id of the newly created Layer
    """
    result = handle_command(Commands.CreateLayer)
    new_layer_id = result["id"]
    return {"_id": new_layer_id}


@route("/layers", "PUT")
def update_layer():
    """Update a Layer
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: {{Layer}}
    Response: Id of the updated Layer
    """
    result = handle_command(Commands.UpdateLayer)
    layer_id = result["id"]
    return {"_id": layer_id}


@route("/layers", "DELETE")
def delete_layer():
    """Delete a Layer
    Method: DELETE
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    handle_command(Commands.DeleteLayer)
    response.status = 204


@route("/segments", "POST")
def create_segment():
    """Create a new Segment
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: {{Segment}}
    Response: Id of the newly created Segment
    """
    result = handle_command(Commands.CreateSegment)
    new_segment_id = result["id"]
    return {"_id": new_segment_id}


@route("/segments", "PUT")
def update_segment():
    """Update the Basic Info of a Segment
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: {{Segment}}
    Response: Id of the updated Segment
    """
    result = handle_command(Commands.UpdateSegment)
    segment_id = result["id"]
    return {"_id": segment_id}


# {
#   "segment": "_Segment_...",
#   "annotations": ["...", "..."]
# }
@route("/segments/annotations", "PUT")
def update_segment_annots():
    """Update the List of Annotations belonging to a Segment
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: {{Segment}}Id, List of {{Annotation}}s
    Response: Id of the updated Segment
    """
    result = handle_command(Commands.UpdateSegmentAnnots)
    segment_id = result["id"]
    return get_document_by_id(segment_id)


@route("/segments", "DELETE")
def delete_segment():
    """Delete a Segment
    Method: DELETE
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    handle_command(Commands.DeleteSegment)
    response.status = 204


@route("/query/entities", "POST")
def do_query_entities():
    """Query entities
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: query: a query string
    Response: List of matching {{Entity}}s
    """
    return {"entityIds": find_matching_entities(request.json["query"])}


@route("/query/block", "POST")
def do_query_block():
    """Results for a query block
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: Query block
    Response: Results of the query block
    """
    return get_block_result(request.json)


@route("/query/intersection", "POST")
def do_query_intersection():
    """Results for a intersected query
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: block results
    Response: Results of the intersected query
    """
    block_results = [get_block_result(b) for b in request.json["blocks"]]
    return get_intersection_by_clip(block_results)


@route("/graph/clip/<clip_id>", "GET")
def do_graph_data_clip(clip_id):
    """Get the data for the graph view (for a Clip)
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: Graph data for the given ClipId
    """
    types = [t for t in request.query.get("type", "").split(",") if t] or None
    return get_graph_data_clip(clip_id, types)


@route("/graph/entity/<entity_id>", "GET")
def do_graph_data_entity(entity_id):
    """Get the data for the graph view (for an Entity)
    Method: GET
    Produces: application/json
    Parameters: filter: comma-separated list of entity types
    Request body: -
    Response: Graph data for the given EntityId
    """
    types = [t for t in request.query.get("type", "").split(",") if t] or None
    return get_graph_data_entity(entity_id, types)


@route("/search/quotes", "GET")
def do_search_quotes():
    """Search through quotes
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: Quotes, where search string matched
    """
    q = request.query.getunicode("q", "")
    person_ids = [
        p for p in request.query.get("personIds", "").split(",") if p
    ] or None
    return quote_search(q, person_ids)


# announcement = ""


# def _announcement():
#     return {"messageType": "ANNOUNCEMENT", "payload": {"message": announcement}}


# @route("/announce", "POST")
# def ws_announce():
#     message = request.json.get("message")
#     if not message:
#         abort(400, "no message provided")
#     global announcement
#     announcement = message
#     _ws_broadcast(_announcement())
#     response.status = 204


# @route("/announce", "DELETE")
# def clear_announcement():
#     global announcement
#     announcement = ""
#     _ws_broadcast(_announcement())
#     response.status = 204


@route("/users", "GET")
def do_get_users():
    """Get all users
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: List of all users
    """
    return {"users": [user._asdict() for user in get_users()]}


@route("/users/<username>", "GET")
def do_get_one_user(username):
    """Get user by username
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: User
    """
    try:
        return get_users(username)._asdict()
    except UsernameError as e:
        abort(404, str(e))


@route("/users", "POST")
def do_create_user():
    """Create new user
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: -
    Response: User and newly generated password if no password was given
    """
    data = request.json
    if data.get("username") is None:
        abort(400, "no username provided")
    if data.get("password") is None:
        generated_password = generate_password()
        password = generated_password
    else:
        generated_password = None
        password = data["password"]
    prv = data.get("privileges") or P.w.name
    try:
        create_user(data["username"], password, prv, data.get("email"))
        return (
            {"password": generated_password}
            if generated_password is not None
            else {}
        )
    except (UsernameError, PasswordError) as e:
        abort(400, str(e))


@route("/users/<username>", "DELETE")
def do_delete_user(username):
    """Delete user
    Method: DELETE
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    try:
        delete_user(username)
        response.status = 204
    except UsernameError as e:
        abort(404, str(e))


@route("/users/<username>", "PUT")
def do_update_user(username):
    """Update user
    Method: PUT
    Produces: application/json
    Parameters: -
    Request body: -
    Response: newly generated password, if no new was given
    """
    data = request.json
    use_generated_password = data.get("useGeneratedPassword") is True
    if use_generated_password:
        password = generate_password()
    else:
        password = data.get("password")
    try:
        update_user(
            username,
            password=password,
            privileges=data.get("privileges"),
            email=data.get("email"),
            active=data.get("active"),
            reauth=data.get("reauth", True),
        )
        return {"password": password} if use_generated_password else {}
    except UsernameError as e:
        abort(404, str(e))
    except UserStoreError as e:
        abort(400, str(e))


# @route("/ws", "GET", apply=[websocket])
# def websocket_endpoint(ws):
#     print("client connected")
#     sockets.add(ws)
#     if announcement:
#         ws.send(json.dumps(_announcement()))
#     while True:
#         msg = ws.receive()
#         if msg is None:
#             print("client disconnected")
#             break
#         else:
#             data = json.loads(msg)
#             if data["messageType"] == "PING":
#                 ws.send(json.dumps({"messageType": "PONG"}))
#                 # print("<3")
#             else:
#                 print("ws:", msg)


def get_git_revision():
    global GIT_REVISION
    revision_from_environment = os.environ.get("LAMA_REVISION")
    if revision_from_environment is not None:
        GIT_REVISION = revision_from_environment
        return
    try:
        with open("git_revision.txt", encoding="utf-8") as f:
            revision_from_file = f.read().strip()
            if not revision_from_file:
                raise ValueError(
                    "could not read git revision from git_revision.txt"
                )
            GIT_REVISION = revision_from_file
    except (FileNotFoundError, ValueError):
        print("could not get GIT_REVISION, unsetting")
        GIT_REVISION = None


TOKEN_EXPIRES = "exp"
TOKEN_USERNAME = "usr"
TOKEN_PRIVILEGES = "prv"

# AUTH_TOKEN_EXPIRES_IN = 10  # seconds
AUTH_TOKEN_EXPIRES_IN = 60 * 15  # seconds
REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7
REQUESTED_TOKEN_EXPIRES_IN = 60 * 60

# REFRESH_TOKEN_EXPIRES_IN = 30


def _in_x_seconds(secs):
    return int(datetime.now(tz=timezone.utc).timestamp()) + secs


def _make_token(payload, expires_in):
    return jwt.encode(
        {
            TOKEN_EXPIRES: _in_x_seconds(expires_in),
            **payload,
        },
        SECRETS[JWT_SECRET],
        algorithm="HS256",
    )


def _auth_token(username, privileges):
    return {TOKEN_USERNAME: username, TOKEN_PRIVILEGES: privileges}


def _refresh_token(username):
    return {TOKEN_USERNAME: username}


def _invalid_user_password():
    return_error(message="Invalid username or password.", status_code=401)


@route("/auth", "POST")
def get_auth_token():
    """Get Auth Token
    Method: POST
    Produces: application/json
    Parameters: -
    Request body: Username, Password
    Response: Auth Token
    """
    username = request.json.get("username")
    password = request.json.get("password")
    try:
        privileges = check_credentials(username, password)
        encoded_token = _make_token(
            _auth_token(username, privileges), REQUESTED_TOKEN_EXPIRES_IN
        )
        return {
            "username": username,
            "privileges": privileges,
            "token": encoded_token,
            "expires": datetime.fromtimestamp(
                _in_x_seconds(REQUESTED_TOKEN_EXPIRES_IN), tz=timezone.utc
            ).isoformat(),
        }
    except UserAuthenticationError:
        _invalid_user_password()


def _set_cookie(key, value):
    # is_testing_locally = (
    #     request.headers.get("Origin") == "http://localhost:9054"
    #     or request.headers.get("Origin") == "http://acontra-i.mdw.ac.at"
    # )
    response.set_cookie(
        key,
        value,
        secret=SECRETS[COOKIE_SECRET],
        httponly=True,
        secure=False,  # GIT_REVISION != "dev" and not is_testing_locally,
        max_age=REFRESH_TOKEN_EXPIRES_IN,
    )


@route("/login", "POST")
def do_login():
    """Login a given User
    Method: POST
    Produces: -
    Parameters: -
    Request body: Username, Password
    Response: -
    """
    username = request.json.get("username")
    password = request.json.get("password")
    try:
        privileges = check_credentials(username, password)
        auth_token = _make_token(
            _auth_token(username, privileges), AUTH_TOKEN_EXPIRES_IN
        )
        refresh_token = _make_token(
            _refresh_token(username), REFRESH_TOKEN_EXPIRES_IN
        )
        _set_cookie(COOKIE_AUTH_TOKEN_KEY, auth_token)
        _set_cookie(COOKIE_REFRESH_TOKEN_KEY, refresh_token)
        response.status = 204
    except UserAuthenticationError:
        _invalid_user_password()


@route("/guest", "GET")
def do_guest():
    """Set privileges for the read only version
    Method: GET
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    read_only_token = _make_token({TOKEN_PRIVILEGES: P.r.name}, 60 * 60 * 24)
    _set_cookie(COOKIE_AUTH_TOKEN_KEY, read_only_token)
    response.status = 204


@route("/logout", "GET")
def logout():
    """Logout
    Method: GET
    Produces: -
    Parameters: -
    Request body: -
    Response: -
    """
    response.delete_cookie(COOKIE_AUTH_TOKEN_KEY)
    response.delete_cookie(COOKIE_REFRESH_TOKEN_KEY)
    response.status = 204


@route("/export/data", "GET")
def get_data_export():
    """Export mongo data
    Method: GET
    Produces: application/json
    Parameters: -
    Request body: -
    Response: All data from the mongo store
    """
    return get_mongo_data()


@route("/export/events", "GET")
def get_events_export():
    """Export events as xml
    Method: GET
    Produces: application/xml
    Parameters: -
    Request body: -
    Response: Events in xml
    """
    response.content_type = "application/xml"
    return get_events_xml()


# defaults: read for GET, write for everything else
# read (r), write (w), admin (a)
# use same name and format as in route if there are variables in route
PRIVILEGES_OVERRIDES = {
    ("/announce", "DELETE"): P.a,
    ("/announce", "POST"): P.a,
    ("/clients", "GET"): P.a,
    ("/entities/byId", "POST"): P.r,
    ("/query/block", "POST"): P.r,
    ("/query/entities", "POST"): P.r,
    ("/query/intersection", "POST"): P.r,
    ("/users", "GET"): P.a,
    ("/users", "POST"): P.a,
    ("/users/<username>", "DELETE"): P.a,
    ("/users/<username>", "GET"): P.a,
    ("/users/<username>", "PUT"): P.a,
    ("/export/events", "GET"): P.a,
    ("/export/data", "GET"): P.a,
}


def _check_privileges(prv_str):
    if not P.exists(prv_str):
        raise jwt.exceptions.InvalidTokenError(
            "token has no or invalid privileges"
        )
    token_privilege = P[prv_str]
    matching_rule = app.router.match(request.environ)[0].rule
    required_privilege = PRIVILEGES_OVERRIDES.get(
        (matching_rule, request.method), P.r if request.method == "GET" else P.w
    )
    # print("need:", required_privilege)
    # print("have:", token_privilege)
    if not token_privilege >= required_privilege:
        return_error(message="not authorized", status_code=403)


COOKIE_AUTH_TOKEN_KEY = "tkt"
COOKIE_REFRESH_TOKEN_KEY = "rfr"


def _no_ticket():
    return_error(message="no ticket", status_code=401)


def _decode_token(encoded_token):
    return jwt.decode(encoded_token, SECRETS[JWT_SECRET], algorithms=["HS256"])


@hook("before_request")
def ensure_authentication():
    # print("ensure authentication")
    print("request path: " + request.path)
    if request.path in ["/auth", "/login", "/guest"]:
        print(
            "skipping authentication because of:", request.path, request.method
        )
        return
    if request.method == "OPTIONS":
        return
    encoded_token = None
    auth_header = request.headers.get("Authorization")
    if auth_header is not None:
        print("authorization header present")
        try:
            bearer, token = auth_header.split(" ", 1)
            if bearer == "Bearer":
                encoded_token = token
            else:
                raise ValueError
        except ValueError:
            return_error(
                message="authorization header present, but wrong format (bearer token required)",
                status_code=401,
            )
    if encoded_token is None:
        # print("no authorization header, checking cookies")
        encoded_token = request.get_cookie(
            COOKIE_AUTH_TOKEN_KEY, secret=SECRETS[COOKIE_SECRET]
        )
    if encoded_token is None:
        print("no auth token cookie")
        _no_ticket()
    try:
        # print("checking token")
        valid_token = _decode_token(encoded_token)
        token_privilege = valid_token[TOKEN_PRIVILEGES]
        request[LAMA_USERNAME] = valid_token.get(TOKEN_USERNAME)
        request[LAMA_PRIVILEGES] = valid_token.get(TOKEN_PRIVILEGES)
    except jwt.exceptions.ExpiredSignatureError:
        # print("access token expired (EXPIRED ERROR)")
        encoded_refresh_token = request.get_cookie(
            COOKIE_REFRESH_TOKEN_KEY, secret=SECRETS[COOKIE_SECRET]
        )
        if encoded_refresh_token is None:
            # print("no valid refresh token")
            _no_ticket()
        try:
            valid_refresh_token = _decode_token(encoded_refresh_token)
            username = valid_refresh_token[TOKEN_USERNAME]
            privileges = check_status(username)
            auth_token = _make_token(
                _auth_token(username, privileges), AUTH_TOKEN_EXPIRES_IN
            )
            token_privilege = privileges
            _set_cookie(COOKIE_AUTH_TOKEN_KEY, auth_token)
            # print("refresh token is valid, new auth token issued")
            request[LAMA_USERNAME] = username
            request[LAMA_PRIVILEGES] = privileges
        except (
            jwt.exceptions.ExpiredSignatureError,
            jwt.exceptions.InvalidSignatureError,
            jwt.exceptions.InvalidTokenError,
            UserAuthenticationError,
            UsernameError,
        ) as err:
            print("no valid refresh token")
            print(type(err), str(err))
            _no_ticket()
    except (
        jwt.exceptions.InvalidSignatureError,
        jwt.exceptions.InvalidTokenError,
    ) as err:
        print(type(err), str(err))
        _no_ticket()

    _check_privileges(token_privilege)


LEN_SECRET = 64
SECRETS = {}
COOKIE_SECRET = "cookie_secret"
JWT_SECRET = "jwt_secret"


def ensure_secret(name):
    try:
        with open(name, encoding="utf-8") as f:
            secret = f.read()
            if not secret or len(secret) < LEN_SECRET:
                raise ValueError
    except (FileNotFoundError, ValueError):
        import secrets

        secret = secrets.token_hex(LEN_SECRET)
        with open(name, "w", encoding="utf-8") as f:
            f.write(secret)
        print(f"Initialized secret {name}...")
    SECRETS[name] = secret


bottle_app = bottle.default_app()
bottle_app.default_error_handler = handle_error
app = bottle_app


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-d",
        "--dev",
        action="store_true",
        help="enable development mode (auto reload)",
    )
    parser.add_argument(
        "--cors",
        action="store_true",
        help="enable CORS for localhost",
    )
    args = parser.parse_args()

    if args.cors:
        global LOCALHOST_CORS
        LOCALHOST_CORS = True

    init_db()
    ensure_secret(COOKIE_SECRET)
    ensure_secret(JWT_SECRET)
    if args.dev:
        print("Development mode (auto-reloading) is active!")
        bottle.run(
            app=app,
            host="127.0.0.1",
            port=app_port,
            # server=GeventWebSocketServer,
            reloader=True,
        )
    else:
        get_git_revision()
        print(f"Telling Sounds LAMA build {GIT_REVISION}")
        bottle.run(
            app=app,
            host="127.0.0.1",
            port=app_port,
            # server=GeventWebSocketServer,
        )


if __name__ == "__main__":
    main()
