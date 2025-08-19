# Azure Entra ID + Angular + Spring Boot OAuth2 Setup

## 1. Azure Entra ID App Registrations

### 1.1 Backend API App Registration (Spring Boot)

- Register a new app in Azure Entra ID portal (e.g. `SMASH-BACKEND-NONPROD`).
- Set **Application (client) ID** (e.g. `6b4f8dcc-e7d3-4d30-ab85-20851dca2013`).
- Under **Expose an API**:
    - Set **Application ID URI** to:  
      `api://<backend-app-client-id>`  
      (e.g. `api://6b4f8dcc-e7d3-4d30-ab85-20851dca2013`)
    - Add a scope, e.g.
        - Scope name: `access_as_user`
        - Admin consent description: "Allow backend to a resource server"
        - Enable the scope
- Under **Manifest**:
    - Set `"accessTokenAcceptedVersion": 2`
    - Add SPA app's client ID to `"preAuthorizedApplications"` with the scope ID (for seamless consent)

---

### 1.2 Frontend SPA App Registration (Angular)

- Register a new SPA app in Azure Entra ID (e.g. `SMASH-FRONTEND-NONPROD`).
- Set **Application (client) ID** (e.g. `483a2857-ef87-4f5f-b9b5-8cdf2c031586`).
- Under **Authentication**:
    - Add redirect URI of type SPA, e.g. `http://localhost:4200`
    - Enable **Implicit grant and hybrid flows** if needed (for id tokens, but code flow recommended)
- Under **API Permissions**:
    - Add permission to call your backend API:
        - Select **APIs my organization uses** → find backend API → choose delegated permission `access_as_user`
- Under **Manifest**:
    - Set `"accessTokenAcceptedVersion": 2`

---

## 2. Angular OAuth2 Client Configuration

Use [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) with this config:

```ts
export const authCodeFlowConfig: AuthConfig = {
  // Use v2 issuer endpoint
  discoveryDocument: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
  strictDiscoveryDocumentValidation: false,

  redirectUri: 'http://localhost:4200',   // Your Angular redirect URI
  clientId: '<frontend-client-id>',
  responseType: 'code',
  scope: `openid profile email api://<backend-client-id>/access_as_user`,
  showDebugInformation: true,

  silentRefreshRedirectUri: 'http://localhost:4200/silent-refresh.html',
  useSilentRefresh: false,
  disablePKCE: false,
};
```

* Important: use the discoveryDocument with /v2.0/.well-known/openid-configuration to ensure v2 endpoints.
* Use scope referencing the backend API with the exact exposed scope (access_as_user)


# 3. Spring Boot OAuth2 Resource Server Configuration

In `application.yml`:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://login.microsoftonline.com/<tenant-id>/v2.0
          jwk-set-uri: https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
          audiences:
            - <backend-client-id>   # Your backend app registration's client ID
```

# 4. Additional Notes
- Clear browser cache and token storage when changing configs or manifests.
- 


# 5. Useful Links
- [Azure Entra ID Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [Expose an API - Azure AD](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-expose-web-apis)
- [angular-oauth2-oidc repo](https://github.com/manfredsteyer/angular-oauth2-oidc)
- [Spring Boot OAuth2 Resource Server Guide](https://spring.io/guides/tutorials/spring-boot-oauth2/)
