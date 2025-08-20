### Step 1. Create a Workspace Without an App

```shell
ng new my-workspace --create-application=false
cd my-workspace
```

### Step 2. Generate Two Libraries

```shell
ng generate library lib-a
ng generate library lib-b
```

to change directory structure to have the libraries in the shared folder, you can move them manually or use the following command:

Run:
```shell
ng generate library shared-ui-layout
```
- Move the generated folder from projects/shared-ui-layout to projects/shared/ui-layout.
- Update paths in angular.json and tsconfig.json to reflect the new location.


```shell
```css
### Step 3. Create an showcase Application
```shell
ng generate application showcase
```


### how you have:
```css
projects/
  lib-a/
  lib-b/
  showcase/
```

### Step 4. Add Libraries to the Showcase Application
```shell
ng build lib-a
ng build lib-b
ng serve showcase
```

### Step 5. Import Libraries in the Showcase Application
In your showcase app, you don’t need to add anything to package.json.
Instead, Angular already sets this up for you in the root tsconfig.base.json
So you can just do:
```ts
import { Component } from '@angular/core';
import { ButtonComponent } from 'lib-a';
import { CardComponent } from 'lib-a';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ButtonComponent, CardComponent],
    template: `
    <lib-a-card>
      <h3>Hello from Showcase!</h3>
      <lib-a-button></lib-a-button>
    </lib-a-card>
  `
})
export class AppComponent {}

```

#### Why No package.json Dependency?

- If you add "lib-a" in the showcase app’s package.json, npm will try to fetch it from npm registry.

- But since lib-a is just a workspace library, Angular resolves it via path mapping (tsconfig.base.json), not node_modules.

- This is intentional so you can develop all libs + apps together without publishing.

### Step 6. Develop Faster (Watch Mode)

```shell
ng build lib-a --watch
ng build lib-b --watch
```

Keep those running in background, then ng serve showcase will pick up changes automatically.



#### Create a barrel file for each library
Example structure with index.ts
```css
projects/
  lib-a/
    src/
      lib/
        button/
          button.component.ts
          index.ts
        card/
          card.component.ts
          index.ts
        index.ts
      public-api.ts

```

inside each folder's index.ts - projects/lib-a/src/lib/button/index.ts
```ts
export * from './button.component';
```
inside projects/lib-a/src/lib/index.ts
```ts
export * from './card.component';
```
Barrel at the lib level - projects/lib-a/src/lib/index.ts
```ts
export * from './button';
export * from './card';
```

Finally, in the public-api.ts of the library - projects/lib-a/src/public-api.ts
```ts
/*
 * Public API Surface of lib-a
 */
export * from './lib';
```

Now in your showcase app, you can just do:
```ts
import { ButtonComponent, CardComponent } from 'lib-a';
```
