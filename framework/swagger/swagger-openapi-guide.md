
# Swagger / OpenAPI Guide for Backend Engineers

## 1. What is Swagger

Swagger is a toolset used to **design, document, and test REST APIs**.

Today the official standard is called **OpenAPI Specification (OAS)**, but many developers still refer to the ecosystem as *Swagger*.

Main purpose:

- Automatically generate **API documentation**
- Provide **interactive API testing**
- Standardize **API contracts**
- Enable **client SDK generation**

Basic workflow:

```
Spring Boot Controllers
        ↓
Swagger / OpenAPI Annotations
        ↓
OpenAPI Specification (JSON/YAML)
        ↓
Swagger UI (Interactive API Documentation)
```

---

# 2. Swagger Ecosystem

Important components:

| Component | Description |
|---|---|
| OpenAPI Specification | Standard format describing REST APIs |
| Swagger UI | Web interface for viewing and testing APIs |
| Swagger Editor | Tool for editing OpenAPI spec |
| Swagger Codegen | Generates client/server code |
| springdoc-openapi | Integration for Spring Boot |

In modern Spring Boot projects, the most common library is:

```
springdoc-openapi
```

Springfox is considered outdated.

---

# 3. Adding Swagger to Spring Boot

## Maven Dependency

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

After starting the application, open:

```
http://localhost:8080/swagger-ui/index.html
```

Swagger UI will display all APIs.

---

# 4. Basic Swagger Annotations

Swagger annotations are used to describe APIs.

## Controller Description

```java
@Tag(name = "User API", description = "Operations related to users")
@RestController
@RequestMapping("/users")
public class UserController {
}
```

---

## API Endpoint Description

```java
@Operation(summary = "Get user by ID")
@GetMapping("/{id}")
public User getUser(@PathVariable Long id) {
    return userService.getById(id);
}
```

---

## Parameter Description

```java
@GetMapping("/{id}")
public User getUser(
    @Parameter(description = "User ID")
    @PathVariable Long id
) {
    return userService.getById(id);
}
```

---

## Request Body Description

```java
@Operation(summary = "Create a new user")
@PostMapping
public User createUser(
        @RequestBody
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "User creation request"
        )
        UserCreateRequest request
) {
    return userService.create(request);
}
```

---

## Response Description

```java
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(responseCode = "404", description = "User not found")
})
```

---

# 5. Example Controller

Example Spring Boot API with Swagger annotations.

```java
@RestController
@RequestMapping("/users")
@Tag(name = "User API")
public class UserController {

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return new User(id, "Sam");
    }

    @Operation(summary = "Create user")
    @PostMapping
    public User createUser(@RequestBody UserCreateRequest request) {
        return new User(1L, request.getName());
    }
}
```

---

# 6. OpenAPI Specification Endpoint

Springdoc automatically generates the OpenAPI spec.

Endpoint:

```
/v3/api-docs
```

Example response:

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "User API",
    "version": "1.0"
  }
}
```

This specification is what Swagger UI uses to render documentation.

---

# 7. Swagger UI Capabilities

Swagger UI allows developers to:

### 1. View API documentation

```
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

### 2. Send requests directly

Example request:

```json
{
  "name": "Sam",
  "email": "sam@example.com"
}
```

### 3. View responses

```json
{
  "id": 1,
  "name": "Sam"
}
```

---

# 8. Best Practices

## Disable Swagger in Production

Swagger UI may expose internal APIs.

Example:

```
springdoc.swagger-ui.enabled=false
```

Or enable only in dev profile.

---

## Group APIs

Large systems should group APIs.

Example configuration:

```java
@Bean
public GroupedOpenApi userApi() {
    return GroupedOpenApi.builder()
            .group("users")
            .pathsToMatch("/users/**")
            .build();
}
```

---

## Hide Internal APIs

Use annotation:

```java
@Hidden
@GetMapping("/internal")
public void internalApi() {}
```

---

## Provide Clear API Descriptions

Use:

- `@Tag`
- `@Operation`
- `@Parameter`
- `@ApiResponse`

Good documentation helps frontend and QA teams.

---

# 9. Swagger vs Postman

| Feature | Swagger | Postman |
|---|---|---|
| API documentation | Yes |
| Interactive testing | Yes |
| API collections | Limited |
| Auto documentation | Yes |

Typical usage:

```
Swagger → API documentation
Postman → API testing collections
```

---

# 10. Summary

Swagger (OpenAPI) provides:

- Automatic API documentation
- Interactive API testing
- Standard API specification
- Better collaboration between frontend and backend

Typical architecture:

```
Spring Boot Controller
        ↓
Swagger Annotations
        ↓
OpenAPI Specification
        ↓
Swagger UI
```

For modern Spring Boot projects, the recommended solution is:

```
springdoc-openapi
```
