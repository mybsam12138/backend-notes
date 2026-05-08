# Serialization & Deserialization — Overview

## What is Serialization / Deserialization?

```
Serialization:
Java Object → convert to → JSON / XML / Binary
(for sending over HTTP, storing, messaging)

Deserialization:
JSON / XML / Binary → convert to → Java Object
(for receiving from HTTP, reading from storage)
```

### In a Spring Boot app

```
HTTP Request (JSON string)
        ↓
Deserialization        ← JSON → Java object (Jackson does this)
        ↓
Controller receives Java object
        ↓
Service processes
        ↓
Controller returns Java object
        ↓
Serialization          ← Java object → JSON (Jackson does this)
        ↓
HTTP Response (JSON string)
```

---

## Why Not Just Use Strings?

```java
// Without serialization — painful manual string building
String json = "{\"name\":\"" + user.getName() + "\",\"email\":\"" + user.getEmail() + "\"}";

// With serialization — automatic
String json = objectMapper.writeValueAsString(user);
// → {"name":"John","email":"john@example.com"}
```

---

## Serialization Formats

| Format | Type | Human readable | Size | Best for |
|---|---|---|---|---|
| JSON | Text | ✓ | Medium | REST APIs, web |
| XML | Text | ✓ | Large | Legacy, SOAP |
| Protobuf | Binary | ✗ | Smallest | Microservices, performance |
| Avro | Binary | ✗ | Small | Kafka, big data |
| MessagePack | Binary | ✗ | Small | High performance APIs |

---

## Java Serialization Libraries

| Library | Format | Owner | Spring Boot default |
|---|---|---|---|
| Jackson | JSON | FasterXML | ✓ yes |
| Gson | JSON | Google | ✗ |
| Fastjson2 | JSON | Alibaba | ✗ (popular in China) |
| Protobuf | Binary | Google | ✗ |
| Avro | Binary | Apache | ✗ |

---

## Jackson — Spring Boot Default

Jackson is auto-configured in Spring Boot — no setup needed for basic use.

### Basic serialization (Java → JSON)

```java
ObjectMapper objectMapper = new ObjectMapper();

// Java object → JSON string
User user = new User("John", "john@example.com", 25);
String json = objectMapper.writeValueAsString(user);
// → {"name":"John","email":"john@example.com","age":25}

// Java object → JSON file
objectMapper.writeValue(new File("user.json"), user);

// Java object → pretty printed JSON
String pretty = objectMapper.writerWithDefaultPrettyPrinter()
                            .writeValueAsString(user);
```

### Basic deserialization (JSON → Java)

```java
// JSON string → Java object
String json = "{\"name\":\"John\",\"email\":\"john@example.com\",\"age\":25}";
User user = objectMapper.readValue(json, User.class);

// JSON string → List
String jsonArray = "[{\"name\":\"John\"},{\"name\":\"Mary\"}]";
List<User> users = objectMapper.readValue(
    jsonArray,
    new TypeReference<List<User>>() {}
);

// JSON string → Map
Map<String, Object> map = objectMapper.readValue(json,
    new TypeReference<Map<String, Object>>() {}
);
```

### In Spring Boot — automatic via `@RequestBody` / `@ResponseBody`

```java
@RestController
public class UserController {

    // @RequestBody → Jackson deserializes JSON → User object automatically
    @PostMapping("/users")
    public User create(@RequestBody User user) {
        return userService.save(user);
        // return value → Jackson serializes User → JSON automatically
    }
}
```

---

## Jackson Annotations

### `@JsonProperty` — customize field name in JSON

```java
public class User {

    @JsonProperty("full_name")   // JSON key is "full_name" not "name"
    private String name;

    @JsonProperty("email_address")
    private String email;
}
// → {"full_name":"John","email_address":"john@example.com"}
```

### `@JsonIgnore` — exclude field from JSON

```java
public class User {
    private String name;

    @JsonIgnore               // never appear in JSON output
    private String password;  // ← sensitive, exclude it
}
// → {"name":"John"}   password not included
```

### `@JsonIgnoreProperties` — ignore unknown fields on input

```java
// JSON has extra fields your class doesn't have → normally throws exception
// This tells Jackson to silently ignore unknown fields
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    private String name;
    // JSON might have "age", "address" etc. — ignored safely
}
```

### `@JsonAlias` — accept multiple names for one field

```java
public class User {

    @JsonAlias({"full_name", "userName", "username"})
    private String name;
    // accepts any of these in JSON input → maps to name field
}
```

### `@JsonInclude` — control when fields are included

```java
@JsonInclude(JsonInclude.Include.NON_NULL)    // exclude null fields
public class User {
    private String name;
    private String nickname;   // null → not included in JSON
}
// if nickname is null → {"name":"John"}
// if nickname is "Johnny" → {"name":"John","nickname":"Johnny"}
```

| Include option | Behaviour |
|---|---|
| `NON_NULL` | exclude null fields |
| `NON_EMPTY` | exclude null and empty ("", [], {}) |
| `NON_DEFAULT` | exclude fields with default values |
| `ALWAYS` | always include (default) |

### `@JsonFormat` — format dates

```java
public class User {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    // → "createdAt":"2024-01-15 10:30:00"

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;
    // → "birthday":"1990-05-20"
}
```

