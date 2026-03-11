# Spring @Order Annotation – Complete Guide

## 1. What is `@Order`?

`@Order` is a Spring annotation used to **define precedence (priority)** among multiple beans that participate in the **same extension point**.

> **Lower value = higher priority = executed earlier**

It does **NOT** represent bean registration order or classpath scanning order.

---

## 2. Core Rule

```java
@Order(0)    // higher priority
@Order(10)   // lower priority
```

Execution order:

```
0 → 10 → target → 10 → 0
```

---

## 3. Typical Places Where `@Order` Is Used

| Scenario | What `@Order` Controls |
|--------|------------------------|
| AOP Aspects | Aspect execution order |
| Servlet Filters | Filter chain order |
| HandlerInterceptors | Interceptor execution order |
| Advice beans | Resolution priority |
| Multiple candidates | Selection precedence |

---

## 4. `@Order` in AOP (Most Common Case)

### Example

```java
@Aspect
@Order(0)
class ApiLogAspect {}

@Aspect
@Order(10)
class SecurityAspect {}

@Aspect
@Order(100)
class TransactionAspect {}
```

### Execution Flow

```
ApiLogAspect
  → SecurityAspect
     → TransactionAspect
        → target method
        → TransactionAspect (exit)
     → SecurityAspect (exit)
  → ApiLogAspect (exit)
```

### Why This Matters

- Early aspects can measure total execution time
- Later aspects may wrap or transform exceptions
- Correct ordering avoids subtle bugs

---

## 5. `@Order` vs Registration Order

| Concept | Meaning |
|------|--------|
| Bean registration order | When Spring discovers beans |
| `@Order` | Who runs first when multiple beans apply |

⚠️ **Never rely on registration order** — it is unstable and implementation-dependent.

---

## 6. Same Order Value: What Happens?

```java
@Order(0)
class A {}

@Order(0)
class B {}
```

- Spring treats them as **equal priority**
- Relative order is **undefined**
- May appear stable locally, but **must not be relied on**

> Rule: If order matters, **do not reuse the same order value**.

---

## 7. What If `@Order` Is Missing?

- Bean is treated as **lowest priority**
- Often equivalent to `Ordered.LOWEST_PRECEDENCE`
- Relative order becomes undefined

This is why **framework / starter code should always specify `@Order`**.

---

## 8. `@Order` vs `Ordered` Interface

These are equivalent:

```java
@Order(0)
class ApiLogAspect {}
```

```java
class ApiLogAspect implements Ordered {
    @Override
    public int getOrder() {
        return 0;
    }
}
```

`@Order` is preferred for clarity and simplicity.

---

## 9. Negative Order Values

Negative values are allowed and commonly used for **infrastructure-level logic**.

```java
@Order(-100)
class InfrastructureAspect {}
```

Lower value = earlier execution.

---

## 10. Key Takeaways

- `@Order` controls **precedence**, not registration
- Applies only **among beans of the same role**
- Lower value = higher priority
- Always specify `@Order` in shared frameworks
- Do not rely on equal order values

---

## One-Sentence Summary

> `@Order` defines the execution or selection priority among multiple beans participating in the same Spring extension point, with lower values indicating higher precedence.
