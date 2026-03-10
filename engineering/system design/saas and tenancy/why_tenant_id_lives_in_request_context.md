# Why tenantId Belongs in RequestContext (Not Session)

## 1. Core Conclusion

**tenantId must live in RequestContext, not in Session.**

Reason: tenantId represents *execution scope*, while Session represents *identity*.

---

## 2. First-Principles Definitions

### Session (Identity Layer)

Session answers:
> **Who is the caller?**

Session is:
- Stable across requests
- Created by authentication
- About *identity and authority*

Typical session fields:
- userId
- roles / permissions
- authentication info
- session expiry

---

### RequestContext (Execution Layer)

RequestContext answers:
> **Under which business scope is this request executed?**

RequestContext is:
- Request-scoped
- Explicit per request
- About *intent and routing*

Typical request context fields:
- tenantId
- traceId
- locale / timezone
- requestId

---

## 3. Why tenantId Is NOT Session-Owned

### 3.1 One User Can Belong to Multiple Tenants

Common real-world cases:
- Insurance agent works for multiple insurers
- Admin switches tenant in UI
- Same login, different business space

If tenantId is stored in session:
- Tenant switching becomes dangerous
- Hidden state causes cross-tenant bugs

---

### 3.2 Tenant Is Request Intent, Not Identity

tenantId answers:
> "Which data partition does *this request* operate on?"

It can come from:
- Request header
- URL path
- Subdomain
- Token claim
- UI tenant switch

That makes it **request-scoped by nature**.

---

### 3.3 Session Lifetime ≠ Tenant Intent Lifetime

- Session may last hours or days
- Tenant selection may change per request or per page

Binding tenantId to session causes:
- Stale tenant context
- Hard-to-debug production issues

---

## 4. Correct Layered Model

### Identity Layer (Session)

```text
SessionInfo
 ├─ userId
 ├─ roles / permissions
 └─ accessibleTenantIds
```

Session defines:
- *Who you are*
- *Which tenants you are allowed to access*

---

### Execution Layer (RequestContext)

```text
RequestContext
 ├─ tenantId
 ├─ traceId
 └─ request metadata
```

RequestContext defines:
- *Which tenant this request operates on*

tenantId is **validated against session.accessibleTenantIds**, not owned by session.

---

## 5. Why This Design Is Safer

- Prevents accidental cross-tenant access
- Makes tenant switching explicit
- Works correctly with async jobs and events
- Keeps session clean and stable

---

## 6. Why This Explains the Design Decision

Because:

- Users authenticate → session
- Requests execute → request context
- Tenant is execution scope → request context

So the design naturally leads to:

> **tenantId belongs in RequestContext**

---

## 7. Final Rule (Design Doc Ready)

> Identity is stable → Session
>
> Execution scope is variable → RequestContext

That is why tenantId must live in RequestContext.

