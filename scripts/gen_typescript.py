from datetime import datetime
from enum import Enum
import json
import subprocess
from typing import Dict, Iterable, List, Union

from lama.truth.entitytypes import EntityTypes, entity_type_info
from lama.truth.analysis_categories import (
    AnalysisCategories,
    analysis_cat_labels,
)
from lama.truth.relations import (
    AnnotationFields,
    Elements,
    Relations,
    NestedGroupLabels,
    NestedElements,
    relation_info,
    supported_relations,
    nested_elements,
    nested_elements_labels,
)
from lama.schemas import FormTypes, get_allowed_keys
from lama.server import CLIP_SORT_FIELDS


class PrettierError(Exception):
    pass


def de_enumify(o):
    if isinstance(o, dict):
        return {
            (k.name if isinstance(k, Enum) else k): de_enumify(v)
            for k, v in o.items()
        }
    elif isinstance(o, list):
        return [de_enumify(e) for e in o]
    else:
        return o.name if isinstance(o, Enum) else o


def create_literals_type(name: str, entries: Iterable[str], export=True) -> str:
    return (
        ("export " if export else "")
        + f"type {name} ="
        + "".join(f"\n  | '{entry}'" for entry in entries)
        + ";\n"
    )


def create_nested_literals_type(
    name: str, entries: Iterable[str], export=True
) -> str:
    return (
        ("export " if export else "")
        + f"type {name} ="
        + "".join(f"\n  | '{entry}'" for entry in entries)
        + ";\n"
    )


JSONable = Union[Dict, List, str, int]


def create_jsonable(name: str, data: JSONable, export=True, typing=None) -> str:
    data_as_json = json.dumps(data, indent=2, ensure_ascii=True)
    return (
        ("export " if export else "")
        + f"const {name}"
        + (f": {typing}" if typing is not None else "")
        + " ="
        + data_as_json
        + ";\n"
    )


def format_with_prettier(typescript: str) -> str:
    p = subprocess.run(
        [
            "frontend/node_modules/.bin/prettier",
            "--config",
            "frontend/.prettierrc.js",
            "--stdin-filepath",
            "typescript.ts",
        ],
        input=typescript,
        encoding="utf-8",
        capture_output=True,
    )
    if p.returncode == 0:
        return p.stdout
    else:
        raise PrettierError(p.stderr)


GEN_DIR = "frontend/src/generated"


def generate_typescript(filename: str, elements: Iterable[str]) -> None:
    now = datetime.now().isoformat()
    assembled_code = "\n".join(
        [
            f"// generated {now} by gen_typescript.py - don't make changes here! :)\n",
            *elements,
        ]
    )
    formatted_code = format_with_prettier(assembled_code)
    with open(f"{GEN_DIR}/{filename}", "w", encoding="utf-8") as f:
        f.write(formatted_code)


def main():
    generate_typescript(
        "entityTypes.ts",
        [
            create_jsonable("entityTypes", [e.name for e in EntityTypes]),
            create_literals_type("EntityType", [e.name for e in EntityTypes]),
            create_jsonable(
                "entityTypeLabels",
                {k.name: v["label"] for k, v in entity_type_info.items()},
                typing="Record<typeof entityTypes[number], string>",
            ),
        ],
    )
    generate_typescript(
        "relations.ts",
        [
            create_literals_type("Element", [e.name for e in Elements]),
            create_literals_type("Relation", [r.name for r in Relations]),
            create_literals_type(
                "NestedElements", [n.name for n in NestedElements]
            ),
            create_literals_type(
                "NestedGroupLabels", [n.name for n in NestedGroupLabels]
            ),
            create_literals_type(
                "AnnotationField", [f.name for f in AnnotationFields]
            ),
            *(
                create_jsonable(
                    f"all{el.name}Relations",
                    [r.name for r in supported_relations[el]],
                )
                for el in Elements
                if len(supported_relations[el]) > 0
            ),
            *(
                create_literals_type(
                    f"{el.name}Relation",
                    [r.name for r in supported_relations[el]],
                )
                for el in Elements
                if len(supported_relations[el]) > 0
            ),
            *(
                create_nested_literals_type(
                    f"{el.name}Relation",
                    [r.name for r in supported_relations[el]],
                )
                for el in Elements
                if len(supported_relations[el]) > 0
                and el in ["MusicLayer", "SpeechLayer", "SoundLayer"]
            ),
            create_jsonable(
                "supportedRelations", de_enumify(supported_relations)
            ),
            create_jsonable("nestedGroupElements", de_enumify(nested_elements)),
            create_jsonable(
                "nestedElementsLabels", de_enumify(nested_elements_labels)
            ),
            create_jsonable(
                "connectionRelationInfo", de_enumify(relation_info)
            ),
        ],
    )
    generate_typescript(
        "formFields.ts",
        [
            create_jsonable(
                "allowedFieldsMap",
                {ft.name: get_allowed_keys(ft) for ft in FormTypes},
            ),
        ],
    )
    generate_typescript(
        "analysisCategories.ts",
        [
            create_literals_type(
                "AnalysisCategory",
                [a.name for a in AnalysisCategories],
            ),
            create_jsonable(
                "analysisCategories",
                [a.name for a in AnalysisCategories],
                typing="AnalysisCategory[]",
            ),
            create_jsonable(
                "analysisCategoryLabels",
                {k.name: v for k, v in analysis_cat_labels.items()},
                typing="Record<AnalysisCategory, string>",
            ),
        ],
    )
    generate_typescript(
        "clipList.ts",
        [
            create_jsonable(
                "allowedSortFields",
                [f for f in CLIP_SORT_FIELDS],
            ),
        ],
    )


if __name__ == "__main__":
    main()
