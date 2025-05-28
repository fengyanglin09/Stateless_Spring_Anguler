
"""
tmp_path is function-scoped and provides a temporary directory unique to the test invocation.
"""

def test_tmp_path(tmp_path):
    """Test that checks if the tmp_path fixture provides a valid temporary directory."""
    assert tmp_path.is_dir(), "tmp_path should be a valid directory"

    # Check that the path exists
    assert tmp_path.exists(), "tmp_path should exist"

    # Check that the path is empty
    assert not any(tmp_path.iterdir()), "tmp_path should be empty initially"

    file = tmp_path / "test_file.txt"

    file.write_text("Hello, World!")
    assert file.read_text() == "Hello, World!", "File content should match the written text"



"""
tmp_path_factory is session-scoped and provides a factory for creating temporary directories.
"""
def test_tmp_path_factory(tmp_path_factory):
    """Test that checks if the tmp_path_factory fixture provides a valid temporary directory."""
    temp_dir = tmp_path_factory.mktemp("test_temp_dir")

    assert temp_dir.is_dir(), "Temporary directory should be a valid directory"

    # Check that the path exists
    assert temp_dir.exists(), "Temporary directory should exist"

    # Check that the path is empty
    assert not any(temp_dir.iterdir()), "Temporary directory should be empty initially"

    file = temp_dir / "test_file.txt"

    file.write_text("Hello, World!")
    assert file.read_text() == "Hello, World!", "File content should match the written text"



