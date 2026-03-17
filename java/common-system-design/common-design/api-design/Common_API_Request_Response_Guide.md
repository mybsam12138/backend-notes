# Common Request & Response Design Guide
## CRUD APIs vs Business (Command) APIs in Web Systems

This document summarizes **common request patterns**, **HTTP methods**, **status codes**, and **response bodies**
for both **CRUD APIs** and **Business / Command APIs** in typical web backend systems.

---

## 1. API Classification Recap

| API Type | Purpose |
|--------|--------|
| CRUD API | Manage resource lifecycle |
| Command API | Execute business intent |
| Query API | Read-only data access |

---

## 2. CRUD API – Common Request & Response Patterns

### 2.1 Create (Create Resource)

**Request**
```http
POST /users
Content-Type: application/json
```

**Response**
```http
201 Created
Location: /users/{id}
```

```json
{
  "id": "123",
  "name": "Sam"
}
```

**Intent**
- Create a new resource
- Server assigns resource identity

---

### 2.2 Read (Get Resource)

**Request**
```http
GET /users/{id}
```

**Response**
```http
200 OK
```

```json
{
  "id": "123",
  "name": "Sam"
}
```

**Intent**
- Retrieve resource state
- No side effects

---

### 2.3 Update (Full or Partial)

#### PUT – Full Replace
```http
PUT /users/{id}
```

- Full resource representation
- Idempotent

#### PATCH – Selective Update
```http
PATCH /users/{id}
```

- Partial fields only
- Preferred for selective update

**Response**
```http
200 OK
```

```json
{
  "id": "123",
  "name": "Updated Name"
}
```

---

### 2.4 Delete (Remove Resource)

**Request**
```http
DELETE /users/{id}
```

**Response**
```http
204 No Content
```

**Intent**
- Remove resource permanently or logically

---

## 3. Business / Command API – Common Patterns

### 3.1 Execute Business Action

**Request**
```http
POST /accounts/transfer
```

```json
{
  "fromAccountId": "A",
  "toAccountId": "B",
  "amount": 100
}
```

**Response (Synchronous)**
```http
200 OK
```

```json
{
  "transferId": "tx-001",
  "status": "SUCCESS"
}
```

**Intent**
- Execute business behavior
- Often transactional
- May involve multiple aggregates

---

### 3.2 State Transition Command

**Request**
```http
POST /policies/{id}/approve
```

**Response**
```http
200 OK
```

```json
{
  "policyId": "P-001",
  "status": "APPROVED"
}
```

---

### 3.3 Asynchronous Command

**Request**
```http
POST /reports/generate
```

**Response**
```http
202 Accepted
```

```json
{
  "taskId": "task-123",
  "status": "PROCESSING"
}
```

**Intent**
- Command accepted
- Processing happens asynchronously

---

## 4. Recommended Response Body Structure

### 4.1 CRUD API Response (Resource-Oriented)

```json
{
  "id": "123",
  "data": {
    "name": "Sam"
  }
}
```

---

### 4.2 Command API Response (Result-Oriented)

```json
{
  "commandId": "cmd-001",
  "result": "SUCCESS",
  "message": "Transfer completed"
}
```

---

## 5. HTTP Status Code & Intent Summary

### 5.1 Success Codes

| Code | Meaning | Typical Use |
|----|--------|------------|
| 200 OK | Success | Read / Sync command |
| 201 Created | Resource created | POST (CRUD) |
| 202 Accepted | Accepted for processing | Async command |
| 204 No Content | Success, no body | DELETE |

---

### 5.2 Client Error Codes

| Code | Meaning | When to Use |
|----|--------|-----------|
| 400 Bad Request | Invalid input | Validation failed |
| 401 Unauthorized | Not authenticated | No login |
| 403 Forbidden | No permission | Access denied |
| 404 Not Found | Resource missing | ID not found |
| 409 Conflict | State conflict | Duplicate / invalid state |
| 422 Unprocessable Entity | Business rule violation | Domain validation |

---

### 5.3 Server Error Codes

| Code | Meaning | When to Use |
|----|--------|-----------|
| 500 Internal Server Error | Unknown error | Unexpected failure |
| 503 Service Unavailable | System busy/down | Retry later |

---

## 6. Idempotency Considerations

| API Type | Idempotency |
|-------|------------|
| CRUD Create | Optional |
| CRUD Update | Required |
| Command API | **Strongly recommended** |
| Query API | Naturally idempotent |

---

## 7. A Simple & Pragmatic HTTP Code Strategy (Less Perfect but Very Common)

In many real-world systems (especially internal admin systems), teams intentionally **simplify HTTP status codes**
to reduce frontend complexity and improve consistency.

This approach is **not wrong** — it is a conscious trade-off.

---

### 7.1 Simplified Strategy

| Category | HTTP Status | Meaning |
|--------|------------|--------|
| Success | 200 OK | All successful requests |
| Client Error | 400 Bad Request | All client-side / business errors |
| Server Error | 500 Internal Server Error | All server-side failures |

---

### 7.2 How Errors Are Distinguished (Key Point)

Instead of relying on HTTP status codes, the system uses **business error codes** in the response body.

Example – client/business error:

```http
400 Bad Request
```

```json
{
  "errorCode": "MIN_PREMIUM_VIOLATION",
  "message": "Premium must be greater than or equal to 50"
}
```

Example – server error:

```http
500 Internal Server Error
```

```json
{
  "errorCode": "SYSTEM_ERROR",
  "message": "Unexpected error occurred"
}
```

---

### 7.3 Why This Strategy Is Widely Used

- Frontend only needs to handle **three categories**
- Business logic errors are clearly expressed via `errorCode`
- Easier global exception handling
- Compatible with legacy systems
- Reduces over-engineering of HTTP semantics

---

### 7.4 Trade-offs

**Pros**
- Simple
- Consistent
- Easy to maintain

**Cons**
- Loses fine-grained HTTP semantics (409 / 422 / 403, etc.)
- Less expressive for public APIs

---

### 7.5 Recommendation

- For **internal systems**: this simplified strategy is **perfectly acceptable**
- For **public / open APIs**: consider using richer HTTP status codes
- Consistency across the system is **more important than theoretical REST purity**

---

### 7.6 Key Takeaway 

- CRUD APIs manage **data**
- Command APIs execute **business intent**
- HTTP method reflects **semantic meaning**
- Response body should reflect **resource state** or **command result**
- HTTP status codes communicate **intent, not implementation**

> **Using only 200 / 400 / 500 with structured error codes in the response body is a valid, pragmatic API design choice, as long as the semantics are clearly documented and consistently applied.**
