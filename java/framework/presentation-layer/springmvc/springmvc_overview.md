# Spring MVC — Overview & Core Mechanisms

Spring MVC is a **Presentation Layer web framework** built on the MVC pattern.
It handles the full HTTP request-response lifecycle inside a web server container (Tomcat).

---

## The Big Picture

```
Client (Browser / Mobile / API Consumer)
        ↕  HTTP (Request Line + Headers + Body)
     Tomcat (Web Server Container)
        ↕  HttpServletRequest / HttpServletResponse
     DispatcherServlet  ← Front Controller (Spring MVC entry point)
        ↕
     Spring MVC Core Mechanisms
        ↕
     Service Layer (Business Logic)
```

---

## Core Mechanisms

### 1. DispatcherServlet — Front Controller
- The **single entry point** for all HTTP requests
- Tomcat receives the request and hands it to `DispatcherServlet`
- It then **orchestrates** all other mechanisms below
- Registered automatically in Spring Boot

```
All requests → DispatcherServlet → delegates to the right handler
```

---

### 2. HandlerMapping — Request Routing
- Maps incoming URL + HTTP method → correct Controller method
- Reads your `@RequestMapping`, `@GetMapping`, `@PostMapping` annotations

```java
@GetMapping("/users/{id}")   // HandlerMapping registers this
public UserDto getUser(@PathVariable Long id) { ... }
```

```
GET /users/1  →  HandlerMapping  →  UserController.getUser()
```

---

### 3. Controller — Request Handler
- Your code lives here
- Receives parsed input, calls Service layer, returns result
- Two types:

| Annotation | Returns | Used For |
|---|---|---|
| `@Controller` | View name (String) | Server-side rendering (HTML) |
| `@RestController` | Java Object | REST API (JSON/XML) |

```java
@RestController
public class UserController {
    @GetMapping("/users/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return userService.findById(id); // returns Object
    }
}
```

---

### 4. HttpMessageConverter — Object ↔ JSON/XML
- Converts Java Object → JSON (for response)
- Converts JSON → Java Object (for request body)
- Default converter: **Jackson** (`MappingJackson2HttpMessageConverter`)

```
// Response path
UserDto (Java Object)  →  Jackson  →  {"name":"John","age":30}  →  HttpServletResponse body

// Request path
{"name":"John","age":30}  →  Jackson  →  UserDto (Java Object)
```

Triggered automatically by `@ResponseBody` / `@RequestBody`.

---

### 5. ViewResolver — Server-Side Rendering
- Used when returning HTML (not JSON)
- Maps view name String → actual template file
- Common: **Thymeleaf**, JSP

```java
return "home"; // ViewResolver finds → templates/home.html
```

```
"home"  →  ViewResolver  →  renders home.html  →  HTML String  →  HttpServletResponse body
```

---

### 6. HandlerMethodArgumentResolver — Input Binding
- Extracts and binds data from the HTTP request into method parameters automatically

| Annotation | Binds From |
|---|---|
| `@PathVariable` | URL path `/users/{id}` |
| `@RequestParam` | Query string `?page=1` |
| `@RequestBody` | Request body (JSON) |
| `@RequestHeader` | HTTP headers |

```java
public UserDto getUser(
    @PathVariable Long id,           // from URL
    @RequestParam String filter,     // from query string
    @RequestHeader String token      // from header
) { ... }
```

---

### 7. Validation — Input Checking
- Validates input before it reaches your logic
- Uses `@Valid` / `@Validated` + Bean Validation annotations

```java
public ResponseEntity<?> createUser(@Valid @RequestBody UserDto dto) { ... }

public class UserDto {
    @NotNull
    @Size(min = 2)
    private String name;

    @Min(0)
    private int age;
}
```

If validation fails → Spring automatically returns `400 Bad Request`.

---

### 8. ExceptionHandler — Error Handling
- Catches exceptions thrown anywhere in the controller layer
- Returns proper HTTP error responses

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        return ResponseEntity.status(500).body("Internal Server Error");
    }
}
```

---

### 9. Interceptor — Pre/Post Processing
- Runs logic **before** and **after** controller execution
- Common use: logging, authentication checks, performance tracking

```java
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        // check token before hitting controller
        return true; // or false to block
    }
}
```

---

## Full Request Flow

```
HTTP Request
    ↓
Tomcat
    ↓
DispatcherServlet
    ↓
HandlerMapping         → finds the right Controller method
    ↓
Interceptor.preHandle  → pre-processing (auth, logging)
    ↓
ArgumentResolver       → binds @PathVariable, @RequestBody, etc.
    ↓
Validation             → validates @Valid inputs
    ↓
Controller Method      → your code, calls Service layer
    ↓
HttpMessageConverter   → Object → JSON  (REST)
ViewResolver           → name  → HTML  (SSR)
    ↓
Interceptor.postHandle → post-processing
    ↓
HttpServletResponse    → headers + body filled
    ↓
Tomcat                 → sends bytes over TCP
    ↓
HTTP Response (Status Line + Headers + Body)
    ↓
Client
```

---

## Core Mechanisms Summary

| # | Mechanism | Role |
|---|---|---|
| 1 | **DispatcherServlet** | Front controller — entry point for all requests |
| 2 | **HandlerMapping** | Routes URL → Controller method |
| 3 | **Controller** | Handles request, calls service, returns result |
| 4 | **HttpMessageConverter** | Object ↔ JSON/XML conversion (Jackson) |
| 5 | **ViewResolver** | View name → HTML template (SSR only) |
| 6 | **ArgumentResolver** | Binds request data into method parameters |
| 7 | **Validation** | Validates input, returns 400 if invalid |
| 8 | **ExceptionHandler** | Catches exceptions, returns proper error response |
| 9 | **Interceptor** | Pre/post processing around controller execution |

---

## One-liner Summary

> Spring MVC's core is the **DispatcherServlet** acting as a front controller,
> delegating to **HandlerMapping → Controller → MessageConverter**,
> and wrapping everything with **validation, exception handling, and interceptors**
> to produce a clean HTTP response written into `HttpServletResponse` and shipped by Tomcat.
