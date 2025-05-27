from cards import Card


class TestEquality:

    def test_equality(self):
        c1 = Card("something", "brain", "todo", 123)
        c2 = Card("something", "brain", "todo", 123)

        assert c1 == c2, "Cards with same attributes should be equal"


    def test_inequality(self):
        c1 = Card("something", "brain", "todo", 123)
        c2 = Card("something else", "brain", "todo", 123)

        assert c1 != c2, "Cards with different attributes should not be equal"

