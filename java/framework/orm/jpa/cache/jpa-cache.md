# JPA Cache

## Overview

Cache in JPA is split into two levels — L1 and L2. Ownership is shared between the JPA spec and the provider (e.g. Hibernate).

| Concept | JPA Spec | Hibernate specific |
|---|---|---|
| L1 cache (persistence context) | ✓ mandatory | — |
| L2 cache API  (`@Cacheable`) | ✓ | — |
| L2 cache implementation | — | ✓ |
| Cache provider integration (EhCache, Redis…) | — | ✓ |
| Cache regions & eviction | — | ✓ |
| Query cache | — | ✓ Hibernate only |

---

## Level 1 Cache (L1)

**Owner: JPA spec — mandatory for all providers.**

The JPA spec calls L1 the **persistence context**. Every `EntityManager` instance has one automatically — you cannot disable it.

### How it works

```java
User u1 = em.find(User.class, 1L);  // hits DB → SQL executed
User u2 = em.find(User.class, 1L);  // hits L1 cache → no SQL!

System.out.println(u1 == u2);  // true — exact same object in memory
```

### Characteristics

- Scoped to **one `EntityManager` instance** — not shared across instances
- Always on — cannot be disabled
- Cleared when `EntityManager` closes, or manually via `em.clear()`
- Individual entity removed from cache via `em.detach(entity)`

### Lifecycle

```
EntityManager opens
      ↓
em.find() → DB hit → entity stored in L1
      ↓
em.find() same id → L1 hit → no DB call
      ↓
em.clear() → L1 wiped
      ↓
EntityManager closes → L1 destroyed
```

### Limitation

Because L1 is scoped to one `EntityManager`, it does **not** help across different requests or sessions. Each new request gets a fresh `EntityManager` with an empty L1 cache.

---

## Level 2 Cache (L2)

**Owner: JPA spec defines the API — Hibernate implements the behavior.**

L2 cache is shared across all `EntityManager` instances within the same `EntityManagerFactory`. It survives after an `EntityManager` closes.

### How it works

```
Request 1 → EntityManager A → em.find(User, 1L) → DB hit → stored in L2
Request 2 → EntityManager B → em.find(User, 1L) → L2 hit → no DB call
```

### Setup (Spring Boot + Hibernate + EhCache)

**1. Add dependencies:**
```xml
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-jcache</artifactId>
</dependency>
<dependency>
    <groupId>org.ehcache</groupId>
    <artifactId>ehcache</artifactId>
</dependency>
```

**2. Enable in `application.yml`:**
```yaml
spring:
  jpa:
    properties:
      hibernate:
        cache:
          use_second_level_cache: true
          region.factory_class: org.hibernate.cache.jcache.JCacheRegionFactory
        javax:
          cache:
            provider: org.ehcache.jsr107.EhcacheCachingProvider
```

**3. Mark entity as cacheable (JPA annotation):**
```java
@Entity
@Cacheable(true)
public class User {
    @Id
    private Long id;
    private String name;
}
```

### Characteristics

- Scoped to **`EntityManagerFactory`** — shared across all sessions
- **Off by default** — must be explicitly enabled
- Requires a third-party cache provider (EhCache, Redis, Caffeine, Hazelcast)
- Best for entities that are read frequently and rarely updated

### Cache store modes (JPA spec)

```java
// Control per-query behavior
em.find(User.class, 1L, Map.of(
    "javax.persistence.cache.retrieveMode", CacheRetrieveMode.BYPASS,  // skip cache, go to DB
    "javax.persistence.cache.storeMode",   CacheStoreMode.REFRESH      // update cache after DB read
));
```

| Mode | Effect |
|---|---|
| `CacheRetrieveMode.USE` | Read from cache if available (default) |
| `CacheRetrieveMode.BYPASS` | Skip cache, always go to DB |
| `CacheStoreMode.USE` | Store in cache after DB read (default) |
| `CacheStoreMode.BYPASS` | Do not store in cache |
| `CacheStoreMode.REFRESH` | Force update cache from DB |

### Evict cache manually

```java
Cache cache = emf.getCache();

cache.evict(User.class, 1L);   // evict one entity
cache.evict(User.class);        // evict all User entities
cache.evictAll();               // evict everything
```

---

## Query Cache (Hibernate only — not in JPA spec)

Caches the **result set of a query** (list of IDs), not the entities themselves. Works together with L2 cache.

```yaml
# Enable query cache
spring:
  jpa:
    properties:
      hibernate:
        cache:
          use_query_cache: true
```

```java
// Mark a query as cacheable
List<User> users = em.createQuery("SELECT u FROM User u WHERE u.status = :status", User.class)
    .setParameter("status", "ACTIVE")
    .setHint("org.hibernate.cacheable", true)
    .getResultList();
```

### How query cache works

```
First call  → DB hit → result IDs [1, 2, 3] stored in query cache
                     → entities stored in L2 cache

Second call → query cache hit → gets IDs [1, 2, 3]
                              → loads each entity from L2 cache
                              → no DB call
```

> Query cache is only useful when the query is called frequently with the same parameters and the underlying data changes rarely.

---

## L1 vs L2 vs Query Cache

| | L1 Cache | L2 Cache | Query Cache |
|---|---|---|---|
| JPA spec | ✓ | ✓ (API only) | ✗ Hibernate only |
| Scope | One `EntityManager` | Whole app | Whole app |
| Default | Always on | Off | Off |
| Survives request | ✗ | ✓ | ✓ |
| What is cached | Entity objects | Entity objects | Query result IDs |
| Needs config | No | Yes | Yes |
| Needs third-party lib | No | Yes | No (but needs L2) |

---

## The Full Chain

```
JPA says:
  "L1 cache is mandatory"
  "L2 cache API must exist (@Cacheable, CacheRetrieveMode, CacheStoreMode)"
  "providers may implement L2 as they wish"

Hibernate says:
  "Here is how L2 actually works"
  "Here is query cache (bonus, not in JPA spec)"
  "Plug in EhCache / Redis / Caffeine to store the data"

EhCache / Redis / Caffeine:
  "We store the actual cached data"
```

---

## When to use each

| Scenario | Use |
|---|---|
| Same entity loaded multiple times in one request | L1 (automatic) |
| Same entity loaded across many requests | L2 |
| Reference data (countries, categories, config) | L2 — perfect fit |
| Frequently run query with same params | Query cache |
| Entity updated frequently | Skip L2 — cache invalidation overhead not worth it |
| Financial / real-time data | Skip all caches — always need fresh data |
