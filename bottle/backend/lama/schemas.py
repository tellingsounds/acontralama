"""Attempts at data validation; most likely should have used JSON Schema instead."""

from enum import Enum, auto, unique
import json
from typing import List

from schema import Schema, And, Optional

from lama.truth.commands_events import Events
from lama.truth.entitytypes import EntityTypes
from lama.types_errors import Event

META = {
    "created": And(str, len),
    "createdBy": And(str, len),
    Optional("updated"): And(str, len),
    Optional("updatedBy"): And(str, len),
}

meta_fields = [
    "created",
    "createdBy",
    "updated",
    "updatedBy",
    "updatedAny",
    "updatedAnyBy",
]


def newly_created(schema):
    return {
        **{k: v for k, v in schema.items() if k not in meta_fields},
        "_id": "",
    }


def optional(schema):
    return {Optional(k): v for k, v in schema.items()}


TIMECODE_V1 = {
    "timecodeStart": And(int, lambda n: n >= 0),
    "timecodeEnd": int,
}

# CLIP
CLIP_V0 = {
    "_id": And(str, len),
    Optional("effectiveId"): And(str, len),
    "type": "Clip",
    "title": And(str, len),
    Optional("label"): str,
    Optional("subtitle"): str,
    "url": And(str, len),
    "platform": And(str, len),
    Optional("collections"): [And(str, len)],
    "fileType": And(str, lambda s: s in ["a", "v"]),
    "duration": And(int, lambda n: n > 0),
    Optional("shelfmark"): str,
    Optional("language"): [And(str, len)],
    "clipType": [And(str, len)],
    Optional("description"): str,
    Optional("updatedAny"): And(str, len),
    Optional("updatedAnyBy"): And(str, len),
    **META,
}
CLIP_V1 = {
    "_id": And(str, len),
    "effectiveId": And(str, len),
    "type": "Clip",
    "title": And(str, len),
    Optional("label"): And(str, len),
    Optional("subtitle"): And(str, len),
    "url": And(str, len),
    "platform": And(str, len),
    Optional("collections"): [And(str, len)],
    "fileType": And(str, lambda s: s in ["a", "v"]),
    "duration": And(int, lambda n: n > 0),
    Optional("shelfmark"): And(str, len),
    "language": [And(str, len)],
    "clipType": [And(str, len)],
    Optional("description"): str,
    **META,
    Optional("updatedAny"): And(str, len),
    Optional("updatedAnyBy"): And(str, len),
}

CLIP_V2 = {
    "_id": And(str, len),
    "effectiveId": And(str, len),
    "type": "Clip",
    "title": And(str, len),
    Optional("label"): And(str, len),
    Optional("subtitle"): And(str, len),
    Optional("url"): And(str, len),
    "platform": And(str, len),
    Optional("collections"): [And(str, len)],
    "fileType": And(str, lambda s: s in ["a", "v"]),
    "duration": And(
        int, lambda n: n >= 0
    ),  # acontra needs to be able to enter clips without known length
    Optional("shelfmark"): And(str, len),
    Optional("language"): [And(str, len)],
    "clipType": [And(str, len)],
    Optional("recordingDate"): And(str, len),
    Optional("broadcastDates"): [And(str, len)],
    Optional("station"): [And(str, len)],
    Optional("clipStatus"): [And(str, len)],
    Optional("offsetTimecode"): And(str, len),
    Optional("description"): str,
    **META,
    Optional("updatedAny"): And(str, len),
    Optional("updatedAnyBy"): And(str, len),
}

