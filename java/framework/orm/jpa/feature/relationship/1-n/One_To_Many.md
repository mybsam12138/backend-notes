# One-to-Many Relationship in JPA

> One parent has many children — e.g. one Department has many Employees

---

## 1. Annotations

| Annotation | Side | Meaning |
|------------|------|---------|
| `@OneToMany` | Parent | one dept → many employees |
| `@ManyToOne` | Child | many employees → one dept |
| `mappedBy` | Parent | tells JPA the FK is on child side |
| `@JoinColumn` | Child | the actual FK column in DB |

---

## 2. Entity Setup

```java
// Parent side
@Entity
public class Department {
    @Id @GeneratedValue
    Long id;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Employee> employees = new ArrayList<>();
}

// Child side — owns the FK
@Entity
public class Employee {
    @Id @GeneratedValue
    Long id;

    @ManyToOne
    @JoinColumn(name = "department_id")  // FK column in employees table
    Department department;
}
```

```
DB Tables:
  departments: id, name
  employees:   id, name, department_id  ← FK lives here
```

---

## 3. API Comparison

### Save
```java
// JPA
Department dept = new Department("IT");
dept.getEmployees().add(new Employee("John"));
em.persist(dept);                      // cascade → employees also saved

// Hibernate
session.persist(dept);                 // same

// Spring Data JPA
deptRepo.save(dept);                   // same
```

### Find with children
```java
// JPA
Department dept = em.find(Department.class, 1L);
dept.getEmployees();                   // lazy loaded by default

// Hibernate
session.get(Department.class, 1L);

// Spring Data JPA
deptRepo.findById(1L);
// or eager fetch:
@Query("SELECT d FROM Department d JOIN FETCH d.employees WHERE d.id = :id")
Department findWithEmployees(@Param("id") Long id);
```

### Add child
```java
// All three — same approach
@Transactional
public void addEmployee(Long deptId, Employee emp) {
    Department dept = deptRepo.findById(deptId).orElseThrow();
    emp.setDepartment(dept);       // set FK on child side!
    dept.getEmployees().add(emp);  // keep in-memory consistent
    empRepo.save(emp);
}
```

### Remove child
```java
// JPA / Hibernate
em.remove(em.find(Employee.class, empId));

// Spring Data JPA (orphanRemoval = true)
@Transactional
public void removeEmployee(Long deptId, Long empId) {
    Department dept = deptRepo.findById(deptId).orElseThrow();
    dept.getEmployees().removeIf(e -> e.getId().equals(empId));
    // orphanRemoval → auto DELETE on commit ✅
}
```

---

## 4. Lazy vs Eager Loading
```
| | `LAZY` (default) | `EAGER` |
|--|--|--|
| When loaded | on access | immediately with parent |
| N+1 risk | ✅ Yes | ❌ No |
| Recommended | ✅ Yes | ❌ Avoid |
```
```java
@OneToMany(fetch = FetchType.LAZY)   // default, recommended
@OneToMany(fetch = FetchType.EAGER)  // avoid — always loads children
```

---

## 5. N+1 Problem & Fix

```java
// ❌ N+1 — 1 query for depts + N queries for each dept's employees
List<Department> depts = deptRepo.findAll();
depts.forEach(d -> d.getEmployees().size()); // N extra queries!

// ✅ Fix — JOIN FETCH in one query
@Query("SELECT d FROM Department d JOIN FETCH d.employees")
List<Department> findAllWithEmployees();
```

---

## 6. Common Pitfall

```java
// ❌ Only set parent side — FK not saved!
dept.getEmployees().add(emp);
// emp.department is still null → department_id = null in DB

// ✅ Always set the child (owning) side
emp.setDepartment(dept);        // this sets the FK in DB
dept.getEmployees().add(emp);   // keeps in-memory consistent
```

> The **child side** (`@ManyToOne`) owns the FK — JPA only writes the FK based on the child, not the parent collection.

---

## 7. Layer Overview

```
Spring Data JPA  → deptRepo.save(), @Query with JOIN FETCH
      ↑
     JPA         → @OneToMany, @ManyToOne, @JoinColumn, FetchType
      ↑
  Hibernate      → actual SQL JOIN, lazy loading proxy, N+1 execution
```
