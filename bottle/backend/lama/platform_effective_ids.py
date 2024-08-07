"""Create Ids from URLs for uniqueness check of Clips"""

import re
from urllib.parse import urlparse, parse_qs


last_num_re = re.compile(r"^.+/(\d+).*$")


def _get_last_numeric(url):
    if (match := last_num_re.match(url)) is not None:
        return match.group(1)
    return None


last_alphanum_re = re.compile(r"^.+/([A-Za-z0-9_-]+).*$")


def _get_last_alphanumeric(url):
    if (match := last_alphanum_re.match(url)) is not None:
        return match.group(1)
    return None


def _get_query_param(url, param):
    if (vals := parse_qs(urlparse(url).query).get(param)) is not None:
        return vals[0]
    return None


def _eff_facebook(url):
    if (v := _get_query_param(url, "v")) is not None:
        return f"fb:{v}"
    elif (n := _get_last_numeric(url)) is not None:
        return f"fb:{n}"
    return url


mediathek_re = re.compile(
    r"[A-F0-9]{8}-[A-F0-9]{3}-[A-F0-9]{5}-[A-F0-9]{8}-[A-F0-9]{8}"
)


def _eff_mediathek(url):
    if (match := mediathek_re.search(url)) is not None:
        return f"mediathek:{match.group(0)}"
    return url


def _eff_pha(url):
    if (v := _get_query_param(url, "id")) is not None:
        return f"pha:{v}"
    elif (n := _get_last_numeric(url)) is not None:
        return f"pha:{n}"
    return url


def _eff_okto(url):
    if (n := _get_last_numeric(url)) is not None:
        return f"okto:{n}"
    return url


def _eff_youtube(url):
    if (v := _get_query_param(url, "v")) is not None:
        return f"yt:{v}"
    elif (x := _get_last_alphanumeric(url)) is not None:
        return f"yt:{x}"
    return url


def effective_id_from_url(url: str) -> str:
    if url is None:
        return None
    netloc = urlparse(url.lower()).netloc
    if "facebook." in netloc:
        return _eff_facebook(url)
    if "mediathek.at" in netloc:
        return _eff_mediathek(url)
    if "phonogrammarchiv.at" in netloc or "pharchiv.local" in netloc:
        return _eff_pha(url)
    if "okto.tv" in netloc:
        return _eff_okto(url)
    if "youtube." in netloc or "youtu.be" in netloc:
        return _eff_youtube(url)
    return url
