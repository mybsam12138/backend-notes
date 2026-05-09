# OpenAPI Overview

## What is OpenAPI?

OpenAPI (formerly known as **Swagger**) is an **industry-standard specification**
for describing RESTful APIs in a structured, machine-readable format (YAML or JSON).

It defines a **rulebook** that everyone agrees on — so any tool, any language,
any framework can read and understand your API description the same way.

---

## History

```
2010  → "Swagger Specification" created by Tony Tam
          (a format to describe REST APIs)
          ↓
2015  → Swagger donated to the open source community
          ↓
2016  → Renamed to "OpenAPI Specification" (OAS)
          Managed by the OpenAPI Initiative (Linux Foundation)
          ↓
Today → OpenAPI = the official standard name
        Swagger  = the tools built around that standard (by SmartBear)
```

---

## OpenAPI vs Swagger — What is the Difference?

```
+----------------+-------------------------------+-----------------------------+
| Term           | What it is                    | Maintained by               |
+================+===============================+=============================+
| OpenAPI        | The specification / standard  | OpenAPI Initiative          |
|                | (the rulebook)                | (Linux Foundation)          |
+----------------+-------------------------------+-----------------------------+
| Swagger        | Tools built around OpenAPI    | SmartBear company           |
|                | (UI, Editor, Codegen)         |                             |
+----------------+-------------------------------+-----------------------------+
```

**Analogy:**

```
+------------+---------------------------+----------------------------------+
| Concept    | OpenAPI World             | Web World                        |
+============+===========================+==================================+
| Standard   | OpenAPI Specification     | HTML Standard (by W3C)           |
+------------+---------------------------+----------------------------------+
| Tool       | Swagger UI                | Chrome Browser (by Google)       |
+------------+---------------------------+----------------------------------+
```

The HTML standard defines the rules. Chrome is a tool that reads/renders it.
Same here — OpenAPI defines the rules. Swagger tools read/render it.

---

## What Does OpenAPI Define?

An OpenAPI YAML/JSON file describes your entire API:

- **Endpoints** — what URLs exist (e.g. `GET /users`, `POST /orders`)
- **Parameters** — what inputs each endpoint accepts (path, query, header, body)
- **Request body** — what data structure the client sends
- **Responses** — what the server returns (status codes, body structure)
- **Data models/schemas** — reusable object definitions (e.g. what a `User` looks like)
- **Authentication** — Bearer token, API Key, OAuth2, etc.
- **Metadata** — API title, version, description, contact info

---

## What Does an OpenAPI YAML Look Like?

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: API for managing users

paths:
  /users/{id}:
    get:
      summary: Get a user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            minimum: 1
      responses:
        200:
          description: A user object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        404:
          description: User not found

components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - email
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
```

---

## What is OpenAPI Used For?

### 1. API Documentation
Auto-generate interactive, visual API docs from the spec.
Tools like Swagger UI and Redoc render the YAML into a browsable interface.

### 2. API Design (Design-First)
Write the YAML spec before writing any code.
Teams agree on the API contract first — frontend and backend can work in parallel.

### 3. Code Generation
Generate boilerplate code directly from the spec using tools like
Swagger Codegen or OpenAPI Generator:

- **Client SDKs** — Java, Python, JavaScript, Go, etc.
- **Server stubs** — Spring Boot, Express, Flask, etc.

### 4. API Testing
Tools like Swagger UI (Try it out), Postman, and Dredd use the spec
to send real requests and validate responses.

### 5. Validation
Validate that incoming requests and outgoing responses match the spec —
automatically, without writing manual validation code.

### 6. API Contract
The spec acts as a **contract** between:

```
Frontend team  ←──── OpenAPI YAML ────→  Backend team
                      (agreed contract)
```

Both sides build against the same spec — no guessing, no miscommunication.

### 7. CI/CD Integration
Automate spec linting, validation, and doc publishing in your pipeline:

- **Spectral** — lint and validate the spec
- **Dredd** — test if the running API matches the spec
- **Redoc** — auto-publish docs on deployment

---

## OpenAPI Versions

```
+------------+------------------+----------------------------------------+
| Version    | Released         | Key Changes                            |
+============+==================+========================================+
| Swagger 1.x| 2010             | Original Swagger format                |
+------------+------------------+----------------------------------------+
| Swagger 2.0| 2014             | Major improvement, widely adopted      |
+------------+------------------+----------------------------------------+
| OAS 3.0    | 2017             | Renamed to OpenAPI, cleaner structure  |
+------------+------------------+----------------------------------------+
| OAS 3.1    | 2021             | Full JSON Schema alignment, webhooks   |
+------------+------------------+----------------------------------------+
```

Most modern projects use **OAS 3.0 or 3.1**.

---

## Who Uses OpenAPI?

OpenAPI is used by almost every major tech company:

- **AWS** — API Gateway supports OpenAPI import/export
- **Google** — Cloud Endpoints uses OpenAPI
- **Microsoft** — Azure API Management supports OpenAPI
- **GitHub** — publishes their API as OpenAPI spec
- **Stripe, Twilio, PayPal** — publish official OpenAPI specs for their APIs

---

## Tools That Support OpenAPI

```
+---------------------+------------------------------------------+
| Tool                | Purpose                                  |
+=====================+==========================================+
| Swagger UI          | Interactive documentation + Try it out   |
+---------------------+------------------------------------------+
| Swagger Editor      | Browser-based YAML editor                |
+---------------------+------------------------------------------+
| Swagger Codegen     | Code generation from spec                |
+---------------------+------------------------------------------+
| OpenAPI Generator   | Community fork of Codegen (more features)|
+---------------------+------------------------------------------+
| Redoc               | Alternative doc renderer                 |
+---------------------+------------------------------------------+
| Postman             | Import spec for testing                  |
+---------------------+------------------------------------------+
| Spectral            | Lint and validate spec                   |
+---------------------+------------------------------------------+
| Dredd               | Test API against spec                    |
+---------------------+------------------------------------------+
| Springdoc           | Auto-generate spec from Spring Boot code |
+---------------------+------------------------------------------+
| FastAPI             | Auto-generate spec from Python code      |
+---------------------+------------------------------------------+
```

---

## Summary

```
+---------------------+------------------------------------------------+
| Aspect              | Detail                                         |
+=====================+================================================+
| Full name           | OpenAPI Specification (OAS)                    |
+---------------------+------------------------------------------------+
| Previous name       | Swagger Specification                          |
+---------------------+------------------------------------------------+
| Maintained by       | OpenAPI Initiative (Linux Foundation)          |
+---------------------+------------------------------------------------+
| Format              | YAML or JSON                                   |
+---------------------+------------------------------------------------+
| Current version     | OAS 3.1                                        |
+---------------------+------------------------------------------------+
| Purpose             | Describe REST APIs in a standard,              |
|                     | machine-readable format                        |
+---------------------+------------------------------------------------+
| Used for            | Docs, design, testing, code generation,        |
|                     | validation, CI/CD                              |
+---------------------+------------------------------------------------+
```

---

*Official OpenAPI Specification: https://spec.openapis.org*
*OpenAPI Initiative: https://www.openapis.org*
*Swagger Tools: https://swagger.io*
