# OAuth Login Flow & Security Design
## OAuth 1.0a vs OAuth 2.0

This document explains:
- The OAuth 1.0a and OAuth 2.0 login flows
- Why OAuth 1.0a and OAuth 2.0 are designed differently
- Why OAuth 2.0 requires the `state` parameter

It focuses on **security motivations**, not just protocol steps.

---

## 1. Common OAuth Roles

- **Resource Owner**  
  The user who owns the data.

- **Client**  
  Your application (frontend + backend).

- **Authorization Server**  
  Authenticates the user and issues tokens.

- **Resource Server**  
  Hosts protected APIs and validates access tokens.

---

## 2. OAuth 1.0a Login Flow (Protocol-Level Security)

OAuth 1.0a was designed for an era where **the network could not be trusted**.

### 2.1 Core Characteristics

- Uses **shared secrets**
- Every sensitive request is **cryptographically signed**
- No bearer tokens
- Resistant to request tampering and replay attacks
- Complex but self-contained security

---

### 2.2 OAuth 1.0a Flow Summary

1. **Request Token (Signed Request)**
   - Client signs request using:
     `consumer_secret &`
   - Server returns a temporary request token and secret

2. **User Authorization (Browser Redirect)**
   - User logs in and approves access

3. **Callback with oauth_verifier**
   - Browser redirects back with:
     - request token
     - oauth_verifier

4. **Access Token (Signed Request)**
   - Client signs request using:
     `consumer_secret & request_token_secret`
   - Server returns access token and access token secret

5. **API Access**
   - Every API call is signed using:
     `consumer_secret & access_token_secret`

---

### 2.3 Why OAuth 1.0a Needs Secrets

OAuth 1.0a does **not trust the transport layer**.

Secrets are required to:
- Prove client identity
- Guarantee request integrity
- Prevent request modification
- Prevent replay attacks (with timestamp + nonce)

Security is enforced **inside the protocol itself**.

---

## 3. OAuth 2.0 Login Flow (Transport-Level Security)

OAuth 2.0 was designed when **HTTPS (TLS) became ubiquitous, reliable, and mandatory**.

### 3.1 Core Characteristics

- Uses **Bearer Tokens**
- No per-request signing
- HTTPS (TLS) is **mandatory**, not optional
- Simpler and more flexible
- Designed for browsers, mobile apps, and SPAs

---

### 3.2 OAuth 2.0 Authorization Code Flow

1. **Authorization Request (Browser Redirect)**
   - Client redirects user to authorization server
   - Includes client_id, redirect_uri, scope, state

2. **User Login & Consent**
   - Happens entirely on authorization server

3. **Callback with Authorization Code**
   - Browser redirects back with:
     - authorization code
     - state

4. **Code Exchange (Server-to-Server over TLS)**
   - Client sends:
     - code
     - client_id
     - client_secret (or PKCE verifier)
   - This request is protected **entirely by TLS**
   - Authorization server returns:
     - access_token
     - optional refresh_token

5. **API Access**
   - Client calls resource server using:
     `Authorization: Bearer access_token`
   - Transport security is guaranteed by TLS

---

## 4. Why OAuth 1.0a and OAuth 2.0 Are Designed Differently

### 4.1 Historical Context

| Aspect | OAuth 1.0a | OAuth 2.0 |
|---|---|---|
| Era | Pre-ubiquitous HTTPS | HTTPS everywhere |
| Network trust | Low | High (TLS) |
| Client types | Mostly servers | Browser, mobile, SPA |
| Complexity tolerance | High | Low |

---

### 4.2 Security Philosophy Difference

#### OAuth 1.0a
> Do not trust the network. Put security into the protocol.

- Secrets
- HMAC signatures
- Nonce + timestamp
- Protocol-level integrity

#### OAuth 2.0
> Trust TLS. Simplify the protocol.

- TLS provides confidentiality and integrity
- Authorization codes are short-lived
- Bearer tokens are protected by HTTPS
- Additional mitigations (PKCE, rotation, revocation)

---

### 4.3 Why OAuth 2.0 Does NOT Use Token Secrets

OAuth 2.0 intentionally **moves security from the protocol layer to the transport layer (TLS)**.

Key reasons:

- **TLS guarantees confidentiality**
  - Access tokens and authorization codes cannot be observed in transit
- **TLS guarantees integrity**
  - Requests cannot be modified without detection
- **TLS guarantees server authentication**
  - Clients know they are talking to the real authorization server

Because of these TLS guarantees:

- There is **no need for per-request cryptographic signatures**
- There is **no access_token_secret**
- Possession of the access token is sufficient (Bearer Token model)

Additionally, OAuth 2.0 must support **public clients**:
- Browsers
- Mobile apps

These environments:
- Cannot securely store long-term secrets
- Cannot safely perform request signing

Therefore OAuth 2.0 relies on:
- Mandatory TLS
- Short-lived access tokens
- Refresh token rotation
- PKCE for public clients
- Token revocation and scope limitation

---

## 5. What Is the `state` Parameter in OAuth 2.0

### 5.1 Definition

> `state` is a client-generated value used to bind the authorization response to the original authorization request.

The authorization server treats it as **opaque data**.

---

### 5.2 Why `state` Is Required (Security Reason)

OAuth callbacks are invoked by the **user’s browser**, not directly by the authorization server.

This enables **Login CSRF / Session Fixation attacks** if `state` is not used.

---

### 5.3 Login CSRF Attack (Without state)

1. Attacker authorizes their own OAuth account
2. Attacker obtains a valid authorization code
3. Attacker tricks victim’s browser into visiting:
   `/callback?code=ATTACKER_CODE`
4. Client exchanges the code
5. Victim is logged into attacker’s account

---

### 5.4 How `state` Prevents This Attack

1. Client generates a cryptographically random `state`
2. Client stores it in the user session
3. Client sends it with the authorization request
4. Authorization server returns it unchanged
5. Client validates:
   `returned_state == stored_state`

If validation fails → login is rejected.

---

## 6. Final Comparison Summary

| Aspect | OAuth 1.0a | OAuth 2.0 |
|---|---|---|
| Secrets required | Yes | No (except client_secret at token endpoint) |
| Request signing | Yes | No |
| Replay protection | Nonce + timestamp | TLS + token expiry |
| Token type | Token + Secret | Bearer Token |
| Browser-friendly | No | Yes |
| Complexity | High | Lower |

---

## 7. Key Takeaway

- OAuth 1.0a enforces security at the protocol level using secrets and signatures.
- OAuth 2.0 relies on **TLS as the primary security foundation**, combined with token lifecycle controls.
- The `state` parameter is essential in OAuth 2.0 to protect against login CSRF attacks.
