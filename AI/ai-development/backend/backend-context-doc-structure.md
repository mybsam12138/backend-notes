# Backend System Documentation Structure (AI-Ready)

This document defines a **clean, scalable documentation layout** for a backend system.
Each file has a **clear purpose**, **logical boundary**, and **AI-context role**.

---

## 1. Tech Stack & Architecture
**File:** `tech-stack-and-architecture.md`

**Purpose:**
- Define chosen technologies and overall architecture style

**Includes:**
- Language, framework, runtime versions
- Architecture pattern (monolith / modular / microservice)
- Infrastructure assumptions

**AI Role:** Global technical constraints

---

## 2. System & Directory Design
**File:** `system-and-directory-design.md`

**Purpose:**
- Explain module boundaries and folder responsibilities

**Includes:**
- Layered architecture
- Package responsibilities
- Dependency rules

**AI Role:** Structural reasoning guide

---

## 3. Code Style & Conventions
**File:** `code-style.md`

**Purpose:**
- Enforce consistency and readability

**Includes:**
- Naming conventions
- Formatting rules
- Error-handling style

**AI Role:** Output normalization

---

## 4. What Should Be Done (Principles)
**File:** `principles.md`

**Purpose:**
- Define preferred design and coding behaviors

**Includes:**
- Design principles
- Default choices
- Best practices

**AI Role:** Positive guidance

---

## 5. What Must NOT Be Done (Anti-Patterns)
**File:** `anti-patterns.md`

**Purpose:**
- Record known traps and broken assumptions

**Includes:**
- Common mistakes
- Dangerous shortcuts
- Rejected approaches

**AI Role:** Risk prevention

---

## 6. Bug List & Root Causes
**File:** `bugs-and-root-causes.md`

**Purpose:**
- Preserve paid experience

**Includes:**
- Root cause analysis
- Broken assumptions
- Preventive rules

**AI Role:** Negative knowledge base

---

## 7. Feature List (Product View)
**File:** `feature-list.md`

**Purpose:**
- Describe system capabilities

**Includes:**
- Feature overview
- Status (planned / done / deprecated)

**AI Role:** Capability awareness

---

## 8. Business Rules
**File:** `business-rules.md`

**Purpose:**
- Define domain logic and invariants

**Includes:**
- Validation rules
- Constraints
- Calculations

**AI Role:** Domain correctness

---

## 9. Features & Tasks Mapping
**File:** `features-and-tasks.md`

**Purpose:**
- Connect business features to implementation tasks

**Includes:**
- Feature → task breakdown
- Ownership and dependencies

**AI Role:** Execution planning

---

## 10. Checklists
**File:** `checklists.md`

**Purpose:**
- Enforce quality gates

**Includes:**
- Design checklist
- Code review checklist
- Release checklist

**AI Role:** Self-verification

---

## 11. Other Rules & Constraints
**File:** `other-rules.md`

**Purpose:**
- Capture cross-cutting or exceptional rules

**Includes:**
- Security rules
- Compliance requirements
- Operational constraints

**AI Role:** Global guardrails

---

## 12. Database Structure
**File:** `database-structure.md`

**Purpose:**
- Define persistent data models

**Includes:**
- Tables
- Fields
- Indexes
- Relationships

**AI Role:** Data modeling constraints

---

## 13. Other Stateful Component Data Structures
**File:** `stateful-components.md`

**Purpose:**
- Describe non-DB state

**Includes:**
- Cache structures
- Message formats
- Session models

**AI Role:** Runtime state reasoning

---

## Final Principle

> **This documentation set is not just for humans.**
>  
> It is a **high-quality, reusable context layer** for AI systems.

Well-structured docs turn AI from a chat tool into a **predictable engineering assistant**.
