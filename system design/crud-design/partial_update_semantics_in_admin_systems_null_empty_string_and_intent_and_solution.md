# Partial Update Semantics in Admin Systems: `null`, Empty String, and Intent

> This article summarizes a set of **real-world design decisions** that frequently appear in admin / enterprise backend systems when dealing with **form updates, partial updates, and data consistency**.

It focuses on one deceptively simple question:

> **What do `null` and `""` really mean across frontend, backend, and database layers?**

---

## 1. Why This Problem Exists in Almost Every Admin System

Most admin systems support **edit forms** where:
- Not all fields are modified every time
- Users may *clear* a field intentionally
- Frontend frameworks may send empty strings by default
- Backend must decide **what to update and what to ignore**

Without clear rules, systems slowly accumulate:
- Dirty data
- Inconsistent semantics
- Hard-to-maintain update logic

---

## 2. Core Semantic Difference: `null` vs `""`

This distinction is the foundation of everything else.

| Value | Semantic Meaning |
|-----|------------------|
| `null` | Not provided / unknown / no intent |
| `""` (empty string) | Explicitly provided and intentionally empty |

**They are not equivalent**, and collapsing them leads to loss of intent.

---

## 3. Frontend Responsibilities

### 3.1 What frontend *should* send

| User action | Payload value |
|-----------|---------------|
| Field untouched | `null` or omitted |
| User clears input | `""` |
| User enters value | Non-empty string |

Some frontend components **must return `null` instead of `""`** by design:
- Optional selects
- Optional date pickers
- Untouched inputs

Frontend correctness helps — but **cannot be fully trusted**.

---

## 4. Backend Reality: You Cannot Trust Input Completely

In real systems:
- DTOs may be reused
- Objects may come from other APIs
- Serialization libraries may include `null`

Therefore:

> **Backend must always defensively control update behavior.**

---

## 5. Deserialization Truth: Jackson Cannot Truly “Ignore null”

After JSON deserialization:

| JSON input | Java field value |
|----------|------------------|
| Field missing | `null` |
| `"field": null` | `null` |
| `"field": ""` | `""` |

Once deserialized:
- Missing field and explicit `null` are indistinguishable
- Ignoring `null` at deserialization does **not** preserve intent

**Conclusion**:
- Jackson should deserialize faithfully
- Business logic must decide what to update

---

## 6. Partial Update Rule (PATCH Semantics)

For admin updates, a safe and common rule is:

| DTO value | Update behavior |
|---------|-----------------|
| `null` | Ignore (do not update) |
| `""` | Update to empty (if allowed) |
| Non-null value | Update |

This enables **true partial updates**.

---

## 7. Where `ignore null` Actually Belongs

### ❌ Wrong layers
- JSON deserialization
- Controller
- Database

### ✅ Correct layer

> **DTO → Entity mapping / update logic**

Conceptually:
```
DTO = user intent
Entity = persisted state
Mapping = state mutation logic
```

This is where `null` should be ignored.

---

## 8. Free Text vs Identifier Fields (Critical Distinction)

Not all `VARCHAR` fields are equal.

### 8.1 Free-text fields

Examples:
- description
- remark
- comment

Allowed values:
- `null` → never set
- `"text"` → content
- `""` → intentionally cleared

**Storing `""` is valid and correct.**

---

### 8.2 Identifier-like fields

Examples:
- phoneNumber
- email
- code

Empty string has **no real business meaning** here.

Recommended semantics:

| Incoming value | Meaning |
|---------------|--------|
| `null` | Do not update |
| `""` | Clear value → store as `null` |
| Valid string | Update |

This requires **extra backend handling**.

---

## 9. Why `isNotBlank()` Is Common — and Its Limitation

Many systems rely on:
```java
if (isNotBlank(value)) {
    update(value);
}
```

This treats:
- `null`
- `""`
- whitespace

as equivalent.

### This is acceptable when:
- Clearing is not required
- Business rules are loose

### This fails when:
- Users must clear values
- Audit logs matter
- PATCH semantics are expected

---

## 10. Normalization: The Simplest Correct Solution

If some fields must convert `"" → null`, the **cleanest approach** is:

> **Normalize DTO before mapping**

Conceptually:
- Only selected fields
- Explicit and readable
- No mapper magic

