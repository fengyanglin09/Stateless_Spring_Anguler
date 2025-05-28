import pytest


@pytest.fixture(name = "ultimate_answer")
def ultimate_answer_fixture():
    """Fixture that returns the ultimate answer to life, the universe, and everything."""
    return 42




def test_everything(ultimate_answer):
    """Test that checks if the ultimate answer is indeed 42."""
    assert ultimate_answer == 42, "The ultimate answer should be 42"