import pytest

from cards import Card

@pytest.mark.smoke
class TestFinish:
    def test_finish_from_todo(self, cards_db):
        """Test finishing a card from 'todo' state."""
        card = cards_db.add_card(Card("foo", state="todo"))
        cards_db.finish(card)
        updated_card = cards_db.get_card(card)
        assert updated_card.state == "done", f"Expected 'done', got {updated_card.state}"



    def test_finish_from_in_progress(self,  cards_db):
        """Test finishing a card from 'in progress' state."""
        card = cards_db.add_card(Card("bar", state="in progress"))
        cards_db.finish(card)
        updated_card = cards_db.get_card(card)
        assert updated_card.state == "done", f"Expected 'done', got {updated_card.state}"