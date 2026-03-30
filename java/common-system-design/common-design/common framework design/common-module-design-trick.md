# Common Module Design Principles (Business-Oriented Middle Platform)

## 🎯 Goal

Design a **reusable common module** that can be shared across multiple subsystems, while allowing:

* different databases
* different implementations
* unified business behavior
* low coupling

This is a key concept behind:

* Middle Platform
* Shared Services
* Enterprise Architecture

---

# 🧠 Core Principle

> **Separate "What" from "How"**

| Layer         | Responsibility                              |
| ------------- | ------------------------------------------- |
| Common Module | Define WHAT (interface, behavior, contract) |
| Subsystem     | Implement HOW (DB, mapper, logic details)   |

---

# 🧩 Key Design Pattern

## 1. Interface-Driven Design

All DB-related or business-related logic should be abstracted as:

```
interface
```

### Example

```
public interface QueryCacheService {
    void saveQuery(String userId, String pageCode, String queryJson);
    String getQuery(String userId, String pageCode);
}
```

---

## 2. No DB in Common Module ❗

### ❌ Wrong

* MyBatis Mapper
* Table structure
* SQL
* Entity tied to specific DB

### ✅ Correct

* Interface only
* No persistence logic
* No DB dependency

---

## 3. Use AOP + Annotation for Business Behavior

Common module should provide:

* annotations (mark behavior)
* AOP (execute logic)

### Example

```
@QueryCache(pageCode = "policy_search")
```

👉 This allows:

* zero intrusion into business code
* unified behavior across systems

---

## 4. Subsystem Implements the Interface

Each subsystem:

* uses its own DB
* defines its own table
* implements the interface

```
@Service
public class QueryCacheServiceImpl implements QueryCacheService {
    ...
}
```

---

# 🏗️ Architecture

```
common-module
 ├── annotations
 ├── aspects (AOP)
 ├── interfaces

subsystem A
 ├── implementation
 ├── mapper
 ├── database (MySQL)

subsystem B
 ├── implementation
 ├── mapper
 ├── database (Oracle)
```

---

# 🔥 Why This Works

## 1. Decoupling

* common module does not depend on DB
* subsystem does not depend on implementation details of others

---

## 2. Reusability

* same interface reused across systems
* same annotation + AOP reused

---

## 3. Flexibility

* different DB (MySQL / Oracle / PostgreSQL)
* different optimization strategies
* different scaling approaches

---

## 4. Unified Business Behavior

Even with different systems:

* same annotation
* same interface
* same behavior

👉 This achieves **business consistency**

---

# 🧠 Relation to Middle Platform

This is essentially a lightweight **business middle platform pattern**:

| Concept                    | Mapping          |
| -------------------------- | ---------------- |
| Middle Platform Capability | Common Module    |
| Business Service Contract  | Interface        |
| Service Implementation     | Subsystem        |
| Unified Governance         | AOP + Annotation |

---

# 🚀 Design Checklist (Practical Tips)

## ✅ Always Do

* define interface first
* use annotation to mark business behavior
* use AOP to implement cross-cutting logic
* keep common module stateless
* allow extension via interface

---

## ❌ Never Do

* put SQL in common module
* bind to specific DB
* write business-specific logic (too specific)
* tightly couple to one system

---

# 🧠 When to Use This Pattern

Use this pattern when:

* multiple systems share same business capability
* systems use different databases
* you want consistent behavior (audit, cache, logging, etc.)
* you want to reduce duplicated logic

---

# 🧾 Examples of Suitable Use Cases

* Query Cache
* Audit Log
* Operation Log
* Permission Check (RBAC)
* Idempotency Control
* API Logging
* Multi-tenant handling

---

# 💡 One Sentence Summary

> Build common modules by defining **interfaces + annotations + AOP**, and let each subsystem implement persistence — this achieves **decoupled, reusable, and unified business capabilities across systems**.

---

# ⭐ Interview-Level Insight

If asked:

👉 "How do you design reusable business modules?"

You can answer:

* use interface-driven design
* avoid DB coupling
* use AOP for cross-cutting concerns
* let subsystems implement persistence
* achieve middle-platform-like reuse

---

# ✅ Final Takeaway

This pattern is the foundation of:

* scalable enterprise systems
* reusable backend frameworks
* middle platform architecture

It is simple, but extremely powerful when applied consistently.
