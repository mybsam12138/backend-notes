# OAuth 2.0 & JWT — From Abstract Model to Cloud Provider Practice

> This article explains OAuth 2.0 and JWT **from an abstract, protocol-level perspective**,  
> and then shows how **a major cloud provider (Huawei Cloud)** follows the same standard model.  
>  
> The focus is on **roles, APIs, and trust boundaries**, not on any vendor’s internal implementation.

---

## 1. OAuth 2.0: The Abstract Model

OAuth 2.0 is **not a login protocol**.  
It is a **delegation protocol** that allows a client to access protected resources **on behalf of a user**.

### 1.1 The Four Core Roles

| Role | Description |
|---|---|
| **Resource Owner** | The user (human) |
| **Client** | The application requesting access |
| **Authorization Server** | Authenticates the user and issues tokens |
| **Resource Server** | Hosts protected APIs and validates tokens |

> These four roles **always exist**, even if some are hidden behind products or services.

---

## 2. Authorization Server — API Responsibilities

At API level, an authorization server exposes **standardized endpoints**.

### 2.1 OAuth / OIDC Standard Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /authorize` | Start authorization, user consent |
| `POST /token` | Exchange authorization code for token |
| `GET /.well-known/jwks.json` | Publish public keys (JWT verification) |
| `GET /userinfo` (OIDC) | Return user identity info |

### 2.2 Login Is NOT OAuth

User login itself is **not defined by OAuth**.

Examples of **internal (non-standard) login mechanisms**:
- Username + password
- MFA
- SMS / Email code
- QR code
- SSO

OAuth only starts **after** the user is authenticated.

---

## 3. JWT — The Token Format

In modern systems, access tokens are commonly **JWTs**.

### 3.1 Why JWT?

- Self-contained
- Signed (tamper-proof)
- No database lookup required
- Scales horizontally

### 3.2 Typical JWT Claims

```json
{
  "iss": "https://auth.example.com",
  "sub": "user-123",
  "aud": "resource-server",
  "exp": 1700000000,
  "scope": "read write",
  "role": "user"
}
```

---

## 4. Resource Server — Token Validation Model

### 4.1 Important Rule

> **A resource server does NOT call the authorization server to verify tokens (JWT case).**

### 4.2 What the Resource Server Does

1. Extract `Authorization: Bearer <token>`
2. Verify JWT signature using public key (JWKS)
3. Validate:
   - expiration (`exp`)
   - audience (`aud`)
   - issuer (`iss`)
   - scope / role
4. Return protected data

There is **no `/verifyToken` API** in standard JWT-based OAuth.

---

## 5. Client — API Responsibilities

The client acts as the **orchestrator**, not a verifier.

### 5.1 Typical Client APIs

| API | Purpose |
|---|---|
| `/oauth/authorize-url` | Generate redirect URL |
| `/oauth/callback` | Handle authorization code |
| `/api/*` | Call resource server |
| Frontend redirect | Navigate user after login |

### 5.2 Client Responsibilities Summary

- Build authorization URL
- Redirect user
- Exchange code for token
- Store token securely
- Attach token to API calls
- Redirect user to frontend pages

---

## 6. End-to-End Abstract Flow

```
User
 ↓
Client ──► Authorization Server (/authorize)
            ↓
        User Login + Consent
            ↓
Authorization Code
            ↓
Client ──► Authorization Server (/token)
            ↓
        JWT Access Token
            ↓
Client ──► Resource Server (Bearer Token)
            ↓
        Protected Data
```

---

## 7. Cloud Provider Example: Huawei Cloud (Conceptual)

> ⚠️ **Disclaimer**  
> This example is based on **public OAuth 2.0 / OIDC behavior** common to major cloud providers  
> (Huawei Cloud, AWS, Azure, etc.).  
> It does **not reference any internal or non-public implementation details**.

### 7.1 Role Mapping in a Cloud Desktop Scenario

| OAuth Role | Cloud Mapping |
|---|---|
| Resource Owner | End user |
| Client | Cloud Desktop client (Web / PC / Mac) |
| Authorization Server | Cloud IAM |
| Resource Server | Cloud Desktop service APIs |

---

## 8. Cloud Desktop Login Flow (Authorization Code + PKCE)

1. User opens Cloud Desktop client
2. Client redirects to Cloud IAM authorization endpoint
3. User completes login (password / MFA / SSO)
4. Authorization server returns `authorization_code`
5. Client exchanges code for JWT access token
6. Client calls Cloud Desktop APIs with Bearer token

This flow is **pure OAuth 2.0**, independent of vendor.

---

## 9. Token Trust Boundary (Critical Insight)

```
Authorization Server
   ├─ issues token
   ├─ owns user authentication
   └─ publishes public keys

Resource Server
   ├─ trusts token signature
   ├─ validates claims
   └─ never re-authenticates user
```

This separation is the **core design strength** of OAuth.

---

## 10. Key Takeaways

- OAuth is about **delegation**, not login UI
- JWT enables **stateless authorization**
- Resource servers **trust tokens**, not sessions
- Clients **coordinate**, but never verify tokens
- Cloud providers implement **the same standard model**

---

## 11. One-Sentence Summary

> **OAuth defines who may access what; JWT defines how that trust is carried across systems.**

---

*End of document.*
