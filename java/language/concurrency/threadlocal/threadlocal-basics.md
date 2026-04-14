# ThreadLocal — From First Principles

## What is ThreadLocal?

`ThreadLocal` is a Java mechanism that allows you to bind data **to the current thread**,  
instead of binding data to an object instance or a static class.

Each thread sees **its own independent value**, even though the variable itself is shared.

In short:

> **Same variable, different value per thread**
 
---

## Basic Example

```java
private static final ThreadLocal<String> TRACE_ID = new ThreadLocal<>();

TRACE_ID.set("abc-123");

String value = TRACE_ID.get(); // "abc-123" (only in this thread)
```

Another thread calling `get()` will see:
- `null` (if never set)
- or its own value

---

## What happens if you never call set()?

```java
TRACE_ID.get();
```

- ❌ Does NOT throw an exception  
- ✅ Returns `null`

`ThreadLocal.get()` is always safe to call.

Errors only happen if you **use the returned value without null checks**.

---

## How ThreadLocal works (conceptually)

Important mental model:

- `ThreadLocal` does **not store values**
- **Thread stores values**

Internally:

```
Thread
 └── ThreadLocalMap
      ├── ThreadLocalA → valueA
      ├── ThreadLocalB → valueB
```

So:
- Same `ThreadLocal` instance
- Different threads
- Different values

---

## Common Use Cases

ThreadLocal is typically used for:

- Trace ID / Request ID
- User context (userId, tenantId)
- Locale / timezone
- Transaction context
- Security context

All of these share one property:

> They are **request-scoped**, but implemented on top of threads

---

## ThreadLocal vs Method Parameters

Why not just pass parameters?

Because ThreadLocal:
- Avoids polluting every method signature
- Works across deep call stacks
- Works with framework callbacks

Trade-off:
- Implicit dependency
- Harder to reason about if abused

---

## initialValue()

You can avoid null values by overriding `initialValue()`:

```java
private static final ThreadLocal<String> TRACE_ID =
    new ThreadLocal<>() {
        @Override
        protected String initialValue() {
            return UUID.randomUUID().toString();
        }
    };
```

Now:
- `get()` never returns `null`
- Value is lazily created per thread

---

## Very Important: Thread Pool Risk

In servers (Tomcat, Netty, Executors):

- Threads are reused
- ThreadLocal values **do NOT reset automatically**

This is dangerous:

```java
TRACE_ID.set("request-1");
// forgot to clean
```

Next request on same thread may see old data.

---

## Correct Usage Pattern

```java
try {
    TRACE_ID.set(traceId);
    // business logic
} finally {
    TRACE_ID.remove();
}
```

This cleanup step is **mandatory** in thread-pool environments.

---

## What ThreadLocal is NOT

- ❌ Not a replacement for synchronization
- ❌ Not shared state
- ❌ Not request scope by itself

ThreadLocal solves **data isolation**, not concurrency control.

---

## Summary

- ThreadLocal binds data to **threads**
- `get()` returns `null` if not set
- Must always `remove()` in thread pools
- Best used for request-level contextual data
- Belongs to **Java SE / language-level runtime behavior**
