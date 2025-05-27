import pytest
from cards import Card

def test_with_fail():
    c1 = Card("something", "brain", "todo", 123)
    c2 = Card("something else", "brain", "todo", 123)
    # This should fail because the summaries are different
    with pytest.raises(AssertionError):
        assert c1 == c2



def assert_identical(c1,    c2):
    """Custom assertion to check if two cards are identical."""
    __tracebackhide__ = True
    assert c1 == c2
    if c1.id != c2.id:
        pytest.fail(f"IDs do not match: {c1.id} != {c2.id}")


def test_identical_fail():
    c1= Card("something", "brain", "todo", 123)
    c2= Card("something", "brain", "todo", 456)

    # assert_identical(c1,c2)
