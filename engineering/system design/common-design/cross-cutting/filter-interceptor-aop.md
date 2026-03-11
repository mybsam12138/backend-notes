# Filter vs Interceptor vs AOP  
## Responsibilities, Differences, and Proper Usage in a Web System

In a Spring-based web system, **Filter**, **Interceptor**, and **AOP** are all interception mechanisms.
They appear similar, but they operate at **different layers**, have **different capabilities**, and should be used for **different responsibilities**.

This document summarizes their differences and gives **clear guidance on when to use each**.

---

## 1. Filter

### Layer
- Servlet container layer
- Runs **before Spring MVC**

### What it intercepts
- HTTP request / response
- Headers
- Raw input/output streams

### What it knows
- URL
- HTTP method
- Headers
- Client IP
- Raw body (bytes)

### What it does NOT know
- Controller method
- Method arguments
- Return value
- Business exception types

### Typical use scenarios
- TraceId generation
- TenantId extraction
- Locale resolution
- Character encoding
- Request / response logging (transport-level)
- Security headers

### Example
```java
OncePerRequestFilter
```

### Key principle
> Filter is for **transport-level, request lifecycle concerns**.

---

## 2. Interceptor

### Layer
- Spring MVC layer
- Runs **around controller invocation**

### What it intercepts
- Handler execution (Controller methods)

### What it knows
- HandlerMethod
- Controller annotations
- HttpServletRequest / Response

### What it does NOT know
- Controller return value (object)
- Service-layer execution
- Non-HTTP method calls

### Important limitation
- For `@RestController`, `postHandle()` does **not** expose the return object
- `ModelAndView` is `null` in REST APIs

### Typical use scenarios
- Login state binding
- Permission pre-check (coarse-grained)
- Request-scoped context setup
- MVC-related checks

### Example
```java
HandlerInterceptor
```

### Key principle
> Interceptor is for **MVC flow and request-to-handler glue logic**.

---

## 3. AOP (Aspect-Oriented Programming)

### Layer
- Application / business layer
- Method-level interception

### What it intercepts
- Method execution

### What it knows
- Method signature
- Method arguments
- Return value (actual Java object)
- Exact execution time
- Typed exceptions

### What makes it powerful
- Independent of HTTP
- Works for:
  - Controllers
  - Services
  - Async tasks
  - Scheduled jobs
  - MQ consumers

### Typical use scenarios
- Business logging
- Audit logging
- Idempotency control
- Permission enforcement (fine-grained)
- Business validation
- Exception wrapping / translation
- Metrics and observability

### Example
```java
@Around("execution(* ..service..*(..))")
```

### Key principle
> AOP is for **business semantics and cross-cutting rules**.

---

## 4. Why Interceptor Cannot Access Return Values

Spring MVC flow:
1. Controller method executes
2. Return value is passed to `HandlerMethodReturnValueHandler`
3. Object is serialized and written to response
4. Interceptor is never given the object

This is **by design**.

To access return values:
- Use AOP
- Not Interceptor

---

## 5. Comparison Table

| Capability | Filter | Interceptor | AOP |
|----------|--------|-------------|-----|
| HTTP headers | ✅ | ✅ | ❌ |
| URL / method | ✅ | ✅ | ❌ |
| Controller method info | ❌ | ✅ | ✅ |
| Method arguments | ❌ | ⚠️ | ✅ |
| Return value | ❌ | ❌ | ✅ |
| Typed exceptions | ❌ | ⚠️ | ✅ |
| Execution time (exact) | ❌ | ⚠️ | ✅ |
| Non-HTTP reuse | ❌ | ❌ | ✅ |

---

## 6. Recommended Usage Strategy

### Use Filter for
- TraceId
- TenantId
- Locale
- Encoding
- Transport-level logging

### Use Interceptor for
- Authentication binding
- MVC-related permission checks
- Request-scoped preparation

### Use AOP for
- Business logging
- Audit
- Idempotency
- Business validation
- Permission enforcement
- Exception wrapping

---

## 7. Architectural Guideline

> If your logic sounds like:
> “Every request should do X”
→ Use **Filter / Interceptor**

> If your logic sounds like:
> “Every operation must obey rule X”
→ Use **AOP**

---

## 8. Final Conclusion

Filter, Interceptor, and AOP are **not interchangeable**.

A clean web framework:
- Uses **Filter** for request lifecycle
- Uses **Interceptor** for MVC glue
- Uses **AOP** for business semantics

Keeping these boundaries clear is what separates
**maintainable frameworks** from fragile ones.
