# NoSQL Overview (Using MongoDB as Example)

## 1. What is NoSQL?

NoSQL (Not Only SQL) databases are designed to handle flexible, scalable, and high-performance data storage without requiring a fixed schema.

> NoSQL focuses on flexibility, scalability, and performance rather than strict structure.

---

## 2. MongoDB Overview

MongoDB is a document-based NoSQL database.

- Stores data as JSON-like documents (BSON)
- Schema is flexible (no fixed columns)
- Designed for scalability and high performance

---

## 3. Data Structure in MongoDB

### Hierarchy

```
Database
  ↓
Collection (like table)
  ↓
Document (like row, JSON format)
```

---

### Example Document

```json
{
  "policy_id": 1,
  "customer": {
    "id": 1001,
    "name": "Alice"
  },
  "premium": 1000,
  "claims": [
    { "amount": 200 },
    { "amount": 300 }
  ]
}
```

---

## 4. Key Characteristics

- Schema-less (flexible structure)
- Data stored as nested documents
- No joins (or minimal)
- Supports horizontal scaling
- Optimized for read-heavy operations

---

## 5. Core Design Principles

### 5.1 Design Based on Access Patterns

> Design schema based on how data is queried, not how it is stored.

---

### 5.2 Embedding vs Referencing

#### Embedding (Preferred)

```json
{
  "policy_id": 1,
  "claims": [
    { "amount": 200 }
  ]
}
```

Use when:
- Data is read together
- Small and bounded size

---

#### Referencing

```json
{
  "policy_id": 1,
  "claim_ids": [101, 102]
}
```

Use when:
- Data is large
- Shared across multiple documents

---

### 5.3 Denormalization

- Duplicate data is acceptable
- Avoid joins
- Optimize for read performance

---

## 6. Transactions in MongoDB

- Supports transactions (multi-document)
- But not the primary design approach
- Prefer single-document atomic operations

---

## 7. When to Use MongoDB (NoSQL)

Use when:

- Flexible or evolving schema
- Nested or hierarchical data
- High write volume
- Rapid development needed

---

## 8. When NOT to Use MongoDB

Avoid when:

- Strong relationships required
- Complex joins needed
- Financial / transactional systems
- Strict consistency required

---

## 9. Comparison with Relational Databases

| Aspect | MongoDB (NoSQL) | Relational DB |
|------|----------------|--------------|
| Schema | Flexible | Fixed |
| Structure | JSON Documents | Tables |
| Joins | Limited | Strong support |
| Transactions | Supported (not primary) | Core feature |
| Use case | Flexible apps | Structured systems |

---

## 10. Key Insight

> MongoDB stores data the way it is used, while relational databases store data in a normalized structure.

---

## 11. One-line Summary

> NoSQL = flexible, scalable, query-driven design  
> MongoDB = document-based, JSON-style database optimized for real-world data usage
