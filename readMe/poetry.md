```shell
poetry init
```

### run time packages
```shell
poetry add <package_name>
```

### development packages
```shell
poetry add --dev <package_name>
```

### test packages
```shell
poetry add --group test <package_name>
```
example:
```shell
poetry add --group test pytest faker tox coverage pytest-cov
```


### remove a package
```shell
poetry remove requests
```

```shell
poetry add black isort flake8 mypy pre-commit
```



## for the new developers
### create a lock file, if one is missing
```shell
poetry lock
```
### install the dependencies
```shell
poetry install
```

### sync a project
```shell
poetry sync
```