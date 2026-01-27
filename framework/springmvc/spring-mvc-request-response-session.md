# Spring MVC Method Parameters: Request / Response / Session

## 1. Core Rule

In Spring MVC (including `@Controller`, `@RestController`, and `@ExceptionHandler`):

**If a method parameter can be resolved from the current web request, Spring will automatically inject it.**

This applies to:
- Controller methods
- `@ExceptionHandler` methods
- Argument resolvers managed by Spring MVC

---

## 2. Automatically Injectable Web Parameters

### 2.1 HttpServletRequest

```java
HttpServletRequest request
```

**What it is**
- Represents the incoming HTTP request.

**Typical uses**
- Read headers (`Accept-Language`, `User-Agent`)
- Read request URI / HTTP method
- Get client IP
- Access request-scoped attributes

**Examples**
```java
request.getRequestURI();
request.getMethod();
request.getHeader("Accept-Language");
request.getRemoteAddr();
```

**When to use**
- Logging
- Auditing
- Debugging
- Conditional logic based on headers or path

---

### 2.2 HttpServletResponse

```java
HttpServletResponse response
```

**What it is**
- Represents the outgoing HTTP response.

**Typical uses**
- Set response headers
- Add cookies
- Set status codes (advanced scenarios)

**Examples**
```java
response.setHeader("X-Trace-Id", traceId);
response.addCookie(cookie);
```

**When to use**
- Add tracing or security headers
- Cookie manipulation

> In REST APIs, you normally do **not** write the response body manually.

---

### 2.3 HttpSession

```java
HttpSession session
```

**What it is**
- Server-side session storage associated with a client.

**Typical uses**
- Store user state across requests
- Read/write session-scoped attributes

**Examples**
```java
session.getAttribute("userId");
session.setAttribute("step", 2);
```

**When to use**
- Traditional server-rendered web apps
- Legacy systems

> In modern REST or token-based systems, HttpSession is often avoided.

---

## 3. Other Commonly Injectable Parameters

| Parameter | Purpose |
|---|---|
| `WebRequest` | Abstract access to request data |
| `NativeWebRequest` | Access to native request/response |
| `Locale` | Resolved request locale |
| `TimeZone` | Client time zone (if configured) |
| `@CookieValue` | Read specific cookie |
| `@SessionAttribute` | Read session attribute |

---

## 4. ExceptionHandler Example

```java
@ExceptionHandler(BaseException.class)
public ResponseEntity<ApiResponse<Void>> handleBaseException(
        BaseException ex,
        HttpServletRequest request,
        Locale locale
) {
    // Spring injects request and locale automatically
}
```

---

## 5. What Cannot Be Injected Automatically

Spring will NOT inject arbitrary objects unless explicitly resolvable:

```java
User user        // not resolvable
Order order     // not resolvable
MyDto dto        // not resolvable
```

These must be obtained manually (e.g. from request, session, or services).

---

## 6. Summary

- Spring resolves method parameters **by type and context**
- Request/Response/Session are injected automatically in web requests
- Use them for infrastructure concerns (logging, headers, tracing)
- Avoid overusing `HttpSession` in modern REST APIs
