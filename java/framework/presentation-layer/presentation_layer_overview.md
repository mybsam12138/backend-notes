# Presentation Layer — Web Application Overview

The **Presentation Layer** is the topmost layer in a web application. Its sole job is to **handle communication between the outside world (client) and your application**.

---

## What It Does

```
Client (Browser / Mobile / API Consumer)
            ↕  HTTP
    [ Presentation Layer ]
            ↕
      Business / Service Layer
```

| Responsibility | Description |
|---|---|
| **Receive Requests** | Accept incoming HTTP requests from clients |
| **Parse Input** | Extract data from URL, headers, body, params |
| **Validate Input** | Check format, required fields, constraints |
| **Delegate** | Pass clean data down to the Service layer |
| **Format Output** | Transform results into HTML, JSON, XML |
| **Send Response** | Write HTTP response back to the client |
| **Handle Errors** | Return proper error codes (400, 404, 500…) |
| **Handle Auth** | Check tokens, sessions, permissions at entry point |

---

## It Does NOT

- ❌ Contain business rules or logic
- ❌ Talk directly to the database
- ❌ Know how data is stored or processed

It only **receives, delegates, and responds**.

---

## Two Styles

### ① Server-Side Rendering (SSR)
- Server builds the full HTML page and sends it
- Example: Spring MVC + Thymeleaf, JSP

### ② REST API (Client-Side)
- Server returns raw JSON/XML
- Client (React, Vue, mobile) renders the UI
- Example: Spring MVC `@RestController`

---

## In the Full Layer Picture

```
┌──────────────────────────┐
│     Presentation Layer   │  ← Spring MVC, Controllers
├──────────────────────────┤
│     Service Layer        │  ← Business logic
├──────────────────────────┤
│     Repository Layer     │  ← Data access (JPA, SQL)
├──────────────────────────┤
│     Database             │  ← MySQL, PostgreSQL...
└──────────────────────────┘
```

---

## Spring MVC — What It Handles

**Spring MVC handles the full HTTP request-response lifecycle:**

1. **Incoming HTTP Requests** — via `DispatcherServlet` (the front controller)
2. **Request Routing** — maps URLs to `@Controller` methods using `@RequestMapping`, `@GetMapping`, etc.
3. **Input Binding** — binds request params, path variables, request body (`@RequestParam`, `@PathVariable`, `@RequestBody`)
4. **Validation** — validates input with `@Valid` / `@Validated`
5. **Business Logic Delegation** — calls service layer
6. **View Resolution** — resolves view templates (Thymeleaf, JSP, etc.) or returns JSON/XML (`@ResponseBody`)
7. **Exception Handling** — via `@ExceptionHandler` / `@ControllerAdvice`
8. **Response Writing** — sends back HTTP response (HTML page or REST JSON)

### The Flow

```
Client → DispatcherServlet → HandlerMapping → Controller → Service → View/JSON → Client
```

---

## Classification

| Category | Value |
|---|---|
| **Type** | Web MVC Framework |
| **Layer** | Presentation Layer (Web Layer) |
| **Pattern** | Model-View-Controller (MVC) |
| **Protocol** | HTTP (Request/Response) |
| **Part of** | Spring Framework ecosystem |

---

## One-liner Summary

> The Presentation Layer is the **entry gate** of your application — it speaks HTTP, understands requests, and returns responses, while keeping all business logic out.
