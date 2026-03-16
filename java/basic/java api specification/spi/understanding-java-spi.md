# Understanding Java SPI (Service Provider Interface)

When reading JDBC, Spring, or JDK source code, you will frequently encounter  
`ServiceLoader`, `META-INF/services`, and *driver auto-discovery*.

This article summarizes **what Java SPI really is**, **why it exists**, and **how it works internally**, without treating it as magic.

**Business Help:**
Understanding SPI helps engineers read and understand framework source code more effectively, and enables the design of clean,
extensible plugin mechanisms when building pure Java utilities or libraries.

---

## 1. What is SPI?

**SPI (Service Provider Interface)** is a Java mechanism that allows:

- One module (or JAR) to **define an interface**
- Other modules (or JARs) to **provide implementations**
- The application to **discover implementations at runtime**
- **Without compile-time dependency on implementations**

In short:

> **SPI decouples interfaces from implementations across JAR boundaries.**

---

## 2. The Core Design Idea

The key SPI principle is:

> **The interface belongs to the consumer, the implementation belongs to the provider.**

This design enables:
- Plugin architectures
- Optional implementations
- Late binding at runtime

SPI is widely used in:
- JDBC drivers
- Logging frameworks
- Security providers
- Charset / locale providers

---

## 3. Fully Qualified Class Name (FQCN)

**Fully Qualified Class Name** means:

> **Package name + class name**

Example:

```java
java.sql.Driver
```

SPI requires fully qualified class names to avoid ambiguity.

---

## 4. SPI Directory Structure

SPI uses a strict convention:

```text
META-INF/services/<service-interface-fqcn>
```

Example:

```text
META-INF/services/java.sql.Driver
```

File content:

```text
com.mysql.cj.jdbc.Driver
```

- File name = interface FQCN
- File content = implementation FQCN(s)

---

## 5. How ServiceLoader Works

When code calls:

```java
ServiceLoader.load(Driver.class);
```

Java will:

1. Build resource path  
   `META-INF/services/java.sql.Driver`
2. Iterate over classpath entries (directories + JARs)
3. Read implementation class names
4. Load classes lazily
5. Instantiate via no-arg constructor

No full classpath scanning happens.

---

## 6. Static Blocks and SPI

Static blocks alone are not enough:

```java
static {
    DriverManager.registerDriver(new MySqlDriver());
}
```

Static code runs **only after class loading**.

SPI solves this by:
1. Discovering the class via `ServiceLoader`
2. Triggering class loading
3. Executing static initialization

---

## 7. Cross-JAR Design

SPI is designed for **cross-JAR extensibility**.

Typical layout:

```text
api.jar
 └── com.example.spi.PaymentService

impl-alipay.jar
 ├── com.example.impl.AlipayPaymentService
 └── META-INF/services/com.example.spi.PaymentService
```

The application depends only on the API.

---

## 8. JDBC and Spring Boot

Spring Boot does **not** register JDBC drivers.

Flow:

```text
Application → DriverManager → ServiceLoader → Driver loaded → Registered
```

Driver discovery is handled by the JDK via SPI.

---

## 9. Key Takeaways

- SPI is lazy and demand-driven
- File name = interface FQCN
- File content = implementation FQCN
- Designed for cross-JAR plugin architectures

---

## Summary

> Java SPI allows applications to discover implementations across JAR boundaries at runtime using the interface’s fully qualified class name as a stable service identifier.
