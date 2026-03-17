# Defensive Programming (Cheat Sheet)

Defensive programming is a style of writing code that **anticipates misuse, bad inputs, partial failures, and unexpected states**, and handles them in a predictable, safe way.

---

## 1. Goals

- **Fail fast** when inputs are invalid (catch bugs early).
- **Fail safe** when the system is unreliable (degrade gracefully).
- Preserve **data integrity** (avoid corrupt writes).
- Improve **observability** (logs/metrics that help diagnosis).
- Reduce **blast radius** (contain failures to a small scope).

---

## 2. The “Trust Boundary” Rule

Treat data differently based on where it comes from:

- **Outside your process** (HTTP requests, MQ messages, files, DB rows, 3rd-party APIs): **never trust**.
- **Inside your process** (method calls with controlled types/invariants): trust **more**, but still validate key invariants at boundaries.

**Practical rule:** validate at module boundaries (Controller → Service, Service → Repository, inbound DTO → domain model).

---

## 3. Input Validation & Sanitization

### What to validate
- **Presence**: required fields not null/blank.
- **Type/format**: number ranges, dates, enum values.
- **Length/size**: strings, arrays, payload sizes.
- **Cross-field rules**: start <= end, currency matches locale, etc.

### How
- Reject invalid inputs early with **clear error codes/messages**.
- Normalize inputs (trim strings, canonicalize case) when appropriate.
- Prevent injection:
  - SQL: use parameterized queries
  - HTML: escape output
  - JSON: don’t build via string concatenation

---

## 4. Preconditions, Postconditions, Invariants

- **Preconditions**: what must be true before a function runs (e.g., `id > 0`).
- **Postconditions**: what must be true after it completes (e.g., `result != null`).
- **Invariants**: what must always remain true for an object/module (e.g., `balance >= 0`).

**Common Java tools**
- `Objects.requireNonNull(x, "x must not be null")`
- `assert` (useful in tests/dev, not a runtime validation strategy)
- Bean Validation (Jakarta Validation) for DTOs: `@NotNull`, `@Size`, `@Min`, ...

---

## 5. Null Safety (and Optional)

- Prefer **non-null by default** in domain logic.
- Use `Optional<T>` for **return values** (not for fields/DTOs in most cases).
- Avoid NPE by:
  - Validating inputs
  - Using defaults for missing optional fields
  - Encapsulating null-handling near boundaries

---

## 6. Error Handling Strategy

### Principles
- **Don’t swallow exceptions** silently.
- Convert exceptions at **layer boundaries**:
  - Low-level (IO/DB) → Infra exception
  - Business rule failures → Biz exception
  - Unknown → System exception

### Error contracts
- Return stable **error code + message** to clients.
- Keep internal details (stack traces, SQL, secrets) out of client responses.

---

## 7. Logging (Safe and Useful)

- Log enough to diagnose: request id / trace id, key identifiers, error code.
- **Do not** log secrets: passwords, tokens, full card numbers, private keys.
- Prefer structured logging (key=value):
  - `traceId`, `userId`, `tenantId`, `orderId`, `errorCode`
- Logging exceptions:
  - In internal logs: `log.error("...", ex)` is fine if you control access.
  - For user-facing: show a safe message, keep stack trace internal.

---

## 8. Resource Safety

Always release resources deterministically:

- Use `try-with-resources` for `InputStream`, `Connection`, etc.
- Avoid unbounded memory growth:
  - Cap caches
  - Limit collection sizes
  - Stream large files instead of loading into memory

---

## 9. Concurrency & Thread Safety

- Avoid shared mutable state, or protect it (locks/atomic).
- Assume callbacks may run concurrently.
- For thread-local/request-context:
  - Set in filter/interceptor
  - Clear in `finally` to prevent leaks in thread pools

---

## 10. External Calls: Timeouts, Retries, Circuit Breakers

When talking to DBs/HTTP/MQ:

- Always set **timeouts** (connect + read).
- Retry **only** on safe, transient errors.
- Add **circuit breaker / bulkhead** patterns to prevent cascading failures.
- Use idempotency keys for “at least once” behaviors.

---

## 11. Data Integrity & Transactions

- Validate before write; also guard with DB constraints:
  - `NOT NULL`, `CHECK`, `UNIQUE`, FK constraints
- Prefer **atomic operations**:
  - Use transactions for multi-step updates
- Handle partial failures:
  - Compensating actions (SAGA) for distributed flows

---

## 12. Safe Defaults and Feature Flags

- Prefer defaults that reduce harm:
  - “deny by default” for permissions
  - conservative rate limits
- Roll out risky changes using feature flags:
  - enable gradually
  - quick rollback

---

## 13. Defensive API Design

- Make illegal states unrepresentable:
  - Strong types / value objects (e.g., `Money`, `Email`)
  - Enums instead of strings for closed sets
- Prefer immutability for domain objects.
- Small, explicit interfaces reduce misuse.

---

## 14. Testing for Defensive Behavior

Add tests for:
- Boundary values (min/max, empty/null)
- Invalid formats and cross-field rules
- Fault injection:
  - timeouts, network errors, DB failures
- Concurrency tests for race conditions
- Property-based tests for broad input coverage

---

## 15. Quick Checklist

- [ ] Validate inputs at trust boundaries
- [ ] Use clear error codes; don’t leak internals to clients
- [ ] Log safely (no secrets), with trace identifiers
- [ ] Always use timeouts for external calls
- [ ] Release resources (try-with-resources)
- [ ] Protect shared state (thread safety)
- [ ] Use DB constraints + transactions for integrity
- [ ] Add tests for invalid and failure scenarios

---

## 16. Mini Example (Layered Validation)

**Controller (boundary):** validate request DTO (format/range).  
**Service (domain):** enforce business invariants.  
**Repository (infra):** handle DB exceptions, translate to infra errors.

This keeps validation close to where it is most meaningful and prevents “garbage-in” from spreading.
