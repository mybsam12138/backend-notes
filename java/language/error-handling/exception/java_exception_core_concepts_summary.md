# Java Exception: Cause, Message, and Stack Trace — A Practical Summary

This document summarizes **what an exception is**, and clearly explains the roles of **message**, **cause**, and **stack trace**, with a focus on **real-world usage and design intent**.

---

## 1. What Is a `Throwable`?

In Java, **all exceptions and errors** extend `Throwable`.

A `Throwable` contains **four core parts**:

```
Throwable
 ├─ message        (what happened)
 ├─ cause          (why it happened)
 ├─ stackTrace     (where it happened)
 └─ suppressed     (secondary failures)
```

Each part serves a **different responsibility**.

---

## 2. Exception Message (`getMessage()`)

### What it is

- A **human-readable description** of the error
- Usually short
- Often business-oriented

```java
throw new IllegalStateException("Service failed");
```

```java
ex.getMessage(); // "Service failed"
```

### Purpose

- Explain the failure at the **current abstraction level**
- Suitable for:
  - API responses (after filtering)
  - logs
  - error codes mapping

### What it is NOT

- ❌ Not diagnostic
- ❌ Not sufficient for debugging
- ❌ Not a replacement for stack trace

---

## 3. Exception Cause (`getCause()`)

### What it is

- Another `Throwable`
- Represents **why this exception happened**
- Forms a **cause chain**

```java
throw new ServiceException("create order failed", sqlException);
```

```
ServiceException
  └─ cause → SQLException
```

### Important facts

- Root exception has `cause == null`
- Cause is set **only when wrapping**
- Cause preserves **original failure reason**

### Typical use cases

- Error classification
- Retry / fallback decisions
- API error mapping
- Monitoring & alert grouping

---

## 4. Root Cause

### Definition

The **root cause** is the deepest exception in the cause chain:

```java
Throwable root = getRootCause(ex);
```

```
IllegalStateException
  → CompletionException
    → TimeoutException   ← root cause
```

### Why root cause matters

- Frameworks wrap exceptions multiple times
- Business logic should depend on **real failure**, not wrappers

### Correct usage

- ✅ Decision making (retry, degrade, classify)
- ❌ Rethrowing
- ❌ Replacing top-level exception

---

## 5. Stack Trace (`getStackTrace()`)

### What it is

- A list of `StackTraceElement`
- Captures the **call path at exception creation time**

```java
StackTraceElement[] trace = ex.getStackTrace();
```

Each element contains:

```
ClassName.method(File.java:line)
```

### Key properties

- Each `Throwable` has its **own stack trace**
- Stack trace does NOT change when exception is wrapped
- Cause chain = multiple stack traces

---

## 6. Printing Stack Traces

### `toString()`

```java
ex.toString();
```

Output:

```
java.lang.IllegalStateException: Service failed
```

- ❌ No stack trace
- ❌ No cause chain

---

### `printStackTrace()`

```java
ex.printStackTrace();
```

- Prints full diagnostic info
- Includes:
  - message
  - stack trace
  - causes
  - suppressed exceptions

Can print to:
- console (`System.err`)
- file (`PrintWriter` / `PrintStream`)
- memory (`StringWriter`)

---

## 7. Logging Framework Behavior

Logging frameworks (SLF4J / Logback / Log4j):

```java
log.error("failed", ex);
```

- Detect `Throwable` specially
- Do NOT call `toString()`
- Render full stack trace internally

### Best practice

```java
log.error("Unexpected error", ex);
```

Avoid:

```java
log.error(ex.getMessage()); // loses stack trace
```

---

## 8. Exception Layering (Best Practice)

```
ControllerException   → business context
ServiceException      → domain meaning
InfraException        → infrastructure
SQLException          → technical root cause
```

Rules:

- Always wrap with cause
- Never swallow root cause
- Never throw root cause directly

---

## 9. Mental Model (Remember This)

> **Message = WHAT**  
> **Cause = WHY**  
> **Stack trace = WHERE**

All three are required for a healthy system.

---

## 10. Final Summary Table

| Component | Purpose | Used For |
|---------|--------|---------|
| message | human meaning | API / logs |
| cause | failure reason | retry / classify |
| root cause | real failure | recovery decisions |
| stack trace | execution path | debugging |

---

**This separation is intentional and foundational to Java’s exception design.**

---

## 11. Cause Chain & `printStackTrace()` Output (Extended)

### 11.1 Cause Chain (Multiple `Caused by:`)

A Java exception can show **multiple `Caused by:` sections**, which represent a **cause chain**, not parallel causes.

Key rule:

> **Each `Throwable` has only ONE direct cause, but that cause can itself have a cause.**

Conceptually:

```
Exception A
  └─ cause → Exception B
       └─ cause → Exception C
```

This is why `printStackTrace()` may contain multiple `Caused by:` blocks.

---

### 11.2 Example Code (Multi-Layer Wrapping)

```java
public class Demo {
    public static void main(String[] args) {
        try {
            controller();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void controller() {
        try {
            service();
        } catch (Exception e) {
            throw new RuntimeException("controller failed", e);
        }
    }

    static void service() {
        try {
            repository();
        } catch (Exception e) {
            throw new IllegalStateException("service failed", e);
        }
    }

    static void repository() {
        Integer.parseInt("abc");
    }
}
```

---

### 11.3 `printStackTrace()` Output (Annotated)

```text
java.lang.RuntimeException: controller failed          ← message (top exception)
    at Demo.controller(Demo.java:15)                  ← stack trace (RuntimeException)
    at Demo.main(Demo.java:6)

Caused by: java.lang.IllegalStateException: service failed
    at Demo.service(Demo.java:24)                     ← stack trace (IllegalStateException)
    at Demo.controller(Demo.java:13)

Caused by: java.lang.NumberFormatException: For input string: "abc"
    at java.lang.Integer.parseInt(Integer.java:652)   ← stack trace (root cause)
    at Demo.repository(Demo.java:29)
```

---

### 11.4 How to Read This Output

- **Message**: appears on the first line of each exception block
- **Stack trace**: the indented `at ...` lines immediately following that message
- **Cause boundary**: each `Caused by:` line starts a *new Throwable section*

Each `Throwable` prints:

- its **own message**
- its **own stack trace**
- then delegates to its **cause** (if any)

---

### 11.5 Key Takeaway (Lock This In)

> **`printStackTrace()` walks the cause chain and prints, for EACH Throwable:  
> class + message + stack trace.**

This is why it is called *full diagnostic output*.


