
# Runtime Exceptions in the JVM vs Business Exceptions

## 1. What are Runtime Exceptions?

Runtime exceptions are **unchecked exceptions** defined by the JVM and Java standard library.
They represent **programming errors, broken assumptions, or illegal states**.

They are subclasses of:

```
java.lang.RuntimeException
```

They:
- Do NOT require `throws` in method signatures
- Usually indicate **developer bugs**
- Should normally NOT be caught and swallowed

---

## 2. Common JVM Runtime Exceptions and When to Use Them

### 2.1 NullPointerException
**Meaning:** Accessing a member of a `null` reference

**Use when:**  
- Never throw manually in business code  
- Let it fail naturally if it happens

**Indicates:**  
- Missing null checks
- Broken assumptions

---

### 2.2 IllegalArgumentException
**Meaning:** Method argument value is invalid

**Use when:**  
- Parameters are out of allowed range
- Invalid format or value

**Example:**
```
if (age < 0) {
    throw new IllegalArgumentException("age must be >= 0");
}
```

---

### 2.3 IllegalStateException
**Meaning:** Method is called at the wrong time or lifecycle state

**Use when:**  
- Required initialization not done
- Object or system lifecycle is broken

**Example:**
```
if (!initialized) {
    throw new IllegalStateException("Not initialized");
}
```

---

### 2.4 IndexOutOfBoundsException
**Meaning:** Index is outside valid range

**Use when:**  
- Let JVM throw it naturally
- Do not wrap unless adding context

---

### 2.5 ClassCastException
**Meaning:** Invalid type cast at runtime

**Use when:**  
- Never throw manually
- Indicates design or generics misuse

---

### 2.6 ArithmeticException
**Meaning:** Illegal arithmetic operation

**Example:** divide by zero

**Use when:**  
- Let JVM throw it
- Catch only if you can recover

---

### 2.7 UnsupportedOperationException
**Meaning:** Operation is intentionally not supported

**Use when:**  
- Method is part of interface but not supported
- Immutable collections

---

## 3. What Runtime Exceptions Represent (Core Idea)

Runtime exceptions mean:

> **The code is wrong, not the user.**

They represent:
- Broken invariants
- Invalid lifecycle
- Programming mistakes
- Framework misconfiguration

They usually map to:
- **HTTP 500**
- Immediate bug fixing

---

## 4. What Are Business Exceptions (BizException)?

Business exceptions represent **expected business rule failures**.

They:
- Are part of normal system behavior
- Are triggered by valid user actions
- Should be handled and translated into responses

Typical base class:
```
class BizException extends RuntimeException {
    private final ErrorCode errorCode;
}
```

---

## 5. When to Use Business Exceptions

Use business exceptions when:

- Business rules are violated
- User action is valid but not allowed
- Domain constraints fail

**Examples:**
- Insufficient balance
- Order already paid
- Policy expired
- User not authorized for operation

---

## 6. Runtime Exception vs Business Exception (Comparison)

| Aspect | Runtime Exception | Business Exception |
|-----|------------------|-------------------|
| Cause | Developer bug | Business rule |
| Expected | No | Yes |
| Client fixable | No | Sometimes |
| HTTP status | 500 | 200 / 400 |
| Logged as error | Yes | Usually warning |
| Should be caught | Rarely | Yes |

---

## 7. Golden Rules

1. **Do NOT convert runtime exceptions into business exceptions**
2. **Do NOT swallow runtime exceptions**
3. **Fail fast on IllegalStateException**
4. **Use BizException for domain logic only**
5. **Framework problems ≠ business problems**

---

## 8. Simple Decision Guide

Ask this question:

> "If this happens, should a developer wake up at night?"

- YES → RuntimeException
- NO → BusinessException

---

## 9. Recommended Project Placement

```
docs/
 └── backend/
     └── error-handling/
         ├── runtime-exceptions.md
         └── business-exceptions.md
```

---

## 10. Final Principle

> Runtime exceptions protect the system.  
> Business exceptions protect the business.

Never mix them.
