"""Different utility functions"""

from datetime import datetime, timezone
import re

from unidecode import unidecode


def get_timestamp():
    return datetime.utcnow().replace(tzinfo=timezone.utc).isoformat()


def replace_umlauts_etc(s):
    return (
        s.replace("ä", "ae")
        .replace("a\u0308", "ae")
        .replace("ö", "oe")
        .replace("o\u0308", "oe")
        .replace("ü", "ue")
        .replace("u\u0308", "ue")
        .replace("ß", "ss")
    )


def sorted_enums(es):
    return sorted(es, key=lambda e: e.name)


BASIC_CHARS_PAT = re.compile(r"[^a-z0-9 ]")


def basic_chars_only(s):
    return re.sub(
        BASIC_CHARS_PAT, "", unidecode(replace_umlauts_etc(s.lower()))
    )
