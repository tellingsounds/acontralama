from glob import iglob
import os
import re
import shutil


OUT = "../doc_comments"
MP = "../materialpony"

r = re.compile(r"^/\*\*.*?\*/\n|^\"\"\".*?\"\"\"\n", flags=re.DOTALL)


def export_comments():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.mkdir(OUT)
    for fp in (
        *iglob("frontend/src/**/*.ts*", recursive=True),
        *iglob("bottle/backend/lama/**/*.py", recursive=True),
    ):
        with open(fp, encoding="utf-8") as f:
            s = f.read()
        m = re.search(r, s)
        if m is not None and m.span()[0] == 0:
            dir_name = os.path.join(
                OUT, os.path.dirname(fp).replace("bottle/", "")
            )
            os.makedirs(dir_name, exist_ok=True)
            with open(
                os.path.join(dir_name, os.path.basename(fp)),
                "w",
                encoding="utf-8",
            ) as f:
                f.write(m.group(0))


def import_comments():
    for fp in (
        *iglob(MP + "/frontend/src/**/*.ts*", recursive=True),
        *iglob(MP + "/backend/lama/**/*.py", recursive=True),
    ):
        comment_fp = fp.replace(MP, OUT)
        if os.path.isfile(comment_fp):
            with open(comment_fp, encoding="utf-8") as f:
                comment = f.read()
            with open(fp, encoding="utf-8") as f:
                contents = f.read()
            with open(fp, "w", encoding="utf-8") as f:
                f.write(comment + contents)


def main():
    export_comments()
    import_comments()


if __name__ == "__main__":
    main()
