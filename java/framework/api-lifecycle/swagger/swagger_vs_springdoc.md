# Swagger vs Springdoc

## What is Swagger?

Swagger is the **toolset and standard** for API documentation and design.
It does not know anything about Spring Boot or Java specifically.

**Swagger provides:**

- The **OpenAPI Specification** (the standard/format for describing APIs)
- **Swagger UI** (the visual interactive interface)
- **Swagger Editor** (write/edit YAML in the browser)
- **Swagger Codegen** (generate code from spec)

---

## What is Springdoc?

Springdoc is the **bridge between Spring Boot and Swagger.**
It reads your Spring Boot code and translates it into something Swagger UI can display.

**Springdoc provides:**

- Reads your Spring Boot code (controllers, models, annotations)
- Auto-generates the OpenAPI YAML from your code
- Serves Swagger UI automatically at ``/swagger-ui``
- Serves the spec at ``/v3/api-docs``

---

## How They Work Together

```
Your Spring Boot Code
        ↓
Springdoc reads it
        ↓
Auto-generates OpenAPI YAML
        ↓
Swagger UI renders it visually
        ↓
You see the interactive docs + Try it out
```

---

## Analogy

```
+----------------+--------------------------------------------+
| Component      | Analogy                                    |
+================+============================================+
| Swagger        | The TV screen and remote control           |
+----------------+--------------------------------------------+
| Springdoc      | The cable box that feeds content to screen |
+----------------+--------------------------------------------+
| Your Code      | The actual TV channels                     |
+----------------+--------------------------------------------+
```

Swagger UI cannot read Spring Boot code itself —
it needs Springdoc to translate your code into a spec it understands.

---

## Who Does What?

```
+---------------------------+------------------+------------+
| Task                      | Swagger          | Springdoc  |
+===========================+==================+============+
| Define OpenAPI standard   | ✅               | ❌         |
+---------------------------+------------------+------------+
| Render Swagger UI         | ✅               | ❌         |
+---------------------------+------------------+------------+
| Edit YAML in browser      | ✅               | ❌         |
+---------------------------+------------------+------------+
| Generate code from spec   | ✅               | ❌         |
+---------------------------+------------------+------------+
| Read Spring Boot code     | ❌               | ✅         |
+---------------------------+------------------+------------+
| Auto-generate YAML        | ❌               | ✅         |
+---------------------------+------------------+------------+
| Serve UI at /swagger-ui   | ❌               | ✅         |
+---------------------------+------------------+------------+
| Serve spec at /api-docs   | ❌               | ✅         |
+---------------------------+------------------+------------+
```

---

## In a Spring Boot Project You Need Both

But the good news — **one dependency gives you both:**

```xml
<!-- Springdoc bridges Spring Boot to OpenAPI -->
<!-- It includes Swagger UI internally -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.0</version>
</dependency>
```

After adding this, you automatically get:

- ``http://localhost:8080/swagger-ui``     ← Swagger UI (visual docs + Try it out)
- ``http://localhost:8080/v3/api-docs``    ← Generated OpenAPI JSON
- ``http://localhost:8080/v3/api-docs.yaml`` ← Generated OpenAPI YAML

---

## Validation — Who Does What?

When you use "Try it out" in Swagger UI:

```
You fire a request in Swagger UI
        ↓
Layer 1: Swagger UI checks required fields (client side)
        ↓
Real HTTP request sent to your server
        ↓
Layer 2: Springdoc/Spring validates against OpenAPI spec
        ↓
Layer 3: Your application code runs business logic
        ↓
Response returned and displayed in Swagger UI
```

- **Swagger UI** — minor client-side checks (required fields, UI form)
- **Springdoc** — bridges the spec to Spring's validation layer
- **Your code/framework** — the real enforcer of validation rules

---

## Summary

```
+------------+----------------------------------+----------------------------------+
| Tool       | Role                             | Without it                       |
+============+==================================+==================================+
| Swagger    | Standard + UI + tooling          | No visual docs, no standard      |
+------------+----------------------------------+----------------------------------+
| Springdoc  | Bridge from Spring Boot to       | Swagger can't read your code,    |
|            | Swagger                          | no auto-generated spec           |
+------------+----------------------------------+----------------------------------+
| Both       | Full API lifecycle in Spring     | You'd have to write YAML         |
|            | Boot                             | manually and wire everything     |
|            |                                  | yourself                         |
+------------+----------------------------------+----------------------------------+
```

---

*Springdoc official docs: https://springdoc.org*
*Swagger official docs: https://swagger.io*
