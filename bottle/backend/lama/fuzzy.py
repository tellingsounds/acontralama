"""Fuzzy search"""

from collections import defaultdict

from rapidfuzz import fuzz, process

from lama.util import basic_chars_only


def _default_sort(query, id_, match, score):
    return (
        score,  # fuzzy score
        int(match.startswith(query)) * 2  # match starts with query
        + int(query in match)  # entire query contained in match
        + int(query in match.split()),  # query is word in match
        len(match) * -1,  # the shorter, the better
    )


def _make_sort(func, query):
    def _inner_sort(triple):
        # 0: _id, 1: matched string, 2: score
        id_, match, score = triple
        return func(query, id_, match, score)

    return _inner_sort


def fuzzy_map(
    choices_map,
    query,
    limit=None,
    cutoff=75,
    sort_func=None,
    use_partial_token_sort_ratio=False,
    include_score=False,
):
    if sort_func is None:
        sort_func = _default_sort
    choices_index = defaultdict(list)
    for k, v in choices_map.items():
        choices_index[basic_chars_only(v)].append(k)
    choices = list(choices_index.keys())
    scorer = (
        fuzz.partial_token_sort_ratio
        if use_partial_token_sort_ratio
        else fuzz.partial_ratio
    )
    query = basic_chars_only(query)
    result = process.extract(
        query,
        choices,
        limit=limit,
        processor=None,
        scorer=scorer,
        score_cutoff=cutoff,
    )
    fuzz_result = (
        (k, result_key, score)
        for result_key, score, _ in result
        for k in choices_index[result_key]
    )
    result = [
        (k, score) if include_score else k
        for k, _, score in sorted(
            fuzz_result,
            key=_make_sort(sort_func, query),
            reverse=True,
        )
    ]
    return result
