# API Log Implementation Using Servlet Filter

---

## 1. Purpose of API Log

API Log is an **infrastructure-level access log** used to observe the HTTP request lifecycle.

It answers questions such as:
- Did the request reach the system?
- How long did it take?
- What was the HTTP status?
- Which `traceId` can be used for correlation?

API log is **not** business log and **not** audit log.

---

## 2. Why Use Servlet Filter (Not Aspect)

API logging belongs to the **HTTP boundary**, therefore it should be implemented using a **Servlet Filter**, not AOP.

### Problems with Aspect-based API logging
- Depends on Spring proxy mechanism
- Misses requests rejected before controller
- Misses 404 / 401 / 403 responses
- Cannot reliably observe full request lifecycle

### Advantages of Filter-based API logging
- Runs before Spring MVC
- Covers all HTTP requests
- Works even when controller is not invoked
- Framework-agnostic
- Predictable execution order

---

## 3. Recommended Filter Type

Use:

- `OncePerRequestFilter`

Reasons:
- Executes exactly once per request
- Safe for async dispatch
- Clear lifecycle guarantees

---

## 4. Responsibilities of ApiLogFilter

An API log filter should:

1. Record request start time
2. Pass request down the filter chain
3. Capture response status
4. Calculate latency
5. Read request context (`traceId`, `tenantId`, `clientIp`)
6. Emit **one summary log line**

**Important rule**

> One request → one log line

---

## 5. What API Log Should Contain

Recommended fields:
- timestamp
- traceId
- HTTP method
- URI (preferably templated)
- HTTP status
- cost (ms)

Example:
```
2026-01-30 10:15:32.123 abc123 POST /plans/{id}/approve 200 87ms
```

---

## 6. What API Log Must NOT Contain

- Request body
- Response body
- Headers
- Sensitive data
- Business semantics

API log must stay **small and safe**.

---

## 7. Filter Ordering Requirement

When multiple filters exist:

```
RequestContextFilter   (initialize traceId / tenant)
        ↓
ApiLogFilter           (log request summary)
```

Rule:
> Context must be initialized before API logging.

---

## 8. Production Rules

- API log is always enabled in production
- Verbosity controlled by log level, not code
- INFO for success
- ERROR for failures
- Short retention policy (days)

---

## 9. Mental Model

> API log is infrastructure telemetry, not business evidence.
