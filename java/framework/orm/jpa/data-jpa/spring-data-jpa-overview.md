# Spring Data JPA — Overview

## What is Spring Data JPA?

Spring Data JPA is a Spring framework layer that sits **on top of JPA** (and therefore on top of Hibernate). It eliminates boilerplate repository code by auto-generating implementations from interface definitions and method names.

```
Your Code
    ↓
Spring Data JPA      ← auto-generates CRUD, query methods, pagination
    ↓
JPA API              ← EntityManager, JPQL
    ↓
Hibernate            ← SessionImpl, SQL generation, dirty check, flush
    ↓
JDBC
    ↓
Database
```

---

## What Spring Data JPA Provides

### 1. Repository Abstraction

The core idea — define an interface, Spring generates the implementation automatically.

```java
// You write only this — no implementation needed
public interface UserRepository extends JpaRepository<User, Long> {
}

// Spring Data JPA auto-generates:
// save(), findById(), findAll(), delete(), count(), existsById()... etc.
```

#### Repository hierarchy

```
Repository                        ← marker interface (top)
    ↓
CrudRepository                    ← basic CRUD (save, findById, delete...)
    ↓
PagingAndSortingRepository        ← adds pagination and sorting
    ↓
JpaRepository                     ← adds JPA-specific (flush, saveAll, deleteInBatch...)
```

| Interface | Key methods added |
|---|---|
| `CrudRepository` | `save()`, `findById()`, `findAll()`, `delete()`, `count()` |
| `PagingAndSortingRepository` | `findAll(Pageable)`, `findAll(Sort)` |
| `JpaRepository` | `flush()`, `saveAllAndFlush()`, `deleteAllInBatch()`, `getReferenceById()` |

---

### 2. Query Methods (Derived Queries)

Spring parses method names and auto-generates the SQL — no `@Query` needed.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // WHERE status = ?
    List<User> findByStatus(String status);

    // WHERE age > ? AND status = ?
    List<User> findByAgeGreaterThanAndStatus(int age, String status);

    // WHERE name LIKE ?
    List<User> findByNameContaining(String keyword);

    // WHERE email = ? ORDER BY name ASC
    List<User> findByEmailOrderByNameAsc(String email);

    // WHERE status = ? LIMIT 1
    Optional<User> findFirstByStatus(String status);

    // COUNT WHERE status = ?
    long countByStatus(String status);

    // DELETE WHERE status = ?
    void deleteByStatus(String status);

    // EXISTS WHERE email = ?
    boolean existsByEmail(String email);
}
```

#### Supported keywords

| Keyword | Example | SQL |
|---|---|---|
| `findBy` | `findByName` | `WHERE name = ?` |
| `And` | `findByNameAndAge` | `WHERE name = ? AND age = ?` |
| `Or` | `findByNameOrEmail` | `WHERE name = ? OR email = ?` |
| `GreaterThan` | `findByAgeGreaterThan` | `WHERE age > ?` |
| `LessThan` | `findByAgeLessThan` | `WHERE age < ?` |
| `Between` | `findByAgeBetween` | `WHERE age BETWEEN ? AND ?` |
| `Like` | `findByNameLike` | `WHERE name LIKE ?` |
| `Containing` | `findByNameContaining` | `WHERE name LIKE '%?%'` |
| `StartingWith` | `findByNameStartingWith` | `WHERE name LIKE '?%'` |
| `In` | `findByStatusIn` | `WHERE status IN (...)` |
| `IsNull` | `findByEmailIsNull` | `WHERE email IS NULL` |
| `OrderBy` | `findByStatusOrderByName` | `ORDER BY name ASC` |
| `Top/First` | `findTop3ByStatus` | `LIMIT 3` |

---

### 3. `@Query` — Custom JPQL or Native SQL

When method names get too complex, write the query directly.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // JPQL query
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.age > :age")
    List<User> findActiveAdults(@Param("status") String status, @Param("age") int age);

    // Native SQL query
    @Query(value = "SELECT * FROM user WHERE status = :status", nativeQuery = true)
    List<User> findByStatusNative(@Param("status") String status);

    // Modifying query (UPDATE / DELETE)
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
```

---

### 4. Pagination and Sorting

Built-in — no extra code needed.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByStatus(String status, Pageable pageable);
}

// Usage
Pageable pageable = PageRequest.of(
    0,                          // page number (0-based)
    10,                         // page size
    Sort.by("name").ascending() // sort
);

Page<User> page = userRepository.findByStatus("ACTIVE", pageable);

