# JDBC Demystified: Core Interfaces and the Role of DriverManager

Many developers use JDBC daily through frameworks like Spring, MyBatis, or Hibernate, yet still feel JDBC is "magic".
The main reason is a misunderstanding of **what is an interface**, **what is a utility**, and **who actually implements database behavior**.

This article explains JDBC by clearly separating **core interfaces** from **supporting utility classes**, and by showing **who implements what**.

**Help:**
Understanding JDBC interfaces clarifies how databases execute SQL and 
provides a solid foundation for understanding and reading the source code of ORM and datasource frameworks.

---

## 1. JDBC Is a Contract, Not a Framework

JDBC itself does **not** connect to databases.

JDBC is:
- A **set of interfaces defined by the JDK**
- A **contract** that database vendors implement
- A stable boundary between applications and databases

All real database work is performed by **JDBC drivers**, not by JDBC itself.

---

## 2. The Five Core JDBC Interfaces (The Real Abstractions)

These interfaces define all essential JDBC behavior.

### 2.1 `java.sql.Driver` — Driver SPI Interface

**Responsibility**
- Defines how to connect to a specific database
- Acts as the **SPI entry point** for JDBC drivers

**Implemented by**
- MySQL, PostgreSQL, Oracle drivers

**Key method**
```java
Connection connect(String url, Properties info);
```

**Key insight**
> `Driver` defines *how* to talk to the database, not *when* to do so.

---

### 2.2 `javax.sql.DataSource` — Connection Factory Interface

**Responsibility**
- Factory for obtaining `Connection`
- Standard entry point for enterprise and framework usage
- Abstracts pooling, authentication, and transactions

**Implemented by**
- HikariCP
- DBCP
- Druid
- Application servers

**Key method**
```java
Connection getConnection();
```

**Key insight**
> `DataSource` creates connections but does not implement database protocol logic.

---

### 2.3 `java.sql.Connection` — Session and Transaction Interface

**Responsibility**
- Represents a logical database session
- Defines transaction boundaries
- Creates SQL statements

**Implemented by**
- JDBC drivers (vendor implementations)

**Key methods**
```java
setAutoCommit(boolean);
commit();
rollback();
prepareStatement(String sql);
```

**Key insight**
> `Connection` is **not thread-safe** and represents a single database session.

---

### 2.4 `java.sql.Statement` — SQL Execution Interface

**Responsibility**
- Executes SQL statements
- Returns update counts or result sets

**Implemented by**
- JDBC drivers

**Key methods**
```java
executeQuery();
executeUpdate();
execute();
```

---

### 2.5 `java.sql.PreparedStatement` — Precompiled SQL Interface

**Responsibility**
- Executes parameterized SQL
- Prevents SQL injection
- Improves performance through precompilation

**Implemented by**
- JDBC drivers

**Key insight**
> `PreparedStatement` exists for safety and performance, not convenience.

---

## 3. `DriverManager` Is NOT an Interface

A common misunderstanding is treating `DriverManager` as a JDBC abstraction.

### What `DriverManager` really is

- A **concrete utility class**
- Provided by the **JDK**
- Contains mostly static methods
- NOT implemented by database drivers

### Responsibility
- Discovers JDBC drivers
- Selects the correct driver based on JDBC URL
- Delegates connection creation

### Key method
```java
Connection getConnection(String url, Properties info);
```

### Key insight
> `DriverManager` coordinates drivers; it does not define database behavior.

Internally, `DriverManager` uses **Java SPI (`ServiceLoader`)** to load drivers lazily.

---

## 4. Who Implements What (Critical Clarification)

Understanding JDBC requires a correct responsibility mapping.

### Implemented by JDBC drivers
- `Driver`
- `Connection`
- `Statement`
- `PreparedStatement`
- `ResultSet`

### Implemented by infrastructure libraries
- `DataSource`

### Provided by the JDK
- JDBC interfaces
- `DriverManager`

### Common misconceptions
- ❌ Drivers do NOT implement `DriverManager`
- ❌ `DataSource` does NOT implement `Connection`

This separation is **intentional and fundamental**.

---

## 5. The Complete Responsibility Chain

```text
Driver           → database protocol & execution
DriverManager    → driver discovery and delegation
DataSource       → connection factory and pooling
Connection       → session and transaction scope
Statement        → SQL execution
```

Frameworks like Spring and MyBatis only **orchestrate** this chain; they do not change it.

---

## 6. Why This Model Matters

Once this separation is clear:
- JDBC driver loading stops being mysterious
- Connection pools become understandable
- Spring and MyBatis source code becomes predictable
- Debugging database issues becomes much easier

---

## 7. Final Takeaway

> JDBC works because responsibilities are strictly separated: drivers implement database behavior, `DriverManager` coordinates discovery, `DataSource` provides connections, and interfaces like `Connection` and `Statement` define execution boundaries.

Understanding this model is the key to reading JDBC, Spring, and ORM source code with confidence.
