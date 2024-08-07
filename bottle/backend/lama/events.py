"""Implementation of various events, i.e. what should actually happen in
MongoDB for a given event."""

from functools import wraps
from typing import Dict

from lama.database import (
    db,
    init_db,
    create_document,
    update_document,
    delete_document,
    get_document_by_id,
)
from lama.types_errors import Event
from lama.platform_effective_ids import effective_id_from_url
from lama.truth.commands_events import Events
from lama.entity_relations import add_relation
from lama.entity_usage_count import get_usage_count, update_all_usage_counts
from lama.errors import IdNotFoundError
from lama.entity_zoo import EntityZoo


PRESERVE_EMPTY = ["description"]


def _stripped_pair(pair):
    k, v = pair
    return (k, (v.strip() if isinstance(v, str) else v))


def _process_anything(data: Dict) -> Dict:
    saved_data = {
        k: v
        for k, v in map(_stripped_pair, data.items())
        if v or v == [] or k in PRESERVE_EMPTY
    }
    # in case timecodeStart is 0
    if "timecodeStart" in data:
        saved_data["timecodeStart"] = data["timecodeStart"]
    return saved_data


def handle_create(collection: str):
    def _handle_create_in_collection(event: Event, is_replaying=False) -> Dict:
        saved_data = _process_anything(event.data)
        create_document(
            event.subject_id,
            saved_data,
            collection,
            event.timestamp,
            event.user_id,
        )
        return {"id": event.subject_id}

    return _handle_create_in_collection


def _with_effective_id(func):
    @wraps(func)
    def _handler(event: Event, is_replaying=False) -> Dict:
        event.data["effectiveId"] = effective_id_from_url(event.data.get("url"))
        return func(event, is_replaying)

    return _handler


def _with_timecode_v2(func):
    # convert "old" separate timecode fields into new array of pairs
    @wraps(func)
    def _handler(event: Event, is_replaying=False) -> Dict:
        if event.version == 1:
            timecode_start = event.data.get("timecodeStart")
            timecode_end = event.data.get("timecodeEnd")
            timecodes = (
                [[timecode_start, timecode_end]]
                if timecode_start is not None and timecode_end is not None
                else []
            )
            event.data["timecodes"] = timecodes
            if "timecodeStart" in event.data:
                del event.data["timecodeStart"]
            if "timecodeEnd" in event.data:
                del event.data["timecodeEnd"]
        elif event.version == 2:
            event.data["timecodes"] = sorted(event.data["timecodes"])
        else:
            raise NotImplementedError(f"{event.event_name} {event.version}")
        return func(event, is_replaying)

    return _handler


def _update_entity_usage_counts(entity_ids):
    for entity_id in entity_ids:
        try:
            usage_count = get_usage_count(entity_id)
        except IdNotFoundError:
            print(
                f'trying to get usage count for "{entity_id}" but it doesn\'t exist'
            )
            continue
        db.entities.update_one(
            {"_id": entity_id}, {"$set": {"usageCount": usage_count}}
        )


def _with_updated_entity_count(func):
    # update entity usage count when creating, editing, deleting annotations
    @wraps(func)
    def _handler(event: Event, is_replaying=False) -> Dict:
        result = func(event, is_replaying)
        if is_replaying:
            return result
        entity_ids = list(
            set(
                e
                for e in [
                    event.data.get("target"),
                    event.data.get("role"),
                    (event.prev_data or {}).get("target"),
                    (event.prev_data or {}).get("role"),
                ]
                if e
            )
        )
        _update_entity_usage_counts(entity_ids)
        return result

    return _handler


def _with_updated_entity_count_clip(func):
    # update entity usage count when creating, editing, deleting clips
    @wraps(func)
    def _handler(event: Event, is_replaying=False) -> Dict:
        result = func(event, is_replaying)
        if is_replaying:
            return result
        multi_fields = ["clipType", "collections", "language"]
        solo_fields = ["platform"]
        data = event.data
        prev_data = event.prev_data or {}
        # collect all entity ids used in any of the above fields
        entity_ids = [
            e
            for e in set(
                (
                    *(v for f in multi_fields for v in data.get(f, [])),
                    *(data.get(f) for f in solo_fields),
                    *(v for f in multi_fields for v in prev_data.get(f, [])),
                    *(prev_data.get(f) for f in solo_fields),
                )
            )
            if e
        ]
        _update_entity_usage_counts(entity_ids)
        return result

    return _handler


def handle_update(event: Event, is_replaying=False) -> Dict:
    saved_data = _process_anything(event.data)
    update_document(saved_data, event.timestamp, event.user_id)
    return {"id": event.subject_id}


def handle_delete(collection: str):
    def _handle_delete_from_collection(
        event: Event, is_replaying=False
    ) -> None:
        document_id = event.data["_id"]
        delete_document(
            collection,
            document_id,
            event.timestamp,
            event.user_id,
        )

    return _handle_delete_from_collection


