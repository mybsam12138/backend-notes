# Authentication Service – Features

## 1. Overview

The **Authentication Service** is responsible for verifying user identity and issuing authentication credentials for accessing the cloud desktop platform.

This service operates in the **control plane** and provides secure identity verification before users can interact with system resources such as desktops, sessions, and management APIs.

The Authentication Service communicates with:

- WI Server (Web Interface Server)
- Identity Providers (AD / LDAP / IAM / OAuth)
- Redis or Session Store
- Desktop Management Service (indirectly through authenticated requests)

This service does **not interact with desktop VMs** and does **not handle remote desktop sessions**.

---

# 2. Core Responsibilities

The Authentication Service focuses on:

- verifying user identity
- issuing authentication tokens
- managing login sessions
- integrating external identity providers
- enforcing authentication security policies

It acts as the **identity verification layer for the entire cloud desktop platform**.

---

# 3. Core Features

## 3.1 User Authentication

The Authentication Service verifies user credentials during login.

Supported authentication methods may include:

- Local account authentication
- Active Directory authentication
- LDAP authentication
- Cloud IAM authentication
- OAuth / Single Sign-On (SSO)

Example authentication flow:

```
WI Client
    │
    ▼
WI Server
    │
    ▼
Authentication Service
```

Example API:

```
POST /authenticate
```

Request example:

```
{
  username
  password
}
```

---

## 3.2 Authentication Token Issuance

After successful authentication, the service generates an **authentication token**.

The token is used by the client to access backend APIs.

Token information may include:

```
userId
username
roles
expireTime
signature
```

Common token types:

- JWT tokens
- session tokens
- OAuth access tokens

Example response:

```
{
  accessToken
  expireTime
}
```

---

## 3.3 Session Management

The Authentication Service manages login sessions.

Responsibilities include:

- creating login sessions
- validating session tokens
- expiring sessions
- handling logout

Session data may be stored in:

- Redis
- database
- in-memory cache

Example session record:

```
session:user:1001
token: xyz123
expire: 30 minutes
```

Example APIs:

```
GET  /session/validate
POST /logout
```

---

## 3.4 Single Sign-On (SSO) Integration

The Authentication Service may integrate with enterprise identity systems to provide Single Sign-On.

Supported integrations may include:

- Active Directory
- LDAP
- OAuth providers
- SAML providers
- enterprise IAM systems

Example SSO flow:

```
User
   │
   ▼
Identity Provider
   │
   ▼
Authentication Service
   │
   ▼
WI Server
```

SSO allows users to access the cloud desktop platform without entering credentials again.

---

## 3.5 Multi-Factor Authentication (MFA)

The Authentication Service may enforce additional verification steps.

Supported MFA methods include:

- one-time password (OTP)
- SMS verification
- email verification
- authenticator apps
- hardware security keys

Example flow:

```
username + password
        │
        ▼
MFA verification
        │
        ▼
authentication success
```

---

## 3.6 Authentication Policy Enforcement

The service enforces security policies during login.

Examples:

- password complexity rules
- login attempt limits
- account lockout policy
- allowed login locations
- device restrictions

Example configuration:

```
maxLoginAttempts = 5
accountLockTime = 30 minutes
```

---

## 3.7 Token Validation

Backend services use the Authentication Service to validate tokens.

Example flow:

```
WI Server
    │
    ▼
Authentication Service
    │
    ▼
token validation
```

Validation checks include:

- token signature
- expiration time
- user status
- revoked sessions

Example API:

```
POST /validateToken
```

---

## 3.8 Logout and Session Revocation

The Authentication Service supports logout and session revocation.

Responsibilities include:

- invalidating tokens
- deleting session records
- notifying backend services

Example flow:

```
WI Client
    │
    ▼
WI Server
    │
    ▼
Authentication Service
    │
    ▼
session revoked
```

Example API:

```
POST /logout
```

---

# 4. Interaction with Other Services

The Authentication Service interacts with several system components.

Example architecture:

```
WI Client
    │
    ▼
WI Server
    │
    ▼
Authentication Service
    │
    ├─ Identity Providers
    ├─ Redis / Session Store
    └─ Database
```

Other backend services trust authentication tokens issued by this service.

---

# 5. Control Plane Role

The Authentication Service operates entirely in the **control plane**.

Responsibilities include:

- identity verification
- token issuance
- session management
- login security enforcement

The service does **not participate in desktop session streaming**.

Desktop streaming path:

```
WI Client
    │
    ▼
Access Gateway (VGA)
    │
    ▼
Desktop Agent
    │
    ▼
Desktop VM
```

---

# 6. Architecture Summary

```
User PC
 └─ WI Client
       │
       ▼
 WI Server
       │
       ▼
 Authentication Service
       │
       ├─ Identity Providers
       ├─ Redis / Session Store
       └─ Database

Authenticated requests then access:

Desktop Management Service
Desktop Control Service (HDC)
```

---

# 7. Summary

The **Authentication Service** provides secure identity verification for the cloud desktop platform.

Its main responsibilities include:

- authenticating users
- issuing authentication tokens
- managing login sessions
- integrating enterprise identity systems
- enforcing authentication security policies
- validating access tokens

This service ensures that only authorized users can access the cloud desktop environment.