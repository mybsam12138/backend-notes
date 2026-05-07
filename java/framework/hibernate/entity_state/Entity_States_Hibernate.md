# Entity States in Hibernate

> How Hibernate manages entity lifecycle — get, save, update, delete.

---

## 1. Four Entity States

```
TRANSIENT   → new object, Hibernate doesn't know it exists
PERSISTENT  → Hibernate is watching it, changes auto saved
DETACHED    → was persistent, now Hibernate ignores it
REMOVED     → marked for deletion, deleted on commit
```

---

## 2. State Diagram

```
  new Employee()
       ↓
  TRANSIENT ──── session.save() ──────────────→ PERSISTENT
                                                     │
                                               session.detach()
                                               session.close()
                                               session.clear()
                                                     │
                                                     ↓
  TRANSIENT ←── session.delete() ←────────── DETACHED
                                                     │
                                               session.merge()
                                                     │
                                                     ↓
                                               PERSISTENT
                                                     │
                                               session.delete()
                                                     │
                                                     ↓
                                                REMOVED
                                                     │
                                               tx.commit()
                                                     │
                                                     ↓
                                             deleted from DB
```

---

## 3. TRANSIENT — Hibernate Doesn't Know It

```java
// Just created, not saved yet
Employee emp = new Employee("John");
emp.setSalary(50000);

// Hibernate completely unaware of this object
// No ID assigned yet
// No DB row exists
// Changes NOT tracked
```

```
TRANSIENT:
  In DB?           ❌ No
  Has ID?          ❌ No (or manually set)
  Hibernate tracks? ❌ No
  Changes saved?   ❌ No
```

---

## 4. PERSISTENT — Hibernate is Watching

```java
// Way 1 — save new object
session.save(emp);
// → INSERT INTO employees ...
// → emp is now PERSISTENT, has ID assigned

// Way 2 — load from DB
Employee emp = session.get(Employee.class, 1L);
// → SELECT * FROM employees WHERE id = 1
// → emp is PERSISTENT

// Way 3 — query result
List<Employee> list = session.createQuery("FROM Employee").getResultList();
// → all results are PERSISTENT
```

```
PERSISTENT:
  In DB?            ✅ Yes
  Has ID?           ✅ Yes
  Hibernate tracks? ✅ Yes — dirty checking active!
  Changes saved?    ✅ Yes — auto on commit
```

### Dirty Checking — The Magic of PERSISTENT state

```java
Employee emp = session.get(Employee.class, 1L);  // PERSISTENT

// Just change the field — no save() needed!
emp.setSalary(60000);
emp.setName("John Updated");

// Transaction commits → Hibernate compares:
//   current:  { salary: 60000, name: "John Updated" }
//   snapshot: { salary: 50000, name: "John" }
//   → detected change!
// → auto fires: UPDATE employees SET salary=60000, name='John Updated' WHERE id=1
```

---

## 5. DETACHED — Hibernate Ignores It

```java
Employee emp = session.get(Employee.class, 1L);  // PERSISTENT
session.detach(emp);                              // DETACHED

emp.setSalary(99999);  // Hibernate doesn't notice!
// → NO UPDATE fired, salary unchanged in DB ✅
```

```
DETACHED:
  In DB?            ✅ Yes (row still exists)
  Has ID?           ✅ Yes
  Hibernate tracks? ❌ No
  Changes saved?    ❌ No
```

### Re-attach a Detached Entity

```java
// session.merge() — bring detached back to persistent
Employee emp = session.get(Employee.class, 1L);
session.detach(emp);

emp.setSalary(60000);  // changed while detached

session.merge(emp);    // re-attach with changes
// → UPDATE employees SET salary = 60000 WHERE id = 1 ✅
```

---

## 6. REMOVED — Marked for Deletion

```java
Employee emp = session.get(Employee.class, 1L);  // PERSISTENT
session.delete(emp);                              // REMOVED

// Object still in memory but marked for deletion
// DELETE fires when transaction commits
tx.commit();
// → DELETE FROM employees WHERE id = 1
```

```
REMOVED:
  In DB?            ⚠️ Still yes, until commit
  Has ID?           ✅ Yes
  Hibernate tracks? ✅ Yes (watching for commit)
  Changes saved?    ❌ No (will be deleted!)
```

---

## 7. GET — How to Load Data

### By ID

```java
// get() — returns null if not found
Employee emp = session.get(Employee.class, 1L);
// → SELECT * FROM employees WHERE id = 1
// → returns null if id not found

// getReference() — returns proxy, no DB call
Employee emp = session.getReference(Employee.class, 1L);
// → NO DB call! just a shell with id=1
// → throws exception when accessed if not found
// → use when you only need to set FK
```

### By Query (HQL)

```java
// Get all
List<Employee> list = session.createQuery(
    "FROM Employee", Employee.class
).getResultList();

// With condition
List<Employee> list = session.createQuery(
    "FROM Employee WHERE salary > :min", Employee.class)
    .setParameter("min", 50000.0)
    .getResultList();

// Single result
Employee emp = session.createQuery(
    "FROM Employee WHERE name = :name", Employee.class)
    .setParameter("name", "John")
    .getSingleResult();
```

### Spring Boot Repository

```java
// findById — returns Optional
Optional<Employee> emp = empRepo.findById(1L);

// findAll
List<Employee> all = empRepo.findAll();

// custom query
List<Employee> list = empRepo.findBySalaryGreaterThan(50000.0);

// getReferenceById — proxy, no DB call (for FK setting)
Employee emp = empRepo.getReferenceById(1L);
```

