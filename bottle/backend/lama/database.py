"""DB management

COLLECTIONS:
entities
db_state: contains flag whether db has been initialized
elements: Music, Speech, etc.
segments
clips: clip basic data
annotations
"""

from typing import Dict, Union

from bson import json_util
from pymongo import MongoClient, ASCENDING, DESCENDING

from lama.config import db_name, mongo_host, mongo_port
from lama.errors import IdNotFoundError
from lama.util import get_timestamp

ASC = ASCENDING
DESC = DESCENDING

client = MongoClient(mongo_host, mongo_port)
db = client[db_name]


def dump_mongo_data(filename: str) -> None:
    mongo_data = get_mongo_data()
    with open(filename, "w", encoding="utf-8") as f:
        f.write(mongo_data)
        f.write("\n")


def get_mongo_data():
    return json_util.dumps(
        {
            coll: list(db[coll].find({}))
            for coll in sorted(db.list_collection_names())
        },
        indent=2,
        ensure_ascii=False,
    )


def init_db(reset=False):
    if db.db_state.find_one({}) is not None and not reset:
        print("Found existing mongo data.")
        return
    print("Initializing mongo...")
    for coll in db.list_collection_names():
        db.drop_collection(coll)
    # for coll in ["clips", "elements", "segments", "annotations", "entities"]:
    #     db.create_collection(coll, collation={"locale": "de", "strength": 1})
    db.entities.create_index("type")
    db.entities.create_index("label", collation={"locale": "de", "strength": 1})
    db.entities.create_index("analysisCategories")
    db.entities.create_index("attributes.composer")
    db.entities.create_index("attributes.lyricist")
    # db.entities.create_index(
    #     [("label", "text")],
    #     default_language="none",
    #     language_override="mongo_language",
    # )
    db.elements.create_index("clip")
    db.layers.create_index("clip")
    db.segments.create_index("clip")
    db.annotations.create_index("clip")
    db.annotations.create_index("relation")
    db.annotations.create_index("target")
    db.annotations.create_index("role")
    db.annotations.create_index("instrument")
    db.annotations.create_index("clip")
    db.annotations.create_index(
        name="quotes_de", default_language="de", keys=[("quotes", "text")]
    )
    db.clips.create_index("title", collation={"locale": "de", "strength": 1})
    db.clips.create_index("label", collation={"locale": "de", "strength": 1})
    db.clips.create_index("clipType")
    db.clips.create_index("language")
    db.clips.create_index("platform")
    db.clips.create_index("collections")
    db.clips.create_index("effectiveId")
    # db.clips.create_index(
    #     [("label", "text"), ("title", "text"), ("description", "text")],
    #     default_language="none",
    #     language_override="mongo_language",
    # )
    db.users.create_index("favoriteClips")

    db.db_state.insert_one({"initialized": get_timestamp()})


def get_collection_name(id_: str) -> Union[str, None]:
    for coll in db.list_collection_names():
        if db[coll].find_one({"_id": id_}) is not None:
            return coll
    return None


def id_exists(id_: str) -> bool:
    return get_collection_name(id_) is not None


def set_clip_updated(clip_id: str, timestamp: str, user_id: str) -> None:
    db.clips.update_one(
        {"_id": clip_id},
        {
            "$set": {
                "updatedAny": timestamp,
                "updatedAnyBy": user_id,
            }
        },
    )


def get_document_by_id(id_: str) -> Dict:
    collection_name = get_collection_name(id_)
    if collection_name is None:
        raise IdNotFoundError(f"no result for id {id_}")
    return db[collection_name].find_one({"_id": id_})


def create_document(document_id, document, collection_name, timestamp, user_id):
    actual_data = dict(
        [
            *document.items(),
            ("_id", document_id),
            ("created", timestamp),
            ("createdBy", user_id),
        ]
    )
    db[collection_name].insert_one(actual_data)
    if document["type"] == "Clip" or document.get("clip") is not None:
        if document["type"] == "Clip":
            set_clip_updated(actual_data["_id"], timestamp, user_id)
        elif document.get("clip") is not None:
            set_clip_updated(document["clip"], timestamp, user_id)


def update_document(document, timestamp, user_id):
    document_id = document["_id"]
    collection_name = get_collection_name(document_id)
    existing = db[collection_name].find_one(
        {"_id": document_id},
    )
    if existing is None:
        raise IdNotFoundError(f'no result for id "{document_id}"')
    existing_without_updated = {
        k: v for k, v in existing.items() if k not in ["updated", "updatedBy"]
    }
    new_without_updated = {
        k: v for k, v in document.items() if k not in ["updated", "updatedBy"]
    }
    if existing_without_updated == new_without_updated:
        # print("attempted update without changes... ignoring")
        return
    actual_data = dict(
        **new_without_updated,
        **{
            "updated": timestamp,
            "updatedBy": user_id,
        },
    )
    result = db[collection_name].replace_one(
        {"_id": document_id},
        actual_data,
    )
    if result.matched_count < 1:
        raise IdNotFoundError(f'no result for id "{document_id}"')
    if document["type"] == "Clip" or document.get("clip") is not None:
        if document["type"] == "Clip":
            set_clip_updated(document["_id"], timestamp, user_id)
        elif document.get("clip") is not None:
            set_clip_updated(document["clip"], timestamp, user_id)


def delete_document(collection, document_id, timestamp, user_id):
    document = db[collection].find_one({"_id": document_id})
    if not document:
        raise IdNotFoundError(f'no result for id "{document_id}"')
    clip_id = document.get("clip")
    db[collection].delete_one({"_id": document_id})
    if clip_id is not None:
        set_clip_updated(clip_id, timestamp, user_id)


if __name__ == "__main__":
    print(*db.list_collection_names(), sep="\n")
