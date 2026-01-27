
# Servlet Dispatch Types Summary

## 1. What Is Dispatch in Servlet?

In the Servlet specification, **dispatch** means:

> The servlet container routes the **same HTTP request** to another processing target **inside the server**.

Key characteristics:
- Happens on the **server side**
- Uses the **same HttpServletRequest / HttpServletResponse**
- The client is **not aware**
- May cause the filter chain to execute again

Dispatch is a **container-level mechanism**, not a Spring-only concept.

---

## 2. Servlet Dispatch Types

The Servlet specification defines the following **dispatch types**:

### 2.1 REQUEST

**Meaning**: Initial request coming from the client.

- Triggered by browser / client
- This is the **first dispatch**
- Always happens exactly once per HTTP request

Example:
```
GET /api/orders
```

---

### 2.2 FORWARD

**Meaning**: Internal forward to another resource.

- Triggered by `RequestDispatcher.forward()`
- Same request and response objects
- Client does not see the URL change

Example:
```java
request.getRequestDispatcher("/error").forward(request, response);
```

Use cases:
- Internal error pages
- MVC flow control
- Legacy JSP forwarding

---

### 2.3 INCLUDE

**Meaning**: Include another resource’s output into the current response.

- Triggered by `RequestDispatcher.include()`
- Same request and response
- Response output is appended

Example:
```java
request.getRequestDispatcher("/header").include(request, response);
```

Use cases:
- JSP fragments
- Shared page components

---

### 2.4 ERROR

**Meaning**: Dispatch triggered during error handling.

- Triggered when an exception occurs
- Mapped via error pages or framework handlers
- Same request object

Example:
```
Controller throws RuntimeException
→ container dispatches to /error
```

Use cases:
- Centralized error handling
- Error pages

---

### 2.5 ASYNC

**Meaning**: Asynchronous request continuation.

- Triggered after async processing resumes
- Often executed in a different thread
- Same request object

Example:
```java
return Callable<String>
```

Use cases:
- Long-running tasks
- Non-blocking IO
- Async controllers

---

## 3. Dispatch vs Redirect (Very Important)

### Forward (Dispatch)

- Server-side
- Same request
- Client unaware
- Is a dispatch

### Redirect (Not Dispatch)

```java
response.sendRedirect("/login");
```

- Client-side
- New HTTP request
- New request lifecycle
- Not a dispatch

---

## 4. Why Dispatch Matters for Filters

Because **each dispatch may re-enter the filter chain**, a single HTTP request may cause:

- multiple `doFilter()` executions
- repeated ThreadLocal initialization
- duplicated logging
- broken cleanup logic

This is why Spring provides `OncePerRequestFilter`.

---

## 5. Dispatch Type and Filter Mapping

Filters can be configured to apply to specific dispatch types:

- REQUEST
- FORWARD
- INCLUDE
- ERROR
- ASYNC

---

## 6. One-Sentence Takeaway

> Servlet containers work in **dispatches**, not just requests, and each dispatch may legally pass through the filter chain again.

Understanding dispatch types is essential for:
- filters
- async processing
- error handling
- ThreadLocal safety
