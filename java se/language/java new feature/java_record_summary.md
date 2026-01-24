# Java Record — Practical Summary for Developers

## 1. What is a Record?

A **record** is a special kind of Java class designed to represent **immutable data carriers**.

> A record is a **named, immutable value** composed of components.

Records are ideal when a class’s main purpose is to **hold data**, not behavior.

---

## 2. Java Version Support

- **Java 14**: Preview
- **Java 15**: Preview
- **Java 16+**: Official and stable

Records are fully supported in modern LTS environments.

---

## 3. Basic Syntax

```java
public record ToolCall(String name, Map<String, Object> arguments) {}
```

This single line defines:
- `private final` fields
- A canonical constructor
- Accessor methods
- `equals()`, `hashCode()`, `toString()`

---

## 4. What the Compiler Generates

The record above is roughly equivalent to:

```java
public final class ToolCall {

    private final String name;
    private final Map<String, Object> arguments;

    public ToolCall(String name, Map<String, Object> arguments) {
        this.name = name;
        this.arguments = arguments;
    }

    public String name() {
        return name;
    }

    public Map<String, Object> arguments() {
        return arguments;
    }

    @Override
    public boolean equals(Object o) { /* generated */ }

    @Override
    public int hashCode() { /* generated */ }

    @Override
    public String toString() { /* generated */ }
}
```

---

## 5. Record Components

The components declared in the record header:

```java
String name, Map<String, Object> arguments
```

Are simultaneously:
- Constructor parameters
- `private final` fields
- Accessor methods (`name()`, `arguments()`)
- The basis for equality

They represent the **entire state** of the record.

---

## 6. Constructors in Records

### 6.1 Canonical Constructor

```java
public record ToolCall(String name, Map<String, Object> arguments) {
    public ToolCall {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name must not be blank");
        }
        arguments = (arguments == null) ? Map.of() : Map.copyOf(arguments);
    }
}
```

- Parameters can be validated or normalized
- Fields are assigned **once**
- Invariants are enforced at construction time

---

## 7. Immutability Rules

Records guarantee:
- Fields are `final`
- No setters allowed
- Class is `final`
- State cannot change after construction

However:
- Components may reference mutable objects (unless defensively copied)

---

## 8. Why Use `Map.copyOf()` in Records?

```java
arguments = Map.copyOf(arguments);
```

Ensures:
- No external modification
- True immutability
- Thread safety
- Strong invariants

---

## 9. When to Use Records

Use records when:
- The class is a **data holder**
- Equality is **value-based**
- Objects are **immutable**
- Used as DTOs, commands, messages, events

Common use cases:
- API request/response models
- Tool calls in AI agents
- Event objects
- Configuration snapshots

---

## 10. When NOT to Use Records

Avoid records when:
- Fields must be mutable
- Identity matters more than value
- Complex inheritance is required
- Behavior dominates over data

---

## 11. Records vs Lombok

| Feature | Record | Lombok `@Data` | Lombok `@Value` |
|------|------|------|------|
| Immutable | ✅ | ❌ | ✅ |
| Final class | ✅ | ❌ | ❌ |
| Boilerplate-free | ✅ | ❌ | ❌ |
| Language-level | ✅ | ❌ | ❌ |

---

## 12. Mental Model

> **Record = immutable value object with a name**

If the state changes, it should be a **new record instance**.

---

## 13. Summary

- Every record has components
- Components define the entire state
- Records are immutable and final
- Constructors enforce invariants
- Records are ideal for value-based data modeling

---

**Recommended Java Version:** Java 17+ for production
