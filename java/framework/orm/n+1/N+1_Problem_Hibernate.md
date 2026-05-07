# N+1 Problem in Hibernate

> A complete guide on what causes N+1, how to identify it, and how to fix it.

---

## 1. What is the N+1 Problem?

The N+1 problem occurs when Hibernate fires **1 query to load parents**, then fires **N separate queries** to load each parent's children — one query per parent.

```
1 query  → load all departments
N queries → load employees for EACH department separately

Total = 1 + N queries  (e.g. 1 + 100 = 101 queries!) 😱
```

---

## 2. How It Is Caused

### Setup — Entity Classes

```java
@Entity
public class Department {
    @Id
    private Long id;
    private String name;

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<Employee> employees;
}

@Entity
public class Employee {
    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;
}
```

### The N+1 Trigger — Looping Through Parents

```java
// Step 1 — load all departments
// → Query 1: SELECT * FROM departments
List<Department> departments = session.createQuery(
    "FROM Department", Department.class
).getResultList();

// Step 2 — loop and access children
for (Department dept : departments) {
    // Each call to getEmployees() fires a NEW query!
    System.out.println(dept.getEmployees().size());
}
// → Query 2:   SELECT * FROM employees WHERE dept_id = 1
// → Query 3:   SELECT * FROM employees WHERE dept_id = 2
// → Query 4:   SELECT * FROM employees WHERE dept_id = 3
// → ...
// → Query 101: SELECT * FROM employees WHERE dept_id = 100

// Total: 101 queries for 100 departments! 😱
```

### N+1 Also Happens With EAGER

```java
// EAGER doesn't fix N+1 — it just fires queries immediately!
@OneToMany(fetch = FetchType.EAGER)
private List<Employee> employees;

// Load departments
List<Department> depts = session.createQuery("FROM Department").getResultList();
// → Query 1:   SELECT * FROM departments
// → Query 2:   SELECT * FROM employees WHERE dept_id = 1   ← immediate!
// → Query 3:   SELECT * FROM employees WHERE dept_id = 2   ← immediate!
// → ...
// → Query 101: SELECT * FROM employees WHERE dept_id = 100

// Still 101 queries! EAGER doesn't help! ❌
```

### Real Performance Impact

```
100 departments, 1000 employees total

Without N+1 fix:  101 queries × 5ms = 505ms  😱
With fix:           1 query   × 8ms =   8ms  ✅

60x performance difference!
```

---

## 3. How to Detect N+1

### Enable SQL Logging

```yaml
# application.yml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

If you see this pattern in logs — you have N+1:

```sql
-- Suspicious! Same query repeated with different IDs
SELECT * FROM employees WHERE dept_id = 1
SELECT * FROM employees WHERE dept_id = 2
SELECT * FROM employees WHERE dept_id = 3
SELECT * FROM employees WHERE dept_id = 4
-- ... repeating 100 times!
```

### Use Hibernate Statistics

```java
// In code — count queries programmatically
SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
Statistics stats = sessionFactory.getStatistics();
stats.setStatisticsEnabled(true);

// Run your code here...

long queryCount = stats.getQueryExecutionCount();
System.out.println("Total queries: " + queryCount);  // should be 1, not 101!
```

---

## 4. How to Fix N+1

### Fix 1 — JOIN FETCH in HQL (Most Common)

Forces Hibernate to load everything in ONE JOIN query.

```java
// ❌ Before — N+1
List<Department> depts = session.createQuery(
    "FROM Department", Department.class
).getResultList();

// ✅ After — JOIN FETCH
List<Department> depts = session.createQuery(
    "FROM Department d JOIN FETCH d.employees",  // ← force join
    Department.class
).getResultList();
```

```sql
-- Hibernate generates ONE query:
SELECT d.*, e.*
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id

