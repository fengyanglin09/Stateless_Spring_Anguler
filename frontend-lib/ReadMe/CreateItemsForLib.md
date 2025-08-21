## General Syntax
```shell
ng generate <schematic> <name> --project <project-name> --path <path>
```

* <schematic> → what you’re generating (component, pipe, directive, service, etc.).

* <name> → name of the item.

* --project <project-name> → which app or lib inside the workspace.

* --path <path> → folder location inside the project (relative to src/).


### Exmamples
#### 1. Create a component in a library

Suppose you have lib-a and want a FancyButton component inside src/lib/components/:
```shell
ng g c components/fancy-button --project=lib-a
```
creates:
```shell
projects/lib-a/src/lib/components/fancy-button/
```

#### 2. Create a pipe in an app
```shell
ng g pipe pipes/capitalize --project=lib-a
```
creates:
```shell
projects/lib-a/src/lib/pipes/capitalize.pipe.ts
```


#### 3. Create a directive in a library
```shell
ng g directive directives/highlight --project=lib-b
```
creates:
```shell
projects/lib-b/src/lib/directives/highlight.directive.ts
```


#### 4. Specify custom path explicitly
If you want the file somewhere else, you can use --path:
```shell
ng g s core/auth/auth --project=lib-a --path=projects/lib-a/src/lib/core
```
👉 Forces service into core/ folder.
