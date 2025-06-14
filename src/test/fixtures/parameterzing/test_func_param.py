import pytest

from cards import Card


@pytest.mark.parametrize(
    "start_summary, start_state",
    [
        ("write a book", "done"),
        ("second edition", "in prog"),
        ("create a course", "todo"),
    ]
)
def test_finish(cards_db, start_summary, start_state):
    """Test finishing a card."""
    card = Card(summary=start_summary, state=start_state)
    card_id = cards_db.add_card(card)
    cards_db.finish(card_id)
    updated_card = cards_db.get_card(card_id)
    assert updated_card.state == "done", f"Expected 'done', got {updated_card.state}"