# When to Catch `Throwable` vs `Exception` in Java

This document summarizes **when it is appropriate to catch `Throwable`** and **when you should only catch `Exception`**, especially in the context of Spring, AOP, and infrastructure code.

---

## 1. Java Exception Hierarchy (Baseline)

```
Throwable
 ├── Exception
 │    ├── RuntimeException
 │    └── Checked Exceptions
 └── Error
      ├── OutOfMemoryError
      ├── StackOverflowError
      ├── LinkageError
      └── ...
```

- `Exception` ❌ does **not** include `Error`
- `Throwable` ✅ includes **everything that can be thrown**

---

## 2. Catching `Exception` (Most Application Code)

### When to Catch `Exception`

Use `catch (Exception e)` in:

- Business logic
- Service layer code
- Controller logic
- Validation and domain rules
- Recoverable failure scenarios

### Example

```java
try {
    processOrder();
} catch (Exception e) {
    log.warn("Business failure", e);
    throw new BusinessException(e);
}
```

### Why This Is Correct

- Business code cannot recover from JVM-level failures
- Catching `Error` would hide fatal system problems
- Preserves correct JVM and transaction semantics

---

## 3. Catching `Throwable` (Infrastructure Code Only)

### When Catching `Throwable` Is Correct

Catch `Throwable` **only** in infrastructure-level code such as:

- AOP (`@Around` advice)
- Logging frameworks
- Monitoring / tracing
- Metrics collection
- Resource cleanup wrappers

### Example (Correct Pattern)

```java
try {
    return pjp.proceed();
} catch (Throwable t) {
    log.error("Invocation failed", t);
    throw t;   // MUST rethrow
}
```

### Why This Is Necessary

- `ProceedingJoinPoint.proceed()` declares `throws Throwable`
- Infrastructure must observe *all* failures
- JVM `Error`s (OOM, SOE) may still propagate through the stack
- Logging fatal failures is valuable

---

## 4. Important Rule: Catching ≠ Handling

### Key Distinction

| Concept | Meaning |
|------|--------|
| Catching | Intercepting the thrown object |
| Handling | Recovering and continuing execution |

> **JVM Errors may be caught, but should never be handled.**

Catching `Throwable` is allowed **only** to:
- log
- measure time
- clean up minimal resources

It must **never** attempt recovery.

---

## 5. What NOT to Do ❌

### ❌ Swallowing `Throwable`

```java
catch (Throwable t) {
    log.error("error", t);
    return null;   // ❌ catastrophic
}
```

### ❌ Wrapping `Error`

```java
catch (Throwable t) {
    throw new RuntimeException(t);  // ❌ breaks JVM semantics
}
```

### ❌ Catching `Throwable` in Business Code

```java
catch (Throwable t) {
    // business logic ❌
}
```

This hides fatal JVM problems and leads to undefined behavior.

---

## 6. Special Case: `OutOfMemoryError`

- `OutOfMemoryError` **can be caught**
- Catch block **may or may not execute**
- JVM may not have enough resources to continue
- Logging is **best-effort only**

This is why infrastructure code:
- may catch it
- must rethrow it
- must not rely on cleanup logic

---

## 7. Practical Rules to Remember

### Rule 1
> **Business code: catch `Exception` only**

### Rule 2
> **Infrastructure code: may catch `Throwable`, must rethrow**

### Rule 3
> **Never attempt recovery from `Error`**

### Rule 4
> **Never swallow or wrap `Error`**

---

## 8. Quick Decision Table

| Context | Catch Type |
|------|-----------|
| Controller / Service | `Exception` |
| Domain / Business Logic | `Exception` |
| AOP / Logging | `Throwable` |
| Framework / Infrastructure | `Throwable` |
| JVM Recovery | ❌ none |

---

## 9. One-Sentence Summary

> Catch `Exception` in business code for recoverable failures, and catch `Throwable` only in infrastructure code for observation and logging, always rethrowing to preserve JVM semantics.

---

## 10. Final Reminder

If you ever ask:

> “Should I catch `Throwable` here?”

The safe default answer is:

> ❌ **No — unless you are writing framework-level or infrastructure code.**
