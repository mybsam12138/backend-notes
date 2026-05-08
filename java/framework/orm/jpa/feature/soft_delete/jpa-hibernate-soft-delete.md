# Soft Delete in JPA & Hibernate — Overview

## What is Soft Delete?

```
Hard delete (physical):
DELETE FROM user WHERE id = 1
→ row is GONE forever

Soft delete (logical):
UPDATE user SET deleted = true WHERE id = 1
→ row still exists, just marked as deleted
```

---

## Why Use Soft Delete?

```
✓ Audit trail — keep history of deleted records
✓ Recovery — restore accidentally deleted data
✓ Referential integrity — other tables still reference the row
✓ Compliance — legal requirements to keep data
✗ Table grows forever — need archiving strategy
✗ Queries must always filter deleted = false
✗ Unique constraints become complicated
```

---

## Three Ways to Implement

```
Way 1 — Manual (JPA only)
  → handle everything yourself
  → easy to forget deleted = false on queries

Way 2 — @SQLDelete + @Where (Hibernate, recommended)
  → Hibernate intercepts DELETE automatically
  → auto-appends WHERE deleted = false to every query

Way 3 — @SoftDelete (Hibernate 6.4+)
  → single annotation, cleanest syntax
```

---

## Way 1 — Manual (JPA Only)

The most basic approach — handle everything yourself.

```java
@Entity
public class User {
    @Id
    private Long id;
    private String name;
    private boolean deleted = false;  // soft delete flag
}

// Repository — manually filter on every query
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByDeletedFalse();
    List<User> findByStatusAndDeletedFalse(String status);
    Optional<User> findByIdAndDeletedFalse(Long id);
}

// Service — manually set flag instead of calling delete
@Service
public class UserService {

    public void delete(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setDeleted(true);        // set flag
        userRepository.save(user);    // UPDATE instead of DELETE
    }
}
```

**Problem:** Easy to forget `deleted = false` on any query → deleted records leak through.

---

## Way 2 — Hibernate `@SQLDelete` + `@Where` (Recommended)

Hibernate intercepts DELETE and auto-filters all queries — no manual handling needed.

```java
@Entity
@SQLDelete(sql = "UPDATE user SET deleted = true WHERE id = ?")
// ↑ intercepts DELETE → converts to UPDATE automatically

@Where(clause = "deleted = false")
// ↑ auto-appends WHERE deleted = false to EVERY query on this entity

public class User {
    @Id
    private Long id;
    private String name;

    @Column(nullable = false)
    private boolean deleted = false;
}
```

### Everything is now automatic

```java
// This call:
userRepository.deleteById(1L);
// Hibernate fires UPDATE instead of DELETE:
// UPDATE user SET deleted = true WHERE id = 1

// This call:
userRepository.findAll();
// Hibernate auto-appends filter:
// SELECT * FROM user WHERE deleted = false

// This call:
userRepository.findById(1L);
// Hibernate auto-appends filter:
// SELECT * FROM user WHERE id = 1 AND deleted = false
// → returns empty Optional if user is soft-deleted
```

---

## Way 3 — Hibernate `@SoftDelete` (Hibernate 6.4+)

Newest approach — single annotation, cleanest syntax.

```java
// default — uses "deleted" boolean column
@Entity
@SoftDelete
public class User { ... }

// customize column name
@Entity
@SoftDelete(columnName = "is_deleted")
public class User { ... }

// reversed strategy — true means ACTIVE, false means deleted
@Entity
@SoftDelete(
    columnName = "is_active",
    strategy = SoftDeleteType.ACTIVE
)
public class User { ... }
```

---

## Handling the `deleted` Column

```java
// Option 1 — Boolean flag (most common)
private boolean deleted = false;

// Option 2 — Timestamp (know WHEN it was deleted)
private LocalDateTime deletedAt;

// With timestamp — @SQLDelete + @Where
@SQLDelete(sql = "UPDATE user SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class User {
    private LocalDateTime deletedAt;
}
```

---

## Querying Deleted Records (Bypass `@Where`)

Sometimes you need to see deleted records — e.g. admin panel, audit log.

### Option A — Native query (simplest)

```java
// bypass @Where with nativeQuery = true
@Query(value = "SELECT * FROM user WHERE id = :id", nativeQuery = true)
Optional<User> findByIdIncludeDeleted(@Param("id") Long id);

@Query(value = "SELECT * FROM user", nativeQuery = true)
List<User> findAllIncludeDeleted();
```

### Option B — `@FilterDef` + `@Filter` (most flexible)

