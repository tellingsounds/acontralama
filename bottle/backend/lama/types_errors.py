from typing import Dict, NamedTuple


class Event(NamedTuple):
    id: int
    timestamp: str
    event_name: str
    version: int
    user_id: str
    subject_id: str
    data: Dict
    prev_data: Dict
