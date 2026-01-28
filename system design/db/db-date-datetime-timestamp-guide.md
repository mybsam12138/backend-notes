# Choosing DATE / DATETIME / TIMESTAMP in Databases  
## with PostgreSQL, Oracle, and MySQL Differences

---

## 1. Purpose of This Document

This document defines **when to use DATE, DATETIME, or TIMESTAMP** in database design, and explains the **behavioral differences** across:

- PostgreSQL
- Oracle
- MySQL

The goal is **semantic correctness first**, portability second, and surprises last.

---

## 2. Core Decision Principle

> **Choose the column type based on business meaning, not storage format.**

Ask first:
- Is time-of-day relevant?
- Is timezone relevant?
- Is this a business-local concept or a global instant?

---

## 3. When to Use `DATE`

### Meaning
- Calendar date only
- No time-of-day
- No timezone

### Typical Use Cases
- Birthday
- Policy effective date
- Contract start/end date (date-based)
- Accounting period boundaries
- Business days

### Characteristics
- Stable across regions
- Immune to timezone changes
- Safest choice when time-of-day is irrelevant

### Recommendation
✅ **Prefer `DATE` whenever possible**

---

## 4. When to Use `DATETIME` / `TIMESTAMP WITHOUT TIME ZONE`

### Meaning
- Date + time-of-day
- Business-local wall-clock time
- No timezone semantics

### Typical Use Cases
- Approval time
- Submission time
- Audit time (business-local)
- Workflow steps
- Created/updated timestamps (business meaning)

### Characteristics
- Interpreted the same everywhere *by agreement*
- Requires consistent JVM + DB timezone configuration
- Does not represent a global instant

### Recommendation
✅ **Default choice for most business timestamps**

---

## 5. When to Use `TIMESTAMP WITH TIME ZONE`

### Meaning
- Represents a global instant
- Timezone or offset preserved or normalized

### Typical Use Cases
- Cross-region event correlation
- Integration with external global systems
- Financial transaction ordering across regions
- Legal or compliance records

### Characteristics
- More complex semantics
- Requires careful conversion rules
- Often unnecessary for pure business systems

### Recommendation
⚠️ Use **only when global instant semantics are required**

---

## 6. Database-Specific Behavior Differences

### 6.1 PostgreSQL

| Type | Behavior |
|---|---|
| `DATE` | Date only |
| `TIMESTAMP WITHOUT TIME ZONE` | Date-time, no TZ |
| `TIMESTAMP WITH TIME ZONE` (`timestamptz`) | Stored as UTC, converted on input/output |

Key Notes:
- `timestamptz` **does not store the original timezone**
- Session timezone affects input/output
- Excellent semantic clarity

---

### 6.2 Oracle

| Type | Behavior |
|---|---|
| `DATE` | Date + time (to seconds) |
| `TIMESTAMP` | Date + time (fractional seconds) |
| `TIMESTAMP WITH TIME ZONE` | Stores timezone |
| `TIMESTAMP WITH LOCAL TIME ZONE` | Normalized to DB TZ |

Key Notes:
- Oracle `DATE` is closer to `DATETIME`
- True date-only semantics require convention
- Very rich time support, but easy to misuse

---

### 6.3 MySQL

| Type | Behavior |
|---|---|
| `DATE` | Date only |
| `DATETIME` | Date-time, no TZ |
| `TIMESTAMP` | Stored in UTC, converted using session TZ |

Key Notes:
- `TIMESTAMP` is timezone-aware implicitly
- `DATETIME` is timezone-agnostic
- Range limits differ between the two

---

## 7. Cross-Database Comparison Table

| Semantic Need | PostgreSQL | Oracle | MySQL |
|---|---|---|---|
| Date only | `DATE` | `DATE` (by convention) | `DATE` |
| Business-local datetime | `TIMESTAMP` (no TZ) | `DATE` / `TIMESTAMP` | `DATETIME` |
| Global instant | `TIMESTAMPTZ` | `TIMESTAMP WITH TZ` | `TIMESTAMP` |

---

## 8. Recommended Cross-DB Strategy

For portable business systems:

- Use **DATE** for date-only meaning
- Use **DATETIME / TIMESTAMP WITHOUT TZ** for business-local time
- Use **TIMESTAMP WITH TZ** only when required
- Normalize all Java usage to:
  - `LocalDate`
  - `LocalDateTime`

Timezone consistency is enforced by **configuration**, not by column type alone.

---

## 9. Common Mistakes to Avoid

❌ Using `TIMESTAMP WITH TZ` everywhere “just in case”  
❌ Assuming Oracle `DATE` has no time  
❌ Mixing JVM and DB timezones implicitly  
❌ Treating time types as interchangeable

---

## 10. One-Line Rule

> **Store what the business means, not what the database happens to support.**

---

End of document.
