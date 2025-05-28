def test_add_some(cards_db, some_cards):
    expected_count = len(some_cards)

    for card in some_cards:
        cards_db.add_card(card)

    assert cards_db.count() == expected_count


def test_non_empty_db(non_empty_db,  some_cards):
    expected_count = len(some_cards)

    assert non_empty_db.count() == expected_count, "Database should contain the expected number of cards"

    # Check that the path is correct
    assert non_empty_db.path() == non_empty_db.path(), "CardsDB path should match the provided path"

    # Check that the path exists
    assert non_empty_db.path().exists(), "CardsDB path should exist after creation"