Toggle the filter on/off per session — more control than `@Where`.

```java
@Entity
@SQLDelete(sql = "UPDATE user SET deleted = true WHERE id = ?")
@FilterDef(
    name = "deletedFilter",
    parameters = @ParamDef(name = "deleted", type = Boolean.class)
)
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
public class User { ... }

// Enable or disable filter per request
@Service
public class UserService {

    @PersistenceContext
    private EntityManager em;

    public List<User> findAll(boolean includeDeleted) {
        if (!includeDeleted) {
            Session session = em.unwrap(Session.class);
            session.enableFilter("deletedFilter")
                   .setParameter("deleted", false);
        }
        return userRepository.findAll();
    }
}
```

### `@Where` vs `@FilterDef`

| | `@Where` | `@FilterDef` + `@Filter` |
|---|---|---|
| Always applied | ✓ cannot turn off | ✗ toggle per session |
| Bypass possible | Only via native query | ✓ just don't enable filter |
| Setup | Simple | More verbose |
| Best for | Always filter deleted | Need to sometimes include deleted |

---

## Soft Delete + Unique Constraint Problem

```
Normal:
  john@example.com → active → unique ✓

With soft delete:
  john@example.com → deleted = true
  john@example.com → new registration → FAILS unique constraint!
  ↑ even though old record is "deleted"
```

### Solutions

```sql
-- Option 1: partial unique index (PostgreSQL)
CREATE UNIQUE INDEX idx_user_email
ON user(email)
WHERE deleted = false;
-- only enforces uniqueness on non-deleted rows

-- Option 2: MySQL workaround — use deletedAt timestamp
-- NULL means active, timestamp means deleted
-- unique constraint on (email, deleted_at) — NULLs are not compared
```

```java
// Option 3: deletedAt timestamp instead of boolean
@SQLDelete(sql = "UPDATE user SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class User {
    // unique constraint on email only applies when deleted_at IS NULL
    @Column(unique = true)
    private String email;

    private LocalDateTime deletedAt;
}
```

---

## Soft Delete with Relationships

```java
@Entity
@SQLDelete(sql = "UPDATE order SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class Order {
    @Id
    private Long id;

    @ManyToOne
    private User user;
    // ⚠️ if User is soft-deleted, Order still references the deleted User
}
```

Need to cascade soft delete manually:

```java
@Service
public class UserService {

    public void delete(Long userId) {
        userRepository.deleteById(userId);       // soft deletes User
        orderRepository.deleteByUserId(userId);  // must also soft delete Orders
    }
}
```

---

## Restore a Soft-Deleted Record

```java
// @SQLDelete and @Where only affect DELETE and SELECT
// UPDATE still works normally — use it to restore

@Modifying
@Transactional
@Query("UPDATE User u SET u.deleted = false WHERE u.id = :id")
void restore(@Param("id") Long id);

// or with native query
@Modifying
@Transactional
@Query(value = "UPDATE user SET deleted = false WHERE id = :id", nativeQuery = true)
void restore(@Param("id") Long id);
```

---

## All 3 Ways Compared

| | Manual | `@SQLDelete` + `@Where` | `@SoftDelete` (6.4+) |
|---|---|---|---|
| Setup effort | High | Low | Lowest |
| Auto-filter queries | ✗ manual everywhere | ✓ automatic | ✓ automatic |
| Intercept DELETE | ✗ manual | ✓ automatic | ✓ automatic |
| Bypass filter | Easy | Native query needed | Native query needed |
| Hibernate version | Any | Any | 6.4+ only |
| Flexibility | Highest | High | Medium |
| Best for | Full control | Most projects | Hibernate 6.4+ projects |

---

## Decision Flow

```
Need soft delete?
        ↓
On Hibernate 6.4+?
  ✓ → @SoftDelete (simplest, one annotation)

Older Hibernate?
        ↓
Need to bypass filter and query deleted records easily?
  ✓ → @SQLDelete + @FilterDef (toggleable)
  ✗ → @SQLDelete + @Where (recommended default)
```

---

## Common Pitfalls

```
1. Forgetting @Where bypasses with native queries
   → @Where only applies to JPQL / Criteria — native queries bypass it

2. Unique constraint conflicts on re-registration
   → use partial index or deletedAt timestamp

3. Not cascading soft delete to child entities
   → must manually soft delete related records

4. @Where is permanent — cannot be toggled
   → use @FilterDef if you need to sometimes include deleted records

5. L2 cache may serve stale data after soft delete
   → evict cache after soft delete operation
```
