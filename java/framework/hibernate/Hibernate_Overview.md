# Hibernate – Definition & Overview

> A comprehensive study guide for Java developers preparing for enterprise roles.

---

## 1. What is Hibernate?

**Hibernate** is an open-source **Object-Relational Mapping (ORM)** framework for Java. It maps Java objects (POJOs) to relational database tables, allowing developers to interact with the database using Java code instead of raw SQL.

- **First released:** 2001 by Gavin King
- **Current maintainer:** Red Hat / JBoss
- **License:** LGPL
- **Part of:** JakartaEE persistence ecosystem (implements JPA – Java Persistence API)

> **Simple analogy:** Hibernate acts as a "translator" between your Java objects and your database rows.

---

## 2. Why Use Hibernate?

| Problem (Without ORM) | Solution (With Hibernate) |
|------------------------|--------------------------|
| Write verbose JDBC boilerplate | Automatic SQL generation |
| Manual ResultSet mapping | Auto-maps rows → Java objects |
| Database-specific SQL | Database-agnostic HQL |
| Manual transaction management | Built-in transaction support |
| No caching | First & second level cache |

---

## 3. Core Architecture

```
[ Java Application ]
        |
        v
[ Hibernate ORM Layer ]
   ├── SessionFactory      ← Created once, thread-safe, expensive
   ├── Session             ← Unit of work, NOT thread-safe
   ├── Transaction         ← Wraps DB operations
   ├── Query / Criteria    ← HQL or Criteria API for queries
   └── Configuration       ← Reads hibernate.cfg.xml or annotations
        |
        v
[ JDBC Layer ]
        |
        v
[ Relational Database ]  (MySQL, PostgreSQL, GaussDB, Oracle, etc.)
```

---

## 4. Key Concepts

### 4.1 Entity / POJO Mapping

```java
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "salary")
    private Double salary;

    // Getters and Setters
}
```

### 4.2 SessionFactory & Session

```java
// SessionFactory – created once at startup
SessionFactory factory = new Configuration()
    .configure("hibernate.cfg.xml")
    .addAnnotatedClass(Employee.class)
    .buildSessionFactory();

// Session – one per request/transaction
Session session = factory.getCurrentSession();
session.beginTransaction();

Employee emp = session.get(Employee.class, 1L);  // SELECT by ID

session.getTransaction().commit();
```

### 4.3 CRUD Operations

```java
// CREATE
session.save(employee);

// READ
Employee emp = session.get(Employee.class, id);

// UPDATE
session.update(employee);
// OR
employee.setSalary(50000.0);  // Auto-detected if inside session (dirty checking)

// DELETE
session.delete(employee);
```

### 4.4 HQL – Hibernate Query Language

HQL is object-oriented SQL. You query **class names**, not table names.

```java
// HQL Example
String hql = "FROM Employee WHERE salary > :minSalary";
List<Employee> results = session.createQuery(hql, Employee.class)
    .setParameter("minSalary", 30000.0)
    .getResultList();
```

```java
// Native SQL (when needed)
List results = session.createNativeQuery("SELECT * FROM employees")
    .getResultList();
```

---

## 5. Relationships / Associations

### 5.1 One-to-Many

```java
@Entity
public class Department {
    @Id
    private Long id;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees;
}

@Entity
public class Employee {
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;
}
```

### 5.2 Many-to-Many

```java
@ManyToMany
@JoinTable(
    name = "employee_project",
    joinColumns = @JoinColumn(name = "emp_id"),
    inverseJoinColumns = @JoinColumn(name = "proj_id")
)
private List<Project> projects;
```

---

## 6. Fetching Strategies

| Strategy | When Data is Loaded | Use Case |
|----------|---------------------|----------|
| `EAGER` | Immediately with parent | Small, always-needed associations |
| `LAZY` *(default)* | Only when accessed | Large collections, performance |

```java
@OneToMany(fetch = FetchType.LAZY)   // Load employees only when accessed
private List<Employee> employees;
```

> ⚠️ **N+1 Problem:** Lazy loading in a loop triggers one query per record. Use `JOIN FETCH` in HQL to avoid this.

```java
// Fix N+1 with JOIN FETCH
String hql = "FROM Department d JOIN FETCH d.employees";
```

---

## 7. Caching

### 7.1 First-Level Cache (Session Cache)
- **Always enabled**, scoped to a `Session`
- Same object requested twice → second call hits cache, not DB

### 7.2 Second-Level Cache (SessionFactory Cache)
- **Optional**, shared across sessions
- Providers: EhCache, Redis, Infinispan

```xml
<!-- hibernate.cfg.xml -->
<property name="hibernate.cache.use_second_level_cache">true</property>
<property name="hibernate.cache.region.factory_class">
    org.hibernate.cache.ehcache.EhCacheRegionFactory
</property>
```

```java
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employee { ... }
```

---

## 8. Hibernate vs JPA

| Feature | JPA | Hibernate |
|---------|-----|-----------|
| Type | Specification (interface) | Implementation |
| Annotations | `@Entity`, `@Id`, etc. | Same (+ extras) |
| Query Language | JPQL | HQL (superset of JPQL) |
| Provider | Any (EclipseLink, etc.) | Most popular JPA impl |
| Spring Boot Default | Yes | Yes (via `spring-data-jpa`) |

> **In practice:** Spring Boot uses Hibernate as the default JPA provider. Writing JPA code = Hibernate running underneath.

---

## 9. Spring Boot + Hibernate Integration

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: admin
    password: secret
  jpa:
    hibernate:
      ddl-auto: update       # Options: none, validate, update, create, create-drop
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
```

```java
// Repository using Spring Data JPA
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findBySalaryGreaterThan(Double salary);
}
```
