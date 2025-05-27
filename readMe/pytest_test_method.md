```markdown
# Pytest Subset Syntax

This document outlines the syntax for running specific subsets of tests using pytest.

## Single Test Method
To run a specific test method within a class:
```
pytest path/test_module.py::TestClass::test_method
```

## All Tests in a Class
To run all test methods within a specific class:
```
pytest path/test_module.py::TestClass
```

## Single Test Function
To run a specific test function:
```
pytest path/test_module.py::test_function
```

## All Tests in a Module
To run all tests within a specific module:
```
pytest path/test_module.py
```

## All Tests in a Directory
To run all tests within a directory:
```
pytest path
```

## Tests Matching a Name Pattern
To run tests that match a specific name pattern:
```
pytest -k pattern
```
```