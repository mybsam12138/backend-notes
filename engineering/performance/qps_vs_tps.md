# QPS vs TPS (Quick Summary)

## Definitions

### QPS (Queries Per Second)
- **Meaning:** how many **requests/queries** a system receives or handles **per second**
- **Common aliases:** **RPS** (Requests Per Second), req/s
- **Typical scenarios:** HTTP APIs, RPC calls, gateways, search queries

### TPS (Transactions Per Second)
- **Meaning:** how many **complete business transactions** a system finishes **per second**
- A “transaction” usually means a **full business operation** (often includes DB work/commit), e.g. *place an order*, *complete a payment*.

---

## Core Difference
- **QPS measures traffic (how many times you’re called).**
- **TPS measures business throughput (how many complete business actions you finish).**

> One transaction may involve multiple requests, so **TPS is not always equal to QPS**.

---

## Examples

### Example A: One request = one transaction
- `POST /login`
- 1 request completes the business action
- ✅ **QPS ≈ TPS**

### Example B: One transaction = multiple requests
**Place an order** might involve:
1. check inventory (request 1)
2. create order (request 2)
3. deduct stock (request 3)
4. create payment (request 4)

If you complete **1 order per second**:
- **TPS = 1**
- **QPS = 4**

---

## Simple Formulas
- **QPS** = total requests in a time window / seconds  
- **TPS** = total completed transactions in a time window / seconds

---

## Why Both Matter (Monitoring View)

### QPS tells you about:
- traffic/load pressure
- network & thread pool pressure
- request-level bottlenecks

### TPS tells you about:
- real business capacity (orders/payments/etc.)
- database/commit limits
- “how much work actually got done”

In many systems (payments, orders), **TPS is the KPI**.

---

## JVM/GC Connection (Practical)
- GC pressure is often driven by **allocation rate**, which correlates strongly with **request rate (QPS)**.
- A common “GC problem” pattern is:
  - **QPS stable**, **TPS stable**, but **CPU goes up**  
  → suspect **GC thrashing** / high allocation churn.

---

## One-line Memory Aid
- **QPS:** how many times the system is *hit* per second  
- **TPS:** how many complete business tasks the system *finishes* per second
