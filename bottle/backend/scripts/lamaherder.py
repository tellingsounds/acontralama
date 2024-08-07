"""Command line script for administration tasks."""
import argparse
from datetime import datetime
from sys import stdout, stderr

import lama.userstore as u


def _date_only(iso_date):
    return datetime.fromisoformat(iso_date).strftime("%Y-%m-%d")


def _datetime_only(iso_date):
    return datetime.fromisoformat(iso_date).strftime("%Y-%m-%dT%H:%M:%S")


def _truncated(s, n):
    return s if len(s) <= n else s[: n - 3] + "..."


def _centered(fspec):
    return fspec.replace(">", "^").replace("<", "^")


def do_show_users(username):
    # heading, formatting, getter
    format_info = [
        ("Username", "<12", lambda user: user.username),
        (
            "Email",
            "<24",
            lambda user: _truncated(user.email or "-", 24)
            if username is None
            else user.email or "-",
        ),
        ("Prv.", "^4", lambda user: user.privileges),
        ("Act.", "^4", lambda user: "y" if user.active else "n"),
        ("ReA.", "^4", lambda user: "y" if user.reauth else "n"),
        ("Created", "^10", lambda user: _date_only(user.created)),
        (
            "Last Login (UTC)",
            "^20",
            lambda user: _datetime_only(user.last_login)
            if user.last_login is not None
            else "-",
        ),
    ]
    if username is None:
        print(
            "  ".join(
                ("{:" + _centered(fspec) + "}").format(heading)
                for heading, fspec, _ in format_info
            )
        )
        print(
            *(
                "  ".join(
                    ("{:" + fspec + "}").format(f(user))
                    for _, fspec, f in format_info
                )
                for user in u.get_users()
            ),
            sep="\n",
        )
    else:
        user = u.get_users(username)
        print(
            *(
                f"{heading + ':':<17} {f(user)}"
                for heading, _, f in format_info
            ),
            sep="\n",
        )


def do_create_user(username, email, privileges, password):
    u.create_user(username, password, privileges or "w", email)


def do_delete_user(username):
    u.delete_user(username)


def do_update_user(
    username,
    password=None,
    privileges=None,
    email=None,
    active=None,
    reauth=True,
):
    u.update_user(username, password, privileges, email, active, reauth)


def yes_no(s):
    if s in "yY1":
        return True
    elif s in "nN0":
        return False
    else:
        raise ValueError("invalid value")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "command",
        choices=["showusers", "createuser", "deleteuser", "updateuser"],
    )
    parser.add_argument("username", nargs="?", default=None)
    parser.add_argument("--password", "-p", nargs="?", const="__generate__")
    parser.add_argument("--email", "-e")
    parser.add_argument("--privileges", "-v", metavar="rwa")
    parser.add_argument("--active", "-a", type=yes_no, help="yn", metavar="yn")
    parser.add_argument("--reauth", "-r", type=yes_no, help="yn", metavar="yn")
    args = parser.parse_args()
    if args.command == "showusers":
        if any(
            v is not None
            for k, v in vars(args).items()
            if k not in ["command", "username"]
        ):
            print("only username allowed for showusers", file=stderr)
            exit(1)
        try:
            do_show_users(args.username)
        except u.UsernameError as e:
            print(str(e), file=stderr)
            exit(1)
    if args.command == "createuser":
        if args.username is None:
            print("username is required", file=stderr)
            exit(1)
        generated_password = None
        if args.password is None:
            generated_password = u.generate_password()
        try:
            do_create_user(
                args.username,
                args.email,
                args.privileges,
                args.password or generated_password,
            )
        except u.UserStoreError as e:
            print(str(e), file=stderr)
            exit(1)
        if generated_password is not None:
            print("Generated password (will not be shown again):", file=stderr)
            print(generated_password, file=stdout)
    if args.command == "deleteuser":
        if args.username is None:
            print("username is required", file=stderr)
            exit(1)
        if any(
            v is not None
            for k, v in vars(args).items()
            if k not in ["command", "username"]
        ):
            print("only username allowed for showusers", file=stderr)
            exit(1)
        try:
            do_delete_user(args.username)
        except u.UsernameError as e:
            print(str(e), file=stderr)
            exit(1)
    if args.command == "updateuser":
        if args.username is None:
            print("username is required", file=stderr)
            exit(1)
        generated_password = None
        if args.password == "__generate__":
            generated_password = u.generate_password()
        try:
            do_update_user(
                args.username,
                generated_password
                if generated_password is not None
                else args.password,
                args.privileges,
                args.email,
                args.active,
                True if args.reauth is None else args.reauth,
            )
        except u.PasswordError as e:
            print(str(e), file=stderr)
            exit(1)
        if generated_password is not None:
            print("Generated password (will not be shown again):", file=stderr)
            print(generated_password, file=stdout)


if __name__ == "__main__":
    main()
