# Distributed Transaction - Overview

## 1. What is a Distributed Transaction?

A **distributed transaction** is a transaction that spans multiple services, databases, or systems, where all operations must either **succeed together or fail together**.

---

## 2. Why Do We Need It?

In a **monolithic system**:

* One database
* One local transaction (ACID)

In a **distributed system (microservices)**:

* Multiple services
* Multiple databases

Example:

* Create policy (Policy Service)
* Create billing record (Billing Service)
* Update customer (Customer Service)

👉 These operations must stay **consistent**

---

## 3. Core Problem

### Data Consistency Across Systems

```
Service A → Success
Service B → Success
Service C → Failed ❌
```

👉 What should happen?

* Rollback A & B? (hard)
* Retry C?
* Accept temporary inconsistency?

---

## 4. Consistency Models

### 4.1 Strong Consistency

* All systems are always consistent
* Similar to single DB transaction
* High cost, low scalability

---

### 4.2 Eventual Consistency (Most Common)

* Systems become consistent over time
* Temporary inconsistency allowed

---

## 5. Main Solutions / Patterns

---

## 5.1 Two-Phase Commit (2PC / XA)

### Flow:

```
1. Prepare phase
2. Commit / Rollback phase
```

### Pros:

* Strong consistency
* Simple concept

### Cons:

* Blocking
* Poor performance
* Not suitable for microservices

---

## 5.2 TCC (Try-Confirm-Cancel)

### Flow:

```
Try     → Reserve resources
Confirm → Commit
Cancel  → Rollback
```

### Pros:

* Strong control
* High consistency

### Cons:

* High implementation cost
* Intrusive (each service must implement 3 operations)

---

## 5.3 Saga Pattern

### Flow:

```
Step1 → Step2 → Step3
              ↓
         Failure
              ↓
Compensate Step2
Compensate Step1
```

### Pros:

* Suitable for long workflows
* Decoupled

### Cons:

* Requires compensation logic
* Complex error handling

---

## 5.4 Message + Eventual Consistency ⭐ (Most Used)

### Flow:

```
1. Local transaction commit
2. Send message
3. Other services consume
4. Retry on failure
```

### Key Concepts:

* Idempotency
* Retry
* Dead-letter queue

### Pros:

* High performance
* Scalable
* Loosely coupled

### Cons:

* Not strongly consistent
* Requires careful design

---

## 6. Common Tools / Frameworks

### Strong Consistency:

* Atomikos
* Narayana

### Flexible / Hybrid:

* Seata (AT / TCC / Saga)

### Message-Based:

* Kafka
* RocketMQ

---

## 7. Trade-offs

| Approach | Consistency | Complexity | Performance | Usage       |
| -------- | ----------- | ---------- | ----------- | ----------- |
| 2PC      | Strong      | Low        | Low         | Rare        |
| TCC      | Strong      | High       | Medium      | Finance     |
| Saga     | Eventual    | Medium     | High        | Common      |
| MQ       | Eventual    | Medium     | High        | Most Common |

---

## 8. Real-World Best Practice

### Recommended Strategy:

```
1. Prefer local transaction
2. Use eventual consistency for cross-service
3. Avoid 2PC unless necessary
4. Design for failure (retry + compensation)
```

---

## 9. Example (Policy System)

```
1. Create policy (local transaction)
2. Publish "policy_created" event
3. Billing service consumes event
4. Failure → retry or compensate
```

---

## 10. Key Design Principles

* Idempotency is required
* Retry must be safe
* Design compensation logic
* Avoid tight coupling
* Monitor and log events

---

## 11. One-Line Summary

> Distributed transaction is about **maintaining data consistency across multiple systems**, typically solved using **eventual consistency + messaging** instead of strong consistency.
