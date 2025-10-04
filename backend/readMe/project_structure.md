### 1 Top-Level Project Structure

```shell
backend/
 ├─ pom.xml                  # parent
 ├─ common/                  # shared cross-cutting code
 ├─ user-service/            # feature module
 ├─ order-service/           # feature module
 ├─ billing-service/         # feature module
 └─ app/                     # (optional) the main runnable Spring Boot app

```


### 2 What Goes in common/ (Shared Module)

- This should be small, stable, and reusable.
- Think: “infrastructure & cross-cutting utilities,” not business logic.


#### good candidates for /common:
- Exception handling

    -  ApiException, ErrorResponse, maybe even a base GlobalExceptionHandler if you want consistency.

- DTOs for cross-module communication (if modules talk to each other internally).

    - e.g. UserInfoDto if multiple modules need minimal user data.

- Utility classes

    - Date/time helpers, string utils.

- Base classes / interfaces

    - BaseEntity (with id, createdAt, updatedAt).

    - AuditableEntity.

- Security helpers

    - JWT parsing utils (if used across modules).

- Constants

    - Global error codes, role names, etc.


#### avoid putting in common/:
- Feature entities (User, Order) → keep them in their domain.

- Business services (UserService) → should live in the feature module.

- Controllers → never shared.


### 3 Feature Module Structure

Each module is a domain boundary (align with DDD and business features).
Example: user-service/

```shell
user-service/
 ├─ src/main/java/com/example/user/
 │   ├─ controller/        # REST endpoints (UserController)
 │   ├─ service/           # Business logic (UserService, UserManager)
 │   ├─ repository/        # Spring Data interfaces (UserRepository)
 │   ├─ entity/            # JPA entities (User, Role)
 │   ├─ dto/               # API-facing DTOs (UserRequestDto, UserResponseDto)
 │   ├─ mapper/            # MapStruct mappers (UserMapper)
 │   └─ config/            # Module-specific config (UserModuleConfig)
 └─ pom.xml

```


### 3 App/ Module
- This is the runnable Spring Boot application.
- It pulls in the feature modules as dependencies.
- Contains the main method and application-wide configuration.
- Example structure:
```shell
app/
 ├─ src/main/java/com/example/app/
 │   ├─ AppApplication.java      # main method
 │   ├─ config/                  # global config (e.g. SwaggerConfig)
 │   ├─ exception/               # global exception handling (GlobalExceptionHandler)       
    │   └─ filter/                  # global filters (e.g. LoggingFilter)
    └─ pom.xml
```


