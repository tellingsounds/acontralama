from lama.truth.relations import relation_info, supported_relations
from collections import defaultdict
from lama.truth.entitytypes import entity_type_info

if __name__ == "__main__":
    l = []  # noqa: E741
    l.append("# Relations\n")

    el_by_relation = defaultdict(list)
    for k, v in supported_relations.items():
        for r in v:
            el_by_relation[r].append(k)
    relations_by_entity_type = defaultdict(list)
    for k, v in relation_info.items():
        for et in v["types"]:
            relations_by_entity_type[et].append(k)

    for k, v in sorted(relation_info.items(), key=lambda pair: pair[1]["label"]):
        l.append(f"## {v['label']} ({k.name})\n")
        l.append("### Definition:\n")
        l.append(f"{v['definition']}\n")

        types = v["types"]
        if len(types) > 0:
            l.append("### Supported Entity Types:\n")
            for et in sorted(types, key=lambda t: entity_type_info[t]["label"]):
                l.append(f"+ {entity_type_info[et]['label']} ({et.name})")
            l.append("")

        roles = v["roles"]
        if len(roles) > 0:
            l.append("### Supported Roles:")
            for r in roles:
                l.append(f"+ {r.name}")
            l.append("")

        if len(el_by_relation) > 0:
            l.append("### Elements:\n")
            for e in el_by_relation[k]:
                if e.name == "Segment":
                    l.append("+ Interpretation")
                else:
                    l.append(f"+ {e.name}")
            l.append("")

    l.append("# Entity Types")
    for k, v in sorted(entity_type_info.items(), key=lambda pair: pair[1]["label"]):
        l.append(f"## {v['label']} [{k.name}]")
        l.append("")
        l.append("### Definition:\n")
        l.append(f"{v['definition']}\n")
        relations = relations_by_entity_type[k]
        if len(relations) > 0:
            l.append("### Allowed for:\n")
            for rel in sorted(relations, key=lambda r: relation_info[r]["label"]):
                l.append(f"+ {relation_info[rel]['label']} ({rel.name})")
            l.append("")
        l.append("")

    s = "\n".join(l)

    with open("frontend/src/generated/glossary.md", "w", encoding="utf-8") as f:
        f.write(s)
