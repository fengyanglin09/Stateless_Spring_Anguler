import pytest

import cards


@pytest.fixture(scope="session")
def some_cards():
    """Fixture to provide some cards data."""
    return [
            cards.Card("write book", "brain", "done"),
            cards.Card("edit book", "katie", "done"),
            cards.Card("write 2nd edition", "brain", "todo"),
            cards.Card("edit 2nd edition", "katie", "todo"),
           ]



"""
The fixture non_empty_db has to be function scope because it uses cards_db, which is function scope. 
If you try to make non_empty_db module scope or wider, pytest will throw an error. 
"""
@pytest.fixture(scope="function")
def non_empty_db(cards_db, some_cards):
    """Fixture to populate the database with some cards."""
    for card in some_cards:
        cards_db.add_card(card)
    return cards_db
