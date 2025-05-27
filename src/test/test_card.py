
from cards import Card

def test_field_access():
    c = Card("something","brain", "todo", 123)
    assert c.summary == "something"
    assert c.owner == "brain"
    assert c.state == "todo"
    assert c.id == 123


def test_defaults():
    c = Card()
    assert c.summary is None
    assert c.owner is None
    assert c.state == "todo"
    assert c.id is None


def test_equality():
    c1 = Card("something", "brain", "todo", 123)
    c2 = Card("something", "brain", "todo", 123)
    c3 = Card("something else", "brain", "todo", 123)
    assert c1 == c2
    assert c1 != c3
    assert c2 != c3

def test_equality_with_diff_ids():
    c1 = Card("something", "brain", "todo", 123)
    c2 = Card("something", "brain", "todo", 456)
    assert c1 == c2  # IDs are not compared in equality
    assert c1.id != c2.id  # IDs are different


def test_from_dict():
    d = {"summary": "something", "owner": "brain", "state": "todo", "id": 123}
    c = Card.from_dict(d)
    assert c.summary == "something"
    assert c.owner == "brain"
    assert c.state == "todo"
    assert c.id == 123

def test_to_dict():
    c = Card("something", "brain", "todo", 123)
    d = c.to_dict()
    assert d["summary"] == "something"
    assert d["owner"] == "brain"
    assert d["state"] == "todo"
    assert d["id"] == 123


def test_equality_fail():
    c1= Card("something", "brain", "todo", 123)
    c2 = Card("something else", "brain", "todo", 123)
    assert c1 != c2
