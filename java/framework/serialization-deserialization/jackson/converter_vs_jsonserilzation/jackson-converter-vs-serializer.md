# Jackson — Converter vs Serializer vs Deserializer

## The Core Difference

```
JsonSerializer    → you control HOW the JSON is written (raw tokens)
JsonDeserializer  → you control HOW the JSON is read (raw tokens)
StdConverter      → you just convert the VALUE, Jackson handles the JSON
```

---

## Inheritance Chain — How They Relate

```
JsonSerializer<T>                ← base, full token control
      ↓ extends
StdSerializer<T>                 ← adds helper methods
      ↓ extends
StdConverter<IN, OUT>            ← wraps convert() into a serializer
                                    Jackson calls convert() then writes result

JsonDeserializer<T>              ← base, full token control
      ↓ extends
StdDeserializer<T>               ← adds helper methods
      ↓ extends
StdConverter<IN, OUT>            ← same class, used for deserialization too
```

> `StdConverter` IS a `JsonSerializer` / `JsonDeserializer` underneath — it just hides the complexity behind a simpler `convert()` method.

---

## JsonSerializer — Full Token Control

You decide every single token written to JSON — `{`, `}`, `[`, `]`, field names, values.

```java
public class UserSerializer extends JsonSerializer<User> {

    @Override
    public void serialize(User user, JsonGenerator gen,
                          SerializerProvider provider) throws IOException {

        // YOU control the entire JSON structure
        gen.writeStartObject();                                    // {
        gen.writeStringField("full_name", user.getName());        // "full_name":"John"
        gen.writeNumberField("age", user.getAge());               // "age":25
        gen.writeArrayFieldStart("roles");                         // "roles":[
        for (String role : user.getRoles()) {
            gen.writeString(role);                                 // "ADMIN","USER"
        }
        gen.writeEndArray();                                       // ]
        gen.writeObjectFieldStart("contact");                      // "contact":{
        gen.writeStringField("email", user.getEmail());            // "email":"..."
        gen.writeEndObject();                                      // }
        gen.writeEndObject();                                      // }
    }
}

// Apply to class
@JsonSerialize(using = UserSerializer.class)
public class User { ... }

// Result:
// {
//   "full_name": "John",
//   "age": 25,
//   "roles": ["ADMIN", "USER"],
//   "contact": {"email": "john@example.com"}
// }
```

---

## JsonDeserializer — Full Token Control (Reading)

You control how JSON tokens are read and mapped to a Java object.

```java
public class UserDeserializer extends JsonDeserializer<User> {

    @Override
    public User deserialize(JsonParser p,
                            DeserializationContext ctx) throws IOException {

        JsonNode node = p.getCodec().readTree(p);  // read entire JSON node

        // manually extract each field
        String name  = node.get("full_name").asText();
        int    age   = node.get("age").asInt();
        String email = node.get("contact").get("email").asText();

        // build Java object manually
        User user = new User();
        user.setName(name);
        user.setAge(age);
        user.setEmail(email);
        return user;
    }
}

// Apply to class
@JsonDeserialize(using = UserDeserializer.class)
public class User { ... }
```

---

## StdConverter — Simple Value Conversion

Just convert one type to another — no `JsonGenerator`, no `JsonParser`. Jackson handles all JSON reading/writing.

### Serialization converter (Java → JSON value)

```java
public class MoneyToStringConverter extends StdConverter<BigDecimal, String> {
    @Override
    public String convert(BigDecimal value) {
        return value.setScale(2).toString() + " USD";  // just return a value
    }
}
// Jackson takes the returned String and writes it to JSON automatically
```

### Deserialization converter (JSON value → Java)

```java
public class StringToMoneyConverter extends StdConverter<String, BigDecimal> {
    @Override
    public BigDecimal convert(String value) {
        return new BigDecimal(value.replace(" USD", ""));  // just return a value
    }
}
// Jackson reads the JSON string and passes it to convert() automatically
```

### Apply to field

```java
public class Order {

    @JsonSerialize(converter = MoneyToStringConverter.class)
    @JsonDeserialize(converter = StringToMoneyConverter.class)
    private BigDecimal total;
}
// serialize   → "total":"150.00 USD"
// deserialize ← "total":"150.00 USD" → BigDecimal 150.00
```

---

## Side by Side — Same Task, All 3 Ways

Convert `LocalDateTime` to formatted string `"2024-01-15"`:

