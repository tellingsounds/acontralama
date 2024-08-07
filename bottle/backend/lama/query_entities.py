"""XXX: Build sparql queries"""

from lama.triplestore import sparql_query

PREFIX_E = "https://tellingsounds.com/lama/entities#"

QUERY_DATA = {
    "and": [
        {
            "all": [
                {"var": "entityType"},
                {"in": [{"var": ""}, ["PieceOfMusic"]]},
            ]
        },
        {
            "or": [
                {
                    "all": [
                        {"var": "attribute.composer"},
                        {"in": [{"var": ""}, ["_Person_david-bowie"]]},
                    ]
                },
                {
                    "all": [
                        {"var": "attribute.lyricist"},
                        {"in": [{"var": ""}, ["_Person_wolfgang-ambros"]]},
                    ]
                },
            ]
        },
    ]
}


PREFIXES = """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX wd: <https://www.wikidata.org/wiki/>
PREFIX gnd: <http://d-nb.info/gnd/>
PREFIX mbr: <https://musicbrainz.org/relations/>
PREFIX mbw: <https://musicbrainz.org/work/>
PREFIX mba: <https://musicbrainz.org/artist/>
PREFIX t: <https://tellingsounds.com/lama/entityTypes#>
PREFIX p: <https://tellingsounds.com/lama/properties#>
PREFIX a: <https://tellingsounds.com/lama/analysisCats#>
PREFIX : <https://tellingsounds.com/lama/entities#>
"""

PROPERTY_MAP = {
    "entityType": "rdf:type",
    "attribute.composer": "mbr:composer",
    "attribute.lyricist": "mbr:lyricist",
    "analyticsCat": "p:analysisCat",
    "isEntity": "owl:sameAs",
}

PREFIX_MAP = {
    "entityType": "t",
    "attribute.composer": "",
    "attribute.lyricist": "",
    "analyticsCat": "a",
    "isEntity": "",
}


def _next_level(tree):
    # because there's only ever going to be one pair, right?
    [first_pair] = tree.items()
    return first_pair


def _maybe_negated(tree):
    key, child_tree = _next_level(tree)
    is_negated = key == "!"
    return (is_negated, child_tree if is_negated else tree)


def _is_negated(tree):
    is_negated, _ = _maybe_negated(tree)
    return is_negated


def _reverse_negated(tree, should_reverse):
    if not should_reverse:
        return tree
    is_negated, actual_tree = _maybe_negated(tree)
    return actual_tree if is_negated else {"!": actual_tree}


def _is_rule(tree):
    _, actual_tree = _maybe_negated(tree)
    key, _ = _next_level(actual_tree)
    return key in ("all", "some", "none")


INDENT = 2


def _indent(level):
    return level * INDENT * " "


def _do_rule(tree, indent_level, conj):
    is_negated, actual_tree = _maybe_negated(tree)
    everything_maybe = "{ { ?s ?p ?o } " if is_negated and conj == "or" else ""
    minus_maybe = everything_maybe + "MINUS " if is_negated else ""
    extra_closer = " }" if is_negated and conj == "or" else ""
    result = "\n" + _indent(indent_level) + minus_maybe + "{ "
    _, rule_items = _next_level(actual_tree)
    var_info, in_info = rule_items
    var_name = var_info["var"]
    _, values = in_info["in"]
    # understanding jsonlogic all-in as "includes all" operator
    result += (
        "?s "
        + PROPERTY_MAP[var_name]
        + " "
        + ", ".join(PREFIX_MAP[var_name] + ":" + v for v in values)
    )
    result += " }" + extra_closer
    return result


CONJ_FLIPPER = {
    "and": ["and", "or"],
    "or": ["or", "and"],
}


def _do_group(tree, indent_level=1):
    is_negated, actual_tree = _maybe_negated(tree)
    conj, group_items = _next_level(actual_tree)
    conj = CONJ_FLIPPER[conj][int(is_negated)]  # int(False) == 0
    result = "\n" + _indent(indent_level) + "{"
    possibly_negated_items = [
        _reverse_negated(item, is_negated) for item in group_items
    ]
    non_negated = [
        item for item in possibly_negated_items if not _is_negated(item)
    ]
    negated = [item for item in possibly_negated_items if _is_negated(item)]
    negation_guardian = (
        "\n" + (_indent(indent_level + 1) + "{ ?s ?p ?o }")
        if len(non_negated) == 0
        else ""
    )
    result += negation_guardian
    joiner = (
        "\n" + _indent(indent_level + 1) + ("." if conj == "and" else "UNION")
    )
    result += joiner.join(
        (
            _do_rule(item, indent_level + 1, conj)
            if _is_rule(item)
            else _do_group(item, indent_level + 1)
        )
        for item in [*non_negated, *negated]
    )
    result += "\n" + _indent(indent_level) + "}"
    return result


def build_sparql_query(query_data):
    query = PREFIXES + "\n"
    query += "SELECT DISTINCT ?s WHERE {"
    query += _do_group(query_data)
    query += "\n  FILTER( regex(str(?s), 'tellingsounds.com/lama') )\n}"
    return query


# TODOs:
# nested subqueries
# go up the hierarchy
# maybe also write tests that check the returned results
def get_queried_entities(query_data):
    if query_data is None:
        query_data = QUERY_DATA
    print(query_data)
    query = build_sparql_query(query_data)
    print(query)
    result = sparql_query(query)
    # print(result)
    entity_ids = [
        item["s"]["value"].replace(PREFIX_E, "")
        for item in result["results"]["bindings"]
    ]
    # print(entity_ids)
    return entity_ids


if __name__ == "__main__":
    print(get_queried_entities(None))
