# `void` vs `Void` in Java (Practical Guide)

This document summarizes **when and why to use `void` and `Void` in Java**, especially in the context of **generics, APIs, and frameworks**.

---

## 1. What is `void`

### Definition

`void` is a **Java keyword**, not a type.

```java
public void doSomething() {
    // no return value
}
```

### Key Characteristics

- Not a class
- Not a reference type
- Cannot be used in generics
- Indicates *absence of a return value*

### Typical Use Cases

- Side-effect methods
- Command-style operations
- Internal logic where no result is needed

Example:

```java
service.save(user);
```

---

## 2. What is `Void`

### Definition

`Void` is a **real class** in `java.lang`:

```java
java.lang.Void
```

Internally:

```java
public final class Void {
    private Void() {}
}
```

### Key Characteristics

- Reference type
- Has **no instances**
- The only valid value is `null`
- Can be used in generics

```java
Void v = null; // valid
```

---

## 3. Why `Void` Exists

Java generics **cannot use `void`**:

```java
List<void> list;   // ❌ illegal
```

To represent *"no value"* in generic structures, Java provides `Void`:

```java
List<Void> list;   // ✅ legal
```

`Void` exists purely to **fill generic type positions** where no value is allowed.

---

## 4. `void` vs `Void` (Comparison)

| Aspect | `void` | `Void` |
|------|------|------|
| Kind | keyword | class |
| Can be instantiated | ❌ | ❌ |
| Reference type | ❌ | ✅ |
| Usable in generics | ❌ | ✅ |
| Meaning | no return value | no possible value |

---

## 5. Using `Void` in APIs (Important)

### Example: API Response Wrapper

```java
ApiResponse<Void>
```

Semantic meaning:

> "This API **never returns business data**."

Implementation:

```java
public static ApiResponse<Void> success() {
    return new ApiResponse<Void>(0, "OK", null);
}
```

This explicitly tells users:

- `data` is **intentionally absent**
- `null` is expected and correct
- No payload will ever appear

---

## 6. Why NOT Use `ApiResponse<Object>`

```java
ApiResponse<Object>
```

This means:

- Some value *might* exist
- Type is unknown
- Easy to misuse

Using `Void` is **stronger and safer** because it communicates intent at the type level.

---

## 7. Common Framework Examples

### Spring MVC

```java
ResponseEntity<Void>
```

Meaning:

- HTTP status + headers
- No response body

---

### Concurrency (JDK)

```java
Callable<Void>
CompletableFuture<Void>
```

Meaning:

- Task has side effects
- Completion matters
- Return value does not

---

## 8. `null` and `Void` (Clarification)

- `null` is **not** an instance of `Void`
- `null` is **not** a subclass of anything
- `null` can be assigned to any reference type

Important rule:

> `Void` has no valid instances, therefore `null` is the only value it can hold.

---

## 9. When You SHOULD Use `Void`

Use `Void` when **all** are true:

- A generic type is required
- No meaningful value should exist
- You want to enforce this at compile time

Typical cases:

- API success without payload
- DELETE / UPDATE endpoints
- Async tasks without result
- Completion-only workflows

---

## 10. When You SHOULD NOT Use `Void`

Avoid `Void` if:

- Data might be returned later
- You want optional semantics
- `null` represents an error or missing state

Use instead:

```java
ApiResponse<T>
Optional<T>
Empty DTO
```

---

## 11. One-Sentence Rule (Remember This)

> **Use `void` for methods, use `Void` for generics when a value must never exist.**

---

## 12. Final Takeaway

`Void` is not about returning `null`.

It is about **designing APIs that make invalid states unrepresentable**.

That is why `Void` belongs in framework-level code and public contracts.
