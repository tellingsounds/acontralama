"""The beginnings of trying to validate and possibly reject Commands putting
them into action. Ideally, the schemas could be used to ensure appropriate
client data."""

from typing import Dict

from lama.truth.commands_events import Commands
from lama.database import db  # , get_document_by_id
from lama.platform_effective_ids import effective_id_from_url
from lama.errors import IdNotFoundError, ValidationError

from lama.userstore import check_status


def not_the_droids(payload, user_id):
    return


def validate_create_annotation(payload, user_id):
    clip_id = payload["clip"]
    if db.clips.find_one({"_id": clip_id}) is None:
        raise ValidationError("clip does not exist")
    element_id = payload.get("element")
    if (
        element_id is not None
        and db.elements.find_one({"_id": element_id}) is None
    ):
        raise ValidationError("element does not exist")


def validate_delete_annotation(payload, user_id):
    annot_id = payload["_id"]
    # annot = get_document_by_id(annot_id)
    # removed this check for now, because we need to clean up the student's entries
    # if annot["createdBy"] != user_id:
    #     raise ValidationError("You can only delete annotations you created.")
    referenced_by = [
        a["_id"]
        for a in db.annotations.find(
            {
                "$or": [
                    {
                        "refersTo": annot_id,
                    },
                    {
                        "constitutedBy": annot_id,
                    },
                ]
            }
        )
    ]
    if len(referenced_by) > 0:
        raise ValidationError(
            f"Cannot delete: (annotation referenced in {', '.join(referenced_by)})"
        )
    used_in_segments = [
        f"{s['label']} ({s['_id']})"
        for s in db.segments.find(
            {
                "segmentContains.annotation": annot_id,
            }
        )
    ]
    if len(used_in_segments) > 0:
        raise ValidationError(
            f"Cannot delete: annotation used in {', '.join(used_in_segments)}"
        )


def _get_entity_usage(entity_id):
    relevant_fields_clip = [
        "platform",
        "collections",
        "language",
        "clipType",
    ]
    relevant_fields_annot = [
        "target",
        "role",
        "instrument",
    ]
    clip_results = db.clips.find(
        {"$or": [{f: entity_id} for f in relevant_fields_clip]}
    )
    annot_results = db.annotations.find(
        {"$or": [{f: entity_id} for f in relevant_fields_annot]}
    )
    return [
        clip_or_annot["_id"]
        for clip_or_annot in (*clip_results, *annot_results)
    ]


def validate_delete_clip(payload, user_id):
    privileges = check_status(user_id)
    if privileges != "a":
        raise ValidationError("You can only delete clips if you are an admin.")


def validate_delete_entity(payload, user_id):
    entity_id = payload["_id"]
    used_by = _get_entity_usage(entity_id)
    if len(used_by) > 0:
        raise ValidationError(f"Cannot delete: (used in {', '.join(used_by)})")


def validate_delete_segment(payload, user_id):
    pass
    # segment_id = payload["_id"]
    # segment = get_document_by_id(segment_id)
    # removed this check for now, because we need to clean up the student's entries
    # if segment["createdBy"] != user_id:
    #     raise ValidationError("You can only delete segments you created.")


def validate_clip(payload, user_id):
    url = payload.get("url")
    if url is None:
        return
    eff_id = effective_id_from_url(url)
    existing_clip = db.clips.find_one({"effectiveId": eff_id})
    if existing_clip is not None and payload["_id"] != existing_clip["_id"]:
        raise ValidationError(
            f"A clip with this URL already exists: {existing_clip['_id']}"
        )


def validate_delete_element(payload, user_id):
    element_id = payload["_id"]
    # element = get_document_by_id(element_id)
    # removed this check for now, because we need to clean up the student's entries
    # if element["createdBy"] != user_id:
    #     raise ValidationError("You can only delete elements you created.")
    has_layers = db.layers.find_one({"element": element_id}) is not None
    has_annotations = (
        db.annotations.find_one({"element": element_id}) is not None
    )
    if has_annotations or has_layers:
        raise ValidationError("Cannot delete: not empty")


def validate_delete_layer(payload, user_id):
    layer_id = payload["_id"]
    # layer = get_document_by_id(layer_id)
    # removed this check for now, because we need to clean up the student's entries
    # if layer["createdBy"] != user_id:
    #     raise ValidationError("You can only delete elements you created.")
    has_annotations = db.annotations.find_one({"layer": layer_id}) is not None
    if has_annotations:
        raise ValidationError("Cannot delete: not empty")


COMMANDS = {
    # entities
    Commands.DeleteEntity: validate_delete_entity,
    # clips
    Commands.CreateClip: validate_clip,
    Commands.UpdateClip: validate_clip,
    Commands.DeleteClip: validate_delete_clip,
    # annotations
    Commands.CreateAnnotation: validate_create_annotation,
    Commands.DeleteAnnotation: validate_delete_annotation,
    # elements
    Commands.DeleteElement: validate_delete_element,
    # layers
    Commands.DeleteLayer: validate_delete_layer,
    # segments
    Commands.DeleteSegment: validate_delete_segment,
}


def validate_command(command_name: str, payload: Dict, user_id: str) -> None:
    if command_name not in COMMANDS:
        # TODO: actually validate all commands
        return
    validation_function = COMMANDS[command_name] or not_the_droids
    try:
        validation_function(payload, user_id)
    except (ValidationError, IdNotFoundError):
        raise
    except Exception:
        raise ValidationError("error validating command")
