# Interceptor in JPA & Hibernate — Overview

## The Mental Model

```
Your code
     ↓
JPA API (EntityManager)
     ↓                    ← JPA level interceptors here (@EntityListeners)
Hibernate
     ↓                    ← Hibernate level interceptors here (Interceptor / EventListener)
SQL → DB
```

Hibernate fires internal events for every DB operation. Your interceptor sits on that event bus and runs your code before or after the actual DB operation.

---

## Which Action Fires Which Event

```
userRepository.save()        → @PrePersist    → onSave()           → PRE_INSERT
  (new entity)               → @PostPersist   →                    → POST_INSERT

userRepository.save()        → @PreUpdate     → onFlushDirty()     → PRE_UPDATE
  (existing entity)          → @PostUpdate    →                    → POST_UPDATE

userRepository.delete()      → @PreRemove     → onDelete()         → PRE_DELETE
                             → @PostRemove    →                    → POST_DELETE

em.find() / SELECT           → @PostLoad      → onLoad()           → POST_LOAD

em.flush()                   →                → onPrepareStatement() → PRE_FLUSH
```

---

## Three Ways to Intercept

```
Hibernate fires event
        ↓
┌────────────────────────────────────────────────────┐
│  Way 1 — JPA @EntityListeners (JPA spec)           │
│  @PrePersist, @PostLoad etc.                       │
│  → per entity type, simplest                       │
├────────────────────────────────────────────────────┤
│  Way 2 — Hibernate Interceptor (Hibernate only)    │
│  extends EmptyInterceptor                          │
│  onSave(), onFlushDirty(), onDelete()...           │
│  → global, all entities                            │
├────────────────────────────────────────────────────┤
│  Way 3 — Hibernate EventListener (Hibernate only)  │
│  implements PreInsertEventListener etc.            │
│  → global, can VETO (cancel) the operation        │
└────────────────────────────────────────────────────┘
        ↓
Hibernate continues (unless vetoed)
        ↓
SQL sent to DB
```

---

## Way 1 — JPA `@EntityListeners`

**Owner: JPA spec** — works with any JPA provider (Hibernate, EclipseLink etc.)

Fires only for the specific entity type it is attached to.

### Option A — External listener class

```java
// Listener class
public class UserListener {

    @PrePersist
    public void beforeInsert(User user) {
        System.out.println("Before INSERT: " + user.getName());
    }

    @PostPersist
    public void afterInsert(User user) {
        System.out.println("After INSERT: " + user.getName());
    }

    @PreUpdate
    public void beforeUpdate(User user) {
        System.out.println("Before UPDATE: " + user.getName());
    }

    @PostUpdate
    public void afterUpdate(User user) {
        System.out.println("After UPDATE: " + user.getName());
    }

    @PreRemove
    public void beforeDelete(User user) {
        System.out.println("Before DELETE: " + user.getName());
    }

    @PostRemove
    public void afterDelete(User user) {
        System.out.println("After DELETE: " + user.getName());
    }

    @PostLoad
    public void afterLoad(User user) {
        System.out.println("Loaded: " + user.getName());
    }
}

// Attach to entity
@Entity
@EntityListeners(UserListener.class)
public class User {
    @Id
    private Long id;
    private String name;
}

// Attach multiple listeners
@Entity
@EntityListeners({AuditingEntityListener.class, UserListener.class})
public class User { ... }
```

### Option B — Directly on the entity

```java
@Entity
public class User {

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void beforeInsert() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void beforeUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PostLoad
    public void afterLoad() {
        System.out.println("Loaded user: " + this.name);
    }
}
```

### JPA lifecycle annotations

| Annotation | Fires when | Can modify entity? | Can cancel? |
|---|---|---|---|
| `@PrePersist` | Before INSERT | ✓ | ✗ |
| `@PostPersist` | After INSERT | ✗ | ✗ |
| `@PreUpdate` | Before UPDATE | ✓ | ✗ |
| `@PostUpdate` | After UPDATE | ✗ | ✗ |
| `@PreRemove` | Before DELETE | ✗ | ✗ |
| `@PostRemove` | After DELETE | ✗ | ✗ |
| `@PostLoad` | After SELECT / load | ✓ | ✗ |

---

## Way 2 — Hibernate `Interceptor`

**Owner: Hibernate only** — not part of JPA spec.

Global — fires for every entity across the whole app.

### What is `EmptyInterceptor`?

