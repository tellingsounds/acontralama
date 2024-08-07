"""Create data for graph"""

from lama.database import db


def get_graph_data_clip(clip_id, filter_types):
    print(filter_types)
    print(type(filter_types))
    clip_annotations = list(
        db.annotations.find(
            {
                "clip": clip_id,
                "target": {"$exists": True},
                "notablyAbsent": {"$ne": True},
            }
        )
    )
    entity_ids = list(set(a["target"] for a in clip_annotations))
    entities_annotations = list(
        db.annotations.find(
            {
                "target": {"$in": entity_ids},
                "notablyAbsent": {"$ne": True},
                "relation": {"$nin": filter_types},
            }
        )
    )
    clip_ids = list(set(a["clip"] for a in entities_annotations))
    clips = list(db.clips.find({"_id": {"$in": clip_ids}}))
    entities = list(db.entities.find({"_id": {"$in": entity_ids}}))
    link_pairs = set((clip_id, a["target"]) for a in clip_annotations).union(
        set((a["target"], a["clip"]) for a in entities_annotations)
    )
    nodes = [
        *(
            {
                "id": clip["_id"],
                "name": clip.get("label", clip["title"]),
                "type": "clip",
            }
            for clip in clips
        ),
        *(
            {
                "id": entity["_id"],
                "name": entity["label"],
                "type": "entity",
                "entityType": entity["type"],
            }
            for entity in entities
        ),
    ]
    links = [
        {"source": source, "target": target} for source, target in link_pairs
    ]
    return {
        "nodes": nodes,
        "links": links,
    }


def get_graph_data_entity(entity_id, filter_types):
    starting_entity_annots = list(
        db.annotations.find(
            {"target": entity_id, "notablyAbsent": {"$ne": True}}
        )
    )
    clip_ids = list(set(a["clip"] for a in starting_entity_annots))
    clips = list(db.clips.find({"_id": {"$in": clip_ids}}))
    clips_annots = list(
        db.annotations.find(
            {
                "clip": {"$in": clip_ids},
                "target": {"$exists": True},
                "notablyAbsent": {"$ne": True},
                "relation": {"$nin": filter_types},
            }
        )
    )
    entity_ids = list(set(a["target"] for a in clips_annots))
    entities = list(db.entities.find({"_id": {"$in": entity_ids}}))
    link_pairs = set(
        (entity_id, a["clip"]) for a in starting_entity_annots
    ).union(set((a["clip"], a["target"]) for a in clips_annots))
    nodes = [
        *(
            {
                "id": clip["_id"],
                "name": clip.get("label", clip["title"]),
                "type": "clip",
            }
            for clip in clips
        ),
        *(
            {
                "id": entity["_id"],
                "name": entity["label"],
                "type": "entity",
                "entityType": entity["type"],
            }
            for entity in entities
        ),
    ]
    links = [
        {"source": source, "target": target} for source, target in link_pairs
    ]
    return {
        "nodes": nodes,
        "links": links,
    }


if __name__ == "__main__":
    from pprint import pprint

    pprint(get_graph_data_entity("_Person_wolfgang-ambros"))
