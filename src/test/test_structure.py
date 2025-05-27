import pytest
from cards import Card

def test_to_dict():
    # Given a card object with known contents

    c1 = Card("something", "brain", "todo", 123)

    # When we call to_dict() on the object

    c2 = c1.to_dict()


    # Then the result will be a dictionary with known contents

    c2_expected = {
        "summary": "something",
        "owner": "brain",
        "state": "todo",
        "id": 123
    }

    assert c2 == c2_expected, f"Expected {c2_expected}, but got {c2}"

