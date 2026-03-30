# Common Utils Design Guide

This document summarizes the **design principles**, **package structure**, and **main use scenarios** of utilities in the `common` module.

---

## 1. Design Principles

### 1.1 Core Philosophy
Utilities are **technical helpers**, not business logic.

**A util SHOULD:**
- Be reusable across multiple systems
- Be business-agnostic
- Do one small, clear thing
- Be easy to test and reason about

**A util SHOULD NOT:**
- Encode business rules (finance / insurance / domain logic)
- Hide complex behavior
- Depend on unnecessary frameworks

---

### 1.2 Package Boundary Rule

We split utils by **dependency type**, not by feature.

```text
util
├── staticutil   (pure Java, no Spring dependency)
└── springutil   (Spring-aware helpers)
```

This answers immediately:
> “Can this util be used without Spring?”

---

## 2. staticutil (Pure Java Utilities)

### 2.1 AssertUtils
**Purpose:**  
Defensive programming and invariant checks.

**Main scenarios:**
- Validate method preconditions
- Fail fast in framework / infra code
- Replace scattered `if (...) throw`

---

### 2.2 CollectionUtils
**Purpose:**  
Null-safe collection handling.

**Main scenarios:**
- Avoid repeated null checks
- Simplify collection guards

---

### 2.3 DateTimeUtils
**Purpose:**  
Technical date/time helpers (NOT business rules).

**Main scenarios:**
- ISO formatting/parsing
- UTC timestamps
- Logging / serialization

**Not allowed:**
- Settlement dates
- Business calendars
- Grace periods

---

### 2.4 EncodingUtils
**Purpose:**  
Character and byte encoding helpers.

**Main scenarios:**
- UTF-8 conversion
- IO / network boundaries
- Encoding safety

---

### 2.5 ExceptionUtils
**Purpose:**  
Exception inspection and diagnostics.

**Main scenarios:**
- Get root cause
- Check exception chains
- Logging stack traces

---

### 2.6 LogUtils
**Purpose:**  
Safe logging helpers.

**Main scenarios:**
- Prevent log explosion
- Guard against `toString()` failures
- Mask or truncate large objects

---

### 2.7 MaskingUtils
**Purpose:**  
Generic sensitive-data masking.

**Main scenarios:**
- Logging protection
- API response masking

**Note:**  
Only generic patterns (email, phone).  
Business-specific masking does NOT belong here.

---

### 2.8 ObjectUtils
**Purpose:**  
Null-safe object operations.

**Main scenarios:**
- Default value handling
- Safe equality checks

---

### 2.9 RequestUtils
**Purpose:**  
Low-level HTTP request helpers.

**Main scenarios:**
- Client IP resolution
- Header access
- Ajax detection

---

### 2.10 TraceIdUtils
**Purpose:**  
Trace ID generation and validation.

**Main scenarios:**
- Request tracing
- Log correlation
- Distributed diagnostics

---

### 2.11 ValidationUtils
**Purpose:**  
Generic value validation.

**Main scenarios:**
- Email / numeric checks
- Basic input validation

---

## 3. springutil (Spring-Aware Utilities)

### 3.1 SpringEnvUtils
**Purpose:**  
Environment and profile evaluation.

**Main scenarios:**
- Determine production-like environments
- Centralize profile logic
- Avoid scattered profile checks

**Why not static:**  
Depends on Spring `Environment`.

---

### 3.2 SpringJsonUtil
**Purpose:**  
Spring-managed JSON handling.

**Main scenarios:**
- Use Spring-configured `ObjectMapper`
- Respect custom modules and serializers
- Framework-level serialization

**Rule:**  
If it depends on Spring config → it belongs here.

---

## 4. Usage Guidelines

### 4.1 When to create a new util
Create a util ONLY if:
- The logic is reused
- It is business-agnostic
- It does not fit a domain model

---

### 4.2 When NOT to use utils
Do NOT use utils for:
- Finance calculations
- Insurance rules
- Domain invariants

These belong in **domain models or domain services**.

---

## 5. Final Rule of Thumb

> **If removing this util would break business meaning, it does not belong in common utils.**

Keep utils:
- small
- boring
- predictable

That is their strength.
