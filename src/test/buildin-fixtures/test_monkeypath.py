from typer.testing import CliRunner
import cards


def run_cli(*args):
    runner = CliRunner()
    result = runner.invoke(cards.cli.app, args)
    return result.output.rstrip()




def test_path_env_var(monkeypatch, tmp_path):
    monkeypatch.setenv("CARDS_DB_DIR", str(tmp_path))

    assert run_cli("config") == str(tmp_path)


def test_patch_get_path(monkeypatch,  tmp_path):
    # Patch the get_path function to return the temporary path
    def mock_get_path():
        return str(tmp_path)

    monkeypatch.setattr(cards.cli, "get_path", mock_get_path)

    assert run_cli("config") == str(tmp_path)