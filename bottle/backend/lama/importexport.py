"""Import or export events from eventlog"""

from datetime import datetime

# from io import StringIO
import json
import re
from typing import Iterable, List

from lxml import etree  # pip install lxml

from lama.eventstore import get_events
from lama.types_errors import Event


def events2xml(events: Iterable[Event]) -> str:
    root = etree.Element("event_log")
    for event in events:
        event_el = etree.Element("event")
        for i, f in enumerate(event._fields):
            if f in ["data", "prev_data"]:
                v = event[i]
                if v is not None:
                    el = etree.Element(f)
                    el.text = etree.CDATA(
                        json.dumps(v, indent=2, ensure_ascii=False)
                    )
                    event_el.append(el)
            else:
                event_el.set(f, str(event[i]))
        root.append(event_el)

    xml = etree.tostring(root, pretty_print=True, encoding=str)
    with_formatted_attributes = "\n".join(
        (
            re.sub(
                r">$",
                r"\n  >",
                re.sub(r" (\w+\=\"[^\"]+\")", r"\n    \1", line),
            )  # seriously? :)
            if line.startswith("  <event ") and line.endswith('">')
            else line
        )
        for line in xml.splitlines()
    )
    return with_formatted_attributes


def xml2events(xml_tree_root) -> List[Event]:
    events = []
    for event in xml_tree_root.iter("event"):
        event_id = int(event.get("id"))
        timestamp = event.get("timestamp")
        name = event.get("event_name")
        version = int(event.get("version"))
        user_id = event.get("user_id")
        subject_id = event.get("subject_id")
        data = json.loads(event.find("data").text)
        prev_data = (
            json.loads(event.find("prev_data").text)
            if event.find("prev_data") is not None
            else None
        )
        events.append(
            Event(
                event_id,
                timestamp,
                name,
                version,
                user_id,
                subject_id,
                data,
                prev_data,
            )
        )
    return events


def get_events_xml():
    return events2xml(get_events())


if __name__ == "__main__":
    xml = get_events_xml()
    now = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"dumps/eventlog_{now}.xml"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(xml)
    # restored_events = xml2events(xml)
    # assert restored_events == events
    # print("OK")
