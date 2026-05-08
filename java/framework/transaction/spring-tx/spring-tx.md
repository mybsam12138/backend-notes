# Spring TX (`spring-tx`) — Complete Overview

## What is `spring-tx`?

`spring-tx` is the **transaction management module** of the Spring Framework. It provides a consistent abstraction for transaction management across different transaction APIs (JPA, JDBC, JTA, Hibernate, etc.) and uses **AOP (Aspect-Oriented Programming)** to apply transactions declaratively via annotations.

---

## Maven Dependency

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
</dependency>
```

> With Spring Boot, it is auto-included via:
> - `spring-boot-starter-data-jpa`
> - `spring-boot-starter-jdbc`

---

## What `spring-tx` Provides

### 1. `@Transactional` Annotation

The core annotation that marks a method or class as transactional.

```java
@Service
public class OrderService {

    @Transactional
    public void placeOrder(Order order) {
        inventoryRepo.reduce(order.getItem());
        paymentRepo.charge(order.getAmount());
        orderRepo.save(order);
        // auto commit or rollback
    }
}
```

**Can be applied at:**
- Method level
- Class level (applies to all public methods)

---

### 2. `PlatformTransactionManager` Interface

The core interface that all transaction managers implement.

```java
public interface PlatformTransactionManager {
    TransactionStatus getTransaction(TransactionDefinition definition);
    void commit(TransactionStatus status);
    void rollback(TransactionStatus status);
}
```

**Common Implementations:**

| Implementation | Used With |
|---|---|
| `JpaTransactionManager` | Spring Data JPA / Hibernate |
| `DataSourceTransactionManager` | JDBC / plain SQL |
| `JtaTransactionManager` | Distributed / XA transactions |
| `HibernateTransactionManager` | Hibernate (without JPA) |

---

### 3. `TransactionDefinition` Interface

Defines transaction behavior/properties.

```java
public interface TransactionDefinition {
    int getPropagationBehavior();
    int getIsolationLevel();
    int getTimeout();
    boolean isReadOnly();
    String getName();
}
```

---

### 4. Transaction Propagation

Controls how transactions behave when calling transactional methods from other transactional methods.

| Propagation | Behavior |
|---|---|
| `REQUIRED` *(default)* | Join existing transaction or create new one |
| `REQUIRES_NEW` | Always create a new transaction; suspend existing |
| `NESTED` | Run inside a nested transaction (savepoint) |
| `SUPPORTS` | Join if exists; run non-transactionally if not |
| `NOT_SUPPORTED` | Suspend existing transaction; run non-transactionally |
| `MANDATORY` | Must run inside an existing transaction; throw if none |
| `NEVER` | Must NOT run inside a transaction; throw if one exists |

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void auditLog(String message) {
    // always runs in its own transaction
}
```

---

### 5. Transaction Isolation Levels

Controls visibility of data between concurrent transactions.

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|---|---|---|
| `READ_UNCOMMITTED` | ✅ possible | ✅ possible | ✅ possible |
| `READ_COMMITTED` | ❌ prevented | ✅ possible | ✅ possible |
| `REPEATABLE_READ` | ❌ prevented | ❌ prevented | ✅ possible |
| `SERIALIZABLE` | ❌ prevented | ❌ prevented | ❌ prevented |
| `DEFAULT` | Uses DB default | — | — |

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void criticalOperation() { ... }
```

---

### 6. Rollback Rules

By default, Spring only rolls back on **unchecked exceptions** (`RuntimeException` and `Error`).

```java
// Custom rollback rules
@Transactional(rollbackFor = Exception.class)
public void riskyOperation() throws Exception { ... }

@Transactional(noRollbackFor = IllegalArgumentException.class)
public void partialSafe() { ... }
```

---

### 7. Read-Only Transactions

Hint to the database for optimization (e.g., skip dirty checks in Hibernate).

```java
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    return userRepo.findAll();
}
```

---

### 8. Timeout

Set a time limit for a transaction.

```java
@Transactional(timeout = 30) // 30 seconds
public void longRunningTask() { ... }
```

---

### 9. `TransactionTemplate` (Programmatic Transactions)

For programmatic (non-declarative) transaction control.

```java
@Autowired
private TransactionTemplate transactionTemplate;

public void execute() {
    transactionTemplate.execute(status -> {
        repo.save(entity);
        if (someCondition) {
            status.setRollbackOnly(); // manual rollback
        }
        return null;
    });
}
```

---

### 10. `TransactionInterceptor` (AOP Core)

The AOP advice that intercepts `@Transactional` methods and wraps them with transaction logic.

```
Method Call
     ↓
AOP Proxy (spring-aop)
     ↓
TransactionInterceptor (spring-tx)
     ↓
PlatformTransactionManager
     ↓
BEGIN → method runs → COMMIT or ROLLBACK
```

---

### 11. `TransactionSynchronizationManager`

Allows registering callbacks that run after a transaction commits or rolls back.

```java
TransactionSynchronizationManager.registerSynchronization(
    new TransactionSynchronizationAdapter() {
        @Override
        public void afterCommit() {
            // e.g., send email after successful commit
            emailService.sendConfirmation();
        }
    }
);
```

---

## Full `@Transactional` Attributes Summary

| Attribute | Default | Description |
|---|---|---|
| `propagation` | `REQUIRED` | Transaction propagation behavior |
| `isolation` | `DEFAULT` | Isolation level |
| `timeout` | `-1` (no limit) | Timeout in seconds |
| `readOnly` | `false` | Read-only optimization hint |
| `rollbackFor` | `RuntimeException` | Exception types that trigger rollback |
| `noRollbackFor` | — | Exception types that do NOT trigger rollback |

---

## How AOP Ties It Together

`spring-tx` relies on `spring-aop` to create a **proxy** around your bean:

```
@Service OrderService
        ↓ wrapped by
Spring AOP Proxy
        ↓ uses
TransactionInterceptor   ← from spring-tx
        ↓ delegates to
JpaTransactionManager    ← from spring-orm
        ↓
Database
```

> **Important:** Self-invocation (calling `@Transactional` method from within the same class) bypasses the proxy and the transaction will NOT be applied.

```java
// ❌ Self-invocation — transaction NOT applied
public void methodA() {
    this.methodB(); // bypasses AOP proxy
}

@Transactional
public void methodB() { ... }

// ✅ Call from another bean — transaction IS applied
@Autowired
private MyService myService;

public void methodA() {
    myService.methodB(); // goes through proxy ✅
}
```

---

## Configuration

### Java Config

```java
@Configuration
@EnableTransactionManagement  // enables @Transactional processing
public class AppConfig {

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
}
```

### Spring Boot

Spring Boot auto-configures the transaction manager. Just use `@Transactional` directly — no extra setup needed.

---

## Summary

| Feature | Class/Interface |
|---|---|
| Declarative transactions | `@Transactional` |
| Transaction management abstraction | `PlatformTransactionManager` |
| Transaction properties | `TransactionDefinition` |
| AOP interception | `TransactionInterceptor` |
| Programmatic transactions | `TransactionTemplate` |
| Post-commit hooks | `TransactionSynchronizationManager` |
| Enable annotation processing | `@EnableTransactionManagement` |
