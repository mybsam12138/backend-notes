# Many-to-Many Relationship in JPA

> Many students can enroll in many courses — join table in between

---

## 1. Annotations

| Annotation | Meaning |
|------------|---------|
| `@ManyToMany` | both sides |
| `@JoinTable` | defines the join table (owner side) |
| `mappedBy` | non-owner side |

---

## 2. Entity Setup

```java
// Owner side
@Entity
public class Student {
    @Id @GeneratedValue
    Long id;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    List<Course> courses = new ArrayList<>();
}

// Non-owner side
@Entity
public class Course {
    @Id @GeneratedValue
    Long id;

    @ManyToMany(mappedBy = "courses")
    List<Student> students = new ArrayList<>();
}
```

```
DB Tables:
  students:       id, name
  courses:        id, name
  student_course: student_id, course_id  ← join table
```

---

## 3. API Comparison

### Save
```java
// JPA
Student s = new Student("John");
Course c = new Course("Math");
s.getCourses().add(c);
em.persist(s);
em.persist(c);                 // persist both sides

// Hibernate
session.persist(s);
session.persist(c);

// Spring Data JPA
courseRepo.save(c);
s.getCourses().add(c);
studentRepo.save(s);
```

### Find with relations
```java
// JPA / Hibernate
Student s = em.find(Student.class, 1L);
s.getCourses();                // lazy loaded by default

// Spring Data JPA
@Query("SELECT s FROM Student s JOIN FETCH s.courses WHERE s.id = :id")
Student findWithCourses(@Param("id") Long id);
```

### Remove relation (not the entity)
```java
// All three — same approach
@Transactional
public void unenroll(Long studentId, Long courseId) {
    Student s = studentRepo.findById(studentId).orElseThrow();
    s.getCourses().removeIf(c -> c.getId().equals(courseId));
    // → DELETE FROM student_course WHERE student_id=? AND course_id=?
    // student and course still exist!
}
```

---

## 4. Extra Data on Join Table → Use @Entity

```java
// ❌ @ManyToMany can't hold extra columns on join table
// ✅ Create a join entity instead

@Entity
public class Enrollment {
    @Id @GeneratedValue
    Long id;

    @ManyToOne
    Student student;

    @ManyToOne
    Course course;

    LocalDate enrolledAt;   // extra data ✅
    String grade;           // extra data ✅
}
```

> If the join table needs extra columns, always use a join entity with two `@ManyToOne` instead of `@ManyToMany`.

---

## 5. Common Pitfall

```java
// ❌ Only set one side — join table row not saved!
course.getStudents().add(student);  // non-owner side, ignored!

// ✅ Always set the owner side
student.getCourses().add(course);   // owner side → writes to join table ✅
course.getStudents().add(student);  // keep in-memory consistent
```

> The **owner side** (`@JoinTable`) controls the join table — setting only `mappedBy` side does nothing in DB.

---

## 6. Lazy vs Eager

```java
@ManyToMany(fetch = FetchType.LAZY)   // default, recommended
@ManyToMany(fetch = FetchType.EAGER)  // avoid
```

Same N+1 risk as `@OneToMany` — use `JOIN FETCH` when needed.

---

## 7. Layer Overview

```
Spring Data JPA  → studentRepo.save(), @Query with JOIN FETCH
      ↑
     JPA         → @ManyToMany, @JoinTable, @JoinColumn, mappedBy
      ↑
  Hibernate      → manages join table INSERT/DELETE, lazy proxy
```