# ANNOTATION
ANNOTATION_V0 = {
    "_id": And(str, len),
    "type": "Annotation",
    "clip": And(str, len),
    Optional("element"): And(str, len),
    "relation": And(str, len),
    Optional("target"): str,
    Optional("quotes"): str,
    Optional("date"): str,
    Optional("role"): str,
    Optional("instrument"): str,
    Optional("metaDate"): str,
    **optional(TIMECODE_V1),
    Optional("confidence"): str,
    Optional("attribution"): str,
    Optional("comment"): str,
    Optional("interpretative"): bool,
    Optional("constitutedBy"): [And(str, len)],
    Optional("refersTo"): str,
    **META,
}
ANNOTATION_V1 = {
    "_id": And(str, len),
    "type": "Annotation",
    "clip": And(str, len),
    Optional("element"): And(str, len),
    "relation": And(str, len),
    Optional("target"): And(str, len),
    Optional("quotes"): And(str, len),
    Optional("date"): And(str, len),
    Optional("role"): And(str, len),
    Optional("instrument"): And(str, len),
    Optional("metaDate"): And(str, len),
    **optional(TIMECODE_V1),
    Optional("confidence"): And(str, len),
    Optional("attribution"): And(str, len),
    Optional("comment"): And(str, len),
    Optional("interpretative"): True,
    Optional("constitutedBy"): [And(str, len)],
    Optional("refersTo"): And(str, len),
    **META,
}

ANNOTATION_V2 = {
    "_id": And(str, len),
    "type": "Annotation",
    "clip": And(str, len),
    Optional("element"): And(str, len),
    Optional("layer"): And(str, len),
    "relation": And(str, len),
    Optional("target"): And(str, len),
    Optional("quotes"): And(str, len),
    Optional("date"): And(str, len),
    Optional("role"): And(str, len),
    Optional("quoteEntities"): [And(str, len)],
    Optional("onSite"): None,
    Optional("diegetic"): None,
    Optional("metaDate"): And(str, len),
    **optional(TIMECODE_V1),
    Optional("confidence"): And(str, len),
    Optional("attribution"): And(str, len),
    Optional("comment"): And(str, len),
    Optional("interpretative"): True,
    Optional("constitutedBy"): [And(str, len)],
    Optional("refersTo"): And(str, len),
    **META,
}

# ELEMENT
elts = ["Music", "Speech", "Noise", "Picture", "Structure"]
ELEMENT_V0 = {
    "_id": And(str, len),
    "type": And(str, lambda t: t in elts),
    "clip": And(str, len),
    "label": And(str, len),
    "description": str,
    **optional(TIMECODE_V1),
    **META,
}
ELEMENT_V1 = ELEMENT_V0
ELEMENT_V2 = {
    "_id": And(str, len),
    "type": And(str, lambda t: t in elts),
    "clip": And(str, len),
    "label": And(str, len),
    "description": str,
    "timecodes": [[int, int]],
    **META,
}

# LAYER
layers = ["MusicLayer", "SpeechLayer", "SoundLayer"]
LAYER_V0 = {
    "_id": And(str, len),
    "type": And(str, lambda t: t in layers),
    "clip": And(str, len),
    "element": And(str, len),
    "label": And(str, len),
    "description": str,
    "timecodes": [[int, int]],
    **META,
}

# ENTITY
_ets = [et.name for et in EntityTypes]
ets0 = set(_ets + ["ContributorRole"])
ets1 = set(_ets)
ENTITY_V0 = {
    "_id": And(str, len),
    "type": And(str, lambda t: t in ets0),
    "label": And(str, len),
    Optional("description"): str,
    "authorityURIs": [And(str, len)],
    Optional("additionalTags"): [And(str, len)],
    **META,
}
ENTITY_V1 = {
    "_id": And(str, len),
    "type": And(str, lambda t: t in ets1),
    "label": And(str, len),
    "description": str,
    "authorityURIs": [And(str, len)],
    "additionalTags": [And(str, len)],
    **META,
}

# SEGMENT
SEGMENT_V0 = {
    "_id": And(str, len),
    "type": "Segment",
    "clip": And(str, len),
    "label": And(str, len),
    "description": And(str, len),
    **TIMECODE_V1,
    "segmentContains": [
        {
            "added": And(str, len),
            "addedBy": And(str, len),
            "annotation": And(str, len),
        }
    ],
    **META,
}
SEGMENT_V1 = SEGMENT_V0
SEGMENT_V2 = {
    "_id": And(str, len),
    "type": "Segment",
    "clip": And(str, len),
    "label": And(str, len),
    "description": str,
    "timecodes": [[int, int]],
    "segmentContains": [
        {
            "added": And(str, len),
            "addedBy": And(str, len),
            "annotation": And(str, len),
        }
    ],
    **META,
}

