### 1 Top-Level Project Structure

```shell
src/
 ├─ app/
 │   ├─ core/          # Singleton services, auth, interceptors
 │   ├─ shared/        # Reusable components, directives, pipes
 │   ├─ features/      # Main app features (organized by domain)
 │   ├─ app.routes.ts  # Route definitions
 │   └─ app.component.ts
 │
 ├─ assets/            # Images, global styles
 ├─ environments/      # env.ts, env.prod.ts
 └─ main.ts

```



### 2 Feature Module Structure
#### Each feature of your app should have its own folder.
```shell
app/
 ├─ features/
 │   ├─ dashboard/
 │   │   ├─ pages/
 │   │   │   └─ dashboard-page.component.ts
 │   │   ├─ components/
 │   │   │   └─ chart-widget.component.ts
 │   │   ├─ services/
 │   │   │   └─ dashboard.service.ts
 │   │   ├─ dashboard.routes.ts
 │   │   └─ index.ts
 │   │
 │   ├─ users/
 │   │   ├─ pages/
 │   │   │   └─ user-list-page.component.ts
 │   │   ├─ components/
 │   │   │   └─ user-card.component.ts
 │   │   ├─ services/
 │   │   │   └─ user.service.ts
 │   │   ├─ users.routes.ts
 │   │   └─ index.ts

```

#### Pattern:
- pages/ → route-level (container) components, usually tied to routing.

- components/ → dumb/reusable UI building blocks (cards, forms, etc.).

- services/ → feature-specific services.

- routes.ts → define feature-specific routing.


### 3 Core Module (or Core Folder)

#### Contains things you only want one instance of (provided in root):

- Auth service

- API interceptors

- Guards

- Global configuration

```shell
app/core/
 ├─ auth/
 │   ├─ auth.service.ts
 │   ├─ auth.guard.ts
 │   └─ token.interceptor.ts
 ├─ services/
 │   └─ logger.service.ts
 └─ core.module.ts   (optional in standalone apps)

```

### 4 Shared Module (or Shared Folder)
#### Contains reusable, stateless things:

- UI components (buttons, modals, tables)

- Pipes

- Directives


```shell
app/shared/
 ├─ components/
 │   ├─ button/
 │   │   ├─ button.component.ts
 │   │   └─ button.component.html
 │   └─ modal/
 ├─ directives/
 ├─ pipes/
 └─ shared.module.ts (optional if using standalone)
```


### 5 Naming Conventions

- Components → xyz.component.ts

- Pages → xyz-page.component.ts

- Services → xyz.service.ts

- Routes → xyz.routes.ts

Keep everything flat within feature folders (avoid deep nesting unless necessary).
