"""Query db for matching entities"""

from lama.database import db


def _log_query(query):
    from pprint import pprint

    pprint(query)


def find_matching_entities(query):
    # _log_query(query)
    result = [e["_id"] for e in db.entities.find(query)]
    return result
