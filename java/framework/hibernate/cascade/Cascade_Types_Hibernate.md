# Cascade Types in Hibernate

> How cascade works, all types explained, and when to use each.

---

## 1. What is Cascade?

When you do something to a **parent**, automatically do the **same thing** to its **children**.

```
Department (Parent)
├── Employee #1 (Child)
├── Employee #2 (Child)
└── Employee #3 (Child)

Without cascade → manage parent and children separately
With cascade    → parent operation flows down to children automatically
```

**Analogy — Company shutting down:**
```
Without Cascade:
  Fire every employee manually → then close company

With Cascade REMOVE:
  Close company → all employees automatically fired ✅
```

---

## 2. Default — No Cascade

```java
// No cascade specified = default
@OneToMany(mappedBy = "department")
private List<Employee> employees;
```

```java
Department dept = new Department("IT");
dept.getEmployees().add(new Employee("John"));

session.save(dept);
// → INSERT INTO departments ✅
// → Employee John NOT saved ❌ must save manually!

session.save(john);  // must do this yourself
```

Without cascade, deleting parent causes FK error:
```java
session.delete(dept);
// employees still have dept_id = 10 in DB
// → 💥 FK constraint violation!
// must delete children manually first
```

---

## 3. All Cascade Types

### `CascadeType.PERSIST` — Save flows down

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.PERSIST)
private List<Employee> employees;
```

```java
Department dept = new Department("IT");
dept.getEmployees().add(new Employee("John"));
dept.getEmployees().add(new Employee("Mary"));

session.save(dept);
// → INSERT INTO departments ...
// → INSERT INTO employees (John) ...  ← auto! ✅
// → INSERT INTO employees (Mary) ...  ← auto! ✅
```

---

### `CascadeType.MERGE` — Update flows down

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.MERGE)
private List<Employee> employees;
```

```java
dept.setName("IT Updated");
dept.getEmployees().get(0).setSalary(60000);  // child also changed

session.merge(dept);
// → UPDATE departments ...
// → UPDATE employees SET salary = 60000 ...  ← auto! ✅
```

---

### `CascadeType.REMOVE` — Delete flows down

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.REMOVE)
private List<Employee> employees;
```

```java
session.delete(dept);
// → DELETE FROM employees WHERE dept_id = 1  ← auto! ✅
// → DELETE FROM departments WHERE id = 1
```

⚠️ **Dangerous in financial systems** — accidental parent delete = all children gone!

---

### `CascadeType.REFRESH` — Reload from DB flows down

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.REFRESH)
private List<Employee> employees;
```

```java
session.refresh(dept);
// → reloads department from DB
// → reloads all employees from DB  ← auto! ✅
// useful when DB was changed externally
```

---

### `CascadeType.DETACH` — Detach from session flows down

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.DETACH)
private List<Employee> employees;
```

```java
session.detach(dept);
// → department detached from session
// → all employees detached too  ← auto! ✅
// changes to detached objects no longer tracked
```

---

### `CascadeType.ALL` — Everything flows down

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
private List<Employee> employees;
// = PERSIST + MERGE + REMOVE + REFRESH + DETACH combined
```

---

## 4. All Types Side by Side

| CascadeType | SAVE | UPDATE | DELETE | REFRESH | DETACH |
|-------------|------|--------|--------|---------|--------|
| None (default) | ❌ | ❌ | ❌ | ❌ | ❌ |
| `PERSIST` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `MERGE` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `REMOVE` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `REFRESH` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `DETACH` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `ALL` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Hibernate-Specific Cascade Types

Beyond standard JPA, Hibernate adds two more:

```java
// Hibernate only — covers save(), update(), saveOrUpdate()
cascade = org.hibernate.annotations.CascadeType.SAVE_UPDATE

// Hibernate only — for DB replication scenarios (rarely used)
cascade = org.hibernate.annotations.CascadeType.REPLICATE
```

| CascadeType | Standard JPA? | Hibernate? |
|-------------|--------------|------------|
| PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL | ✅ | ✅ |
| SAVE_UPDATE | ❌ | ✅ |
| REPLICATE | ❌ | ✅ |

In practice — stick to JPA standard types. `SAVE_UPDATE` and `REPLICATE` rarely needed.

---

## 6. Combining Multiple Types

```java
// Use array when you want specific combination
@OneToMany(mappedBy = "department",
           cascade = {CascadeType.PERSIST, CascadeType.MERGE})
private List<Employee> employees;
// save ✅  update ✅  delete ❌
```

---

## 7. When to Use Each — Real Use Cases

### Order → OrderItems (E-commerce)
```java
cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
// Items meaningless without order → safe to delete together
```

### Department → Employees (HR System)
```java
cascade = {CascadeType.PERSIST, CascadeType.MERGE}
// Employees exist independently → never auto delete people records!
```

### Trade → TradeLegs (Financial System)
```java
cascade = CascadeType.PERSIST
// Only auto save on creation
// Financial records must NEVER be auto deleted
// Regulators require full history!
```

### Invoice → AuditLog (Compliance)
```java
// NO cascade at all!
// Audit logs are sacred — never auto modified
// Even if invoice deleted, logs must stay forever
```

### User → Addresses (CRM)
```java
cascade = CascadeType.ALL
orphanRemoval = true
// Address meaningless without user
// Remove address from list → delete from DB
```

---

## 8. Company Decision Framework

```
Ask these questions before choosing cascade:

1. Can children exist without parent?
   YES → no REMOVE cascade (Employee without Dept)
   NO  → REMOVE is ok (OrderItem without Order)

2. Are children financial/audit records?
   YES → no cascade at all, manage manually
   NO  → PERSIST + MERGE usually safe

3. Simple app or enterprise?
   Simple     → ALL is fine
   Enterprise → be very specific

4. Compliance/regulatory requirements?
   YES → minimal or no cascade, full manual control
   NO  → normal cascade rules apply
```

---

## 9. `orphanRemoval` — Related but Different

```java
@OneToMany(mappedBy = "department",
           cascade = CascadeType.ALL,
           orphanRemoval = true)
private List<Employee> employees;
```

```
CascadeType.REMOVE:
  Trigger → DELETE the PARENT
  Effect  → children auto deleted

orphanRemoval = true:
  Trigger → REMOVE child from COLLECTION
  Effect  → child auto deleted from DB
```

```java
// CascadeType.REMOVE
session.delete(dept);
// → all employees deleted ← triggered by parent delete

// orphanRemoval
dept.getEmployees().remove(john);
// → john deleted from DB ← triggered by removing from list
```
