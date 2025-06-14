import pytest
from packaging.version import parse

import cards
from cards import Card



@pytest.mark.skip(reason="Card doesn't support < comparison yet")
def test_less_than_1():
    c1 = Card("something", "brain", "todo", 123)
    c2 = Card("something else", "brain", "todo", 456)

    # This should pass because the IDs are different
    assert c1 < c2, "Card with lower ID should be less than card with higher ID"



@pytest.mark.skipif(
	    parse(cards.__version__).major < 2,
	    reason="Card < comparison not supported in 1.x",
	)
def test_less_than_2():
    c1 = Card("something", "brain", "todo", 123)
    c2 = Card("something else", "brain", "todo", 456)

    # This should pass because the IDs are different
    assert c1 < c2, "Card with lower ID should be less than card with higher ID"



@pytest.mark.xfail(
	    parse(cards.__version__).major < 2,
	    reason="Card < comparison not supported in 1.x",
	)
def test_less_than_2():
    c1 = Card("something", "brain", "todo", 123)
    c2 = Card("something else", "brain", "todo", 456)

    # This should pass because the IDs are different
    assert c1 < c2, "Card with lower ID should be less than card with higher ID"