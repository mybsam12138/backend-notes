# OAuth 2.0 PKCE Summary
## Frontend as OAuth Client

This document explains **how OAuth 2.0 supports frontend applications as OAuth clients**
using **PKCE (Proof Key for Code Exchange)**, and compares it with **OAuth 2.0 using a client secret**.

---

## 1. OAuth 2.0 Client Types

OAuth 2.0 explicitly defines two client types:

### Confidential Client
- Can securely store secrets
- Usually a backend server
- Uses `client_secret`

### Public Client
- Cannot store secrets
- Browser SPA / Mobile app
- Uses PKCE instead of `client_secret`

---

## 2. OAuth 2.0 with Client Secret (Confidential Client)

### 2.1 Who Is the OAuth Client?
- The **backend server** is the OAuth client
- The frontend only triggers redirects

### 2.2 How Identity Is Verified

During code exchange, the backend sends:

```
client_id + client_secret
```

The **Authorization Server** verifies:

> “Is this the registered backend application?”

If valid → access token is issued.

---

### 2.3 What Client Secret Proves

- Proves **client identity**
- Proves request comes from the legitimate backend
- Does NOT prove:
  - browser identity
  - device identity
  - user session

---

### 2.4 Typical Architecture

```
Browser ──▶ Backend ──▶ Authorization Server
Browser ──▶ Backend ──▶ Resource Server
```

---

## 3. OAuth 2.0 with PKCE (Public Client)

### 3.1 Who Is the OAuth Client?
- The **frontend itself** is the OAuth client
- No backend is required for OAuth login

---

### 3.2 How Identity Is Verified

Instead of a secret, PKCE uses a **one-time proof**:

```
code_verifier → hash → code_challenge
```

During code exchange, the frontend sends:

```
client_id + code_verifier
```

The **Authorization Server** verifies:

> “Is this the same client instance that started the authorization flow?”

---

### 3.3 What PKCE Proves

- Proves **authorization flow continuity**
- Prevents authorization code interception
- Does NOT prove:
  - device identity
  - frontend identity
  - user identity

---

### 3.4 Typical Architecture

```
SPA / Mobile App ──▶ Authorization Server
SPA / Mobile App ──▶ Resource Server
```

---

## 4. Key Differences at a Glance

| Aspect | OAuth 2.0 + client_secret | OAuth 2.0 + PKCE |
|---|---|---|
| Client type | Confidential | Public |
| Client identity proof | Long-term secret | One-time verifier |
| Secret storage | Required | Not required |
| Frontend-only support | No | Yes |
| Backend required | Yes | Optional |
| Proof purpose | Client identity | Flow continuity |
| Suitable for SPA | No | Yes |

---

## 5. What Both Have in Common

Both models rely on:

- Authorization Code flow
- Mandatory HTTPS (TLS)
- Authorization Server verification
- Short-lived authorization codes
- Bearer access tokens

---

## 6. Important Clarifications

- PKCE does NOT authenticate the user
- PKCE does NOT identify a device
- PKCE does NOT replace `state`
- PKCE does NOT remove the Authorization Server

PKCE only replaces the **client secret** for public clients.

---

## 7. When to Use Which

### Use OAuth 2.0 + client_secret when:
- You have a secure backend
- You control server-side token storage
- You want strong client authentication

### Use OAuth 2.0 + PKCE when:
- You build SPAs or mobile apps
- You cannot protect secrets
- You want frontend to act as OAuth client

---

## 8. One-Sentence Summary

> OAuth 2.0 with a client secret authenticates a confidential backend client, while OAuth 2.0 with PKCE allows public clients to securely complete the authorization code flow by proving continuity of the authorization request without using long-term secrets.

