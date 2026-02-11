# Backend System Documentation Structure (AI‑Ready, Contract‑First)

This document defines a **clean, scalable, AI‑friendly documentation and context layout**  
for a modern backend system.

Key principle:

> **Markdown explains intent.  
> SQL DDL defines data.  
> OpenAPI defines contracts.**

---

## 1. Tech Stack & Architecture
**File:** `tech-stack-and-architecture.md`

**Purpose**
- Define global technical decisions and boundaries

**Includes**
- Language, framework, runtime versions
- Architecture style (monolith / modular / microservice)
- Infrastructure assumptions

**AI Role**
- Global technical constraints

---

## 2. System & Directory Design
**File:** `system-and-directory-design.md`

**Purpose**
- Explain module boundaries and directory responsibilities

**Includes**
- Layered architecture
- Package responsibilities
- Dependency rules

**AI Role**
- Structural reasoning guide

---

## 3. Code Style & Conventions
**File:** `code-style.md`

**Purpose**
- Enforce consistency and readability

**Includes**
- Naming conventions
- Formatting rules
- Error‑handling style

**AI Role**
- Output normalization

---

## 4. Principles (What Should Be Done)
**File:** `principles.md`

**Purpose**
- Define preferred design and coding behaviors

**Includes**
- Design principles
- Default choices
- Best practices

**AI Role**
- Positive guidance

---

## 5. Anti‑Patterns (What Must NOT Be Done)
**File:** `anti-patterns.md`

**Purpose**
- Record known traps and rejected approaches

**Includes**
- Common mistakes
- Dangerous shortcuts
- Explicitly rejected designs

**AI Role**
- Risk prevention

---

## 6. Bugs & Root Causes
**File:** `bugs-and-root-causes.md`

**Purpose**
- Preserve paid experience and lessons learned

**Includes**
- Root cause analysis
- Broken assumptions
- Preventive rules

**AI Role**
- Negative knowledge base

---

## 7. Feature List (Product View)
**File:** `feature-list.md`

**Purpose**
- Describe system capabilities

**Includes**
- Feature overview
- Status (planned / implemented / deprecated)

**AI Role**
- Capability awareness

---

## 8. Business Rules
**File:** `business-rules.md`

**Purpose**
- Define domain logic and invariants

**Includes**
- Validation rules
- Calculations
- Cross‑entity constraints

**AI Role**
- Domain correctness

---

## 9. Features ↔ Tasks Mapping
**File:** `features-and-tasks.md`

**Purpose**
- Connect business features to implementation work

**Includes**
- Feature → task breakdown
- Dependencies and ownership

**AI Role**
- Execution planning

---

## 10. Checklists
**File:** `checklists.md`

**Purpose**
- Enforce quality gates

**Includes**
- Design checklist
- Code review checklist
- Release checklist

**AI Role**
- Self‑verification

---

## 11. Other Rules & Constraints
**File:** `other-rules.md`

**Purpose**
- Capture cross‑cutting or exceptional rules

**Includes**
- Security rules
- Compliance requirements
- Operational constraints

**AI Role**
- Global guardrails

---

## 12. Database Structure (Source of Truth)
**File:** `ddl.sql`

**Purpose**
- Define persistent data models **authoritatively**

**Includes**
- Tables
- Columns & data types
- Primary / foreign keys
- Indexes
- Constraints

**AI Role**
- Data modeling ground truth

> No Markdown description can replace DDL accuracy.  
> **DDL *is* the documentation.**

---

## 13. API Interface Contract (Source of Truth)
**File:** `openapi.yaml`

**Purpose**
- Define external and internal API contracts

**Includes**
- Endpoints
- Request / response schemas
- Error models
- Authentication

**AI Role**
- Interface contract & integration reasoning

> OpenAPI is the **single source of truth** for API behavior.

---

## 14. Other Stateful Component Structures
**File:** `stateful-components.md`

**Purpose**
- Describe non‑DB persistent or semi‑persistent state

**Includes**
- Cache key structures
- Message queue payloads
- Session models

**AI Role**
- Runtime state reasoning

---

## Final Design Philosophy

- **Markdown** → intent, reasoning, principles
- **DDL (SQL)** → data truth
- **OpenAPI** → interface truth

This structure turns documentation into a **high‑quality, reusable AI context layer**,  
not just human‑readable text.

> Clear structure turns AI from a chat tool  
> into a predictable engineering assistant.
