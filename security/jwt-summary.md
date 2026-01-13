# JWT (JSON Web Token) Summary

This document provides a **clear, practical summary of JWT**, focusing on how it is used in modern authentication and authorization systems, including OAuth 2.0 and non-OAuth scenarios.

---

## 1. What Is a JWT?

> **JWT (JSON Web Token)** is a compact, URL-safe token format used to securely transmit claims between parties.

JWT itself is **not an authentication protocol**.
It is only a **token format**.

---

## 2. JWT Structure

A JWT consists of **three Base64URL-encoded parts**:

```
HEADER.PAYLOAD.SIGNATURE
```

### 2.1 Header (How to verify)

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "abc123"
}
```

Header fields:
- `alg`: signing algorithm (RS256, HS256, ES256)
- `typ`: token type
- `kid`: key identifier

📌 Header contains **no user data**.

---

### 2.2 Payload (Claims)

The payload is a JSON object containing **claims**.

Example:
```json
{
  "iss": "https://auth.example.com",
  "sub": "user_123",
  "aud": "api://orders",
  "scope": "read write",
  "exp": 1700000000
}
```

Each field is a **claim**.

---

### 2.3 Signature (Proof)

- Created using the private key
- Verifies integrity and authenticity
- Cannot be decoded

---

## 3. What Is a Claim?

> A **claim** is a key–value pair inside the JWT payload.

Common claims:
- `iss` – issuer
- `sub` – subject (user ID)
- `aud` – audience
- `exp` – expiration time
- `scope` / `roles` – permissions

---

## 4. JWT Signing Algorithms

### 4.1 RS256 (Recommended)

- Asymmetric cryptography
- Private key → sign
- Public key → verify
- Used in OAuth / OIDC

### 4.2 HS256

- Symmetric secret
- Same key signs & verifies
- Suitable for single-backend apps

---

## 5. JWT Validation Process

Backend must:
1. Verify signature
2. Validate `exp`
3. Validate `iss`
4. Validate `aud`
5. Extract claims

❌ Decoding without verification is insecure.

---

## 6. JWT in OAuth 2.0

JWT is commonly used as an **access token format**.

Two valid access token types:
- JWT (self-contained)
- Opaque (reference token)

JWT access tokens:
- Are validated locally using public keys (JWKS)
- Do NOT store full user profiles

---

## 7. Access Token vs ID Token

| Token | Purpose | Used by |
|---|---|---|
| Access Token | Authorization | API |
| ID Token | Authentication | Client |

ID Tokens exist only in **OpenID Connect**.

---

## 8. Stateless Authentication

With JWT:
- Backend does NOT need Redis for session lookup
- User identity comes from `sub` claim
- System becomes stateless

⚠️ Refresh tokens and revocation may still need storage.

---

## 9. Key Placement (Important)

### Single backend app
- Private key + public key in same backend
- JWT used as session replacement

### OAuth / OIDC architecture
- Private key ONLY in Authorization Server
- Resource Servers use public key (JWKS)

---

## 10. Pros & Cons of JWT

### Pros
- Stateless
- Scalable
- Fast validation
- No DB lookup per request

### Cons
- Hard to revoke immediately
- Token leakage impact until expiration
- Larger request size

---

## 11. When to Use JWT

Use JWT when:
- You need stateless APIs
- You have multiple services
- You use OAuth / OIDC

Avoid JWT when:
- You need instant revocation
- Tokens must carry zero information

---

## 12. One-Sentence Summary

> JWT is a signed, self-contained token format that allows backends to validate identity and authorization claims statelessly, widely used in OAuth 2.0 and modern distributed systems.

