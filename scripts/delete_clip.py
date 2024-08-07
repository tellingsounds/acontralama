from lama.database import db
from lama.types_errors import Event
from lama.util import get_timestamp
from lama.events import handle_event
import lama.eventstore as eventstore


def _make_event(event_name, subject_id, data, prev_data):
    return Event(
        None,
        get_timestamp(),
        event_name,
        1,
        "system",
        subject_id,
        data,
        prev_data,
    )


def _handle_and_store(event: Event):
    handle_event(event)
    eventstore.store(event)


CLIPS_TO_DELETE = ["_Clip_8122e014-c3eb-45c6-8e7a-763ff71e9a25"]


def main():
    for clip_id in CLIPS_TO_DELETE:
        clip = db.clips.find_one({"_id": clip_id})
        _handle_and_store(
            _make_event("ClipDeleted", clip_id, {"_id": clip_id}, clip)
        )


if __name__ == "__main__":
    main()
