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
