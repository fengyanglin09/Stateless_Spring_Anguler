from traceback import print_tb

import pytest
import time

@pytest.fixture(autouse=True, scope="session")
def footer_session_scope():
    """Session-scoped fixture that runs once at the end of the session."""
    yield
    now = time.time()
    print("\n----------------------")
    print(
        f"Session ended at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(now))}"
    )


@pytest.fixture(autouse=True)
def footer_function_scope():
    """Function-scoped fixture that runs at the end of each test function."""
    start = time.time()
    yield
    stop = time.time()
    delta = stop - start
    print("\n----------------------")
    print(
        f"Test function ended at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stop))}, "
        f"duration: {delta:.2f} seconds"
    )


def test_1():
    """A simple test to demonstrate the autouse fixture."""
    time.sleep(1)



def test_2():
    """Another simple test to demonstrate the autouse fixture."""
    time.sleep(2)