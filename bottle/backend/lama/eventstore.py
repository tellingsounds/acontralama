"""All the interaction with the event log database (SQLite) happens here."""

import json
import os

import sqlite3
from typing import Dict, Iterable, List, Tuple

from lama.types_errors import Event


db_path = os.environ.get("LAMA_DB_PATH") or "lama.db"
conn = sqlite3.connect(db_path)
# prevdata for restoring object
# sqlite may be bottleneck in the future

COLUMN_INFO = [
    ("id", "INTEGER PRIMARY KEY"),
    ("timestamp", "TEXT NOT NULL"),
    ("event_name", "TEXT NOT NULL"),
    ("version", "INTEGER NOT NULL"),
    ("user_id", "TEXT"),
    ("subject_id", "TEXT"),
    ("data", "TEXT NOT NULL"),  # serialized JSON
    ("prev_data", "TEXT"),  # serialized JSON
]

try:
    columns = ", ".join(f"{name} {spec}" for name, spec in COLUMN_INFO)
    conn.cursor().execute(f"CREATE TABLE events ({columns})")
except sqlite3.OperationalError as oe:
    if all(w in str(oe) for w in ("table", "already exists")):
        pass
    else:
        raise


def _row_as_dict(colnames, row) -> Dict:
    return {key: value for key, value in zip(colnames, row)}


def clear_events() -> None:
    c = conn.cursor()
    c.execute("DELETE FROM events")
    conn.commit()


def get_events_as_dicts() -> List[Dict]:
    c = conn.cursor()
    result = c.execute("SELECT * FROM events ORDER BY timestamp")
    columns = [d[0] for d in c.description]
    return [{k: v for k, v in zip(columns, row)} for row in result.fetchall()]


def _as_event(row):
    return Event(
        *row[:6], json.loads(row[6] or "null"), json.loads(row[7] or "null")
    )


def get_events() -> List[Event]:
    c = conn.cursor()
    result = c.execute("SELECT * FROM events ORDER BY timestamp")
    return [_as_event(row) for row in result.fetchall()]


def get_events_by_type(event_types, entity_id=None):
    c = conn.cursor()
    sql = "SELECT * FROM events WHERE event_name IN ({names}){entity_id_maybe} ORDER BY timestamp".format(
        names=", ".join("?" for _ in event_types),
        entity_id_maybe=(
            " AND subject_id = ?" if entity_id is not None else ""
        ),
    )
    params = [*event_types, entity_id] if entity_id is not None else event_types
    result = c.execute(sql, params)
    return [_as_event(row) for row in result.fetchall()]


def _dump_json(data):
    # handle mongodb ObjectIds if necessary
    try:
        return json.dumps(data, ensure_ascii=False)
    except TypeError as err:
        if "ObjectId" in str(err):
            from bson import json_util

            return json_util.dumps(data, ensure_ascii=False)


def store(event: Event) -> None:
    columns = ", ".join(name for name, _ in COLUMN_INFO[1:])  # without id
    qmarks = ", ".join("?" for _ in range(len(COLUMN_INFO[1:])))
    sql = f"INSERT INTO events ({columns}) VALUES ({qmarks})"
    values = (
        event.timestamp,
        event.event_name,
        event.version,
        event.user_id,
        event.subject_id,
        _dump_json(event.data),
        _dump_json(event.prev_data) if event.prev_data is not None else None,
    )
    c = conn.cursor()
    c.execute(sql, values)
    conn.commit()


def _serialize_data(event: Event) -> Tuple:
    return (
        event.id,
        event.timestamp,
        event.event_name,
        event.version,
        event.user_id,
        event.subject_id,
        json.dumps(event.data, ensure_ascii=False),
        (
            json.dumps(event.prev_data, ensure_ascii=False)
            if event.prev_data is not None
            else None
        ),
    )


def replace_event_log(events: Iterable[Event]) -> None:
    columns = ", ".join(name for name, _ in COLUMN_INFO)  # without id
    qmarks = ", ".join("?" for _ in range(len(COLUMN_INFO)))
    sql = f"INSERT INTO events ({columns}) VALUES ({qmarks})"
    c = conn.cursor()
    c.execute("DELETE FROM events")
    c.executemany(sql, map(_serialize_data, events))
    conn.commit()


def dump_events(filename: str):
    events = get_events_as_dicts()
    with open(filename, "w", encoding="utf-8") as outfile:
        json.dump(events, outfile, indent=2, ensure_ascii=False)
