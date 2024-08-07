"""User management"""

from base64 import b64decode, b64encode
from collections import namedtuple
from enum import IntEnum
from hashlib import pbkdf2_hmac
import json
import os
import random
import re
import secrets
import sqlite3
from string import ascii_letters, digits
from time import sleep
import unicodedata

from lama.util import get_timestamp


db_path = os.environ.get("LAMA_USERSTORE_PATH") or "lama_users.db"
conn = sqlite3.connect(db_path)


class UserStoreError(Exception):
    pass


class UserAuthenticationError(UserStoreError):
    pass


class UsernameError(UserStoreError):
    pass


class PasswordError(UserStoreError):
    pass


# comparable privileges so we can check for "minimum" privileges required
class Privileges(IntEnum):
    r = 0
    w = 1
    a = 2

    @classmethod
    def exists(cls, p):
        try:
            _ = cls[p]
            return True
        except KeyError:
            return False


COLUMN_INFO = [
    ("id", "INTEGER PRIMARY KEY"),
    ("username", "TEXT NOT NULL UNIQUE"),
    ("passhash", "BLOB NOT NULL"),
    ("salt", "BLOB NOT NULL"),
    ("privileges", "TEXT NOT NULL"),
    ("email", "TEXT"),
    ("active", "INTEGER NOT NULL"),
    ("reauth", "INTEGER NOT NULL"),
    ("created", "TEXT NOT NULL"),
    ("last_login", "TEXT"),
]

_col_names = [p[0] for p in COLUMN_INFO]


try:
    columns = ", ".join(f"{name} {spec}" for name, spec in COLUMN_INFO)
    conn.cursor().execute(f"CREATE TABLE users ({columns})")
except sqlite3.OperationalError as oe:
    if all(w in str(oe) for w in ("table", "already exists")):
        pass
    else:
        raise


def _hash_password(pw, username, salt):
    combined = unicodedata.normalize("NFC", pw + username).encode("utf-8")
    return pbkdf2_hmac("sha256", combined, salt, 100000)


def _create_salt():
    return secrets.token_bytes(32)


def is_valid_username(s):
    return re.match(r"^[a-z]{2,12}$", s) is not None


def is_valid_password(s):
    # 8-16 chars, at least one [a-z], [A-Z], [0-9]
    patterns = [
        r".*[a-z]",
        r".*[A-Z]",
        r".*[0-9]",
    ]
    has_required_characters = all(re.match(p, s) is not None for p in patterns)
    has_required_length = 8 <= len(s) <= 16
    return has_required_characters and has_required_length


def is_valid_privilege(s):
    return Privileges.exists(s)


INVALID_PASSWORD_MESSAGE = "password must be 8-16 characters with at least one uppercase letter, at least one lowercase letter, and at least one number"


def _generate_password(n=12):
    return "".join(secrets.choice(ascii_letters + digits) for _ in range(n))


def generate_password(n=12):
    p = _generate_password(n)
    while not is_valid_password(p):
        p = _generate_password(n)
    return p


def create_user(username, pw, privileges, email=None):
    if not is_valid_username(username):
        raise UsernameError("username must be 2-12 lowercase letters")
    if not is_valid_password(pw):
        raise PasswordError(INVALID_PASSWORD_MESSAGE)
    if not is_valid_privilege(privileges):
        raise UserStoreError("invalid privileges (allowed: r, w, a)")
    sql = """INSERT INTO users
               ( username, passhash, salt, privileges, email, active, reauth, created )
               VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )"""
    c = conn.cursor()
    salt = _create_salt()
    try:
        c.execute(
            sql,
            (
                username,
                _hash_password(pw, username, salt),
                salt,
                privileges,
                email,
                1,
                0,
                get_timestamp(),
            ),
        )
        conn.commit()
    except sqlite3.IntegrityError as ie:
        if "UNIQUE constraint failed: users.username" in str(ie):
            raise UsernameError("user with that name already exists")
        else:
            raise


