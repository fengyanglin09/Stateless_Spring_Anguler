import pytest

def test_no_marker(cards_db):
    assert cards_db.count() == 0



@pytest.mark.num_cards
def test_marker_with_no_param(cards_db):
    """Test that the marker works without parameters."""
    assert cards_db.count() == 0, "Expected no cards, but found some."


@pytest.mark.num_cards(3)
def test_three_cards(cards_db):
    """Test that the marker works with a parameter."""
    assert cards_db.count() == 3, "Expected 3 cards, but found a different number."

    # print()
    #
    # for c in cards_db.list_cards():
    #     print(c)



@pytest.mark.num_cards(10)
def test_ten_cards(cards_db):
    """Test that the marker works with a different parameter."""
    assert cards_db.count() == 10, "Expected 10 cards, but found a different number."
    #
    # print()
    #
    # for c in cards_db.list_cards():
    #     print(c)