---

## 8. SAVE — How to Create Data

### Pure Hibernate

```java
Employee emp = new Employee("John");  // TRANSIENT
emp.setSalary(50000);

session.save(emp);    // → PERSISTENT, INSERT fires
// OR
session.persist(emp); // JPA standard version

tx.commit();
// → INSERT INTO employees (name, salary) VALUES ('John', 50000)
// → ID auto assigned
```

### With Cascade (Parent saves Children)

```java
Department dept = new Department("IT");
dept.getEmployees().add(new Employee("John"));
dept.getEmployees().add(new Employee("Mary"));

session.save(dept);  // cascade PERSIST → employees also saved
// → INSERT INTO departments ...
// → INSERT INTO employees (John) ...
// → INSERT INTO employees (Mary) ...
```

### Spring Boot

```java
Employee emp = new Employee("John");
empRepo.save(emp);  // INSERT if new, UPDATE if exists
```

---

## 9. UPDATE — How to Modify Data

### Method 1 — Dirty Checking (Most Common, Easiest)

```java
@Transactional
public void updateSalary(Long empId, Double newSalary) {
    Employee emp = empRepo.findById(empId).orElseThrow();
    // emp is PERSISTENT — Hibernate watching!

    emp.setSalary(newSalary);
    // NO save() needed!
    // method ends → auto UPDATE fires ✅
}
```

### Method 2 — session.merge() (For Detached Entities)

```java
// emp came from outside session (API request, detached object)
Employee emp = new Employee();
emp.setId(1L);
emp.setSalary(60000);

session.merge(emp);
// → checks DB for id=1
// → UPDATE employees SET salary=60000 WHERE id=1 ✅
```

### Method 3 — HQL Update

```java
// Bulk update — no entity loading needed
session.createQuery(
    "UPDATE Employee SET salary = salary * 1.1 WHERE department.id = :deptId")
    .setParameter("deptId", 1L)
    .executeUpdate();
// → UPDATE employees SET salary = salary * 1.1 WHERE dept_id = 1
// → all employees in dept get 10% raise in ONE query ✅
```

---

## 10. DELETE — How to Remove Data

### Method 1 — session.delete()

```java
Employee emp = session.get(Employee.class, 1L);  // must be PERSISTENT
session.delete(emp);  // → REMOVED state
tx.commit();
// → DELETE FROM employees WHERE id = 1
```

### Method 2 — orphanRemoval

```java
// Remove from parent collection → child auto deleted
@Transactional
public void removeEmployee(Long deptId, Long empId) {
    Department dept = deptRepo.findById(deptId).orElseThrow();
    dept.getEmployees().removeIf(e -> e.getId().equals(empId));
    // → Hibernate detects collection change (dirty checking)
    // → auto DELETE on commit ✅ no explicit delete needed!
}
```

### Method 3 — HQL Delete (Bulk)

```java
// Delete many records in one query
session.createQuery(
    "DELETE FROM Employee WHERE salary < :min")
    .setParameter("min", 10000.0)
    .executeUpdate();
// → DELETE FROM employees WHERE salary < 10000
```

### Method 4 — Spring Boot Repository

```java
empRepo.deleteById(1L);
empRepo.delete(emp);
empRepo.deleteAll();
```

---

## 11. flush() and commit() — When SQL Actually Fires

```
Changes accumulated in session
         ↓
session.flush()  → SQL sent to DB, but transaction NOT committed yet
                   DB changes not visible to others yet
         ↓
tx.commit()      → transaction committed, changes visible to everyone
                   session closed
```

```java
// flush vs commit
session.save(emp);      // queued, no SQL yet
session.flush();        // SQL fired: INSERT INTO employees...
                        // but can still rollback!
tx.commit();            // permanent, visible to all ✅

// Usually you just commit — flush happens automatically
session.save(emp);
tx.commit();            // flush + commit together ✅
```

---

## 12. save() vs persist() vs merge()

| Method | Input State | Output State | Returns ID? | Standard? |
|--------|-------------|--------------|-------------|-----------|
| `save()` | Transient | Persistent | ✅ Yes | Hibernate |
| `persist()` | Transient | Persistent | ❌ void | JPA ✅ |
| `merge()` | Detached/Transient | Persistent | ✅ Yes | JPA ✅ |
| `saveOrUpdate()` | Any | Persistent | ❌ | Hibernate |

```java
// save() — Hibernate specific, returns generated ID immediately
Long id = (Long) session.save(emp);

// persist() — JPA standard, void return
session.persist(emp);

// merge() — for detached objects, returns new managed instance
Employee managed = session.merge(detachedEmp);
```

---

## 13. Full State Lifecycle in Spring Boot

```java
@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository empRepo;

    // SAVE — Transient → Persistent
    @Transactional
    public Employee create(String name, Double salary) {
        Employee emp = new Employee(name, salary);  // TRANSIENT
        return empRepo.save(emp);                   // PERSISTENT → INSERT
    }

    // GET — loads as Persistent
    @Transactional
    public Employee getById(Long id) {
        return empRepo.findById(id).orElseThrow();  // PERSISTENT
    }

    // UPDATE — dirty checking
    @Transactional
    public void updateSalary(Long id, Double salary) {
        Employee emp = empRepo.findById(id).orElseThrow();  // PERSISTENT
        emp.setSalary(salary);  // dirty checking → auto UPDATE on commit
    }

    // DELETE
    @Transactional
    public void delete(Long id) {
        empRepo.deleteById(id);  // REMOVED → DELETE on commit
    }
}
```
