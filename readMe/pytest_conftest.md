You can put fixtures into individual test files, but to share fixtures among multiple test files, you need to use a conftest.py file either in the same directory as the test file that’s using it or in some parent directory. The conftest.py file is also optional. It is considered by pytest as a “local plugin” and can contain hook functions and fixtures.


We can have conftest.py files at really every level of our test directory. Tests can use any fixture that is in the same test module as a test function, or in a conftest.py file in the same directory, or in any level of parent directory up to the root of the tests.


