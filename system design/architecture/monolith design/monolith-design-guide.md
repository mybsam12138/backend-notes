# Monolith Design Guide (Practical & Simple)

This document summarizes a **traditional monolith** architecture (not modular monolith).
It prioritizes **simplicity, speed, and clarity** while keeping the codebase maintainable.

> Use this when you have **one codebase + one deployment**, and you are not enforcing strict module boundaries yet.

---

## 1. Definition

A **monolith** is a system with:

- One codebase
- One runtime (one process / one JVM)
- One deployment unit
- Shared database (typically one schema)
- In-process calls everywhere

---

## 2. Goals & Non-Goals

### Goals
- Fast development and iteration
- Easy debugging (single process)
- Straightforward transactions
- Minimal operational complexity

### Non-goals
- Strong internal isolation between business areas
- Independent deployment of business areas
- Strict “contracts-only” module boundaries

---

## 3. Recommended Directory Structure

Below is a **clean, common, production-friendly** structure for a Spring Boot style monolith.
(Names are examples; adjust to your project conventions.)

```
my-monolith
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.example.app
│   │   │       ├── Application.java
│   │   │       │
│   │   │       ├── config
│   │   │       │   ├── WebConfig.java
│   │   │       │   └── JacksonConfig.java
│   │   │       │
│   │   │       ├── common
│   │   │       │   ├── error
│   │   │       │   │   ├── ErrorCode.java
│   │   │       │   │   └── BizException.java
│   │   │       │   ├── response
│   │   │       │   │   └── ApiResponse.java
│   │   │       │   └── util
│   │   │       │       └── IdGenerator.java
│   │   │       │
│   │   │       ├── feature
│   │   │       │   ├── order
│   │   │       │   │   ├── controller
│   │   │       │   │   │   └── OrderController.java
│   │   │       │   │   ├── service
│   │   │       │   │   │   └── OrderService.java
│   │   │       │   │   ├── repository
│   │   │       │   │   │   └── OrderRepository.java
│   │   │       │   │   ├── entity
│   │   │       │   │   │   └── OrderEntity.java
│   │   │       │   │   ├── dto
│   │   │       │   │   │   ├── CreateOrderForm.java
│   │   │       │   │   │   └── OrderDTO.java
│   │   │       │   │   └── mapper
│   │   │       │   │       └── OrderMapper.java
│   │   │       │   │
│   │   │       │   ├── payment
│   │   │       │   │   └── ...
│   │   │       │   └── customer
│   │   │       │       └── ...
│   │   │       │
│   │   │       └── infra
│   │   │           ├── db
│   │   │           ├── cache
│   │   │           └── integration
│   │   │
│   │   └── resources
│   │       ├── application.yml
│   │       ├── db
│   │       │   └── migration
│   │       └── logback-spring.xml
│   │
│   └── test
│       └── java
│           └── com.example.app
│               ├── feature
│               │   └── order
│               │       └── OrderServiceTest.java
│               └── ...
```

### Key points about the structure
- **feature/** is “package-by-feature”: each business area has its own controller/service/repository/entity/dto.
- **common/** holds shared technical helpers (errors, responses, utils). Keep it pragmatic—don’t let it become a “dump”.
- **infra/** holds integrations and technical infrastructure (db, cache, external APIs). Keep it separate from feature logic.

---

## 4. Layer Responsibilities (Monolith)

| Layer | Responsibilities | Avoid |
|------|-------------------|------|
| controller | request parsing, validation, HTTP concerns | business logic, DB access |
| service | business orchestration, mapping Form→Entity, transaction boundaries | direct HTTP details |
| repository/dao | persistence operations, queries | request DTOs, business rules |
| entity | persistence model (ORM) | being used as API response directly (often) |
| dto/form | input/output shapes for controller or service | embedding business logic |

**Mapping responsibility (practical default)**:
- Controller: validate request
- Service: translate Form/DTO into internal objects and call repository
- Repository: persist/query only

---

## 5. Service Interfaces in a Plain Monolith

In a plain monolith, you **usually do not need** a separate “service API interface module”.
Two common and acceptable options:

### Option A (simplest): concrete service classes
- `OrderService` is a concrete class, no interface.
- Best when you have one implementation and want simplicity.

### Option B (interface only when useful)
Introduce `IOrderService` / `OrderService` interface only when:
- multiple implementations exist
- you rely heavily on mocking in tests
- you anticipate module boundaries soon

Rule of thumb:
> Interfaces should protect boundaries, not decorate code.

---

## 6. Testing Recommendations

- Unit tests for services (fast)
- Integration tests for repositories (DB)
- A small set of end-to-end tests for critical flows

Keep test scope pragmatic: monoliths win by being simple.

---

## 7. When to Move from Monolith to Modular Monolith

Signals you may be ready:
- cross-feature changes cause frequent conflicts
- “who owns this?” is unclear
- accidental coupling grows quickly
- refactors ripple unpredictably

At that point, introduce:
- module boundaries
- contracts (shared API) and private implementation
- one-directional dependency rules

---

## 8. One-Sentence Summary

> A clean monolith is a single deployable with clear internal layering and feature-based packages, optimized for speed and simplicity.
