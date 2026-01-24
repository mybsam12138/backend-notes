# Maven Scope & Phase Classpath — Practical Summary

> This document summarizes **Maven dependency scopes** and **phase-specific classpaths**, focusing on how Maven decides *when* and *where* a dependency is visible.

---

## 1. Core Concept

**Maven does NOT use a single global classpath.**

Instead, Maven builds **different classpaths for different build phases**, and **dependency scope controls which classpath a dependency appears in**.

Key dimensions:
- **Phase**: compile / test / runtime
- **Visibility**: compile-time, runtime, test-time
- **Transitivity**: whether downstream projects inherit it

---

## 2. Maven Build Phases & Their Classpaths

### 2.1 Compile Classpath

Used when compiling:
```
src/main/java
```

Contains dependencies required to **compile application code**.

Included scopes:
- `compile`
- `provided`

Excluded scopes:
- `runtime`
- `test`

---

### 2.2 Runtime Classpath

Used when running the application:
```
java -jar app.jar
```

Contains dependencies required to **execute application logic**.

Included scopes:
- `compile`
- `runtime`

Excluded scopes:
- `provided`
- `test`

---

### 2.3 Test Classpath

Used when compiling and running:
```
src/test/java
```

This is the **largest classpath**.

Included scopes:
- `compile`
- `provided`
- `runtime`
- `test`

---

## 3. Maven Dependency Scopes

### 3.1 compile (default)

```xml
<dependency>
  <scope>compile</scope> <!-- default -->
</dependency>
```

| Aspect | Value |
|------|------|
| Compile | ✅ |
| Runtime | ✅ |
| Test | ✅ |
| Transitive | ✅ |

Typical use:
- Spring Framework
- Jackson
- Core libraries

---

### 3.2 provided

```xml
<dependency>
  <scope>provided</scope>
</dependency>
```

| Aspect | Value |
|------|------|
| Compile | ✅ |
| Runtime | ❌ |
| Test | ✅ |
| Transitive | ❌ |

Meaning:
- Needed to compile
- Provided by the runtime environment

Typical use:
- Servlet API (traditional WAR)
- Application server APIs

---

### 3.3 runtime

```xml
<dependency>
  <scope>runtime</scope>
</dependency>
```

| Aspect | Value |
|------|------|
| Compile | ❌ |
| Runtime | ✅ |
| Test | ✅ |
| Transitive | ✅ |

Meaning:
- Not referenced in source code
- Required when application runs

Typical use:
- JDBC drivers
- Logging implementations

---

### 3.4 test

```xml
<dependency>
  <scope>test</scope>
</dependency>
```

| Aspect | Value |
|------|------|
| Compile | ❌ |
| Runtime | ❌ |
| Test | ✅ |
| Transitive | ❌ |

Typical use:
- JUnit
- Mockito
- AssertJ

---

### 3.5 system (avoid)

```xml
<dependency>
  <scope>system</scope>
  <systemPath>/path/to/local.jar</systemPath>
</dependency>
```

Characteristics:
- Hard-coded local path
- Not portable
- Breaks CI/CD

> ❌ Almost always wrong

---

### 3.6 import (BOM only)

```xml
<dependency>
  <type>pom</type>
  <scope>import</scope>
</dependency>
```

Used only inside `<dependencyManagement>`.

Purpose:
- Import dependency versions
- Does NOT add a dependency to classpath

---

## 4. Scope vs Optional (Important Distinction)

| Concept | Controls |
|------|---------|
| scope | **When** a dependency is visible |
| optional | **Whether** downstream projects inherit it |

### Example (annotation processors)

```xml
<dependency>
  <artifactId>spring-boot-configuration-processor</artifactId>
  <optional>true</optional>
</dependency>
```

- Still on compile classpath
- Not inherited by downstream users

---

## 5. Practical Rules of Thumb

- **If you import classes → must be on compile classpath**
- **If implementation is discovered dynamically → runtime**
- **If only for tests → test**
- **If container provides it → provided (rare in Spring Boot)**
- **If build-time only (Lombok, processors) → optional=true**

---

## 6. Spring Boot–Specific Notes

- Spring Boot **starters** manage scopes for you
- Embedded containers mean:
  - Servlet API is required at runtime
  - You should NOT declare `jakarta.servlet-api` manually
- JDBC drivers are `runtime` because JDBC is an SPI

---

## 7. One-Sentence Summary

> **Maven scope defines *when* a dependency appears; Maven phase classpaths define *where* it is visible. Together, they control compilation, execution, and dependency propagation.**

---

End of document.