Hibernate's `Interceptor` is an interface with many methods — you would be forced to implement all of them. `EmptyInterceptor` is a convenience base class that pre-implements all methods as empty do-nothing defaults, so you only override what you care about.

```java
// Without EmptyInterceptor — must implement ALL methods (tedious)
public class MyInterceptor implements Interceptor {
    @Override public boolean onSave(...)       { return false; }  // forced
    @Override public boolean onFlushDirty(...) { return false; }  // forced
    @Override public void onDelete(...)        { }                // forced
    @Override public boolean onLoad(...)       { return false; }  // forced
    @Override public String onPrepareStatement(String sql) { return sql; } // forced
    // ... many more forced
}

// With EmptyInterceptor — only override what you need
@Component
public class GlobalHibernateInterceptor extends EmptyInterceptor {

    // fires before INSERT
    @Override
    public boolean onSave(Object entity, Object id,
                          Object[] state, String[] propertyNames,
                          Type[] types) {
        System.out.println("INSERT: " + entity.getClass().getSimpleName());
        return false;  // return true if you modified state[]
    }

    // fires before UPDATE — has both currentState and previousState
    @Override
    public boolean onFlushDirty(Object entity, Object id,
                                Object[] currentState,
                                Object[] previousState,
                                String[] propertyNames,
                                Type[] types) {
        System.out.println("UPDATE: " + entity.getClass().getSimpleName());
        return false;
    }

    // fires before DELETE
    @Override
    public void onDelete(Object entity, Object id,
                         Object[] state, String[] propertyNames,
                         Type[] types) {
        System.out.println("DELETE: " + entity.getClass().getSimpleName());
    }

    // fires after SELECT / load
    @Override
    public boolean onLoad(Object entity, Object id,
                          Object[] state, String[] propertyNames,
                          Type[] types) {
        System.out.println("LOAD: " + entity.getClass().getSimpleName());
        return false;
    }

    // fires before every SQL statement — can modify the SQL
    @Override
    public String onPrepareStatement(String sql) {
        System.out.println("SQL: " + sql);
        return sql;  // return modified SQL if needed
    }
}
```

### Hibernate Interceptor method summary

| Method | Fires when | Can modify state? | Can cancel? |
|---|---|---|---|
| `onSave()` | Before INSERT | ✓ via state[] | ✗ |
| `onFlushDirty()` | Before UPDATE | ✓ via state[] | ✗ |
| `onDelete()` | Before DELETE | ✗ | ✗ |
| `onLoad()` | After SELECT | ✓ via state[] | ✗ |
| `onPrepareStatement()` | Before SQL sent | ✓ return new SQL | ✗ |
| `preFlush()` | Before flush | ✗ | ✗ |
| `postFlush()` | After flush | ✗ | ✗ |

### Register in Spring Boot

```java
@Configuration
public class HibernateConfig {

    @Autowired
    private GlobalHibernateInterceptor interceptor;

    @Bean
    public HibernatePropertiesCustomizer hibernateCustomizer() {
        return properties -> properties.put(
            "hibernate.session_factory.interceptor", interceptor
        );
    }
}
```

---

## Way 3 — Hibernate `EventListener`

**Owner: Hibernate only** — most powerful, can **veto (cancel)** operations.

```java
@Component
public class PreInsertListener implements PreInsertEventListener {

    @Override
    public boolean onPreInsert(PreInsertEvent event) {
        Object entity = event.getEntity();
        System.out.println("Pre insert: " + entity);

        // return false → allow insert to continue
        // return true  → VETO — cancel the insert entirely
        return false;
    }
}

@Component
public class PreUpdateListener implements PreUpdateEventListener {

    @Override
    public boolean onPreUpdate(PreUpdateEvent event) {
        // access old and new state
        Object[] oldState = event.getOldState();
        Object[] newState = event.getState();
        String[] names    = event.getPersister().getPropertyNames();

        for (int i = 0; i < names.length; i++) {
            if (!Objects.equals(oldState[i], newState[i])) {
                System.out.println(names[i] + " changed: "
                    + oldState[i] + " → " + newState[i]);
            }
        }
        return false;
    }
}

@Component
public class PreDeleteListener implements PreDeleteEventListener {

    @Override
    public boolean onPreDelete(PreDeleteEvent event) {
        Object entity = event.getEntity();
        if (entity instanceof User user && user.isAdmin()) {
            throw new IllegalStateException("Cannot delete admin user!");
        }
        return false;
    }
}
```

### Register EventListeners in Spring Boot

