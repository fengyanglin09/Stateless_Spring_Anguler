

import cards.cli


def test_version(capsys):
    cards.cli.version()
    output = capsys.readouterr().out.rstrip()
    assert output == cards.__version__



"""
this makes sure that the print statement will print to the console
"""
def test_disabled(capsys):
    with capsys.disabled():
        print("This will not be captured by capsys")