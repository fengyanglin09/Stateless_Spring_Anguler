import pytest
import cards

def test_no_path_raises():
    """Test that CardsDB raises an error when no path is provided."""
    with pytest.raises(TypeError):
        cards.CardsDB()  # No path provided


def test_raises_with_info():
    match_regex = "CardsDB\.__init__\(\) missing 1 required positional argument: 'db_path'"
    """Test that CardsDB raises an error with invalid path."""
    with pytest.raises(TypeError, match=match_regex):
        cards.CardsDB()  # Assuming this path is invalid for the test


def test_raises_with_info_alt():

    """Test that CardsDB raises an error with invalid path."""
    with pytest.raises(TypeError) as exc_info:
        cards.CardsDB()  # Assuming this path is invalid for the test

    expected = "missing 1 required positional argument"

    assert expected in str(exc_info.value)