import json
import os
import sys

from lama.database import db, init_db
from lama.events import handle_event
import lama.eventstore as eventstore
from lama.importexport import xml2events
from lama.entity_usage_count import update_all_usage_counts


def main():
    filename = None
    if len(sys.argv) > 1:
        filename = sys.argv[1]
    if filename is not None:
        print(f"Replacing event log with contents of {filename}...")
        from lxml import etree

        parser = etree.XMLParser(huge_tree=True, strip_cdata=False)
        root = etree.parse(filename, parser)
        events = xml2events(root)
        eventstore.replace_event_log(events)
    init_db(True)
    print("Replaying event log...")
    for event in eventstore.get_events():
        handle_event(event, is_replaying=True)
    print("Setting entity usage counts...")
    update_all_usage_counts()
    print("Setting entity attributes...")
    if not os.path.isfile("cats_relations_mapping.json"):
        return
    with open("cats_relations_mapping.json", encoding="utf-8") as f:
        data = json.load(f)
    for entity_id, fields in data.items():
        attributes = fields.get("attributes")
        if attributes is not None:
            entity = db.entities.find_one({"_id": entity_id})
            if entity is None:
                continue
            if entity["type"] == "PieceOfMusic":
                db.entities.update_one(
                    {"_id": entity_id}, {"$set": {"attributes": attributes}}
                )


if __name__ == "__main__":
    main()
