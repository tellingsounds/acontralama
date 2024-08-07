from datetime import datetime

from lama.database import dump_mongo_data


def main():
    now = datetime.now().strftime("%Y%m%d%H%M%S")
    dump_mongo_data(f"dumps/mongo_{now}.json")


if __name__ == "__main__":
    main()
