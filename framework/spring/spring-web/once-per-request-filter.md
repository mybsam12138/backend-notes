
# OncePerRequestFilter Summary

## 1. What is OncePerRequestFilter?

`OncePerRequestFilter` is a **Spring-provided base class** located in:

```
org.springframework.web.filter.OncePerRequestFilter
```

It is an **abstract class** that implements the **Servlet Filter** contract.

> In short:  
> **OncePerRequestFilter = Spring’s enhanced Servlet Filter**

---

## 2. Is OncePerRequestFilter Provided by Spring?

✅ **Yes.**

- It is part of **Spring Web**
- It is NOT part of the Servlet specification
- It is a **Spring abstraction on top of `javax/jakarta.servlet.Filter`**

You only get it when using Spring (Spring MVC / Spring Boot).

---

## 3. Relationship with Servlet Filter

### Servlet-level view

```
Servlet Filter (spec)
        ↑
OncePerRequestFilter (Spring)
        ↑
Your Custom Filter
```

`OncePerRequestFilter` **encapsulates and enhances** a standard Servlet Filter.

It still:
- runs in the servlet container
- participates in the filter chain
- executes before DispatcherServlet

---

## 4. Why Does Spring Provide OncePerRequestFilter?

### Problem with plain Servlet Filters

In Servlet containers, a single HTTP request may trigger:
- multiple `doFilter` calls
- internal forwards
- error dispatches
- async dispatches

This can cause **the same filter to run multiple times per request**.

---

## 5. What “Once Per Request” Really Means

`OncePerRequestFilter` guarantees:

> **Your filter logic runs only once per logical HTTP request**

It does this by:
- setting a request attribute as a marker
- skipping execution if the marker already exists

This prevents:
- duplicate execution
- duplicated context creation
- repeated logging
- ThreadLocal pollution

---

## 6. How OncePerRequestFilter Works (Internals)

Simplified logic:

```
if (request already filtered) {
    continue filter chain
} else {
    mark request as filtered
    doFilterInternal()
}
```

Spring handles this automatically.

You only implement:

```java
protected abstract void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
)
```

---

## 7. doFilter vs doFilterInternal

| Method | Who implements | Responsibility |
|------|--------------|----------------|
| doFilter | Spring | lifecycle control, once-per-request guarantee |
| doFilterInternal | You | actual filter logic |

You should **never override `doFilter`**.

---

## 8. Why OncePerRequestFilter Is Ideal for RequestContext

For things like:
- RequestContext
- traceId
- MDC logging
- metrics

You want:
- exactly one initialization
- exactly one cleanup

`OncePerRequestFilter` ensures:
- `set()` happens once
- `clear()` happens once

Even with:
- forwards
- errors
- async dispatch

---

## 9. When You Should Use OncePerRequestFilter

Use it when:

- you are in a Spring-based application
- you need request-scoped infrastructure logic
- you use ThreadLocal
- duplicate execution would be dangerous

Examples:
- request context
- tracing
- logging
- security pre-processing

---

## 10. When NOT to Use It

Avoid it when:

- you are writing a pure Servlet app
- you need container-specific filter behavior
- you want fine-grained dispatch control

In those cases, use plain `Filter`.

---

## 11. Summary Table

| Aspect | OncePerRequestFilter |
|-----|---------------------|
| Provided by | Spring |
| Based on | Servlet Filter |
| Runs once per request | Yes |
| Handles forwards / errors | Yes |
| Async-safe | Yes |
| Recommended for infra | Yes |

---

## 12. One-Sentence Takeaway

> **OncePerRequestFilter is Spring’s safe, request-aware wrapper around the Servlet Filter, designed to guarantee “initialize once, clean once” semantics.**
