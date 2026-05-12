# Java Generics — Summary & Use Cases

## What Are Generics?

Generics, introduced in **Java 5**, allow you to write classes, interfaces, and methods that work with **any data type** while providing **compile-time type safety**. Instead of hardcoding a specific type, you use a **type parameter** (e.g., `<T>`) as a placeholder that gets resolved when the code is used.

Without generics, you'd rely on `Object` and manual casting — error-prone and verbose. Generics eliminate that.

---

## Core Syntax

### Generic Class

```java
public class Box<T> {
    private T value;

    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

// Usage
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String s = stringBox.get(); // No casting needed
```

### Generic Method

```java
public <T> T getFirst(List<T> list) {
    return list.get(0);
}

String first = getFirst(List.of("A", "B")); // inferred as String
```

### Generic Interface

```java
public interface Comparable<T> {
    int compareTo(T other);
}
```

---

## Type Parameter Naming Conventions

| Letter | Meaning         |
|--------|-----------------|
| `T`    | Type            |
| `E`    | Element (lists) |
| `K`    | Key (maps)      |
| `V`    | Value (maps)    |
| `N`    | Number          |
| `R`    | Return type     |

---

## Bounded Type Parameters

Restrict which types can be used as a type argument.

### Upper Bound (`extends`)

```java
// Accepts Number and any subtype (Integer, Double, etc.)
public <T extends Number> double sum(List<T> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}
```

### Lower Bound (`super`) — Wildcards

```java
// Accepts List<Integer>, List<Number>, List<Object>
public void addNumbers(List<? super Integer> list) {
    list.add(42);
}
```

### Unbounded Wildcard

```java
public void printList(List<?> list) {
    list.forEach(System.out::println);
}
```

---

## Wildcards Summary

| Wildcard         | Meaning                             | Use When              |
|------------------|-------------------------------------|-----------------------|
| `<?>`            | Any type                            | Read-only access      |
| `<? extends T>`  | T or any subtype of T               | Producing/reading     |
| `<? super T>`    | T or any supertype of T             | Consuming/writing     |

> **PECS Principle** — *Producer Extends, Consumer Super*

---

## Use Cases

### 1. Type-Safe Collections (Most Common)

```java
List<String> names = new ArrayList<>();
names.add("Alice");
// names.add(42); // Compile-time error — caught early!
String name = names.get(0); // No cast needed
```

### 2. Reusable Data Structures

```java
public class Pair<A, B> {
    public final A first;
    public final B second;

    public Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }
}

Pair<String, Integer> entry = new Pair<>("Age", 30);
```

### 3. Generic Utility Methods

```java
public static <T> void swap(T[] arr, int i, int j) {
    T temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

Integer[] nums = {1, 2, 3};
swap(nums, 0, 2); // Works for any type
```

### 4. Repository / Service Patterns

```java
public interface Repository<T, ID> {
    T findById(ID id);
    void save(T entity);
    List<T> findAll();
}

public class UserRepository implements Repository<User, Long> { ... }
public class ProductRepository implements Repository<Product, UUID> { ... }
```

### 5. Builder Pattern

```java
public class Builder<T> {
    private T instance;

    public Builder<T> with(Consumer<T> setter) {
        setter.accept(instance);
        return this;
    }

    public T build() { return instance; }
}
```

### 6. Functional Interfaces (Java 8+)

```java
Function<String, Integer>  parse  = Integer::parseInt;
Predicate<String>          notEmpty = s -> !s.isEmpty();
Supplier<List<String>>     newList  = ArrayList::new;
Consumer<String>           printer  = System.out::println;
```

### 7. API Response Wrappers

```java
public class ApiResponse<T> {
    private T data;
    private String message;
    private int statusCode;

    // Used to wrap any response type
}

ApiResponse<User>    userResponse    = new ApiResponse<>();
ApiResponse<List<Product>> products = new ApiResponse<>();
```

---

## Type Erasure

Generics in Java use **type erasure** — type parameters are removed at compile time and replaced with `Object` (or the bound type). This means:

- Generic type info is **not available at runtime**
- You **cannot** do `new T()`, `T[]`, or `instanceof T` directly
- All generic instances share the **same class** at runtime

```java
List<String> strings = new ArrayList<>();
List<Integer> ints   = new ArrayList<>();

// Both are just ArrayList at runtime
System.out.println(strings.getClass() == ints.getClass()); // true
```

---

## Common Pitfalls

| Mistake | Why It Fails |
|--------|--------------|
| `new T()` | Type erased — can't instantiate |
| `T[] arr = new T[10]` | Can't create generic arrays |
| `instanceof List<String>` | Type info lost at runtime |
| Mixing raw types and generics | Bypasses type safety, causes warnings |

### Workaround for instantiation:

```java
// Pass a Class<T> token
public <T> T create(Class<T> clazz) throws Exception {
    return clazz.getDeclaredConstructor().newInstance();
}
```

---

## Benefits at a Glance

| Benefit              | Description                                      |
|----------------------|--------------------------------------------------|
| **Type Safety**      | Errors caught at compile time, not runtime       |
| **No Casting**       | Eliminates manual `(Type)` casts                 |
| **Code Reuse**       | Write once, use with any type                    |
| **Readability**      | Self-documenting — types are explicit            |
| **Interoperability** | Works seamlessly with Java Collections Framework |

---

## Quick Reference

```java
// Generic class
class Container<T> { T item; }

// Generic method
<T> List<T> repeat(T val, int n) { ... }

// Bounded
<T extends Comparable<T>> T max(T a, T b) { ... }

// Wildcard (read)
void print(List<?> list) { ... }

// Wildcard (write)
void fill(List<? super Integer> list) { ... }

// Multiple bounds
<T extends Serializable & Comparable<T>> void process(T val) { ... }
```

---

*Java Generics — write flexible, type-safe, reusable code.*
