# Global Time Strategy: DB Timezone + Java LocalDateTime

## 1. Design Goal

This system is **globally extensible** and **node-independent**.

The goal is **not** to preserve every timezone/offset in application code, but to ensure:

- Consistent behavior across regions
- Predictable persistence and queries
- Simple, stable Java domain models
- Clear operational rules

This is achieved by **separating time semantics from Java types**.

---

## 2. Core Principle

> **Java represents business wall‑clock time, not absolute instants.**

Timezone consistency is enforced by **environment configuration**, not by Java type complexity.

---

## 3. Database Rules

### 3.1 Allowed DB Types

Only the following are allowed:

- `DATE`
- `DATETIME` / `TIMESTAMP WITHOUT TIME ZONE`
- `TIMESTAMP WITH TIME ZONE` (optional, DB‑level only)

### 3.2 Meaning

| DB Type | Meaning |
|------|------|
| `DATE` | Calendar date, no time-of-day |
| `DATETIME / TIMESTAMP WITHOUT TZ` | Business-local date-time |
| `TIMESTAMP WITH TZ` | Absolute instant (DB responsibility) |

The database **may store richer semantics**, but the application does not depend on them.

---

## 4. Java Rules (Strict)

### 4.1 Allowed Types

- `LocalDate`
- `LocalDateTime`

### 4.2 Forbidden in Domain Code

- `Instant`
- `ZonedDateTime`
- `OffsetDateTime`
- `java.util.Date`

Reason:
- These leak infrastructure concerns into business logic
- They complicate APIs, DTOs, and persistence unnecessarily

---

## 5. Timezone Consistency Strategy

### 5.1 Fixed Timezone Configuration (Mandatory)

All nodes **must** share the same timezone configuration:

- JVM timezone (e.g. `Asia/Shanghai`)
- Database timezone / session timezone

This guarantees:
- Same input → same persisted value
- Same persisted value → same Java object
- Same Java object → same JSON output

### 5.2 Why This Works Globally

Global systems fail when:
- Each node decides its own timezone
- Time meaning is implicit or accidental

This system avoids that by:
- Centralizing timezone choice
- Treating time as **business-local truth**

---

## 6. DB ⇄ Java Mapping Rules

| DB Column Type | Java Type | Rule |
|---|---|---|
| `DATE` | `LocalDate` | Direct mapping |
| `DATETIME / TIMESTAMP WITHOUT TZ` | `LocalDateTime` | Direct mapping |
| `TIMESTAMP WITH TZ` | `LocalDateTime` | Convert to configured business timezone, then drop TZ |

The loss of TZ in Java is **intentional and documented**.

---

## 7. JSON Contract

Global serialization rules:

- `LocalDate` → `yyyy-MM-dd`
- `LocalDateTime` → `yyyy-MM-dd HH:mm:ss`

Rules are **global**, not per-field.

This ensures:
- Stable frontend contracts
- No DTO annotation noise
- Easy long-term maintenance

---

## 8. Why Not Instant / ZonedDateTime?

Because they answer a **different question**.

| Question | Correct Tool |
|------|------|
| “What exact instant happened globally?” | `Instant` |
| “What time did business say this happened?” | `LocalDateTime` |

Most business systems operate on the second question.

---

## 9. Operational Guarantees Required

If this model is used, the following are **non-negotiable**:

- JVM timezone explicitly set
- DB timezone explicitly set
- Timezone documented as part of system architecture
- No silent reliance on defaults

---

## 10. One‑Line Rule

> **DB may store time with timezone; Java exposes only business-local time via LocalDate / LocalDateTime, with consistency guaranteed by configuration.**
