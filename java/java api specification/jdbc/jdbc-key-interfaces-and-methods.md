# JDBC Key Interfaces and Their Core Methods

This article summarizes the **most important JDBC interfaces** and their **key methods**, focusing on what each method is responsible for and why it exists.  
It also explains **how JDBC transactions and different statement types actually work**, which are common sources of confusion.

Understanding these points is enough to read JDBC-related source code and to understand how higher-level frameworks work internally.

---

## 1. `java.sql.Driver` — Database Driver Entry Point

### Role
- SPI interface implemented by database vendors
- Responsible for creating physical database connections
- Knows database protocol, authentication, and URL parsing

### Key Method

```java
Connection connect(String url, Properties info)
```

**Purpose**
- Establishes a physical connection to the database
- Returns a JDBC `Connection` implementation

**Key points**
- Called by `DriverManager` or connection pools
- Does not manage pooling or transactions
- Executes database handshake and authentication

---

## 2. `javax.sql.DataSource` — Connection Factory

### Role
- Standard entry point for applications and frameworks
- Replaces `DriverManager` in enterprise applications
- Abstracts pooling, credentials, and routing

### Key Methods

```java
Connection getConnection()
Connection getConnection(String username, String password)
```

**Purpose**
- Returns a logical `Connection`
- May reuse pooled connections internally

**Key points**
- Implemented by connection pools (HikariCP, DBCP, Druid)
- Does NOT implement database protocol
- Manages lifecycle, not SQL execution

---

## 3. `java.sql.Connection` — Session and Transaction Control

### Role
- Represents a logical database session
- Controls transaction behavior
- Creates statements

### Key Methods

```java
setAutoCommit(boolean autoCommit)
commit()
rollback()
setReadOnly(boolean readOnly)
prepareStatement(String sql)
createStatement()
prepareCall(String sql)
```

### What these methods really mean

- `setAutoCommit(true)`  
  Each SQL statement runs in its own implicit transaction and is committed automatically.

- `setAutoCommit(false)`  
  Multiple SQL statements run in the same transaction until `commit()` or `rollback()` is called.

- `commit()` / `rollback()`  
  End the current transaction and finalize or discard changes.

- `setReadOnly(true)`  
  Declares transactional intent for read-only operations; enforcement and optimization depend on the database.

- `prepareCall(String sql)`  
  Creates a `CallableStatement` for invoking stored procedures or functions.

**Important clarification**

> JDBC does NOT explicitly start transactions.  
> A transaction is started implicitly by the database when the first SQL statement is executed.

---

## 4. JDBC Statement Types Overview

JDBC defines **three statement types**, each serving a different purpose:

```text
Statement
   └─ PreparedStatement
         └─ CallableStatement
```

---

## 5. `java.sql.Statement` — Basic SQL Execution

### Role
- Executes static SQL strings
- Returns results or update counts

### Key Methods

```java
ResultSet executeQuery(String sql)
int executeUpdate(String sql)
boolean execute(String sql)
```

### Method differences

- `executeQuery`  
  Used for `SELECT` statements and returns a `ResultSet`.

- `executeUpdate`  
  Used for `INSERT`, `UPDATE`, `DELETE`, and DDL statements and returns the number of affected rows.

- `execute`  
  Used when the SQL type is unknown in advance.  
  Returns a boolean indicating whether a `ResultSet` is available, requiring a follow-up call to `getResultSet()` or `getUpdateCount()`.

**Key point**
- `execute()` does NOT start a transaction.
- It only sends SQL to the database.
- Transaction start is handled implicitly by the database engine.

---

## 6. `java.sql.PreparedStatement` — Parameterized SQL Execution

### Role
- Executes precompiled SQL with parameters
- Separates SQL structure from data

### Key Methods

```java
setInt(int index, int value)
setString(int index, String value)
executeQuery()
executeUpdate()
```

**Purpose**
- Prevents SQL injection
- Enables execution plan reuse
- Improves performance and safety

**Key points**
- SQL structure is fixed
- Parameters are sent as typed data, not executable SQL
- Default statement type used by frameworks like MyBatis

---

## 7. `java.sql.CallableStatement` — Stored Procedure Invocation

### Role
- Invokes stored procedures or database functions
- Supports IN, OUT, and INOUT parameters

### How it is created

```java
CallableStatement cs = connection.prepareCall("{CALL proc_name(?, ?)}");
```

### Key Methods

```java
registerOutParameter(int index, int sqlType)
getInt(int index)
getString(int index)
execute()
```

### Key characteristics

- Extends `PreparedStatement`
- Allows bidirectional parameter binding
- Can return:
  - OUT parameters
  - update counts
  - result sets
- Required for calling stored procedures

### Framework behavior (MyBatis / MyBatis-Flex)

- Default statement type is `PreparedStatement`
- Stored procedures require explicit configuration:
  ```xml
  statementType="CALLABLE"
  ```
- Parameter modes (`IN`, `OUT`, `INOUT`) must be declared manually

**Key insight**

> Callable statements are intentionally less abstracted because stored procedures are database-specific and opaque to frameworks.

---

## 8. How JDBC Transactions Actually Work

A common misunderstanding is expecting JDBC to explicitly start transactions.

### The real model

- There is **no JDBC API to start a transaction**
- Transactions are started implicitly by the database on the first SQL statement
- JDBC controls **when a transaction ends**, not when it begins

### Example (auto-commit enabled)

```text
BEGIN
SQL
COMMIT
```

### Example (auto-commit disabled)

```text
BEGIN
SQL 1
SQL 2
COMMIT / ROLLBACK
```

---

## 9. Responsibility Overview

```text
Driver              → database protocol & connection creation
DataSource          → connection factory & pooling
Connection          → transaction boundaries and session state
Statement           → basic SQL execution
PreparedStatement   → safe, parameterized SQL execution
CallableStatement   → stored procedure invocation
```

Frameworks like Spring and MyBatis orchestrate these interfaces but do not replace them.

---

## 10. Final Takeaway

> JDBC separates responsibilities clearly: drivers implement database behavior, `DataSource` provides connections, `Connection` controls transaction boundaries, and different statement types handle SQL execution based on their semantics.

Understanding this model removes much of the mystery around JDBC, transactions, and higher-level frameworks.
