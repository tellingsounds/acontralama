"""Functions for managing relations between entities"""

from collections import defaultdict
import json

from lama.eventstore import get_events_by_type
from lama.triplestore import import_n_triples, sparql_query
from lama.truth.commands_events import Events


PREFIX_SKOS = "http://www.w3.org/2004/02/skos/core#"
PREFIX_E = "https://tellingsounds.com/lama/entities#"


def _iri(prefix, id_):
    return f"<{prefix}{id_}>"


def _triple(entity_id, relation, target_id):
    return " ".join(
        [
            _iri(PREFIX_E, entity_id),
            _iri(PREFIX_SKOS, relation),
            _iri(PREFIX_E, target_id),
            ".",
        ]
    )


def _triple_from_event(event):
    return _triple(
        event.data["_id"], event.data["relation"], event.data["targetId"]
    )


def _triple_from_row(row):
    data = json.loads(row[6])
    return _triple_from_event(data)


SKOS_SLICE = len(PREFIX_SKOS)
E_SLICE = len(PREFIX_E)


def _get_result(p_and_o):
    return (
        p_and_o["p"]["value"][SKOS_SLICE:],
        p_and_o["o"]["value"][E_SLICE:],
    )


def _get_entity_relations_query(entity_id):
    return (
        f"PREFIX skos: <{PREFIX_SKOS}>"
        """

SELECT DISTINCT ?p ?o
WHERE {
  BIND("""
        f"{_iri(PREFIX_E, entity_id)}"
        """ AS ?s)
  {
    ?s skos:related ?r .
    BIND(skos:related AS ?p)
    BIND(?r AS ?o)
  }
  UNION {
    ?s skos:broader ?b .
    BIND(skos:broader AS ?p)
    BIND(?b AS ?o)
  }
  UNION {
    ?s skos:broaderTransitive ?bt .
    BIND(skos:broaderTransitive AS ?p)
    BIND(?bt AS ?o)
  }
  UNION {
    ?s skos:narrower ?n .
    BIND(skos:narrower AS ?p)
    BIND(?n AS ?o)
  }
  UNION {
    ?s skos:narrowerTransitive ?nt .
    BIND(skos:narrowerTransitive AS ?p)
    BIND(?nt AS ?o)
  }
}
"""
    )


def get_entity_relations(entity_id):
    result = sparql_query(_get_entity_relations_query(entity_id))
    aggregated = defaultdict(list)
    for p, o in map(_get_result, result["results"]["bindings"]):
        aggregated[p].append(o)
    return aggregated


def add_relation(entity_id, relation, target_id):
    import_n_triples(_triple(entity_id, relation, target_id))


def set_entity_relations_from_events():
    events = get_events_by_type(
        [Events.EntityRelationAdded.name, Events.EntityRelationRemoved.name]
    )
    n_triples = "\n".join(map(_triple_from_event, events))
    import_n_triples(n_triples)
