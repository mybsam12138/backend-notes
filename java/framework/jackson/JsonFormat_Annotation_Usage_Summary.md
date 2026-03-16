# @JsonFormat Annotation — Practical Summary

## 1. What is @JsonFormat

`@JsonFormat` is a **Jackson annotation** used to control **how a specific field or property is represented in JSON**.

It is:
- Metadata, not a serializer
- Local (field / property scoped)
- Safe to use alongside global configuration

It applies to **serialization and deserialization**.

---

## 2. What @JsonFormat Is NOT

`@JsonFormat` is **NOT**:
- a Jackson module
- a global configuration
- a Spring annotation
- limited to date/time only

It does **not** modify `ObjectMapper` globally.

---

## 3. How @JsonFormat Works (Key Mechanism)

Jackson’s built-in serializers (e.g. Java Time serializers) are **contextual**.

This means:
- Jackson reads `@JsonFormat` on the field
- Creates a **field-specific serializer/deserializer**
- Uses it directly to read/write JSON

There is **no “serialize first, then reformat” step**.

---

## 4. Common Use Cases

### 4.1 Date / Time Formatting

```java
@JsonFormat(pattern = "yyyy-MM-dd")
private LocalDate date;

@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
private LocalDateTime createdAt;
```

JSON output:
```json
{
  "date": "2026-01-27",
  "createdAt": "2026-01-27 16:30:00"
}
```

---

### 4.2 Timezone Control

```java
@JsonFormat(
    pattern = "yyyy-MM-dd HH:mm:ss",
    timezone = "Asia/Shanghai"
)
private LocalDateTime time;
```

---

### 4.3 Force Numbers as Strings (ID Safety)

```java
@JsonFormat(shape = JsonFormat.Shape.STRING)
private Long id;
```

JSON:
```json
{
  "id": "9007199254740993"
}
```

Used to avoid JavaScript number precision loss.

---

### 4.4 Enum Representation

```java
@JsonFormat(shape = JsonFormat.Shape.STRING)
private Status status;
```

Controls whether enums are written as names or numbers.

---

## 5. Precedence Rules (Very Important)

Jackson resolves formatting in this order:

1. Field-level annotations (`@JsonFormat`, `@JsonSerialize`)
2. Type-level annotations
3. Global serializers (modules)
4. Jackson defaults

➡ `@JsonFormat` **overrides global serializers**, if the serializer supports contextualization.

---

## 6. Relationship with JavaTimeModule

| Component | Responsibility |
|------|------|
| JavaTimeModule | Enables Java 8+ date/time support |
| Serializer / Deserializer | Performs conversion |
| @JsonFormat | Customizes representation per field |

They are complementary, not overlapping.

---

## 7. When @JsonFormat Works

`@JsonFormat` works when:
- The serializer is **contextual**
- Jackson’s built-in Java Time serializers are used

It may **not work** with:
- hard-coded custom serializers
- non-contextual serializers

---

## 8. One-Sentence Rule (Memorize This)

> `@JsonFormat` provides **field-level formatting instructions** that Jackson’s serializers read to produce JSON, without changing global behavior.

