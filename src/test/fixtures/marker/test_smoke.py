import pytest

"""
pytest -v -m smoke test_start.py
"""
@pytest.mark.smoke
def test_start():
    """Smoke test to ensure the test suite is running."""
    assert True, "This is a smoke test to check if the test suite is running correctly."