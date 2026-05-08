# Entity States in JPA

> JPA defines the states, Hibernate implements them, Spring Data JPA wraps them.

---

## 1. Four Entity States

| State | Meaning |
|-------|---------|
| `NEW` | Just created, not tracked |
| `MANAGED` | Tracked by JPA — dirty checking active |
| `DETACHED` | Was managed, now ignored |
| `REMOVED` | Marked for DELETE on commit |

---

## 2. State Diagram

```
new Employee()
      ↓
    NEW
      │ persist()
      ↓
  MANAGED ──── detach() ──→ DETACHED
      │                         │ merge()
   remove()                     ↓
      │                     MANAGED
      ↓
  REMOVED
      │ commit()
      ↓
 deleted from DB
```

---

## 3. Dirty Checking (MANAGED only)

```java
@Transactional
public void updateSalary(Long id, Double salary) {
    Employee emp = empRepo.findById(id).orElseThrow(); // MANAGED
    emp.setSalary(salary); // no save() needed!
    // commit → JPA detects change → auto UPDATE
}
```

> Only works inside `@Transactional` — without it, entity becomes DETACHED after load.

---

## 4. API Comparison

### Save
```java
em.persist(emp);           // JPA
session.save(emp);         // Hibernate
empRepo.save(emp);         // Spring Data JPA
```

### Find
```java
em.find(Employee.class, id);          // JPA
session.get(Employee.class, id);      // Hibernate
empRepo.findById(id);                 // Spring Data JPA
```

### Update
```java
em.merge(detachedEmp);         // JPA
session.merge(detachedEmp);    // Hibernate
empRepo.save(detachedEmp);     // Spring Data JPA
// or just dirty checking inside @Transactional (all three)
```

### Delete
```java
em.remove(emp);            // JPA
session.delete(emp);       // Hibernate
empRepo.delete(emp);       // Spring Data JPA
```

### Query
```java
em.createQuery("SELECT e FROM Employee e", Employee.class); // JPA (JPQL)
session.createQuery("FROM Employee", Employee.class);       // Hibernate (HQL)
empRepo.findBySalaryGreaterThan(50000.0);                  // Spring Data JPA
```

---

## 5. flush() vs commit()

```
em.flush()   → SQL sent to DB, not visible yet, can still rollback
tx.commit()  → permanent, visible to all, session closes
```

---

## 6. Layer Overview

```
Spring Data JPA  → what you use daily (empRepo.save, findById...)
      ↑
     JPA         → spec: @Entity, @OneToMany, entity states, JPQL
      ↑
  Hibernate      → implementation: dirty checking, flush, session
      ↑
   Database
```
