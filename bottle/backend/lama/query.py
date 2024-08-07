"""Get clips containing entities"""

from collections import defaultdict
from typing import Iterable, List

from lama.database import db


def get_clips_containing_entities(
    entity_ids: Iterable[str], match_all: bool = False
) -> List[str]:
    clips = db.clips.find(
        {
            "$or": [
                {
                    "$or": [
                        {"clipType": e},
                        {"language": e},
                        {"platform": e},
                        {"collections": e},
                    ]
                }
                for e in entity_ids
            ]
        }
    )
    annots = db.annotations.find(
        {
            "$or": [
                {
                    "$or": [
                        {"target": e},
                        {"role": e},
                        {"instrument": e},
                    ]
                }
                for e in entity_ids
            ]
        }
    )
    eids = set(entity_ids)
    features_in_clip = defaultdict(set)
    for clip in clips:
        for eid in eids:
            if (
                clip["platform"] == eid
                or any(e == eid for e in clip.get("collections", []))
                or any(e == eid for e in clip.get("clipType", []))
                or any(e == eid for e in clip.get("language", []))
            ):
                features_in_clip[clip["_id"]].add(eid)
    for annot in annots:
        for eid in eids:
            if (
                annot.get("target") == eid
                or annot.get("role") == eid
                or annot.get("instrument") == eid
            ):
                features_in_clip[annot["clip"]].add(eid)
    op = all if match_all else any
    return [
        k for k, v in features_in_clip.items() if op(e in v for e in entity_ids)
    ]


def get_clips_excluding_entities(entity_ids: Iterable[str]) -> List[str]:
    eids = set(entity_ids)
    all_clip_ids = set()
    clips_to_exclude = set()

    # Find all clips
    clips = db.clips.find()
    for clip in clips:
        all_clip_ids.add(clip["_id"])
        for eid in eids:
            if (
                clip["platform"] == eid
                or eid in clip.get("collections", [])
                or eid in clip.get("clipType", [])
                or eid in clip.get("language", [])
            ):
                clips_to_exclude.add(clip["_id"])

    # Find all annotations
    annots = db.annotations.find()
    for annot in annots:
        for eid in eids:
            if (
                annot.get("target") == eid
                or annot.get("role") == eid
                or annot.get("instrument") == eid
            ):
                clips_to_exclude.add(annot["clip"])

    # Return clips that do not have any of the given entity IDs
    clips_including_entities = all_clip_ids - clips_to_exclude
    return list(clips_including_entities)


def get_clips_with_date(date_str: str) -> List[str]:

    clips_with_date = set()

    annots = db.annotations.find()
    for annot in annots:
        if annot.get("date"):
            if date_str in annot.get("date"):
                clips_with_date.add(annot["clip"])

    return list(clips_with_date)

    # return [clip["_id"] for clip in clips]
