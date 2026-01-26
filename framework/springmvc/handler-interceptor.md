# Spring MVC HandlerInterceptor — Practical Usage Guide

## What is HandlerInterceptor?

`HandlerInterceptor` is a Spring MVC extension point that allows developers to intercept HTTP requests
**before and after controller execution**.

It operates at the **Spring MVC layer**, between the `DispatcherServlet` and controller methods.

---

## Request Lifecycle Position

```
Client
  → DispatcherServlet
    → preHandle()
      → Controller
    → postHandle()
      → View Rendering / Response Writing
    → afterCompletion()
← Response
```

---

## Core Methods

### 1. preHandle

```java
boolean preHandle(HttpServletRequest request,
                  HttpServletResponse response,
                  Object handler)
```

**When it runs**
- Before the controller method

**Behavior**
- Return `true` → continue request
- Return `false` → abort request

**Typical use cases**
- Authentication / authorization
- Permission checks
- TraceId / TenantId initialization
- Rate limiting
- Request validation

---

### 2. postHandle

```java
void postHandle(HttpServletRequest request,
                HttpServletResponse response,
                Object handler,
                ModelAndView modelAndView)
```

**When it runs**
- After controller execution
- Before view rendering or response commit

**Important characteristics**
- Not guaranteed to run if an exception is thrown
- Not invoked if `preHandle` returns `false`

**Typical use cases**
- Modify `ModelAndView`
- Add common response headers
- Inject common view attributes

**Not suitable for**
- Resource cleanup
- ThreadLocal clearing

---

### 3. afterCompletion

```java
void afterCompletion(HttpServletRequest request,
                     HttpServletResponse response,
                     Object handler,
                     Exception ex)
```

**When it runs**
- After the entire request lifecycle
- After view rendering
- After response is committed

**Guarantees**
- Always executed
- Runs even if an exception occurs

**Typical use cases**
- ThreadLocal cleanup
- Logging and metrics
- Resource release
- Final error handling

---

## postHandle vs afterCompletion

| Aspect | postHandle | afterCompletion |
|------|-----------|----------------|
| Runs after controller | Yes | Yes |
| Runs after view rendering | No | Yes |
| Runs on exception | Not guaranteed | Always |
| Can modify ModelAndView | Yes | No |
| Suitable for cleanup | No | Yes |

---

## Golden Rule

> Anything initialized in `preHandle` **must be cleared in `afterCompletion`**.

Never rely on `postHandle` for cleanup logic.

---

## Common Production Uses

- Authentication / authorization
- TraceId and TenantId propagation
- Request logging
- Metrics collection
- Context initialization and cleanup

---

## When NOT to Use HandlerInterceptor

- For business logic cross-cutting → use AOP
- For low-level protocol concerns → use Servlet Filters
- For method-level concerns → use annotations or AOP

---

## Summary

`HandlerInterceptor` is best suited for **request-scoped, cross-cutting concerns** at the MVC level.
It provides clear lifecycle hooks and is a core building block in production-grade Spring MVC applications.
