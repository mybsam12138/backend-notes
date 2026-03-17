# RESTful API Best Practices (Pragmatic Guide)

This document summarizes **practical, production‑grade RESTful API design rules**. It favors **clarity, domain truth, and long‑term maintainability** over theoretical purity.

---

## 1. Core Principles

### 1.1 APIs Model the Domain, Not Methods
- APIs should expose **domain concepts**, not service methods.
- Avoid designing APIs that look like remote method calls.

**Bad**
```
POST /policyService/approvePolicy
```

**Good**
```
POST /policies/{id}/approve
POST /policies/{id}/approvals
```

---

### 1.2 HTTP Is the Interface, Not an Implementation Detail
- Use HTTP semantics correctly:

| HTTP Method | Meaning |
|-----------|--------|
| GET | Read‑only, safe, cacheable |
| POST | Create or trigger a command |
| PUT | Full replacement |
| PATCH | Partial update |
| DELETE | Remove |

Do **not** overload GET for commands or state changes.

---

## 2. Resource Naming

### 2.1 Use Nouns for Resources
- Resources represent **things**, not actions.
- Prefer plural nouns.

```
/policies
/claims
/products
```

---

### 2.2 Hyphens Are Recommended
- Use `-` to separate words in URLs.
- Avoid camelCase and underscores.

**Recommended**
```
/policy-approvals
/premium-rules
```

**Avoid**
```
/policyApprovals
/policy_approvals
```

---

## 3. Commands and Business Actions

### 3.1 Commands Are Legitimate
Not all APIs are CRUD. Business systems contain **commands**.

Examples:
- approve policy
- cancel order
- issue policy

---

### 3.2 Preferred Patterns for Commands

#### Option A: Sub‑resource (Domain‑oriented)
```
POST /policies/{id}/approvals
POST /policies/{id}/cancellations
```

Use when the action represents a **real domain concept**.

---

#### Option B: Action Endpoint (Pragmatic)
```
POST /policies/{id}/approve
POST /policies/{id}/cancel
```

Acceptable when no honest noun exists.

---

### 3.3 Avoid Fake REST
Do not invent meaningless nouns just to avoid verbs.

**Avoid**
```
POST /policies/{id}/actions
POST /policies/{id}/transitions
```

If domain experts wouldn’t say it, don’t model it.

---

## 4. Search and Query APIs

### 4.1 GET for Simple Queries
Use GET when:
- Parameters are small
- Query is cacheable
- No sensitive data

```
GET /policies?status=ACTIVE&productCode=GI001
```

---

### 4.2 POST for Complex Queries (Recommended)
Use POST when:
- Filters are complex or nested
- Request body is large
- Query contains sensitive data

```
POST /policies/search
{
  "status": ["ACTIVE", "SUSPENDED"],
  "premiumRange": { "min": 1000, "max": 10000 }
}
```

This is a **widely accepted pattern**.

---

### 4.3 When to Use `/xxx-searches`
Only use a dedicated search resource if:
- Search is persistent
- Has an ID
- Can be resumed or re‑fetched

```
POST /policy-searches
GET  /policy-searches/{id}
```

Otherwise, prefer `/xxx/search`.

---

## 5. URL Structure vs Verbs

### 5.1 Prefer `/` for Real Domain Hierarchy

```
POST /policies/{id}/endorsements
POST /policies/{id}/approvals
```

Use `/` **only when the segment is a real domain noun**.

---

### 5.2 Do Not Force Structure
Avoid artificial splits just to remove verbs.

Bad:
```
POST /policies/{id}/status
```

If the operation is conceptually a command, be honest.

---

## 6. RPC Smells to Avoid

These indicate poor REST design:

- Service names in URLs
- Method‑shaped paths
- Verb‑heavy camelCase

**Avoid**
```
/policyService/searchPolicies
/approvePolicy
```

---

## 7. Consistency Rules

- Pick one naming style and stick to it
- Use the same pagination format everywhere
- Use the same sorting conventions everywhere
- Do not mix REST styles within the same API

Consistency beats theoretical perfection.

---

## 8. Recommended Default Conventions

| Area | Recommendation |
|----|---------------|
| Resource naming | plural nouns |
| Word separator | hyphen `-` |
| Commands | POST |
| Complex queries | POST /xxx/search |
| Public APIs | more REST‑strict |
| Internal APIs | pragmatic |

---

## 9. Final Guiding Rule

> **REST is about truthful domain modeling and clear boundaries — not grammar purity.**

If an API clearly expresses business intent, respects HTTP semantics, and avoids RPC coupling, it is a good REST API.

---

**End of document**

