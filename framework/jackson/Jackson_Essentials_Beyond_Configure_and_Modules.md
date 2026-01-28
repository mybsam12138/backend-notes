# Jackson Essentials — Beyond configure() and Modules

This document summarizes the **most important Jackson concepts** you must understand
*after* `ObjectMapper.configure(...)` and `Module`.

---

## 1. ObjectMapper Lifecycle (Very Important)

### Singleton by design
- `ObjectMapper` is **thread-safe after construction**
- Should usually be **one global instance**
- Creating many mappers is expensive

✅ Best practice:
- One `ObjectMapper` per application
- Managed by Spring (or framework)

---

## 2. Serialization vs Deserialization (Two Directions)

Jackson always works in **two independent directions**:

| Direction | Meaning |
|------|------|
| Serialization | Java → JSON |
| Deserialization | JSON → Java |

Each has:
- different features
- different annotations
- different failure modes

Never assume:
> "If serialization works, deserialization will also work"

---

## 3. Annotations (Core Power of Jackson)

Annotations are **more important than global configuration**.

### Most important ones

| Annotation | Purpose |
|------|------|
| `@JsonProperty` | Explicit field name |
| `@JsonIgnore` | Exclude field |
| `@JsonInclude` | Control null/empty output |
| `@JsonFormat` | Date / number format |
| `@JsonCreator` | Custom constructor |
| `@JsonValue` | Enum or value output |
| `@JsonAlias` | Accept multiple names |

📌 Annotations override global settings.

---

## 4. Naming Strategy

Controls how Java names map to JSON.

Examples:
- `camelCase` → `snake_case`
- `userName` → `user_name`

```java
mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
```

This is a **contract decision**, not a technical one.

---

## 5. Null, Empty, and Default Handling

Serialization control:

```java
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
```

Global vs local:
- Global config → dangerous
- Annotation → precise

---

## 6. Enum Handling (Common Pitfall)

Enums can be:
- serialized by name
- by value
- by ordinal (dangerous)

Best practice:
```java
@JsonValue
public String code() { ... }
```

Never rely on ordinal.

---

## 7. Polymorphism (Advanced but Critical)

Jackson supports inheritance:

```java
@JsonTypeInfo(use = Id.NAME)
@JsonSubTypes({...})
```

Use only when:
- versioning APIs
- domain modeling requires it

⚠ Overuse leads to fragile APIs.

---

## 8. Custom Serializer / Deserializer

Use when:
- annotations are not enough
- cross-cutting logic

Trade-off:
- powerful
- harder to debug
- harder to maintain

Prefer:
- annotations first
- custom classes last

---

## 9. Tree Model (JsonNode)

Jackson has **two modes**:
- Data binding (POJO)
- Tree model (`JsonNode`)

Use `JsonNode` when:
- JSON structure is dynamic
- schema is unknown

---

## 10. Error Handling & Diagnostics

Important exceptions:
- `JsonParseException`
- `JsonMappingException`
- `InvalidFormatException`

Never expose raw Jackson errors to clients.
Translate them.

---

## 11. Streaming API (Performance)

Low-level API:
- `JsonParser`
- `JsonGenerator`

Use when:
- very large JSON
- high-performance scenarios

Most applications **do not need this**.

---

## 12. Compatibility & Versioning

Jackson behavior changes across versions.

Rules:
- Lock Jackson version centrally
- Avoid default behavior reliance
- Write tests for JSON contracts

---

## 13. The Most Important Rule (Final)

> **Jackson is not a utility library — it defines your API contract.**
> Treat configuration changes as breaking changes.

---

## 14. Practical Priority Order (Memorize This)

1. ObjectMapper lifecycle
2. Annotations
3. Naming strategy
4. Date / time handling
5. Enum strategy
6. Error handling
7. Custom serializers
8. Streaming (only if needed)

---

## 15. Recommended Placement

```
framework/
└── springboot/
    └── jackson/
        └── jackson-essentials.md
```

---

End of document.
