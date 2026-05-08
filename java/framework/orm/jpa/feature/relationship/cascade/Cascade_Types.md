# Cascade Types in JPA

> Cascade = "when I do X to parent, also do X to children automatically"

---

## 1. Cascade Types

| Type | What it does |
|------|-------------|
| `PERSIST` | persist parent → children also persisted |
| `MERGE` | merge parent → children also merged |
| `REMOVE` | remove parent → children also removed |
| `REFRESH` | refresh parent → children also refreshed |
| `DETACH` | detach parent → children also detached |
| `ALL` | all of the above |

---

## 2. Usage

```java
@OneToMany(cascade = CascadeType.ALL)
List<Employee> employees;

@OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
List<Employee> employees;
```

---

## 3. API Comparison

### PERSIST cascade
```java
// JPA
em.persist(dept);               // children auto persisted

// Hibernate
session.persist(dept);          // same

// Spring Data JPA
deptRepo.save(dept);            // children auto persisted
```

### REMOVE cascade
```java
// JPA
em.remove(dept);                // children auto deleted

// Hibernate
session.delete(dept);           // same

// Spring Data JPA
deptRepo.delete(dept);          // children auto deleted
```

### MERGE cascade
```java
// JPA
em.merge(detachedDept);         // children also merged

// Hibernate
session.merge(detachedDept);    // same

// Spring Data JPA
deptRepo.save(detachedDept);    // children also merged
```

---

## 4. orphanRemoval vs CascadeType.REMOVE

| | `CascadeType.REMOVE` | `orphanRemoval = true` |
|--|--|--|
| Trigger | `em.remove(parent)` | remove child from collection |
| Use case | delete whole tree | remove single child |

```java
// CascadeType.REMOVE — delete parent → children deleted
em.remove(dept);  // all employees deleted

// orphanRemoval — remove from collection → child deleted
dept.getEmployees().remove(emp);  // just that emp deleted on commit
```

---

## 5. Common Pitfall

```java
// ❌ DANGER — CascadeType.REMOVE on @ManyToOne
@ManyToOne(cascade = CascadeType.REMOVE)
Department dept;
// deleting one employee → deletes the whole department!

// ✅ Cascade REMOVE only on @OneToMany (parent side)
@OneToMany(cascade = CascadeType.REMOVE)
List<Employee> employees;
```

---

## 6. Recommendation

```java
// Typical safe setup
@OneToMany(
    mappedBy = "department",
    cascade = {CascadeType.PERSIST, CascadeType.MERGE},
    orphanRemoval = true
)
List<Employee> employees;
```

> Avoid `CascadeType.ALL` unless you really mean it — `REMOVE` can cause accidental mass deletes.

---

## 7. Layer Overview

```
Spring Data JPA  → deptRepo.save(), deptRepo.delete() trigger cascade
      ↑
     JPA         → @OneToMany(cascade=...), CascadeType, orphanRemoval
      ↑
  Hibernate      → actual cascade execution at flush/commit
```
