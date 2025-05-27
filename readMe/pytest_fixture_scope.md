### Here’s a rundown of each scope value:

#### scope=’function’
Run once per test function. The setup portion is run before each test using the fixture. The teardown portion is run after each test using the fixture. This is the default scope used when no scope parameter is specified.

#### scope=’class’
Run once per test class, regardless of how many test methods are in the class.

#### scope=’module’
Run once per module, regardless of how many test functions or methods or other fixtures in the module use it.

#### scope=’package’
Run once per package, or test directory, regardless of how many test functions or methods or other fixtures in the package use it.

#### scope=’session’
Run once per session. All test methods and functions using a fixture of session scope share one setup and teardown call.

#### note:
You can put fixtures into individual test files, but to share fixtures among multiple test files, you need to use a conftest.py file either in the same directory as the test file that’s using it or in some parent directory. The conftest.py file is also optional. It is considered by pytest as a “local plugin” and can contain hook functions and fixtures.


```shell
pytest --fixtures -v
```