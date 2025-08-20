### Minimal Command Set (if you just want working deployable code)
```bash
npm ci
ng build lib-a --configuration production
ng build lib-b --configuration production
ng build showcase-app --configuration production
```

After this, the only thing to deploy is:

```bash
dist/showcase-app/browser/
```
