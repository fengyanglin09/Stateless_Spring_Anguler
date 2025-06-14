from pathlib import Path
from tempfile import TemporaryDirectory

import pytest

import cards
from cards import Card


# this will be setup at the beginning of the test session
# @pytest.fixture(scope="session")
# def db():
#     with TemporaryDirectory() as db_dir:
#         db_path = Path(db_dir) / "cards_db"
#         db = cards.CardsDB(db_path)
#         yield db
#         db.close()

@pytest.fixture(scope="session")
def db(tmp_path_factory):
    db_path = tmp_path_factory.mktemp("cards_db")
    db_ = cards.CardsDB(db_path)
    yield db_
    db_.close()



# this will be setup for each test function to ensure a clean state
@pytest.fixture(scope="function")
def cards_db(db, request, faker):
    """CardsDB object that is empty"""
    db.delete_all()

    # support for `@pytest.mark.num_cards(<some number>)`

    # random seed
    faker.seed_instance(101)

    m = request.node.get_closest_marker("num_cards")

    if m and len(m.args) > 0:
        num_cards = m.args[0]
        for _ in range(num_cards):
            db.add_card(
                Card(summary=faker.sentence(), owner=faker.first_name())
            )

    return db