This keeps existing `ignore null` mapping logic intact.

---

## 11. Using `@JsonDeserialize` or Converters — With Caution

You *can* use:
- `@JsonDeserialize`
- Custom deserializers

But only when:
- Empty has no business meaning
- Conversion is stable and permanent

Risks:
- Hides business rules in serialization layer
- Loses information early
- Harder to change later

**Prefer service-level normalization for most cases.**

---

## 12. Database Semantics: `NULL` vs `''`

### 12.1 Meaning

| Value | DB meaning |
|-----|-----------|
| `NULL` | No value / unknown |
| `''` | Value exists but empty |

### 12.2 SQL behavior differences

- `NULL` must be checked with `IS NULL`
- `''` can be compared with `=`
- `COUNT(column)` ignores `NULL`, counts `''`
- Unique indexes usually allow multiple `NULL`, but only one `''`

---

## 13. Recommended Enterprise Rule

> **Use `NULL` to represent “no value”**  
> **Use `""` only when “empty” has business meaning**

This aligns:
- Frontend intent
- Backend logic
- Database semantics
- Audit and reporting

---

## 14. Final Takeaway

- `null` and `""` are not interchangeable
- Ignoring `null` is necessary but insufficient
- Field semantics must drive update behavior
- Explicit normalization beats implicit magic

This topic sits at the intersection of:
- Admin system design
- Business semantics
- Data integrity

And it is one of the most common sources of subtle bugs in real-world systems.

---

## 15. Recommended Practical Solution (Putting Everything Together)

Based on the discussion above, a **clean and scalable enterprise solution** is to combine three mechanisms, each with a clear responsibility.

---

### 15.1 The Three-Part Combination

#### 1️⃣ Selective Normalization (Optional)

For **identifier-like fields** where empty string has no business meaning (e.g. `phone`, `email`, `code`):

- Convert `""` → `null`
- Keep this **explicit and field-specific**

This can be done by:
- DTO-level `normalize()` method (recommended)
- Or field-level `@JsonDeserialize` / converter **only when semantics are stable**

This step is **not mandatory for all fields**, only for those that require it.

---

#### 2️⃣ Copy Ignore `null` (Core Mechanism)

This is the **core technical mechanism** that enables partial update:

- `null` → ignored
- non-null → applied

This logic should live in a **reusable common utility / framework** and do **only one thing**:

> Apply non-null values from DTO to entity

It should NOT:
- Decide business meaning
- Perform validation
- Fetch entities

---

#### 3️⃣ Selective Update in Service Layer

The application / domain service remains the place where:

- Business rules are enforced
- Validation happens
- Entity lifecycle is controlled

Conceptually:

```
DTO (intent)
  ↓
normalize (optional)
  ↓
copy-non-null (framework)
  ↓
Entity (state)
```

---

### 15.2 Common Framework Design (Recommended Shape)

A good common framework abstraction should:

- Be **mechanical, not smart**
- Be **transparent and predictable**
- Be **reusable across services**

Instead of exposing multiple methods, the framework should provide **ONE single method** that completes the whole mechanical update process:

> **Apply non-null fields from DTO onto an existing entity (selective update)**

#### Conceptual API

```
applyPatch(dto, entity)
```

This single method conceptually does **two things at once**:

1. **Copy non-null fields** from DTO
2. **Apply them directly to the target entity**

It intentionally does **NOT** split into multiple public APIs such as `copyNonNull` + `update`, to avoid unnecessary abstraction leakage.

---

This framework method should:

- Copy only **non-null** properties
- Perform **in-place update** on the entity
- Leave **all semantic and business decisions** to the service layer

---

### 15.3 What This Design Solves

| Problem | Solved by |
|------|----------|
| Partial update | copy-ignore-null |
| Frontend sends `null` | copy-ignore-null |
| Frontend reuses DTO | copy-ignore-null |
| Clearing identifier fields | normalization |
| Business validation | service layer |

Each concern is handled **once and only once**.

---

### 15.4 Final Recommendation

> **Use framework utilities for mechanics, and services for meaning.**

This combination:
- Avoids over-magic mappers
- Preserves business intent
- Scales well with system complexity
- Is easy for teams to understand and maintain

---

**End of article**