-- All data in one shot! ✅
```

---

### Fix 2 — @EntityGraph in Spring Data JPA

Tells Spring to use JOIN for specific repository methods.

```java
// Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // ✅ This method uses JOIN automatically
    @EntityGraph(attributePaths = "employees")
    @Query("SELECT d FROM Department d")
    List<Department> findAllWithEmployees();

    // ❌ This method still has N+1
    List<Department> findAll();
}
```

```java
// Service
@Transactional
public List<Department> getAllDepartments() {
    return deptRepo.findAllWithEmployees();  // ✅ uses JOIN, no N+1
}
```

```sql
-- Hibernate generates:
SELECT d.*, e.*
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
-- One query! ✅
```

---

### Fix 3 — @BatchSize (Compromise Solution)

Instead of N separate queries, loads children in batches.

```java
@Entity
public class Department {

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    @BatchSize(size = 10)  // ← load 10 departments' employees at once
    private List<Employee> employees;
}
```

```sql
-- Instead of 100 separate queries:
SELECT * FROM employees WHERE dept_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
SELECT * FROM employees WHERE dept_id IN (11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
-- ...

-- 100 queries → 10 queries ✅ (batch of 10)
```

```java
// Can also set globally in application.yml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 10
```

---

### Fix 4 — DTO Projection (Best for Read-Only Queries)

Skip entity loading entirely — fetch only the data you need.

```java
// DTO class
public class DepartmentDTO {
    private String deptName;
    private String employeeName;

    public DepartmentDTO(String deptName, String employeeName) {
        this.deptName = deptName;
        this.employeeName = employeeName;
    }
}

// Query using DTO projection
List<DepartmentDTO> results = session.createQuery(
    "SELECT new com.example.DepartmentDTO(d.name, e.name) " +
    "FROM Department d JOIN d.employees e",
    DepartmentDTO.class
).getResultList();
```

```sql
-- Hibernate generates:
SELECT d.name, e.name
FROM departments d
JOIN employees e ON e.dept_id = d.id
-- One JOIN query, only needed columns ✅
-- No entity overhead!
```

---

### Fix 5 — @Fetch(FetchMode.SUBSELECT)

Uses one subquery to load all children at once.

```java
@Entity
public class Department {

    @OneToMany(mappedBy = "department")
    @Fetch(FetchMode.SUBSELECT)  // ← load all children in one subquery
    private List<Employee> employees;
}
```

```sql
-- Hibernate generates:
SELECT * FROM employees
WHERE dept_id IN (
    SELECT id FROM departments  -- subquery!
)
-- Two queries total, no N+1 ✅
```

---

## 5. All Fixes Compared

| Fix | Queries | Use Case | Complexity |
|-----|---------|----------|------------|
| Default (no fix) | 1 + N ❌ | — | — |
| `JOIN FETCH` | 1 ✅ | Most cases | Low |
| `@EntityGraph` | 1 ✅ | Spring Data repos | Low |
| `@BatchSize` | N/batch ⚠️ | Large collections | Low |
| DTO Projection | 1 ✅ | Read-only, reports | Medium |
| `@Fetch(SUBSELECT)` | 2 ✅ | Large datasets | Low |

---

## 6. Which Fix to Use When

```
Simple query, need full entities
  → JOIN FETCH

Spring Data JPA repository method
  → @EntityGraph

Large collection, can't use JOIN (too much data)
  → @BatchSize

Read-only report / dashboard (don't need entity)
  → DTO Projection

Load all children for all parents at once
  → @Fetch(SUBSELECT)

Financial reporting (complex multi-join)
  → DTO Projection or native SQL
```

---

## 7. JOIN FETCH Pitfalls

### Pitfall 1 — Duplicate Parents

```java
// JOIN FETCH can return duplicate departments!
List<Department> depts = session.createQuery(
    "FROM Department d JOIN FETCH d.employees"
).getResultList();

// Department IT has 3 employees
// → IT appears 3 times in results! ❌

// Fix — use DISTINCT
List<Department> depts = session.createQuery(
    "SELECT DISTINCT d FROM Department d JOIN FETCH d.employees"
).getResultList();
// → IT appears once, with 3 employees inside ✅
```

### Pitfall 2 — Cannot Paginate With JOIN FETCH

```java
// ❌ WRONG — Hibernate loads ALL data then paginates in memory!
List<Department> depts = session.createQuery(
    "FROM Department d JOIN FETCH d.employees"
)
.setFirstResult(0)
.setMaxResults(10)  // ← WARNING in logs! not real DB pagination!
.getResultList();

// ✅ Fix — use @BatchSize for paginated queries
// page departments first, then batch load employees
Page<Department> page = deptRepo.findAll(PageRequest.of(0, 10));
// @BatchSize handles employee loading efficiently
```

---

## 8. In Your Financial System Context

```java
// Trade → TradeLegs N+1 scenario
@Entity
public class Trade {
    @OneToMany(mappedBy = "trade", fetch = FetchType.LAZY)
    @BatchSize(size = 20)  // batch load legs
    private List<TradeLeg> legs;
}

// Repository — load trades with legs for settlement report
public interface TradeRepository extends JpaRepository<Trade, Long> {

    // Use JOIN FETCH for settlement processing
    @EntityGraph(attributePaths = "legs")
    @Query("SELECT t FROM Trade t WHERE t.status = :status")
    List<Trade> findByStatusWithLegs(@Param("status") String status);

    // Use DTO projection for reporting dashboard
    @Query("SELECT new com.example.TradeReportDTO(t.id, t.amount, l.legType) " +
           "FROM Trade t JOIN t.legs l WHERE t.tradeDate = :date")
    List<TradeReportDTO> findTradeReport(@Param("date") LocalDate date);
}
```

---

## 9. Quick Reference Cheat Sheet

```
N+1 happens when:
  → loop through parents and access children
  → LAZY: children loaded one by one per parent
  → EAGER: still separate queries, just immediate

Detect N+1:
  → enable show-sql: true
  → look for same query repeating with different IDs
  → use Hibernate Statistics to count queries

Fix options:
  → JOIN FETCH          "FROM Dept d JOIN FETCH d.employees"
  → @EntityGraph        attributePaths = "employees"
  → @BatchSize          loads children in batches
  → DTO Projection      SELECT new DTO(d.name, e.name)
  → @Fetch(SUBSELECT)   uses IN subquery

Golden rules:
  → Never access lazy collections inside a loop without fix
  → Always check SQL logs during development
  → Use JOIN FETCH or @EntityGraph for known access patterns
  → Use @BatchSize as safety net for unexpected lazy loading
  → Use DTO projection for reports and dashboards
```

---

*Prepared for Java Developer interview preparation — OTC Derivatives / Financial Systems role*
