# N+1 Problem in JPA

> N+1 = 1 query to load parents + N queries to load each parent's children

---

## 1. The Problem

```java
// 1 query → SELECT * FROM departments (returns 10 depts)
List<Department> depts = deptRepo.findAll();

// N queries → SELECT * FROM employees WHERE department_id = ?
// fired 10 times, one per department!
depts.forEach(d -> d.getEmployees().size());

// Total: 1 + 10 = 11 queries ❌
```

> Happens because `@OneToMany` is `LAZY` by default —
> children are only loaded when accessed.

---

## 2. Fixes

### Fix 1 — JOIN FETCH (Most Common)

```java
// JPA / Hibernate
em.createQuery(
    "SELECT d FROM Department d JOIN FETCH d.employees", Department.class)
    .getResultList();
// → 1 query with JOIN ✅

// Spring Data JPA
@Query("SELECT d FROM Department d JOIN FETCH d.employees")
List<Department> findAllWithEmployees();
```

### Fix 2 — @EntityGraph (Spring Data JPA)

```java
@EntityGraph(attributePaths = {"employees"})
@Query("SELECT d FROM Department d")
List<Department> findAllWithEmployees();
// → 1 query with LEFT JOIN ✅
```

### Fix 3 — @BatchSize (Hibernate)

```java
@OneToMany(mappedBy = "department")
@BatchSize(size = 10)          // Hibernate-specific
List<Employee> employees;
// → instead of N queries, loads in batches
// → SELECT * FROM employees WHERE department_id IN (?, ?, ?, ...)
```

### Fix 4 — @NamedEntityGraph (JPA)

```java
@NamedEntityGraph(
    name = "Department.employees",
    attributeNodes = @NamedAttributeNode("employees")
)
@Entity
public class Department { ... }

// usage
EntityGraph graph = em.getEntityGraph("Department.employees");
em.find(Department.class, id, Map.of("javax.persistence.fetchgraph", graph));
```

---

## 3. Fix Comparison

| Fix | Layer | Best for |
|-----|-------|---------|
| `JOIN FETCH` | JPA | specific queries |
| `@EntityGraph` | Spring Data JPA | repository methods |
| `@BatchSize` | Hibernate | global setting |
| `@NamedEntityGraph` | JPA | reusable across queries |

---

## 4. EAGER Loading is NOT the fix

```java
// ❌ Don't fix N+1 with EAGER
@OneToMany(fetch = FetchType.EAGER)
List<Employee> employees;
// always loads children even when you don't need them
// causes worse performance overall
```

---

## 5. How to Detect N+1

```yaml
# application.properties — log all SQL
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.orm.jdbc.bind=TRACE
```

> If you see the same SELECT repeated many times → N+1 problem.

---

## 6. Layer Overview

```
Spring Data JPA  → @EntityGraph, @Query with JOIN FETCH
      ↑
     JPA         → JOIN FETCH, @NamedEntityGraph
      ↑
  Hibernate      → @BatchSize, actual query execution
```