def update_user(
    username,
    password=None,
    privileges=None,
    email=None,
    active=None,
    reauth=None,
):
    if reauth is None:
        reauth = True
    to_update = []
    if password is not None:
        if not is_valid_password(password):
            raise PasswordError(INVALID_PASSWORD_MESSAGE)
        salt = _create_salt()
        to_update += [
            ("passhash", _hash_password(password, username, salt)),
            ("salt", salt),
        ]
    if privileges is not None:
        if not is_valid_privilege(privileges):
            raise UserStoreError("invalid privileges (allowed: r, w, a)")
        to_update.append(("privileges", privileges))
    if email is not None:
        to_update.append(("email", email))
    if active is not None:
        to_update.append(("active", int(active)))
    to_update.append(("reauth", int(reauth)))

    c = conn.cursor()
    c.execute(
        "UPDATE users SET "
        + ", ".join(f"{colname} = ?" for colname, _ in to_update)
        + " WHERE username = ?",
        tuple((*(v for _, v in to_update), username)),
    )
    if c.rowcount < 1:
        raise UsernameError("username does not exist")
    conn.commit()


User = namedtuple(
    "User",
    [
        "username",
        "privileges",
        "email",
        "active",
        "reauth",
        "created",
        "last_login",
    ],
)


def _user_from_row(row):
    (
        _,
        username,
        _,
        _,
        privileges,
        email,
        active,
        reauth,
        created,
        last_login,
    ) = row
    return User(
        username,
        privileges,
        email,
        bool(active),
        bool(reauth),
        created,
        last_login,
    )


def _get_rows():
    return conn.cursor().execute("SELECT * FROM users").fetchall()


def get_users(username=None):
    c = conn.cursor()
    sql = "SELECT * FROM users"
    if username is not None:
        sql += " WHERE username = ? ORDER BY created"
        result = c.execute(sql, (username,))
        row = result.fetchone()
        if row is not None:
            return _user_from_row(row)
        else:
            raise UsernameError("username does not exist")
    else:
        result = c.execute(sql + " ORDER BY created")
        return [_user_from_row(row) for row in result.fetchall()]


def delete_user(username):
    c = conn.cursor()
    sql = "DELETE FROM users WHERE username = ?"
    c.execute(sql, (username,))
    if c.rowcount < 1:
        raise UsernameError("username does not exist")
    conn.commit()


def _update_last_login(username):
    c = conn.cursor()
    sql = "UPDATE users SET last_login = ?, reauth = 0 WHERE username = ?"
    c.execute(sql, (get_timestamp(), username))
    conn.commit()


def check_credentials(username, pw):
    c = conn.cursor()
    result = c.execute(
        (
            "SELECT passhash, salt, privileges, active FROM users WHERE username = ?"
        ),
        (username,),
    )
    row = result.fetchone()
    if row is None:
        raise UserAuthenticationError("user doesn't exist")
    passhash, salt, privileges, active = row
    if active != 1:
        raise UserAuthenticationError("that user has been deactivated")
    sleep(random.expovariate(10))
    if not secrets.compare_digest(passhash, _hash_password(pw, username, salt)):
        raise UserAuthenticationError("wrong password")
    _update_last_login(username)
    return privileges


def check_status(username):
    result = conn.cursor().execute(
        ("SELECT privileges, active, reauth FROM users WHERE username = ?"),
        (username,),
    )
    row = result.fetchone()
    if row is None:
        raise UsernameError("user doesn't exist")
    privileges, active, reauth = row
    if not active:
        raise UserAuthenticationError("user is inactive")
    if reauth:
        raise UserAuthenticationError("user must re-authenticate")
    return privileges


def _id_f(x):
    return x


def _b64enc(b):
    return b64encode(b).decode("utf-8")


def _b64dec(s):
    return b64decode(s.encode("utf-8"))


_export_funcs = {
    "passhash": _b64enc,
    "salt": _b64enc,
    "active": bool,
}


def export_users(filename="lama_users.json"):
    rows = conn.cursor().execute("SELECT * FROM users").fetchall()
    as_json = [
        {k: _export_funcs.get(k, _id_f)(v) for k, v in zip(_col_names, row)}
        for row in rows
    ]
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(as_json, f, indent=2, ensure_ascii=False)


_import_funcs = {
    "passhash": _b64dec,
    "salt": _b64dec,
    "active": bool,
}


def import_users(filename="lama_users.json"):
    with open(filename, encoding="utf-8") as f:
        user_data = json.load(f)
    as_rows = [
        tuple(_import_funcs.get(c, _id_f)(u[c]) for c in _col_names)
        for u in user_data
    ]
    c = conn.cursor()
    c.execute("DELETE FROM users")
    c.executemany(
        "INSERT INTO users ("
        + ", ".join(_col_names)
        + ") VALUES ("
        + ", ".join("?" for _ in _col_names)
        + ")",
        as_rows,
    )
    conn.commit()


if __name__ == "__main__":
    print(_get_rows())
    # import_users()
    # export_users()
