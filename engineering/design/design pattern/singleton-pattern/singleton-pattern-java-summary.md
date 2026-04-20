# Singleton Pattern in Java

## What Is the Singleton Pattern?

The **Singleton Pattern** is a creational design pattern that ensures:

1. A class has **only one instance**
2. That instance is **globally accessible**

It is commonly used when exactly one shared object is needed, such as:

- configuration manager
- logger
- cache manager
- thread pool manager
- application context holder

---

## Why Use It?

The Singleton Pattern is useful when:

- you want to avoid creating multiple instances of the same class
- you need a shared resource across the whole application
- you want controlled access to a single object

---

## Core Idea

A singleton class usually has:

- a **private constructor** so other classes cannot create objects directly
- a **private static instance**
- a **public static method** to return that single instance

---

## 1. Basic Eager Initialization

This creates the instance when the class is loaded.

```java
public class EagerSingleton {

    private static final EagerSingleton INSTANCE = new EagerSingleton();

    private EagerSingleton() {
    }

    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

### Advantages

- simple
- thread-safe because class loading is thread-safe

### Disadvantages

- instance is created even if it is never used

---

## 2. Basic Lazy Initialization (Not Thread-Safe)

This creates the instance only when needed.

```java
public class LazySingleton {

    private static LazySingleton instance;

    private LazySingleton() {
    }

    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}
```

### Advantages

- instance is created only when needed

### Disadvantages

- **not thread-safe**
- multiple threads may create multiple instances at the same time

---

## 3. Synchronized Lazy Singleton

A simple thread-safe version.

```java
public class SynchronizedSingleton {

    private static SynchronizedSingleton instance;

    private SynchronizedSingleton() {
    }

    public static synchronized SynchronizedSingleton getInstance() {
        if (instance == null) {
            instance = new SynchronizedSingleton();
        }
        return instance;
    }
}
```

### Advantages

- thread-safe
- simple to understand

### Disadvantages

- `synchronized` on every call can reduce performance

---

## 4. Double-Checked Locking (Recommended Classic Approach)

This improves performance by synchronizing only when the instance is first created.

```java
public class DoubleCheckedSingleton {

    private static volatile DoubleCheckedSingleton instance;

    private DoubleCheckedSingleton() {
    }

    public static DoubleCheckedSingleton getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckedSingleton.class) {
                if (instance == null) {
                    instance = new DoubleCheckedSingleton();
                }
            }
        }
        return instance;
    }
}
```

### Why `volatile` Is Important

Without `volatile`, instruction reordering may cause another thread to see a partially constructed object.

### Advantages

- thread-safe
- better performance than synchronizing the whole method

### Disadvantages

- a bit more complex

---

## 5. Static Inner Class (Recommended)

This is one of the best implementations in Java.

```java
public class InnerClassSingleton {

    private InnerClassSingleton() {
    }

    private static class Holder {
        private static final InnerClassSingleton INSTANCE = new InnerClassSingleton();
    }

    public static InnerClassSingleton getInstance() {
        return Holder.INSTANCE;
    }
}
```

### Why It Works

The inner static class is not loaded until `getInstance()` is called.

### Advantages

- lazy initialization
- thread-safe
- no explicit synchronization
- clean and efficient

### Disadvantages

- less intuitive for beginners

---

## 6. Enum Singleton (Best in Many Cases)

This is the safest and simplest way in modern Java.

```java
public enum EnumSingleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("Doing something...");
    }
}
```

Usage:

```java
public class Main {
    public static void main(String[] args) {
        EnumSingleton.INSTANCE.doSomething();
    }
}
```

### Advantages

- thread-safe by default
- protects against reflection attacks
- protects against serialization issues
- very simple

### Disadvantages

- cannot lazily initialize in the same style as class-based singleton
- some developers feel it is less flexible

---

## Common Problems with Singleton

### 1. Reflection Attack

Reflection can break a normal singleton by calling the private constructor.

Example:

```java
import java.lang.reflect.Constructor;

public class ReflectionTest {
    public static void main(String[] args) throws Exception {
        InnerClassSingleton s1 = InnerClassSingleton.getInstance();

        Constructor<InnerClassSingleton> constructor =
                InnerClassSingleton.class.getDeclaredConstructor();
        constructor.setAccessible(true);

        InnerClassSingleton s2 = constructor.newInstance();

        System.out.println(s1 == s2); // false
    }
}
```

### 2. Serialization Problem

When a singleton object is serialized and deserialized, a new object may be created.

Example fix using `readResolve()`:

```java
import java.io.Serializable;

public class SerializableSingleton implements Serializable {

    private static final long serialVersionUID = 1L;

    private SerializableSingleton() {
    }

    private static class Holder {
        private static final SerializableSingleton INSTANCE = new SerializableSingleton();
    }

    public static SerializableSingleton getInstance() {
        return Holder.INSTANCE;
    }

    private Object readResolve() {
        return getInstance();
    }
}
```

---

## Recommended Choice

In most Java projects:

- use **Enum Singleton** if you want the safest and simplest solution
- use **Static Inner Class Singleton** if you prefer a classic class-based design
- use **Double-Checked Locking** if you want explicit control and understand concurrency well

---

## Complete Demo Example

```java
public class ConfigManager {

    private ConfigManager() {
        System.out.println("ConfigManager created");
    }

    private static class Holder {
        private static final ConfigManager INSTANCE = new ConfigManager();
    }

    public static ConfigManager getInstance() {
        return Holder.INSTANCE;
    }

    public String getConfig(String key) {
        if ("env".equals(key)) {
            return "production";
        }
        return "unknown";
    }
}
```

Test:

```java
public class Main {
    public static void main(String[] args) {
        ConfigManager c1 = ConfigManager.getInstance();
        ConfigManager c2 = ConfigManager.getInstance();

        System.out.println(c1 == c2); // true
        System.out.println(c1.getConfig("env")); // production
    }
}
```

---

## When Not to Overuse Singleton

Do not use Singleton everywhere. It can cause problems such as:

- hidden global state
- hard-to-test code
- tight coupling
- difficulty in dependency injection

In modern enterprise Java projects, many singleton-like needs are often handled by frameworks such as Spring through managed beans.

---

## Quick Comparison Table

| Implementation | Lazy | Thread-Safe | Simple | Recommended |
|---|---|---:|---:|---:|
| Eager Initialization | No | Yes | Yes | Sometimes |
| Lazy Initialization | Yes | No | Yes | No |
| Synchronized Method | Yes | Yes | Yes | Acceptable |
| Double-Checked Locking | Yes | Yes | Medium | Yes |
| Static Inner Class | Yes | Yes | Yes | Yes |
| Enum Singleton | No in usual class style | Yes | Very Yes | Best in many cases |

---

## Final Summary

The Singleton Pattern ensures that a class has only one instance and provides a global access point to it.

In Java, the most practical implementations are:

- **Static Inner Class Singleton**
- **Enum Singleton**

For interviews and real projects, it is important not only to know the code, but also to understand:

- thread safety
- lazy loading
- serialization issues
- reflection attacks
- when Singleton is useful and when it should be avoided
