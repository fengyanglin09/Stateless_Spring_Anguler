# Angular Library with Secondary Entry Points (Option 2)

This guide explains how to structure an Angular workspace with **one main library** (`ui`) that contains multiple **secondary entry points** (e.g., `button`, `input`).  
With this setup, you can build the library **once** and expose multiple reusable modules/components.

---

## 1. Create the Workspace
```bash
ng new angular-workspace --create-application=false --standalone
cd angular-workspace


## 2. Generate the Main Library
```bash
ng generate library ui --standalone
```
This creates a library named `ui` in the `projects/ui` directory.
```shell
projects/ui/
  src/
    public-api.ts
    lib/
  ng-package.json
  package.json
```

## 3. Create Secondary Entry Points
A secondary entry point is a sub-folder inside the library with its own ng-package.json and public-api.ts.

Example: Botton Component
```bash
mkdir -p projects/ui/button
```
Create projects/ui/button/ng-package.json:
```json
{
  "$schema": "../../.../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../.../dist/ui/button",
  "lib": {
    "entryFile": "public-api.ts"
  }
}
```
Create projects/ui/button/public-api.ts:
```ts
export * from './button.component';
```
Add a button.component.ts inside projects/ui/button/.


## 4. Update Main Library's public-api.ts
Tell ng-packagr about the secondary entry points:
projects/ui/ng-package.json
```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/ui",
  "lib": {
    "entryFile": "src/public-api.ts"
  },
  "whitelistedNonPeerDependencies": [
    "."
  ]
}
```

No need to list sub-packages explicitly — ng-packagr will detect them automatically as long as each has its own ng-package.json.


## 5. Build the Library
Run:
```bash
ng build ui --configuration production
```

this generates:
```shell
dist/ui/
  bundles/
  fesm2022/
  package.json
  button/
    package.json
    fesm2022/
  input/
    package.json
    fesm2022/
```


## 6. Use the Library in an Application
In your app (or showcase app), import components like this:
```ts
import { ButtonComponent } from '@my-org/ui/button';
import { InputComponent } from '@my-org/ui/input';
```
@my-org/ui comes from the name field in projects/ui/package.json.
If using inside the same workspace, Angular CLI will resolve automatically.