### `@JsonSerialize` / `@JsonDeserialize` — custom logic

```java
// Custom serializer
public class MoneySerializer extends JsonSerializer<BigDecimal> {
    @Override
    public void serialize(BigDecimal value, JsonGenerator gen,
                          SerializerProvider provider) throws IOException {
        gen.writeString(value.setScale(2).toString() + " USD");
    }
}

// Custom deserializer
public class MoneyDeserializer extends JsonDeserializer<BigDecimal> {
    @Override
    public BigDecimal deserialize(JsonParser p,
                                  DeserializationContext ctx) throws IOException {
        String value = p.getText().replace(" USD", "");
        return new BigDecimal(value);
    }
}

// Apply to field
public class Order {

    @JsonSerialize(using = MoneySerializer.class)
    @JsonDeserialize(using = MoneyDeserializer.class)
    private BigDecimal total;
}
// serialize → "total":"150.00 USD"
// deserialize ← "total":"150.00 USD" → BigDecimal 150.00
```

---

## ObjectMapper Configuration

```java
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // ignore unknown fields globally (instead of per class)
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // exclude null fields globally
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        // handle Java 8 date/time types
        mapper.registerModule(new JavaTimeModule());

        // write dates as strings not timestamps
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // pretty print (dev only)
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        return mapper;
    }
}
```

Or via `application.yml`:

```yaml
spring:
  jackson:
    default-property-inclusion: non_null        # exclude null fields
    serialization:
      write-dates-as-timestamps: false           # dates as strings
      indent-output: true                        # pretty print
    deserialization:
      fail-on-unknown-properties: false          # ignore unknown fields
    date-format: "yyyy-MM-dd HH:mm:ss"
    time-zone: UTC
```

---

## Polymorphism — Serialize / Deserialize subclasses

When you have a class hierarchy and need to preserve type info in JSON.

```java
// Base class
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,        // include type name in JSON
    property = "type"                  // JSON field name for type
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = Cat.class, name = "cat"),
    @JsonSubTypes.Type(value = Dog.class, name = "dog")
})
public abstract class Animal {
    private String name;
}

public class Cat extends Animal {
    private boolean indoor;
}

public class Dog extends Animal {
    private String breed;
}

// Serialized JSON includes type field:
// {"type":"cat","name":"Whiskers","indoor":true}
// {"type":"dog","name":"Rex","breed":"Labrador"}

// Deserialization works correctly:
Animal animal = objectMapper.readValue(json, Animal.class);
// → returns Cat or Dog based on "type" field
```

---

## Common Pitfalls

### 1. LocalDateTime not serialized correctly

```java
// ❌ Without JavaTimeModule — throws exception
ObjectMapper mapper = new ObjectMapper();
mapper.writeValueAsString(LocalDateTime.now());  // error!

// ✓ Register JavaTimeModule
mapper.registerModule(new JavaTimeModule());
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
// → "2024-01-15T10:30:00"
```

### 2. Unknown fields cause exception

```java
// ❌ JSON has field "age" but User class doesn't — throws exception
// ✓ Fix globally
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
// or per class
@JsonIgnoreProperties(ignoreUnknown = true)
```

### 3. Infinite recursion with bidirectional relationships

```java
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    private List<Order> orders;   // Order has reference back to User
}

@Entity
public class Order {
    @ManyToOne
    private User user;            // User has reference back to Order
    // → infinite loop when Jackson serializes!
}

// Fix — break the cycle
@JsonIgnore
private User user;               // ignore back-reference

// or use @JsonManagedReference / @JsonBackReference
public class User {
    @JsonManagedReference
    private List<Order> orders;
}
public class Order {
    @JsonBackReference          // this side is not serialized
    private User user;
}
```

### 4. Enum serialization

```java
public enum Status { ACTIVE, INACTIVE }

// Default → serialized as string name: "ACTIVE"
// To serialize as number:
@JsonValue
public int getCode() { return this.ordinal(); }

// Custom JSON value
public enum Status {
    ACTIVE("active"),
    INACTIVE("inactive");

    @JsonValue
    private final String value;
}
// → "active" instead of "ACTIVE"
```

---

## Jackson vs Gson vs Fastjson2

| | Jackson | Gson | Fastjson2 |
|---|---|---|---|
| Owner | FasterXML | Google | Alibaba |
| Spring Boot default | ✓ | ✗ | ✗ |
| Performance | Fast | Medium | Very fast |
| Annotation support | Rich | Limited | Rich |
| Date/time handling | Via module | Manual | Built-in |
| Streaming API | ✓ | ✓ | ✓ |
| Community | Largest | Large | Large (China) |
| Security history | Good | Good | Had CVEs |
| Best for | Spring apps | Simple projects | High perf / China stack |

---

## Decision Flow

```
Need JSON serialization in Spring Boot?
        ↓
Use Jackson — it is already there, auto-configured
        ↓
Need custom field names?       → @JsonProperty
Need to exclude fields?        → @JsonIgnore / @JsonInclude
Need to handle dates?          → @JsonFormat + JavaTimeModule
Need to ignore unknown fields? → @JsonIgnoreProperties
Need custom logic?             → @JsonSerialize / @JsonDeserialize
Need subclass type info?       → @JsonTypeInfo + @JsonSubTypes
Circular reference?            → @JsonManagedReference / @JsonBackReference
```
