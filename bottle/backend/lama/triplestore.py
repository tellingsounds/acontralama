"""Manage the triplestore"""

import requests as r

URL = "http://localhost:3030/playground"


# class Singleton(type):
#     _instances = {}

#     def __call__(cls, *args, **kwargs):
#         if cls not in cls._instances:
#             cls._instances[cls] = super(Singleton, cls).__call__(
#                 *args, **kwargs
#             )
#         return cls._instances[cls]


# class TripleStore(metaclass=Singleton):
#     def __init__(self):
#         self._last_updated = None


def sparql_query(query):
    resp = r.post(
        URL,
        data={"query": query},
        headers={"Accept": "application/sparql-results+json"},
    )
    result = resp.json()
    return result


def import_n_triples(n_triples):
    r.post(
        URL + "/data",
        data=n_triples.encode("utf-8"),
        headers={"Content-Type": "application/n-triples"},
    )


def clear_triples():
    r.post(
        URL + "/update",
        data="CLEAR DEFAULT",
    )
