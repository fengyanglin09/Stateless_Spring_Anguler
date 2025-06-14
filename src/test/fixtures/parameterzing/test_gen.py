from cards import Card

def pytest_generate_tests(metafunc):
    if "start_state" in metafunc.fixturenames:
        # Generate a list of Card instances with different attributes
        metafunc.parametrize("start_state", ["done", "in prog", "todo"])



def test_finish(cards_db, start_state):
    """Test finishing a card with different states."""
    card = Card(summary="Test Card", state=start_state)
    card_id = cards_db.add_card(card)
    cards_db.finish(card_id)
    updated_card = cards_db.get_card(card_id)
    assert updated_card.state == "done", f"Expected 'done', got {updated_card.state}"

