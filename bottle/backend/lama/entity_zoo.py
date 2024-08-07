"""Fuzzy search for entities, with caching for improving performance. See
server.py for example usage."""

from collections import defaultdict, OrderedDict
from itertools import islice

from rapidfuzz import fuzz, process

from lama.database import db, DESC
from lama.util import basic_chars_only


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(
                *args, **kwargs
            )
        return cls._instances[cls]


# https://stackoverflow.com/questions/480214/how-do-you-remove-duplicates-from-a-list-whilst-preserving-order
def _without_duplicates(seq):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]


def _entity_has_cats(e):
    return (cats := e.get("analysisCategories")) is not None and len(cats) > 0


class EntityZoo(metaclass=Singleton):
    def _initialize_caches(self):
        self._entities_map = None
        self._fuzzy_entity_id_to_label_str = None
        self._fuzzy_label_str_to_entity_ids = None
        self._fuzzy_label_str_to_entity_types = None
        self._fuzzy_label_str_to_has_cats = None
        self._fuzzy_ordered_label_strs = None

    def __init__(self):
        self._initialize_caches()

    @classmethod
    def get_instance(cls):
        new_instance = cls()
        return new_instance

    def _ensure_entities_map(self):
        if self._entities_map is None:
            print("Building entities map...")
            self._entities_map = OrderedDict(
                (e["_id"], e)
                for e in db.entities.find({}).sort([("usageCount", DESC)])
            )

    def _ensure_fuzzy_index(self):
        print("Building fuzzy lookup structures...")
        entities = self.get_entities()
        self._fuzzy_entity_id_to_label_str = OrderedDict(
            (e["_id"], basic_chars_only(e["label"])) for e in entities
        )
        self._fuzzy_label_str_to_entity_ids = defaultdict(list)
        self._fuzzy_label_str_to_entity_types = defaultdict(list)
        self._fuzzy_label_str_to_has_cats = dict()
        for k, v in self._fuzzy_entity_id_to_label_str.items():
            self._fuzzy_label_str_to_entity_ids[v].append(k)
            self._fuzzy_label_str_to_entity_types[v].append(
                self._entities_map[k]["type"]
            )
            self._fuzzy_label_str_to_has_cats[v] = _entity_has_cats(
                self._entities_map[k]
            )
        self._fuzzy_ordered_label_strs = _without_duplicates(
            self._fuzzy_entity_id_to_label_str.values()
        )

    def invalidate_cache(self):
        print("Invalidating entity cache...")
        self._initialize_caches()

    def get_entities(self, types=None, cats_only=False, limit=None):
        self._ensure_entities_map()
        result = self._entities_map.values()
        if types is not None:
            result = (e for e in result if e["type"] in types)
        if cats_only:
            result = (e for e in result if _entity_has_cats(e))
        if limit is not None:
            result = islice(result, limit)
        return result

    def fuzzy_match_entities(self, query, types=None, cats_only=False):
        self._ensure_entities_map()
        if self._fuzzy_label_str_to_entity_ids is None:
            self._ensure_fuzzy_index()
        cutoff = 100 if len(query) < 3 else 66
        limit = 50
        choices = self._fuzzy_ordered_label_strs
        if types is not None:
            choices = [
                s
                for s in choices
                if any(
                    t in self._fuzzy_label_str_to_entity_types[s] for t in types
                )
            ]
        if cats_only:
            choices = [
                s for s in choices if self._fuzzy_label_str_to_has_cats[s]
            ]
        fuzzy_match_result = process.extract(
            basic_chars_only(query),
            choices,
            limit=limit,
            processor=None,
            scorer=fuzz.partial_ratio,
            score_cutoff=cutoff,
        )  # (id, match, score)
        fuzzy_scores = {
            k: score
            for matched_str, score, _ in fuzzy_match_result
            for k in self._fuzzy_label_str_to_entity_ids[matched_str]
        }
        relevant_entities = (
            self._entities_map[eid] for eid in fuzzy_scores.keys()
        )
        if types is not None:
            relevant_entities = (
                self._entities_map[eid]
                for eid in fuzzy_scores.keys()
                if self._entities_map[eid]["type"] in types
            )
        if cats_only:
            relevant_entities = (
                e for e in relevant_entities if _entity_has_cats(e)
            )
        sorted_result = sorted(
            relevant_entities,
            key=lambda entity: (
                fuzzy_scores[entity["_id"]],
                entity.get("usageCount", 0),
            ),
            reverse=True,
        )
        return sorted_result
