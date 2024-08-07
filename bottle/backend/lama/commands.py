"""Create events from commands for the Eventlog"""

import re
from typing import Dict
from uuid import uuid4

from lama.database import get_document_by_id, id_exists
from lama.events import handle_event
from lama.schemas import validate_event
from lama.types_errors import Event
from lama.util import get_timestamp, replace_umlauts_etc
from lama.validation import validate_command
from lama.errors import ValidationError
import lama.eventstore as eventstore
from lama.truth.commands_events import Commands, Events, get_event_version


def slugify(s):
    return re.sub(
        r"[^a-z0-9-]",
        "",
        re.sub(r"\s+", "-", replace_umlauts_etc(s.lower().strip())),
    )


def create_human_id(data: Dict):
    mangled_label = slugify(data["label"])
    new_id = f'_{data["type"]}_{mangled_label}'
    counter = 0
    suffix = ""
    while id_exists(new_id + suffix):
        counter += 1
        suffix = f"_{counter}"
    return new_id + suffix


def create_random_id(data: Dict):
    return f'_{data["type"]}_{uuid4()}'


COMMANDS = {
    # entities
    Commands.CreateEntity: Events.EntityCreated,
    Commands.UpdateEntity: Events.EntityUpdated,
    Commands.DeleteEntity: Events.EntityDeleted,
    Commands.AddEntityRelation: Events.EntityRelationAdded,
    # clips
    Commands.CreateClip: Events.ClipCreated,
    Commands.UpdateClip: Events.ClipUpdated,
    Commands.DeleteClip: Events.ClipDeleted,
    Commands.SetClipFavoriteStatus: Events.ClipFavoriteStatusSet,
    # annotations
    Commands.CreateAnnotation: Events.AnnotationCreated,
    Commands.UpdateAnnotation: Events.AnnotationUpdated,
    Commands.DeleteAnnotation: Events.AnnotationDeleted,
    # elements
    Commands.CreateElement: Events.ElementCreated,
    Commands.UpdateElement: Events.ElementUpdated,
    Commands.DeleteElement: Events.ElementDeleted,
    # layer
    Commands.CreateLayer: Events.LayerCreated,
    Commands.UpdateLayer: Events.LayerUpdated,
    Commands.DeleteLayer: Events.LayerDeleted,
    # segments
    Commands.CreateSegment: Events.SegmentCreated,
    Commands.UpdateSegment: Events.SegmentUpdated,
    Commands.DeleteSegment: Events.SegmentDeleted,
    Commands.UpdateSegmentAnnots: Events.SegmentAnnotsUpdated,
}


CREATE_ID_COMMANDS = {
    Commands.CreateAnnotation,
    Commands.CreateClip,
    Commands.CreateElement,
    Commands.CreateLayer,
    Commands.CreateSegment,
    Commands.CreateEntity,
}


CREATE_HUMAN_ID_COMMANDS = {
    Commands.CreateEntity,
}


def event_from_command(command_name, payload, user_id):
    event_name = COMMANDS[command_name]
    timestamp = get_timestamp()
    version = get_event_version(event_name)
    data = payload
    data_id = data.get("_id")
    new_id = None
    if command_name in CREATE_ID_COMMANDS:
        if command_name in CREATE_HUMAN_ID_COMMANDS:
            new_id = create_human_id(data)
        else:
            new_id = create_random_id(data)
    subject_id = (
        data["segment"]
        if event_name == Events.SegmentAnnotsUpdated
        else (data_id or new_id)
    )
    prev_data = None
    if subject_id and (
        command_name.name.startswith("Update")
        or command_name.name.startswith("Delete")
    ):
        if event_name == Events.SegmentAnnotsUpdated:
            original_segment = get_document_by_id(subject_id)
            prev_data = original_segment["segmentContains"]
        else:
            prev_data = get_document_by_id(subject_id)
    event = Event(
        None,
        timestamp,
        event_name.name,
        version,
        user_id,
        subject_id,
        data,
        prev_data,
    )
    return event


def process_command(command_name, payload, user_id):
    if command_name not in COMMANDS:
        raise ValidationError("unknown command")
    validate_command(command_name, payload, user_id)
    # raise ValidationError
    ensuing_event = event_from_command(command_name, payload, user_id)
    validate_event(ensuing_event)
    result = handle_event(ensuing_event)
    # raise SomethingWentWrongError
    eventstore.store(ensuing_event)
    return result