page.getContent();        // List<User> — current page data
page.getTotalElements();  // total count
page.getTotalPages();     // total pages
page.getNumber();         // current page number
page.hasNext();           // boolean
```

---

### 5. Projection

Load only specific fields instead of full entities.

```java
// Interface projection — Spring generates SELECT name, email only
public interface UserSummary {
    String getName();
    String getEmail();
}

List<UserSummary> findByStatus(String status);
// → SELECT u.name, u.email FROM user u WHERE u.status = ?

// DTO projection — map directly to a DTO class
@Query("SELECT new com.example.UserDto(u.name, u.email) FROM User u WHERE u.status = :status")
List<UserDto> findUserDtos(@Param("status") String status);
```

---

### 6. Auditing

Auto-populate created/updated timestamps and user info.

```java
// Enable in main class
@SpringBootApplication
@EnableJpaAuditing
public class Application { }

// Entity
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @CreatedDate
    private LocalDateTime createdAt;      // auto-set on INSERT

    @LastModifiedDate
    private LocalDateTime updatedAt;      // auto-set on UPDATE

    @CreatedBy
    private String createdBy;             // auto-set from SecurityContext

    @LastModifiedBy
    private String updatedBy;
}
```

---

### 7. Specifications (Dynamic Queries)

Build complex dynamic queries programmatically — JPA Criteria API wrapped nicely.

```java
public class UserSpec {
    public static Specification<User> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<User> olderThan(int age) {
        return (root, query, cb) -> cb.greaterThan(root.get("age"), age);
    }
}

// Combine at runtime
Specification<User> spec = UserSpec.hasStatus("ACTIVE")
                            .and(UserSpec.olderThan(18));

List<User> users = userRepository.findAll(spec);
// WHERE status = 'ACTIVE' AND age > 18
```

Requires repository to extend `JpaSpecificationExecutor<T>`:
```java
public interface UserRepository extends JpaRepository<User, Long>,
                                         JpaSpecificationExecutor<User> { }
```

---

### 8. Entity Lifecycle Callbacks

Hook into JPA entity events.

```java
@Entity
public class User {

    @PrePersist
    public void beforeInsert() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void beforeUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PostLoad
    public void afterLoad() {
        // fires after entity is loaded from DB
    }

    @PostPersist
    public void afterInsert() {
        // fires after INSERT committed
    }
}
```

| Callback | Fires when |
|---|---|
| `@PrePersist` | Before INSERT |
| `@PostPersist` | After INSERT |
| `@PreUpdate` | Before UPDATE |
| `@PostUpdate` | After UPDATE |
| `@PreRemove` | Before DELETE |
| `@PostRemove` | After DELETE |
| `@PostLoad` | After entity loaded from DB |

---

### 9. Custom Repository Implementation

When built-in methods aren't enough — add your own implementation.

```java
// 1. Define custom interface
public interface UserRepositoryCustom {
    List<User> findByComplexCondition(UserFilter filter);
}

// 2. Implement it
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> findByComplexCondition(UserFilter filter) {
        // write any custom JPA / JPQL / native logic here
    }
}

// 3. Extend both in your repository
public interface UserRepository extends JpaRepository<User, Long>,
                                         UserRepositoryCustom { }
```

---

## Full Feature Map

| Feature | Annotation / API | Who owns it |
|---|---|---|
| Auto CRUD | `JpaRepository` | Spring Data JPA |
| Derived query methods | Method naming convention | Spring Data JPA |
| Custom JPQL | `@Query` | Spring Data JPA |
| Native SQL | `@Query(nativeQuery=true)` | Spring Data JPA |
| Pagination | `Pageable`, `Page` | Spring Data JPA |
| Sorting | `Sort` | Spring Data JPA |
| Interface projection | Return type interface | Spring Data JPA |
| DTO projection | `new Dto()` in JPQL | JPA spec |
| Auditing | `@CreatedDate`, `@LastModifiedDate` | Spring Data JPA |
| Specifications | `Specification<T>` | Spring Data JPA (wraps JPA Criteria) |
| Entity callbacks | `@PrePersist`, `@PostLoad` etc. | JPA spec |
| Dirty checking | Automatic at flush | JPA spec / Hibernate |
| L1 Cache | Persistence context | JPA spec / Hibernate |
| Locking | `@Lock`, `@Version` | JPA spec / Hibernate |
| Transaction | `@Transactional` | Spring |

---

## What Spring Data JPA Does NOT provide

| Concern | Go to instead |
|---|---|
| Connection pooling | HikariCP (auto-configured by Spring Boot) |
| SQL generation | Hibernate |
| Dirty checking | Hibernate |
| L1 / L2 cache | JPA spec / Hibernate |
| Schema migration | Flyway or Liquibase |
| Redis / external cache | Spring Cache + Redis |
| Batch processing large data | Spring Batch |
