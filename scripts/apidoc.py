from collections import namedtuple
from pprint import pprint
import re

import lama.server as s


METHOD_ORDER = {"GET": 0, "POST": 1, "PUT": 2, "DELETE": 3}


RouteInfo = namedtuple(
    "RouteInfo", ["route", "method", "desc", "params", "req", "resp"]
)


def split_doc_line(s):
    splits = s.split(": ", 1)
    return splits[1] if len(splits) == 2 else splits[0]


def minus_means_none(s):
    return None if s == "-" else s


def parse_doc_str(s):
    if s is None:
        return tuple((None, None, None, None))
    lines = [split_doc_line(l2) for l in s.split("\n") if (l2 := l.strip())]
    return tuple((lines[0], *map(minus_means_none, lines[3:])))


def schema_link(s):
    return re.sub(r"{{(\w+)}}", r"[\1](#\1)", s)


def main():
    with_doc = [
        (r.method, r.rule, r.callback.__doc__)
        for r in s.app.routes
        if r.method != "OPTIONS"
        # if r.callback.__doc__ is not None
    ]
    routes = []
    for method, route, doc in with_doc:
        route_info = RouteInfo(route, method, *parse_doc_str(doc))
        routes.append(route_info)
    sorted_routes = sorted(
        routes, key=lambda r: (r.route, METHOD_ORDER[r.method])
    )
    current_root_route = ""
    with open("routes.md", "w", encoding="utf-8") as f:
        print("## API Routes\n", file=f)
        labels = ["Route", "Method", "Parameters", "Request Body", "Response"]
        for r in sorted_routes:
            root_route = r.route.split("/")[1]
            if root_route != current_root_route:
                current_root_route = root_route
                print(f"\n### `/{root_route}`\n", file=f)
            print(f"\n#### `{r.method} {r.route}`", file=f)
            print(f"\n{r.desc or '_no description yet_'}", file=f)
            print("\n|   | __Route Information__ |", file=f)
            print("|---|---|", file=f)
            print(
                *(
                    f"| __{label}__ | {schema_link(value)} |"
                    for label, value in zip(
                        labels, [r.route, r.method, r.params, r.req, r.resp]
                    )
                    if value is not None
                ),
                sep="\n",
                file=f,
            )


if __name__ == "__main__":
    main()
