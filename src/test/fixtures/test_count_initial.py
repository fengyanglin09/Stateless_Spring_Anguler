from pathlib import Path
from tempfile import TemporaryDirectory
import cards


def test_empty():
    with TemporaryDirectory() as db_dir:
        db_path = Path(db_dir) / "cards_db"
        db = cards.CardsDB(db_path)

        assert db.count() == 0, "Newly created CardsDB should be empty"

        # Check that the path is correct
        assert db.path() == db_path, "CardsDB path should match the provided path"

        # Check that the path exists
        assert db_path.exists(), "CardsDB path should exist after creation"