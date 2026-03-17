# RequestContext Design Summary

## 1. What Is RequestContext?

**RequestContext** is an in-memory, request-scoped context used to carry **cross-cutting, non-business information** during the execution of a single request.

It is typically implemented using **ThreadLocal** and exists only for the **lifetime of one request**.

> RequestContext answers: **“Who is acting, under what context, right now?”**

It does **not** represent login state, session state, or persistent user data.

---

## 2. Why RequestContext Exists

RequestContext solves these problems:

- Avoids passing repeated parameters (userId, tenantId, traceId)
- Decouples business code from authentication frameworks
- Provides fast, in-memory access to request metadata
- Centralizes cross-cutting concerns

It is a **convenience and safety mechanism**, not a storage system.

---

## 3. Lifecycle and Scope

### Lifecycle

- Created at **request entry** (usually in a filter)
- Used during request processing
- Cleared at **request exit**

### Scope

- JVM memory only
- Bound to the **current thread**
- Does not survive thread reuse
- Does not survive application restart

```text
Request Start
  → Create RequestContext
  → Business logic
Request End
  → Clear RequestContext
```

---

## 4. Relationship with Session / Token Systems

RequestContext is **not** a replacement for session or token storage.

| Aspect | Sa-Token Session | RequestContext |
|---|---|---|
| Storage | Redis / memory | JVM memory |
| Lifetime | Login lifecycle | Single request |
| Persistence | Yes (until logout / TTL) | No |
| Access cost | Network / serialization | O(1) memory |
| Purpose | Identity & authorization | Execution context |

Typical flow:

```text
Request
 ├─ Sa-Token restores session (Redis)
 ├─ Extract userId / tenantId
 ├─ Put into RequestContext
 ├─ Business logic runs
 └─ Clear RequestContext
```

---

## 5. What Should Be Stored in RequestContext

Only **small, stable, cross-cutting values**:

- traceId
- userId
- tenantId (if applicable)
- request start time
- client IP

These values:
- are needed by many layers
- are not business-domain data
- are cheap to copy per request

---

## 6. What Must NOT Be Stored in RequestContext

Do **not** store:

- Business entities (User, Order, Policy, etc.)
- Large objects or collections
- Session or security framework objects
- Mutable workflow or business state
- Data that must survive beyond the request

If something must persist across requests, it does **not** belong here.

---

## 7. Package Structure Recommendation

```text
context
├── RequestContext        // ThreadLocal access facade
├── RequestContextData    // Plain data holder
└── ContextKeys           // Optional constants
```

The `context` package should remain **small and stable**.

---

## 8. Writing and Clearing the Context (Critical Rule)

Only infrastructure code (filter / interceptor) should:

- create the RequestContext
- populate it
- clear it

Example rule:

> Business code may **read** RequestContext, but must never **write** to it.

Always clear in a `finally` block to avoid thread reuse leaks.

---

## 9. Thread Reuse Warning

In web servers, threads are reused.

Failing to clear RequestContext may cause:

- data leakage between requests
- incorrect user or tenant attribution
- severe security bugs

Clearing the context is **mandatory**, not optional.

---

## 10. Key Design Principles

- RequestContext is **ephemeral**
- RequestContext is **in-memory only**
- RequestContext is **request-scoped, not user-scoped**
- RequestContext contains **infrastructure data, not business data**
- Session/token systems remain the source of truth

---

## 11. One-Sentence Summary

> **RequestContext is a short-lived, in-memory execution context that carries cross-cutting request metadata, not persistent user or business state.**