```java
@Configuration
public class HibernateEventConfig {

    @Autowired private PreInsertListener preInsertListener;
    @Autowired private PreUpdateListener preUpdateListener;
    @Autowired private PreDeleteListener preDeleteListener;

    @Bean
    public HibernatePropertiesCustomizer eventCustomizer(EntityManagerFactory emf) {
        SessionFactoryImpl sf = emf.unwrap(SessionFactoryImpl.class);
        EventListenerRegistry registry = sf.getServiceRegistry()
                                           .getService(EventListenerRegistry.class);

        registry.appendListeners(EventType.PRE_INSERT, preInsertListener);
        registry.appendListeners(EventType.PRE_UPDATE, preUpdateListener);
        registry.appendListeners(EventType.PRE_DELETE, preDeleteListener);
        return p -> {};
    }
}
```

### Available EventTypes

| EventType | Fires when | Can veto? |
|---|---|---|
| `PRE_INSERT` | Before INSERT | ✓ |
| `POST_INSERT` | After INSERT | ✗ |
| `PRE_UPDATE` | Before UPDATE | ✓ |
| `POST_UPDATE` | After UPDATE | ✗ |
| `PRE_DELETE` | Before DELETE | ✓ |
| `POST_DELETE` | After DELETE | ✗ |
| `POST_LOAD` | After SELECT | ✗ |
| `PRE_FLUSH` | Before flush | ✗ |
| `POST_FLUSH` | After flush | ✗ |

---

## Real World Use Cases

### 1. Audit log — track every field change

```java
@Override
public boolean onFlushDirty(Object entity, Object id,
                             Object[] currentState,
                             Object[] previousState,
                             String[] propertyNames, Type[] types) {
    for (int i = 0; i < propertyNames.length; i++) {
        if (!Objects.equals(previousState[i], currentState[i])) {
            auditLogService.log(
                entity.getClass().getSimpleName(),
                propertyNames[i],
                previousState[i],   // old value
                currentState[i]     // new value
            );
        }
    }
    return false;
}
```

### 2. Encrypt / decrypt sensitive fields

```java
// encrypt before saving
@Override
public boolean onSave(Object entity, Object id,
                      Object[] state, String[] propertyNames, Type[] types) {
    for (int i = 0; i < propertyNames.length; i++) {
        if (propertyNames[i].equals("creditCard")) {
            state[i] = encrypt((String) state[i]);
            return true;  // must return true — state[] was modified
        }
    }
    return false;
}

// decrypt after loading
@Override
public boolean onLoad(Object entity, Object id,
                      Object[] state, String[] propertyNames, Type[] types) {
    for (int i = 0; i < propertyNames.length; i++) {
        if (propertyNames[i].equals("creditCard")) {
            state[i] = decrypt((String) state[i]);
            return true;
        }
    }
    return false;
}
```

### 3. Log all SQL statements

```java
@Override
public String onPrepareStatement(String sql) {
    log.debug("SQL: {}", sql);
    return sql;
}
```

### 4. Auto-set audit fields globally

```java
@Override
public boolean onSave(Object entity, Object id,
                      Object[] state, String[] propertyNames, Type[] types) {
    for (int i = 0; i < propertyNames.length; i++) {
        if (propertyNames[i].equals("createdBy")) {
            state[i] = SecurityContextHolder.getContext()
                           .getAuthentication().getName();
            return true;
        }
    }
    return false;
}
```

---

## Full Comparison

| | JPA `@EntityListeners` | Hibernate `Interceptor` | Hibernate `EventListener` |
|---|---|---|---|
| Owner | JPA spec | Hibernate only | Hibernate only |
| Scope | One entity type | All entities (global) | All entities (global) |
| Setup | `@EntityListeners` annotation | Register in config | Register in config |
| Base class | — | `EmptyInterceptor` | implement event interface |
| Access old + new state | ✗ | ✓ `onFlushDirty()` | ✓ `event.getOldState()` |
| Can modify state? | Limited | ✓ return true | ✓ |
| Can veto (cancel)? | ✗ | ✗ | ✓ return true |
| Power level | Low | Medium | Highest |
| Best for | Simple per-entity hooks | Global audit / SQL logging | Cancel operations, encrypt |

---

## Decision Flow

```
Need to intercept DB operations?
        ↓
Specific entity only?
  ✓ → @EntityListeners (JPA spec, simplest)

All entities globally?
        ↓
Need to CANCEL (veto) the operation?
  ✓ → Hibernate EventListener (most powerful)
  ✗ → Hibernate Interceptor (simpler, good for audit / logging)
```