# EVENTS_SCHEMAS = {
#     "AnnotationCreated": Schema(
#         newly_created(ANNOTATION_V0), ignore_extra_keys=True
#     ),
#     "AnnotationUpdated": Schema(ANNOTATION_V0, ignore_extra_keys=True),
#     "ClipCreated": Schema(newly_created(CLIP_V0)),
#     "ClipUpdated": Schema(CLIP_V0, ignore_extra_keys=True),  # segments
#     "ElementCreated": Schema(newly_created(ELEMENT_V0)),
#     "ElementUpdated": Schema(ELEMENT_V0, ignore_extra_keys=True),  # annotations
#     "EntityCreated": Schema({**newly_created(ENTITY_V0), **{"_id": str}}),
#     "EntityUpdated": Schema(ENTITY_V0),
#     "SegmentCreated": Schema(newly_created(SEGMENT_V0)),
#     "SegmentUpdated": Schema(SEGMENT_V0),
# }

# MONGO_SCHEMAS = {
#     "annotations": Schema(ANNOTATION_V1),
#     "clips": Schema(CLIP_V1, ignore_extra_keys=True),  # elements
#     "elements": Schema(ELEMENT_V1, ignore_extra_keys=True),  # annotations
#     "entities": Schema(ENTITY_V1),
#     "segments": Schema(SEGMENT_V1),
# }

VALIDATION_LOOKUP = {
    Events.SegmentCreated: {
        1: Schema(newly_created(SEGMENT_V0)),
        2: Schema(newly_created(SEGMENT_V2)),
    },
    Events.SegmentUpdated: {
        1: Schema(SEGMENT_V0),
        2: Schema(SEGMENT_V2),
    },
    Events.ElementCreated: {
        1: Schema(newly_created(ELEMENT_V0)),
        2: Schema(newly_created(ELEMENT_V2)),
    },
    Events.ElementUpdated: {
        1: Schema(ELEMENT_V0, ignore_extra_keys=True),  # annotations
        2: Schema(ELEMENT_V2),
    },
    Events.LayerCreated: {
        2: Schema(newly_created(LAYER_V0)),
    },
    Events.LayerUpdated: {2: Schema(LAYER_V0)},
}


@unique
class FormTypes(Enum):
    Element = auto()
    Segment = auto()
    Layer = auto()


FT = FormTypes


FORM_MAP = {
    FT.Element: Schema(ELEMENT_V2),
    FT.Segment: Schema(SEGMENT_V2),
    FT.Layer: Schema(LAYER_V0),
}


def get_allowed_keys(ftype: FormTypes) -> List[str]:
    if ftype not in FORM_MAP:
        raise NotImplementedError(ftype)
    return list(FORM_MAP[ftype].json_schema("")["properties"].keys())


def validate_event(event: Event) -> None:
    schema = VALIDATION_LOOKUP.get(Events[event.event_name], {}).get(
        event.version
    )
    if schema is None:
        return
    schema.validate(event.data)  # raise SchemaError


if __name__ == "__main__":
    base_url = "https://tellingsounds.com/lama"
    for id_, s in [
        ("entity", ENTITY_V1),
        ("annotation", ANNOTATION_V2),
        ("clip", CLIP_V2),
        ("segment", SEGMENT_V2),
        ("element", ELEMENT_V2),
        ("layer", LAYER_V0),
    ]:
        filename = f"{id_}.schema.json"
        schema = Schema(s).json_schema(f"{base_url}/{filename}")
        for k, v in schema["properties"].items():
            if k in ["created", "updated"]:
                schema["properties"][k] = {
                    "$ref": f"{base_url}/common.schema.json#/definitions/timestamp"
                }
            schema["properties"][k]["description"] = ""
        with open(f"schema/{filename}", "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2, ensure_ascii=False)
