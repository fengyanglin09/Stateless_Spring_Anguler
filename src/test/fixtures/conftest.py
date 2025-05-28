from pathlib import Path
from tempfile import TemporaryDirectory

import pytest

import cards

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
def cards_db(db):
    """CardsDB object that is empty"""
    db.delete_all()
    return db