```java
// JsonSerializer — must handle JsonGenerator manually
public class DateSerializer extends JsonSerializer<LocalDateTime> {
    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen,
                          SerializerProvider provider) throws IOException {
        gen.writeString(                                    // must call gen yourself
            value.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        );
    }
}

// JsonDeserializer — must handle JsonParser manually
public class DateDeserializer extends JsonDeserializer<LocalDateTime> {
    @Override
    public LocalDateTime deserialize(JsonParser p,
                                     DeserializationContext ctx) throws IOException {
        String value = p.getText();                        // must read from parser
        return LocalDateTime.parse(value,
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}

// StdConverter — just return the value, no generator/parser needed
public class DateToStringConverter extends StdConverter<LocalDateTime, String> {
    @Override
    public String convert(LocalDateTime value) {
        return value.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")); // just return
    }
}

public class StringToDateConverter extends StdConverter<String, LocalDateTime> {
    @Override
    public LocalDateTime convert(String value) {
        return LocalDateTime.parse(value,
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));       // just return
    }
}
```

All produce the same result — but `StdConverter` is much simpler.

---

## Common StdConverter Examples

```java
// Enum → lowercase string
public class StatusToStringConverter extends StdConverter<Status, String> {
    @Override
    public String convert(Status status) {
        return status.name().toLowerCase();   // ACTIVE → "active"
    }
}

// String → Enum
public class StringToStatusConverter extends StdConverter<String, Status> {
    @Override
    public Status convert(String value) {
        return Status.valueOf(value.toUpperCase());  // "active" → ACTIVE
    }
}

// Long timestamp → LocalDateTime
public class TimestampToDateConverter extends StdConverter<Long, LocalDateTime> {
    @Override
    public LocalDateTime convert(Long timestamp) {
        return LocalDateTime.ofInstant(
            Instant.ofEpochMilli(timestamp), ZoneId.systemDefault()
        );
    }
}

// Mask sensitive data on serialize
public class MaskConverter extends StdConverter<String, String> {
    @Override
    public String convert(String value) {
        if (value == null || value.length() < 4) return "****";
        return "****" + value.substring(value.length() - 4);
        // "1234567890" → "****7890"
    }
}
```

---

## What Converter CANNOT Do

```java
// ❌ StdConverter cannot produce complex nested JSON structures

// This is impossible with StdConverter:
// User → {"id":1, "info":{"name":"John", "contact":{"email":"..."}}}

// Must use JsonSerializer for this:
public class UserSerializer extends JsonSerializer<User> {
    @Override
    public void serialize(User user, JsonGenerator gen, ...) throws IOException {
        gen.writeStartObject();
            gen.writeNumberField("id", user.getId());
            gen.writeObjectFieldStart("info");           // nested object
                gen.writeStringField("name", user.getName());
                gen.writeObjectFieldStart("contact");    // nested again
                    gen.writeStringField("email", user.getEmail());
                gen.writeEndObject();
            gen.writeEndObject();
        gen.writeEndObject();
    }
}
```

---

## How to Register — 3 Ways

### 1. Per field

```java
public class Order {
    @JsonSerialize(using = MoneySerializer.class)          // serializer
    @JsonSerialize(converter = MoneyToStringConverter.class) // converter
    @JsonDeserialize(using = MoneyDeserializer.class)      // deserializer
    @JsonDeserialize(converter = StringToMoneyConverter.class) // converter
    private BigDecimal total;
}
```

### 2. Per class

```java
@JsonSerialize(using = UserSerializer.class)
@JsonDeserialize(using = UserDeserializer.class)
public class User { ... }
```

### 3. Global via ObjectMapper module

```java
SimpleModule module = new SimpleModule();
module.addSerializer(BigDecimal.class, new MoneySerializer());
module.addDeserializer(BigDecimal.class, new MoneyDeserializer());

ObjectMapper mapper = new ObjectMapper();
mapper.registerModule(module);
// now applies to ALL BigDecimal fields everywhere
```

---

## Full Comparison

| | `JsonSerializer` | `JsonDeserializer` | `StdConverter` |
|---|---|---|---|
| Direction | Java → JSON | JSON → Java | Both (one class per direction) |
| Access `JsonGenerator` | ✓ required | ✗ | ✗ hidden |
| Access `JsonParser` | ✗ | ✓ required | ✗ hidden |
| Control JSON structure | ✓ full | ✓ full | ✗ value only |
| Complex nested JSON | ✓ | ✓ | ✗ |
| Simple value conversion | ✓ but overkill | ✓ but overkill | ✓ perfect |
| Code complexity | High | High | Low |
| IS a JsonSerializer? | ✓ | — | ✓ underneath |
| Best for | Custom JSON shapes | Custom JSON parsing | Simple type transformation |

---

## Decision Flow

```
Need to convert a simple value?
  String ↔ BigDecimal
  Long ↔ LocalDateTime
  Enum ↔ String
  Mask sensitive data
  → StdConverter ✓ (simpler, less code)

Need to control the JSON structure?
  One object → nested JSON with custom shape
  One object → JSON array
  Multiple fields → one JSON field
  Custom field names / structure
  → JsonSerializer / JsonDeserializer ✓ (full control)

Apply to one field only?
  → @JsonSerialize / @JsonDeserialize on the field

Apply globally to a type everywhere?
  → register via ObjectMapper module
```
