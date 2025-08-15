## summary of the three main Spring Security OAuth2 modules:


* **resourceServer**:
Used to protect APIs by validating incoming OAuth2 access tokens (usually JWT). The server checks tokens and grants access to resources if valid. No login UI; typically for REST APIs.


* **oauth2Client**:
Enables your app to act as an OAuth2 client, allowing it to obtain and use access tokens to call other protected APIs. Handles token acquisition, refresh, and propagation.


* **oauth2Login**:
Provides OAuth2/OpenID Connect login for users. Integrates with external identity providers (Google, GitHub, etc.), handling authentication and user session creation. Used for web apps needing user login via OAuth2.


## Each module serves a distinct purpose:
- resourceServer secures APIs,
- oauth2Client enables outbound OAuth2 calls,
- oauth2Login manages user authentication via OAuth2.


## Beans are involved in authentication, and where user objects are created and placed in the Spring Security context:

### resourceServer

- Protects APIs by validating OAuth2 access tokens (usually JWT).
- Main beans: JwtDecoder, JwtAuthenticationConverter.
- User objects are created by converting JWT claims to Authentication (often a JwtAuthenticationToken), which is placed in the SecurityContext automatically by the filter chain.

### oauth2Client

- Enables your app to act as an OAuth2 client for outbound calls.
- Main beans: OAuth2AuthorizedClientManager, OAuth2AuthorizedClientService.
- No user authentication or SecurityContext population; used for managing and propagating access tokens for outbound requests.

### oauth2Login
- Provides OAuth2/OpenID Connect login for users.
- Main beans: OAuth2LoginAuthenticationFilter, OAuth2UserService, AuthenticationManager.
- User objects (OAuth2User) are created by the OAuth2UserService after successful login and placed in the SecurityContext as part of the Authentication object (usually OAuth2AuthenticationToken).
