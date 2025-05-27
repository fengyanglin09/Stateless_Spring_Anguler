import cards


def test_empty(cards_db):
    """Test that a newly created CardsDB is empty."""
    assert cards_db.count() == 0, "Newly created CardsDB should be empty"

    # Check that the path is correct
    assert cards_db.path() == cards_db.path(), "CardsDB path should match the provided path"

    # Check that the path exists
    assert cards_db.path().exists(), "CardsDB path should exist after creation"



def test_two(cards_db):
    """Test that adding two cards increases the count."""
    cards_db.add_card(cards.Card("first"))
    cards_db.add_card(cards.Card("second"))

    assert cards_db.count() == 2, "CardsDB should contain two cards after adding them"

    # Check that the path is still correct
    assert cards_db.path() == cards_db.path(), "CardsDB path should remain consistent after adding cards"

    # Check that the path still exists
    assert cards_db.path().exists(), "CardsDB path should still exist after adding cards"


def test_three(cards_db):
    """Test that adding three cards increases the count."""
    cards_db.add_card(cards.Card("first"))
    cards_db.add_card(cards.Card("second"))
    cards_db.add_card(cards.Card("third"))

    assert cards_db.count() == 3, "CardsDB should contain three cards after adding them"

    # Check that the path is still correct
    assert cards_db.path() == cards_db.path(), "CardsDB path should remain consistent after adding cards"

    # Check that the path still exists
    assert cards_db.path().exists(), "CardsDB path should still exist after adding cards"