def handle_segment_annots_update(event: Event, is_replaying=False) -> Dict:
    original_segment = get_document_by_id(event.subject_id)
    old_annot_ids = [
        sc["annotation"] for sc in original_segment["segmentContains"]
    ]
    new_annot_ids = event.data["annotations"]
    new_segment_contains = [
        sc
        for sc in original_segment["segmentContains"]
        if sc["annotation"] in new_annot_ids
    ] + [
        {
            "added": event.timestamp,
            "addedBy": event.user_id,
            "annotation": annot_id,
        }
        for annot_id in new_annot_ids
        if annot_id not in old_annot_ids
    ]
    new_segment = dict(original_segment)
    new_segment["segmentContains"] = new_segment_contains
    update_document(new_segment, event.timestamp, event.user_id)
    return {"id": event.subject_id}


# data has collection name, field name, default value
def handle_add_field(event: Event, is_replaying=False) -> None:
    db[event.data["collection"]].update_many(
        {},
        {"$set": {event.data["field"]: event.data["default"]}},
    )


def handle_set_field(event: Event, is_replaying=False) -> None:
    db[event.data["collection"]].update_one(
        {"_id": event.data["_id"]},
        {"$set": {event.data["field"]: event.data["value"]}},
    )


# data has format { "old": "ROld", "new": "RNew" }
def handle_rename_relation(event: Event, is_replaying=False) -> None:
    db.annotations.update_many(
        {"relation": event.data["old"]},
        {"$set": {"relation": event.data["new"]}},
    )


# data has format { "old": "_OldID", "new": "_NewID" }
def handle_rename_merge_entity(event: Event, is_replaying=False) -> None:
    old = event.data["old"]
    new = event.data["new"]
    db.clips.update_many(
        {"platform": old},
        {"$set": {"platform": new}},
    )
    db.clips.update_many(
        {"language": old},
        {"$set": {"language.$": new}},
    )
    db.clips.update_many(
        {"clipType": old},
        {"$set": {"clipType.$": new}},
    )
    for f in ["target", "role", "instrument"]:
        db.annotations.update_many(
            {f: old},
            {"$set": {f: new}},
        )
    if db.entities.find_one({"_id": new}) is None:
        original_entity = db.entities.find_one({"_id": old})
        with_new_id = dict([*original_entity.items(), ("_id", new)])
        db.entities.insert_one(with_new_id)
    delete_document("entities", old, event.timestamp, event.user_id)


# def handle_add_clips_effective_id(event: Event, is_replaying=False):
#     clips = db.clips.find({"effectiveId": {"$exists": False}})
#     for clip in clips:
#         db.clips.update_one(
#             {"_id": clip["_id"]},
#             {"$set": {"effectiveId": effective_id_from_url(clip["url"])}},
#         )


# data: { clip_id: str, is_favorite: bool, user_id: str }
def handle_set_favorite(event: Event, is_replaying=False):
    clip_id = event.data["clipId"]
    user_id = event.data["user_id"]
    is_favorite = event.data["is_favorite"]
    op = "$addToSet" if is_favorite else "$pull"
    db.users.update_one(
        {"_id": user_id}, {op: {"favoriteClips": clip_id}}, upsert=True
    )


# data: { _id: <id> }
def handle_delete_clip(event: Event, is_replaying=False):
    clip_id = event.data["_id"]
    element_ids = [e["_id"] for e in db.elements.find({"clip": clip_id})]
    layer_ids = [layer["_id"] for layer in db.layers.find({"clip": clip_id})]
    segment_ids = [s["_id"] for s in db.segments.find({"clip": clip_id})]
    annotation_ids = [a["_id"] for a in db.annotations.find({"clip": clip_id})]
    db.annotations.delete_many({"_id": {"$in": annotation_ids}})
    db.segments.delete_many({"_id": {"$in": segment_ids}})
    db.layers.delete_many({"_id": {"$in": layer_ids}})
    db.elements.delete_many({"_id": {"$in": element_ids}})
    db.clips.delete_one({"_id": clip_id})
    db.users.update_many({}, {"$pull": {"favoriteClips": clip_id}})
    update_all_usage_counts()  # because annotations also get deleted


# data: { _id: <id> }
def handle_delete_element(event: Event, is_replaying=False):
    element_id = event.data["_id"]
    annotation_ids = [
        a["_id"] for a in db.annotations.find({"element": element_id})
    ]
    db.annotations.delete_many({"_id": {"$in": annotation_ids}})
    delete_document("elements", element_id, event.timestamp, event.user_id)


def handle_delete_layer(event: Event, is_replaying=False):
    layer_id = event.data["_id"]
    annotation_ids = [
        a["_id"] for a in db.annotations.find({"layer": layer_id})
    ]
    db.annotations.delete_many({"_id": {"$in": annotation_ids}})
    delete_document("layers", layer_id, event.timestamp, event.user_id)


