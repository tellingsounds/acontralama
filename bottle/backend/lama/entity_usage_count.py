"""Functions for getting the usage count of entities"""

from lama.database import db
from lama.errors import IdNotFoundError
from lama.truth.entitytypes import EntityTypes as T


def _get_count(collection, query):
    entity_result = list(
        collection.aggregate(
            [
                {"$match": query},
                {"$count": "usage_count"},
            ]
        )
    )
    if len(entity_result) == 0:
        return 0
    else:
        return entity_result[0]["usage_count"]


def get_annotation_usage_count(entity_id):
    return _get_count(
        db.annotations,
        {
            "target": entity_id,
        },
    )


def get_clip_basic_usage_count(entity_id):
    return _get_count(
        db.clips,
        {
            "$or": [
                {"platform": entity_id},
                {"language": entity_id},
                {"collections": entity_id},
                # {"clipType": entity_id},
            ]
        },
    )


def get_role_usage_count(entity_id):
    return _get_count(
        db.annotations,
        {
            "role": entity_id,
        },
    )


CLIP_ONLY_TYPES = [T.Collection, T.Platform]
ROLE_TYPES = [
    # T.VFunctionInClipRole,
    # T.VMusicPerformanceRole,
    T.VClipContributorRole,
]


def get_usage_count(entity_id):
    total_usage_count = 0
    entity = db.entities.find_one({"_id": entity_id})
    if entity is None:
        raise IdNotFoundError("entity does not exist")
    if not any(entity["type"] == t.name for t in CLIP_ONLY_TYPES):
        total_usage_count += get_annotation_usage_count(entity_id)
    if any(entity["type"] == t.name for t in [*CLIP_ONLY_TYPES]):
        total_usage_count += get_clip_basic_usage_count(entity_id)
    if any(entity["type"] == t.name for t in ROLE_TYPES):
        total_usage_count += get_role_usage_count(entity_id)
    return total_usage_count


def update_all_usage_counts():
    for entity in db.entities.find({}):
        entity_id = entity["_id"]
        usage_count = get_usage_count(entity_id)
        db.entities.update_one(
            {"_id": entity_id}, {"$set": {"usageCount": usage_count}}
        )


if __name__ == "__main__":
    update_all_usage_counts()
