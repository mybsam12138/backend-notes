# JPA vs Hibernate vs Spring Data JPA

---

## 1. What Each One Is
```
| | Type | Role |
|--|--|--|
| **JPA** | Specification | defines the rules, annotations, interfaces |
| **Hibernate** | Implementation | actually executes the SQL |
| **Spring Data JPA** | Library | convenience layer on top of JPA |
```
---

## 2. Layer Overview

```
Your Code
    ↓
Spring Data JPA   → JpaRepository, empRepo.save(), findById()
    ↓
JPA (spec)        → EntityManager, @Entity, @OneToMany, CascadeType
    ↓
Hibernate         → dirty checking, flush, session, actual SQL
    ↓
JDBC
    ↓
Database
```

---

## 3. Who Owns What

| Concept | Owner |
|---------|-------|
| `@Entity`, `@OneToMany`, `@ManyToMany` | JPA |
| `CascadeType`, `FetchType` | JPA |
| Entity states (New, Managed, Detached, Removed) | JPA |
| `EntityManager` | JPA |
| Dirty checking, flush, first-level cache | Hibernate |
| `Session`, `SessionFactory` | Hibernate |
| `JpaRepository`, `CrudRepository` | Spring Data JPA |
| `empRepo.save()`, `findById()`, `findBy...()` | Spring Data JPA |

---

## 4. In Practice (Spring Boot)

```java
// What you write daily — Spring Data JPA
public interface EmployeeRepository extends JpaRepository<Employee, Long> {}

empRepo.save(emp);        // → em.persist() → Hibernate INSERT
empRepo.findById(id);     // → em.find()    → Hibernate SELECT
empRepo.delete(emp);      // → em.remove()  → Hibernate DELETE
```

> You write Spring Data JPA → it calls JPA → Hibernate does the work.  
> You rarely touch `EntityManager` or `Session` directly.

---

## 5. When to Drop Down

```java
// Need JPA directly — custom queries
@PersistenceContext
EntityManager em;
em.createQuery("SELECT e FROM Employee e WHERE ...").getResultList();

// Need Hibernate directly — Hibernate-specific features only
Session session = em.unwrap(Session.class);
```

---

## 6. The Naming Confusion

| What people say | What they actually use |
|-----------------|----------------------|
| "I use JPA" | Spring Data JPA + Hibernate + JPA |
| "I use Hibernate" | Spring Data JPA + Hibernate + JPA |
| "I use Spring Data JPA" | Spring Data JPA + Hibernate + JPA |

> In Spring Boot, all three always come together via `spring-boot-starter-data-jpa`.