def handle_delete_segments(event: Event, is_replaying=False):
    segment_id = event.data["_id"]
    interpret_annot_ids = [
        a["_id"] for a in db.annotations.find({"segment": segment_id})
    ]
    db.annotations.delete_many({"_id": {"$in": interpret_annot_ids}})
    delete_document("segments", segment_id, event.timestamp, event.user_id)


# def handle_migrate_timecodes(_event, is_replaying=False):
#     for segment in db.segments.find({}):
#         segment_id = segment["_id"]
#         timecode_start = segment["timecodeStart"]
#         timecode_end = segment["timecodeEnd"]
#         db.segments.update_one(
#             {"_id": segment_id},
#             {
#                 "$unset": {"timecodeStart": "", "timecodeEnd": ""},
#                 "$set": {"timecodes": [[timecode_start, timecode_end]]},
#             },
#         )
#     for element in db.elements.find({}):
#         element_id = element["_id"]
#         timecode_start = element.get("timecodeStart")
#         timecode_end = element.get("timecodeEnd")
#         timecodes = (
#             [[timecode_start, timecode_end]]
#             if timecode_start is not None and timecode_end is not None
#             else []
#         )
#         db.elements.update_one(
#             {"_id": element_id},
#             {
#                 "$unset": {"timecodeStart": "", "timecodeEnd": ""},
#                 "$set": {"timecodes": timecodes},
#             },
#         )


def handle_add_entity_relation(event: Event, is_replaying=False):
    data = event.data
    add_relation(data["_id"], data["relation"], data["targetId"])


def handle_set_cats_attributes(event: Event, is_replaying=False):
    data = event.data
    for entity_id, fields in data.items():
        entity = db.entities.find_one({"_id": entity_id})
        if entity["type"] == "Topic":
            db.entities.update_one({"_id": entity_id}, {"$set": fields})
        else:
            print(f"{entity_id} is not a Topic, so no cats for you! {fields}")


# replace db state with data from file
def handle_load_mongo_state(event: Event, is_replaying=False):
    from bson import json_util

    # make sure there are no problems with ObjectIds ("$oid")
    data = json_util.loads(json_util.dumps(event.data))
    init_db(reset=True)
    for coll_name, docs in data.items():
        if coll_name != "db_state":
            db[coll_name].insert_many(docs)


def _with_invalidating_entity_cache(func):
    # invalidate cache used for autocomplete
    @wraps(func)
    def _handler(event: Event, is_replaying=False) -> Dict:
        result = func(event, is_replaying)
        if not is_replaying:
            ez = EntityZoo.get_instance()
            ez.invalidate_cache()
        return result

    return _handler


EVENTS = {
    Events.EntityCreated: _with_invalidating_entity_cache(
        handle_create("entities")
    ),
    Events.EntityUpdated: _with_invalidating_entity_cache(handle_update),
    Events.EntityDeleted: _with_invalidating_entity_cache(
        handle_delete("entities")
    ),
    Events.EntityRelationAdded: handle_add_entity_relation,
    Events.ClipCreated: _with_updated_entity_count_clip(
        _with_effective_id(handle_create("clips"))
    ),
    Events.ClipUpdated: _with_updated_entity_count_clip(
        _with_effective_id(handle_update)
    ),
    Events.ClipDeleted: handle_delete_clip,  # privileged
    Events.ClipFavoriteStatusSet: handle_set_favorite,
    Events.AnnotationCreated: _with_updated_entity_count(
        handle_create("annotations")
    ),
    Events.AnnotationUpdated: _with_updated_entity_count(handle_update),
    Events.AnnotationDeleted: _with_updated_entity_count(
        handle_delete("annotations")
    ),
    Events.ElementCreated: _with_timecode_v2(handle_create("elements")),
    Events.ElementUpdated: _with_timecode_v2(handle_update),
    Events.ElementDeleted: handle_delete_element,
    Events.LayerCreated: _with_timecode_v2(handle_create("layers")),
    Events.LayerUpdated: _with_timecode_v2(handle_update),
    Events.LayerDeleted: handle_delete_layer,
    Events.SegmentCreated: _with_timecode_v2(handle_create("segments")),
    Events.SegmentUpdated: _with_timecode_v2(handle_update),
    Events.SegmentDeleted: handle_delete_segments,
    Events.SegmentAnnotsUpdated: handle_segment_annots_update,
    # specials
    Events.RelationRenamed: handle_rename_relation,
    Events.EntityRenamedMerged: handle_rename_merge_entity,
    Events.FieldAdded: handle_add_field,
    Events.FieldValueSet: handle_set_field,
    Events.AnalysisCatsAttributesSet: handle_set_cats_attributes,
    Events.MongoStateLoaded: handle_load_mongo_state,
}


def handle_event(event: Event, is_replaying=False) -> Dict:
    return EVENTS[Events[event.event_name]](event, is_replaying)
