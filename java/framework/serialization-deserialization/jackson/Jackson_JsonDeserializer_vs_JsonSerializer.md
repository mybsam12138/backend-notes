# Jackson JsonDeserializer & JsonSerializer Guide

This document explains **JsonDeserializer** and **JsonSerializer** in Jackson, with a focus on the
core methods **deserialize** and **serialize**, their parameters, and typical usage patterns,
especially in backend and finance-related systems.

---

## 1. JsonDeserializer Interface

### Purpose

`JsonDeserializer<T>` is used when **converting JSON input into Java objects**.

Typical goals:
- Normalize messy input
- Enforce invariants (non-null, scale, range)
- Validate early (fail fast)
- Protect domain logic from bad data

In finance systems, **deserializer is extremely important**.

---

### Core Method

```java
T deserialize(JsonParser p, DeserializationContext ctxt)
        throws IOException;
```

---

### Method Parameters

#### 1. JsonParser `p`

**What it is**
- A low-level JSON reader
- Points to the current JSON token being parsed

**What you usually do with it**
```java
p.getValueAsString();
p.getDecimalValue();
p.getIntValue();
p.getCurrentToken();
```

**Mental model**
> “Read raw JSON value from the request.”

---

#### 2. DeserializationContext `ctxt`

**What it is**
- Runtime context provided by Jackson
- Holds configuration, locale, features, and helpers

**Typical uses**
- Access configuration
- Throw mapping exceptions
- Delegate to other deserializers

Example:
```java
ctxt.mappingException("Invalid premium value");
```

**Mental model**
> “Environment + error handling for deserialization.”

---

### Typical Usage Pattern

```java
public class BigDecimalDeserializer
        extends JsonDeserializer<BigDecimal> {

    @Override
    public BigDecimal deserialize(
            JsonParser p,
            DeserializationContext ctxt
    ) throws IOException {

        String text = p.getValueAsString();

        if (text == null || text.trim().isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal value = new BigDecimal(text);

        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw ctxt.mappingException(
                "Amount cannot be negative"
            );
        }

        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
```

---

### When to Use JsonDeserializer

✔ Normalize input (`null`, `""`, `" "` → safe value)  
✔ Validate ranges (no negative premium)  
✔ Enforce scale and rounding  
✔ Handle legacy / dirty client data  

**Best practice**
> Deserializer is the right place for data normalization and protection.

---

## 2. JsonSerializer Interface

### Purpose

`JsonSerializer<T>` is used when **converting Java objects into JSON output**.

Typical goals:
- Format output
- Control JSON structure
- Maintain API contract compatibility

In finance systems, serializer should be **conservative and honest**.

---

### Core Method

```java
void serialize(
    T value,
    JsonGenerator gen,
    SerializerProvider serializers
) throws IOException;
```

---

### Method Parameters

#### 1. Value `value`

**What it is**
- The actual Java field value being serialized

**Important**
- Usually non-null
- `null` values are often handled before this method

**Mental model**
> “The final domain value to expose.”

---

#### 2. JsonGenerator `gen`

**What it is**
- Low-level JSON writer
- Writes JSON tokens directly to output stream

**Common methods**
```java
gen.writeNumber(value);
gen.writeString("0.00");
gen.writeNull();
gen.writeStartObject();
gen.writeEndObject();
```

**Mental model**
> “A pen that writes JSON.”

---

#### 3. SerializerProvider `serializers`

**What it is**
- Serialization runtime context
- Gives access to:
  - Other serializers
  - Configuration
  - Default behaviors

**Typical use**
- Delegate serialization
- Respect global rules

Example:
```java
serializers.defaultSerializeValue(value, gen);
```

**Mental model**
> “Serialization environment and helpers.”

---

### Typical Usage Pattern

```java
public class BigDecimalSerializer
        extends JsonSerializer<BigDecimal> {

    @Override
    public void serialize(
            BigDecimal value,
            JsonGenerator gen,
            SerializerProvider serializers
    ) throws IOException {

        if (value == null) {
            gen.writeNumber(BigDecimal.ZERO);
        } else {
            gen.writeNumber(value.setScale(2, RoundingMode.HALF_UP));
        }
    }
}
```

---

### When to Use JsonSerializer

✔ Output formatting (`0` → `0.00`)  
✔ Compatibility with legacy frontend  
✔ Custom JSON structure  

**Avoid**
- Changing business meaning
- Masking calculation errors
- Hiding missing data

**Rule**
> Serializer should format, not decide.

---

## 3. Deserializer vs Serializer (Summary)

| Aspect | Deserializer | Serializer |
|------|-------------|------------|
| Direction | JSON → Java | Java → JSON |
| Role | Protect system | Present data |
| Finance usage | Very important | Use carefully |
| Business logic | Allowed (validation) | Avoid |
| Null handling | Recommended | Risky |

---

## 4. Recommended Finance Practice

1. Normalize input in **JsonDeserializer**
2. Domain model uses **non-null money**
3. Serializer only formats output
4. Never hide financial errors at serialization stage

---

## 5. Final Takeaway

- **Deserializer** = defensive, strict, powerful  
- **Serializer** = simple, honest, minimal  
- In finance systems:  
  > Clean data early, show data truthfully.

