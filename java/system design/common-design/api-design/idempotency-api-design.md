
# Idempotency in APIs
## Why It Exists, When It Matters, and How to Design It

---

## 1. What Is Idempotency?

**Idempotency** means:

> Calling the same API **once or multiple times** results in the **same final business state**.

Formally:
- One request = N repeated requests
- Safe to retry blindly

This concept is critical in **distributed systems**, where failures and retries are normal.

---

## 2. Why Idempotency Exists (The Core Reason)

The key problem idempotency solves:

> **The client may not know whether the server has already processed a request.**

This happens because:

- The server can finish business logic
- But the client may never receive the response

Once this happens, retries become **ambiguous and dangerous**.

Idempotency removes this ambiguity.

---

## 3. Why a Client May Not Receive a Response

This is **not only caused by “bad network”**.

### Common reasons (very real):

1. **Client timeout (most common)**
   - Client timeout = 5s
   - Server finishes in 6s
   - Server commits successfully
   - Client retries

2. **User / app interruption**
   - User refreshes
   - App goes background
   - Browser tab closes
   - Mobile OS kills the app

3. **Gateway / proxy timeout**
   - Nginx / API Gateway times out
   - Backend still finishes

4. **Network packet loss**
   - TCP retries packets, but not forever

5. **Load balancer / NAT reset**
   - Connection reset mid-response

6. **Client-side bugs**
   - JS error
   - Promise dropped
   - Navigation cancels request

Key truth:

> **“Client didn’t receive response” does NOT mean “server didn’t execute.”**

---

## 4. Why This Is Inevitable (Probability Perspective)

- Probability per request: low
- Probability over time and scale: **100%**

Even with a 0.01% failure rate:
- 100,000 requests/day → 10 ambiguous cases/day
- Systems run forever → it WILL happen

This is why idempotency is **engineering realism**, not theory.

---

## 5. Idempotency in CRUD

| Operation | Should Be Idempotent | Reason |
|---------|---------------------|--------|
| Create (C) | ❌ by nature / ✅ by design | Creates new state |
| Read (R) | ✅ | Read-only |
| Update (U) | ✅ | Set final state |
| Delete (D) | ✅ | Ensure non-existence |

### Important nuance:
- **Create is not idempotent by default**
- But **often must be made idempotent** in critical systems

---

## 6. When Non-Idempotent APIs Are Acceptable

Not all systems need idempotent CREATE.

### Acceptable scenarios:
- Human-driven admin systems
- Low traffic
- No automation
- No retries
- Errors are manually fixable

Example:
- First CREATE → success
- Second CREATE → `409 Conflict`
- User refreshes and sees the record

This is **acceptable**.

---

## 7. When Idempotency Is Mandatory

Idempotency is **non-negotiable** when:

- Money is involved
- Inventory is involved
- MQ / retry exists
- Workflow engine exists
- Operation is irreversible

Examples:
- Payment
- Order creation
- Insurance policy issuance
- External API calls

---

## 8. Payment Example (The Most Intuitive Case)

### Case A: Non-idempotent payment (BAD)

1. Pay once → success
2. Response lost (timeout)
3. Pay again → **charged again** ❌

Result:
- Double charge
- Manual refund
- Customer complaint

---

### Case B: Non-idempotent but defensive (partially OK)

1. Pay once → success
2. Timeout
3. Pay again → **“Already paid”**

Result:
- Correct final state
- But client does NOT know:
  - whether first payment succeeded
  - payment ID
  - final status

This is **better**, but still ambiguous.

---

### Case C: Idempotent payment (BEST)

1. Pay once (Idempotency-Key = PAY-001)
2. Timeout
3. Pay again (same key)
4. Server returns **same success result**

Result:
- Exactly-once effect
- Clear state
- Safe retry

---

## 9. How Idempotency Is Designed

### Core principle

> **Check whether the desired business state already exists.**

If it exists → return success  
If not → create it

---

## 10. Common Idempotency Solutions

### Solution 1: Business Unique Key (Most Elegant)

Example:
- orderId
- applicationNo
- paymentNo

Design:
- DB UNIQUE constraint
- Insert-once logic

Flow:
- Insert succeeds → return success
- Duplicate key → query and return existing result

---

### Solution 2: Idempotency Key (Redis / DB)

Client sends:
```
Idempotency-Key: X123
```

Backend stores:
- key
- status (PROCESSING / SUCCESS)
- response or business ID
- TTL

Retry:
- key exists → return stored result

Used heavily in:
- payment systems
- insurance
- external integrations

---

### Solution 3: PUT-create (Resource-oriented)

```
PUT /orders/{orderId}
```

- Create if not exists
- Overwrite if exists
- Naturally idempotent

---

## 11. Redis-Based Idempotency (Typical)

Stored data:
```
idem:{key} → {
  status,
  response,
  createdAt
}
TTL = minutes / hours
```

Why TTL:
- Prevent memory leak
- Idempotency window is finite

---

## 12. Why DELETE Is Different from CREATE

DELETE means:
> “Ensure this resource does not exist.”

So:
- First DELETE → success
- Second DELETE → success

Returning 400 / 404 breaks retries and workflows.

CREATE means:
> “Create something new.”

Duplicate CREATE:
- Semantically a conflict
- But **not retry-safe**

---

## 13. 409 Conflict vs Idempotent CREATE

| Aspect | 409 Conflict | Idempotent CREATE |
|------|-------------|------------------|
| HTTP correct | ✅ | ✅ |
| Retry safe | ❌ | ✅ |
| Workflow safe | ❌ | ✅ |
| Ambiguity-free | ❌ | ✅ |
| Complexity | Low | Higher |

Rule:
> **409 stops retries; idempotency removes ambiguity.**

---

## 14. Final Design Rule (Practical)

Ask one question:

> **If this request is executed twice, will it cause harm or ambiguity?**

- If YES → make it idempotent
- If NO → 409 / error may be acceptable

---

## 15. Final Takeaway

- Failures are normal
- Retries are unavoidable
- Idempotency is how systems survive reality

> **Most systems don’t look broken — until they are retried.**

---

_End of document_
