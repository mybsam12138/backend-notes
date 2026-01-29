# Web Encoding & Decoding Boundaries

This document explains **who is responsible for encoding and decoding in a web request/response pipeline**, what the **default behaviors** are in modern Java + Spring Boot + Tomcat systems, and **whether explicit configuration is still necessary**.

The goal is to clearly separate **responsibility boundaries** so encoding issues can be reasoned about deterministically.

---

## 1. Core Principle (Read This First)

> **Encoding is done by the producer. Decoding is done by the consumer.**

In a web system, *different components act as producers or consumers at different stages*. Encoding bugs happen when we assume one component is responsible while another actually is.

---

## 2. High-Level Request/Response Pipeline

```
Client (Browser / App)
   └─ encode (URL / form / JSON)
        ↓
================ HTTP BYTES ================
        ↓
Servlet Container (Tomcat)
   ├─ decode parameters
   │    - query string
   │    - application/x-www-form-urlencoded
   │    - multipart/form-data
   │
   └─ pass through raw body (NO decoding)
        - application/json
        - text/plain
        - binary
        ↓
Spring MVC
   ├─ read decoded parameters (String)
   └─ decode raw body (via HttpMessageConverter, e.g. Jackson)
        ↓
Application Code
        ↓
Spring MVC
   └─ encode response body (UTF-8 by default)
        ↓
================ HTTP BYTES ================
        ↓
Client
   └─ decode response (browser / app charset)

```

Key takeaway:
- **Tomcat and Spring have different decoding responsibilities**
- **Not all request bodies are decoded by Tomcat**

---

## 3. Request Side (Client → Server)

### 3.1 Query Parameters (`?name=中文`)

**Who decodes?**
- ✅ **Tomcat**

**How?**
- URL decoding during request parsing
- Result available via `HttpServletRequest.getParameter()`

**Encoding source:**
- Connector setting (e.g. `URIEncoding`)
- Or request character encoding

**Default behavior today:**
- Modern Spring Boot configures Tomcat to use UTF-8
- Works in most cases

**Should you still configure explicitly?**
- ✅ **Yes** (to avoid container / proxy differences)

---

### 3.2 Form Data (`application/x-www-form-urlencoded`)

**Who decodes?**
- ✅ **Tomcat**

**Important clarification:**
- Spring does NOT decode form data itself
- Spring only **forces the request encoding before Tomcat decodes**

**How encoding is enforced:**
- `CharacterEncodingFilter`
- Calls `request.setCharacterEncoding("UTF-8")`

**Default behavior today:**
- Spring Boot enables UTF-8 by default

**Should you still configure explicitly?**
- ✅ **Yes**, especially for legacy clients or non-Boot setups

---

### 3.3 JSON Body (`application/json`)

**Who decodes?**
- ❌ Tomcat: **does NOT decode**
- ✅ **Spring (HttpMessageConverter / Jackson)**

**Why?**
- JSON is not a servlet parameter
- Servlet spec treats it as raw body bytes

**Decoding process:**
```
InputStream (bytes)
   ↓ decode (UTF-8)
Jackson
   ↓
Java object
```

**Default behavior today:**
- JSON RFC defaults to UTF-8
- Spring/Jackson use UTF-8 unless specified otherwise

**Should you still configure explicitly?**
- ⚠️ Usually safe, but explicit `produces/consumes` is recommended

---

## 4. Response Side (Server → Client)

### 4.1 Who Encodes Responses?

- **Spring MVC** (via `HttpMessageConverter`)
- Not Tomcat directly

Example:
```http
Content-Type: application/json; charset=UTF-8
```

**Encoding flow:**
```
Java String (UTF-16)
   ↓ encode (UTF-8)
HTTP response bytes
```

---

### 4.2 Default Behavior Today

- Spring Boot JSON responses default to UTF-8
- Most modern browsers and clients assume UTF-8

**But**:
- If headers are missing, clients may guess
- Proxies may rewrite headers

**Explicit charset is still recommended**

---

## 5. Responsibility Boundary Summary (Canonical Table)

| Data Type | Decoded By | Default Charset | Explicit Config Needed |
|---------|-----------|----------------|------------------------|
| Query params | Tomcat | UTF-8 (modern) | ✅ Yes |
| Form data | Tomcat | UTF-8 (via filter) | ✅ Yes |
| JSON body | Spring (Jackson) | UTF-8 | ⚠️ Recommended |
| Response body | Spring | UTF-8 | ✅ Yes |

---

## 6. JVM Default Charset vs Web Encoding

Important distinction:

- `Charset.defaultCharset()` affects **JVM internal defaults**
- It does **NOT** control HTTP request/response decoding globally

Web encoding is governed by:
- HTTP headers
- Servlet container rules
- Framework configuration

---

## 7. Why Explicit Configuration Is Still Required (Even Today)

Even with modern defaults:

- Different JDK versions
- Different servlet containers
- Proxies / gateways
- Non-browser clients
- Legacy integrations

can all reintroduce encoding ambiguity.

> **Defaults reduce risk; explicit config removes risk.**

---

## 8. Recommended Safe Defaults (Spring Boot)

```properties
spring.http.encoding.enabled=true
spring.http.encoding.force=true
spring.http.encoding.charset=UTF-8
```

And always:
- Set `produces` / `consumes`
- Set response `Content-Type`

---

## 9. One-Sentence Mental Model

> **Tomcat decodes parameters, Spring decodes bodies, and explicit UTF-8 configuration turns assumptions into guarantees.**

---

## 10. Final Conclusion

- Tomcat only decodes *parameters*, not JSON bodies
- Spring decodes request/response bodies
- Modern systems default to UTF-8, but **defaults are not contracts**
- Explicit encoding configuration is still best practice

This understanding prevents 99% of real-world web encoding bugs.

