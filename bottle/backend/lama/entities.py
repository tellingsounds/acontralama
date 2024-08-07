"""Functions for managing entities"""

from collections import defaultdict, OrderedDict
import csv
from io import StringIO

from lama.database import db
from lama.errors import IdNotFoundError
from lama.truth.entitytypes import entity_type_info

sorted_entity_types = [
    t.name
    for t, _ in sorted(
        ((t, v["label"]) for t, v in entity_type_info.items()),
        key=lambda pair: pair[1],
    )
]


def get_entities(
    filter_cats=None,
    filter_types=None,
    sort_by=[],
    limit=None,
    filter_associated_with=None,
    match_all=False,
):
    filter_steps = []
    if filter_cats is not None:
        filter_steps.append({"analysisCategories": {"$in": filter_cats}})
    if filter_types is not None:
        filter_steps.append({"type": {"$in": filter_types}})
    if filter_associated_with is not None:
        all_in = "$all" if match_all else "$in"
        filter_steps.append(
            {"attributes.associatedWith": {all_in: filter_associated_with}}
        )
    filter_step = {
        "$match": {"$and": filter_steps} if len(filter_steps) > 0 else {}
    }
    updated_created_step = {
        "$set": {
            "updated": {"$ifNull": ["$updated", "$created"]},
        }
    }
    entity_type_sorting_step = {
        "$addFields": {
            "__typeOrder": {"$indexOfArray": [sorted_entity_types, "$type"]}
        }
    }
    print(sort_by)
    sorting_step = {
        "$sort": OrderedDict(
            (
                *((f.replace("type", "__typeOrder"), o) for f, o in sort_by),
                ("_id", 1),
            ),
        )
    }
    limit_steps = [{"$limit": limit}] if limit is not None else []
    cleanup_step = {"$project": {"__typeOrder": 0}}
    result = list(
        db.entities.aggregate(
            [
                filter_step,
                updated_created_step,
                entity_type_sorting_step,
                sorting_step,
                *limit_steps,
                cleanup_step,
            ],
            # collation={"locale": "de", "strength": 1},
        )
    )
    return result


def get_entities_by_id(entity_ids):
    result = list(db.entities.find({"_id": {"$in": entity_ids}}))
    if len(result) < len(entity_ids):
        ids_not_found = [
            x for x in entity_ids if x not in (e["_id"] for e in result)
        ]
        raise IdNotFoundError(f"no result for \"{', '.join(ids_not_found)}\"")
    return result


def get_entity_by_id(entity_id):
    result = db.entities.find_one({"_id": entity_id})
    if result is None:
        raise IdNotFoundError(f'no result for id "{entity_id}"')
    return result


def make_entity_stats_csv():
    entities = list(db.entities.find({}))
    counts = defaultdict(int)
    for entity in entities:
        eid = entity["_id"]
        count_aggr = db.annotations.aggregate(
            [
                {
                    "$match": {"$or": [{"target": eid}, {"role": eid}]},
                },
                {
                    "$count": "usage_count",
                },
            ]
        )
        for doc in count_aggr:
            counts[eid] += doc["usage_count"]
    for entity in entities:
        eid = entity["_id"]
        count_aggr = db.clips.aggregate(
            [
                {
                    "$match": {
                        "$or": [
                            {"platform": eid},
                            {"language": eid},
                            {"clipType": eid},
                            {"collections": eid},
                        ]
                    },
                },
                {
                    "$count": "usage_count",
                },
            ]
        )
        for doc in count_aggr:
            counts[eid] += doc["usage_count"]
    f = StringIO()
    writer = csv.writer(f, delimiter=";", quoting=csv.QUOTE_ALL)
    writer.writerow(
        [
            "id",
            "type",
            "label",
            "description",
            "created",
            "createdby",
            "uris",
            "tags",
            "usagecount",
        ]
    )
    writer.writerows(
        (
            e["_id"],
            e["type"],
            e["label"],
            e["description"],
            e["created"],
            e["createdBy"],
            ",".join(e["authorityURIs"]),
            ",".join(sorted(e["additionalTags"])),
            counts[e["_id"]],
        )
        for e in sorted(
            entities, key=lambda e_: counts[e_["_id"]], reverse=True
        )
    )
    return f.getvalue()


if __name__ == "__main__":
    from pprint import pprint
    from timeit import default_timer as timer

    start = timer()
    result = get_entities()
    stop = timer()
    pprint(result)
    print(stop - start)
