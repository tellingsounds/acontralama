"""XXX: Get results from query blocks from db"""

from collections import defaultdict
from functools import reduce

from lama.clips import get_clips
from lama.database import db

# from lama.query_entities import get_queried_entities
from lama.query_entities_mongo import find_matching_entities


def _only_keys(d, keys):
    return {k: v for k in keys if (v := d.get(k)) is not None}


def _get_missing_annot_ids(annotations, retrieved_annot_ids):
    return list(
        set(
            annot_id
            for annot_ids in (
                a.get("constitutedBy", [])
                + ([a["refersTo"]] if a.get("refersTo", "") else [])
                for a in annotations
            )
            for annot_id in annot_ids
            if annot_id not in retrieved_annot_ids
        )
    )


def get_block_result(data):
    conj = data["entities"]["conj"]
    qbs = data["entities"]["qbs"]
    relations = data["annotations"]["relations"]
    interpretative_only = data["annotations"]["interpretativeOnly"]
    absent_only = data["annotations"]["absentOnly"]
    entities_by_qb = {}
    for qb in qbs:
        entities_by_qb[qb["id"]] = find_matching_entities(qb["query"])
    if conj == "all":
        conj_entities = reduce(
            set.intersection, map(set, entities_by_qb.values())
        )
    else:
        conj_entities = set(
            e for result in entities_by_qb.values() for e in result
        )
    matching_annots = list(
        db.annotations.find(
            {
                "target": {"$in": list(conj_entities)},
                **(
                    {"relation": {"$in": relations}}
                    if len(relations) > 0
                    else {}
                ),
                **({"interpretative": True} if interpretative_only else {}),
                **({"notablyAbsent": True} if absent_only else {}),
            }
        )
    )
    # make sure we also get referenced annotations
    retrieved_annot_ids = set(a["_id"] for a in matching_annots)
    additional_annots = []
    extra_annot_ids = _get_missing_annot_ids(
        matching_annots, retrieved_annot_ids
    )
    while len(extra_annot_ids) > 0:
        extra_annots = list(
            db.annotations.find({"_id": {"$in": extra_annot_ids}})
        )
        additional_annots += extra_annots
        retrieved_annot_ids = retrieved_annot_ids.union(
            set(a["_id"] for a in extra_annots)
        )
        extra_annot_ids = _get_missing_annot_ids(
            extra_annots, retrieved_annot_ids
        )
    clip_ids = set(a["clip"] for a in matching_annots)
    element_ids = set(
        el for a in matching_annots if (el := a.get("element")) is not None
    )
    clip_data = {
        clip["_id"]: _only_keys(clip, ["labelTitle"])
        for clip in get_clips(filter_clip_ids=list(clip_ids))
    }
    element_data = {
        el["_id"]: _only_keys(el, ["type", "label"])
        for el in db.elements.find({"_id": {"$in": list(element_ids)}})
    }
    annotation_data = {
        **{a["_id"]: a for a in matching_annots},
        **{a["_id"]: a for a in additional_annots},
    }
    result = {
        "blockAnnotations": {data["id"]: [a["_id"] for a in matching_annots]},
        "annotationData": annotation_data,
        "clipData": clip_data,
        "elementData": element_data,
        "intersectionByClip": None,
    }
    return result


def _grouped_by_clip_ids(annots):
    result = defaultdict(list)
    for annot in annots:
        result[annot["clip"]].append(annot["_id"])
    return result


def _merge_block_results(d1, d2):
    return {
        k: {**d1[k], **d2[k]}
        for k in [
            "blockAnnotations",
            "annotationData",
            "clipData",
            "elementData",
        ]
    }


def get_intersection_by_clip(block_results):
    aggregated_block_results = reduce(_merge_block_results, block_results)
    annot_data = aggregated_block_results["annotationData"]
    grouped = {
        block_id: _grouped_by_clip_ids(
            annot_data[annot_id] for annot_id in annot_ids
        )
        for block_id, annot_ids in aggregated_block_results[
            "blockAnnotations"
        ].items()
    }
    shared_keys = reduce(
        set.intersection, (set(g.keys()) for g in grouped.values())
    )
    result = {
        clip_id: {
            block_id: annots_by_clip[clip_id]
            for block_id, annots_by_clip in grouped.items()
        }
        for clip_id in shared_keys
    }
    final_result = {
        **aggregated_block_results,
        "intersectionByClip": result,
    }
    return final_result
