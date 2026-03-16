# Java `long` vs JavaScript `Number`

## Why `LongToStringSerializer` is Needed in Web Systems

---

## 1. The Core Difference

### Java `long`

- Fixed **64-bit signed integer**
- Exact integer representation
- Range:

```
-2^63  ~  2^63 - 1
≈ -9.22e18 ~ 9.22e18
```

- **Every integer in range is precise**
- Commonly used for:
  - Database primary keys
  - Snowflake IDs
  - Order IDs, User IDs

---

### JavaScript `Number`

- Uses **IEEE-754 double-precision floating point**
- Total: 64 bits, but only **52 bits for integer precision**

Maximum safe integer:

```
2^53 - 1 = 9007199254740991
```

JavaScript exposes this explicitly:

```js
Number.MAX_SAFE_INTEGER
```

- Integers larger than this **cannot be represented exactly**
- Precision loss happens **silently** (no error)

---

## 2. Why This Causes Problems in Web Systems

### Backend (Java)

```java
long id = 9223372036854775807L;
```

✔ Perfectly valid and precise

---

### JSON without special handling

HTTP response body:

```json
{
  "id": 9223372036854775807
}
```

- This is a **JSON number**
- JSON itself allows arbitrarily large numbers

---

### Frontend (JavaScript)

```js
const id = response.id;
```

Internally:

```
JSON number → JavaScript Number
```

Result:

```js
9223372036854776000   // ❌ precision lost
```

⚠️ No exception, no warning — just wrong data

---

## 3. The Root Cause

- JSON has **no precision limit**
- JavaScript forces all numbers into `Number`
- `Number` cannot precisely represent 64-bit integers

➡ The data is corrupted **after JSON parsing**, not during transfer

---

## 4. What `LongToStringSerializer` Does

### Backend serialization

```java
class LongToStringSerializer extends JsonSerializer<Long> {
    @Override
    public void serialize(Long value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException {
        gen.writeString(value.toString());
    }
}
```

### HTTP response body

```json
{
  "id": "9223372036854775807"
}
```

- Still plain text over HTTP
- But now the value is a **JSON string**

---

## 5. Frontend After Using String

```js
const id = response.id;
```

- Type: `string`
- Value: exact
- No precision loss
- Safe for:
  - Display
  - Comparison
  - Routing
  - Sending back to backend

---

## 6. Why Backend Still Uses `long`

Important clarification:

- `LongToStringSerializer` affects **only JSON serialization**
- Backend domain model and database still use `long`

```
Java long (memory)
   ↓
JSON string (wire)
   ↓
JavaScript string (frontend)
```

This is a **serialization policy**, not a type change

---

## 7. When `LongToStringSerializer` Should Be Used

### Recommended (YES)

- IDs and identifiers:
  - `id`
  - `userId`
  - `orderId`
  - `tenantId`
- Values that must be **exactly preserved**
- Values not used for arithmetic on frontend

---

### Not Recommended (NO)

- Counters
- Amounts used in math
- Durations
- Pagination values

Example:

```java
Long totalCount;      // keep as number
Long durationMillis; // keep as number
```

---

## 8. Common Strategies in Real Systems

### Strategy 1: Global Long → String (Simple)

- All `Long` serialized as string
- Zero risk of precision loss
- Common in internal admin systems

---

### Strategy 2: Per-field Annotation (Precise)

```java
@JsonSerialize(using = LongToStringSerializer.class)
private Long id;
```

- Fine-grained control
- Requires discipline

---

### Strategy 3: API DTO Uses String (Explicit)

```java
class UserDTO {
    String id;
}
```

- Clean API contract
- More mapping code

---

## 9. Final Takeaway

> **Java `long` and JavaScript `Number` are fundamentally different types.**
>
> **`LongToStringSerializer` is required in web systems to prevent silent precision loss when Java IDs cross the Java–JavaScript boundary.**

---

## 10. One-Line Rule

> **If a value must survive Java → JSON → JavaScript without loss, serialize it as a string.**

