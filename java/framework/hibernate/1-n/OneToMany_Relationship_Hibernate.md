# One-to-Many Relationship in Hibernate

> How 1-N relationships work and how they are implemented in Hibernate.

---

## 1. What is a One-to-Many Relationship?

One record in a parent table relates to **multiple records** in a child table.

```
One Department → Many Employees

Department "IT"
├── Employee John
├── Employee Mary
└── Employee Peter
```

---

## 2. How It Looks in the Database

```
departments table              employees table
┌────┬──────────┐              ┌────┬───────┬─────────┐
│ id │ name     │              │ id │ name  │ dept_id │ ← FK lives here!
├────┼──────────┤              ├────┼───────┼─────────┤
│  1 │ IT       │              │  1 │ John  │    1    │
│  2 │ Finance  │              │  2 │ Mary  │    1    │
└────┴──────────┘              │  3 │ Peter │    1    │
   One side                    │  4 │ Alice │    2    │
   (no FK)                     │  5 │ Bob   │    2    │
                               └────┴───────┴─────────┘
                                  Many side
                                  (has FK = OWNER)
```

**Key rule:**
```
FK always lives on the MANY side (child table)
Many side = OWNER of the relationship in Hibernate
```

---

## 3. Entity Classes

### Department (One side — NOT owner)

```java
@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(
        mappedBy = "department",        // points to field name in Employee class
        cascade = CascadeType.ALL,      // operations flow to children
        fetch = FetchType.LAZY,         // load employees only when accessed
        orphanRemoval = true            // remove from list = delete from DB
    )
    private List<Employee> employees = new ArrayList<>();

    // Getters and Setters
}
```

### Employee (Many side — OWNER)

```java
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne                          // many employees → one department
    @JoinColumn(name = "dept_id")       // FK column name in employees table
    private Department department;      // full object, not just ID!

    // Getters and Setters
}
```

---

## 4. Key Annotations Explained

### `@OneToMany` options

```java
@OneToMany(
    mappedBy = "department",   // must match field name in Employee class exactly
                               // tells Hibernate Employee owns the FK, not Department
    cascade = CascadeType.ALL, // operations flow from Department down to Employees
    fetch = FetchType.LAZY,    // DEFAULT — employees not loaded until getEmployees() called
    orphanRemoval = true       // employee removed from list → auto deleted from DB
)
private List<Employee> employees;
```

### `@ManyToOne` options

```java
@ManyToOne                      // this side OWNS the relationship
@JoinColumn(name = "dept_id")   // defines FK column name in employees table
private Department department;  // object reference, not raw ID
```

---

## 5. Why Object Not Raw ID?

```java
// ❌ Raw FK (MyBatis style)
private Long deptId;

// ✅ Hibernate style — object reference
private Department department;

// Benefit: navigate directly
emp.getDepartment().getName();  // ✅ clean, no extra query needed
```

---

## 6. `mappedBy` — Why It Matters

```java
// ❌ WITHOUT mappedBy — Hibernate creates unnecessary JOIN TABLE!
@OneToMany
private List<Employee> employees;

// ✅ WITH mappedBy — Hibernate knows FK is in employees table
@OneToMany(mappedBy = "department")
private List<Employee> employees;
```

```
mappedBy = "department"
                ↑
    must match EXACTLY the field name in Employee:
    private Department department;
```

---

