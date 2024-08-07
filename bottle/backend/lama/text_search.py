"""Functions for searching quotes (and other text)"""

import re

from lama.clips import get_clips
from lama.database import db
from lama.fuzzy import fuzzy_map
from lama.util import basic_chars_only


def _sort_func(query, id_, match, score):
    whole_query_score = len(re.findall(query, match))
    whole_word_score = 0
    whole_word_present_count = 0
    partial_match_score = 0
    starting_match_score = 0
    query_tokens = [w for w in query.split() if len(w) > 2]
    for w in query_tokens:
        find_count = len(re.findall(w, match, flags=re.MULTILINE))
        whole_word_score += find_count
        whole_word_present_count += min(find_count, 1)
    for w in query_tokens:
        s = w
        for _ in range(3):
            if len(s) > 2:
                if s in match:
                    partial_match_score += len(s)
                    break
                s = s[:-1]
    for w in query_tokens:
        s = w
        for _ in range(3):
            if len(s) > 2:
                starting_count = len(
                    re.findall(rf"\b{s}.*?\b", match, flags=re.MULTILINE)
                )
                if starting_count > 0:
                    starting_match_score += min(starting_count, 1) * len(s)
                    break
                s = s[:-1]
    all_query_tokens_score = whole_word_present_count / len(query_tokens)
    result = (
        whole_query_score,
        all_query_tokens_score,
        whole_word_score,
        starting_match_score,
        partial_match_score,
        score,
    )
    return result


def quote_search(query, person_ids=None):
    if person_ids is None:
        person_ids = []
    person_filter = {"target": {"$in": person_ids}}
    annots = []
    if query:
        text_results = [
            (a["_id"], a["score"] * 100)
            for a in db.annotations.find(
                {
                    "$text": {
                        "$search": query,
                    },
                    **(person_filter if len(person_ids) > 0 else {}),
                },
                {"score": {"$meta": "textScore"}},
            )
        ]
        q_map = {
            a["_id"]: a["quotes"]
            for a in db.annotations.find(
                {
                    "quotes": {"$exists": True},
                    **(person_filter if len(person_ids) > 0 else {}),
                }
            )
        }
        fuzzy_results = fuzzy_map(
            q_map,
            query,
            cutoff=40,
            sort_func=lambda _a, _b, _c, _d: 1,  # do nothing basically
            use_partial_token_sort_ratio=True,
            include_score=True,
        )
        combined_results = [
            *text_results,
            *fuzzy_results,
        ]
        score_map = {annot_id: score for annot_id, score in combined_results}
        annot_ids = list(set(pair[0] for pair in combined_results))
        annots = list(db.annotations.find({"_id": {"$in": annot_ids}}))
        q_map = {a["_id"]: basic_chars_only(a["quotes"]) for a in annots}
        a_map = {a["_id"]: a for a in annots}
        q = basic_chars_only(query)
        annot_ids_with_scores = [
            (
                annot_id,
                _sort_func(q, annot_id, annot_quote, score_map[annot_id]),
            )
            for annot_id, annot_quote in q_map.items()
        ]
        filtered_annot_ids_with_scores = [
            (annot_id, scores)
            for annot_id, scores in annot_ids_with_scores
            if any(x > 0 for x in scores[:-1])
        ]
        sorted_annot_ids = [
            annot_id
            for annot_id, _ in sorted(
                filtered_annot_ids_with_scores,
                key=lambda pair: pair[1],
                reverse=True,
            )
        ]
        annots = [a_map[x] for x in sorted_annot_ids]
    else:
        annots = list(
            db.annotations.find(
                {
                    "quotes": {"$exists": True},
                    **(person_filter if len(person_ids) > 0 else {}),
                }
            )
        )
    clip_ids = list(set(a["clip"] for a in annots))
    clip_data = {
        clip["_id"]: clip for clip in get_clips(filter_clip_ids=clip_ids)
    }
    element_ids = set(
        el for a in annots if (el := a.get("element")) is not None
    )
    element_data = {
        el["_id"]: el
        for el in db.elements.find({"_id": {"$in": list(element_ids)}})
    }
    return {
        "annotationIds": [a["_id"] for a in annots],
        "annotationData": {a["_id"]: a for a in annots},
        "clipData": clip_data,
        "elementData": element_data,
    }


if __name__ == "__main__":
    print(quote_search("austropop danzer fendrich", []))
