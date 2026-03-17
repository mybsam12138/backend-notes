# Modular Monolith Design Guide

This document summarizes a **practical, enforceable modular monolith architecture**.
It is intentionally **non-DDD**, focused on real-world Java/Spring systems.

---

## 1. Definition

A **modular monolith** is a system with:

- One runtime (one JVM / one process)
- One deployment unit
- Multiple **internally isolated business modules**
- In-process communication only (no HTTP between modules)

> Architecture is defined by **runtime behavior**, not by repository layout.

---

## 2. Core Design Principles

### 2.1 One-Directional Dependencies

- Dependencies must flow in **one direction only**
- No circular dependencies between modules

Allowed:
```
*-impl  →  business-api
```

Forbidden:
```
*-impl  →  *-impl
business-api → *-impl
```

---

### 2.2 Share Contracts, Not Implementations

**Allowed to share**:
- Service interfaces
- Input Forms / Commands
- Output DTOs
- Enums & constants (very limited)

**Forbidden to share**:
- Entities
- Repositories / DAOs
- ORM-mapped objects
- Business logic

Rule of thumb:
> If a change forces coordinated refactoring across modules, it must NOT be shared.

---

## 3. Module Structure

### 3.1 Top-Level Layout

```
my-system
├── pom.xml
├── common-kernel        (optional, very small)
├── business-api         (shared contracts only)
├── order-impl
├── payment-impl
├── customer-impl
└── bootstrap            (application entry)
```

---

### 3.2 business-api Module

Purpose: **Define inter-module contracts**

```
business-api
└── com.example.api
    ├── order
    │    ├── service
    │    ├── form
    │    └── dto
    ├── payment
    └── customer
```

Rules:
- No controllers
- No entities
- No repositories
- No persistence annotations
- DTOs must be simple data carriers

---

### 3.3 *-impl Modules

Each business module **fully owns its implementation**.

Example: `order-impl`

```
order-impl
└── com.example.order
    ├── controller
    ├── service
    ├── entity
    ├── repository
    ├── mapper
    └── config
```

Responsibilities:
- Implement service interfaces from `business-api`
- Own entities and persistence
- Expose controllers

Other modules must never import:
- entity
- repository
- internal VO

---

### 3.4 bootstrap Module

Purpose: **Assemble and run the application**

```
bootstrap
└── Application.java
```

Depends on:
- all `*-impl` modules

Contains:
- Spring Boot startup
- global configuration

No business logic.

---

## 4. Communication Model

### Modular Monolith
- In-process calls
- Java service interfaces

```
orderService.create(form)
```

### Distributed / Microservice
- Network calls
- HTTP / RPC

```
POST /orders
```

Same contract concept, different transport.

---

## 5. Where Mapping Happens

| Layer | Responsibility |
|-----|---------------|
| Controller | Receive & validate Form |
| Service | Translate Form → Entity |
| Repository | Persist Entity |

Mapping must NOT be done in:
- Controller
- Repository

---

## 6. When This Is Still a Modular Monolith

This design is still a modular monolith if:

- Single runtime
- Single deployment
- No HTTP between modules
- Modules communicate via service interfaces only

Even if:
- Code is split across multiple repositories
- Teams own different business modules

---

## 7. When It Is NOT a Modular Monolith

It stops being a modular monolith if:

- Modules are deployed independently
- Modules communicate via HTTP / RPC
- Entities or repositories are shared

---

## 8. Key Takeaways

- Modular monolith ≠ big monolith
- Sharing DTOs is safe; sharing entities is not
- Interfaces protect boundaries; implementations stay private
- Transport change comes **after** boundary correctness

---

## 9. One-Sentence Summary

> A modular monolith is a single application
> with microservice-level boundaries
> enforced through in-process APIs.
