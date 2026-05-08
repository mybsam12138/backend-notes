# Spring Framework — Overview

Spring is a **comprehensive application framework for Java**.
Its core job is to manage your objects and their dependencies,
so you focus on business logic instead of wiring code.

---

## The Core Idea — Inversion of Control (IoC)

Normally **you** create and manage objects:

```java
// Traditional way — you control everything
UserService userService = new UserService();
UserRepository repo = new UserRepository();
userService.setRepository(repo);
```

With Spring — **Spring controls it for you**:

```java
// Spring way — Spring creates and wires everything
@Service
public class UserService {
    @Autowired
    private UserRepository repo; // Spring injects this
}
```

> You don't create objects — you just **declare** them, Spring **manages** them.
> This is called **Inversion of Control (IoC)**.

---

## Two Core Concepts

### 1. IoC Container
- The **heart** of Spring
- Creates, manages, and destroys objects for you
- The objects it manages are called **Beans**
- Main implementation: `ApplicationContext`

### 2. Dependency Injection (DI)
- How IoC works in practice
- Spring **injects** dependencies a class needs automatically
- No need to `new` anything manually
- Three ways to inject:

```java
// ① Constructor Injection (recommended)
@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo; // Spring injects via constructor
    }
}

// ② Field Injection
@Service
public class UserService {
    @Autowired
    private UserRepository repo; // Spring injects directly
}

// ③ Setter Injection
@Service
public class UserService {
    private UserRepository repo;

    @Autowired
    public void setRepo(UserRepository repo) {
        this.repo = repo;
    }
}
```

---

## What is a Bean?

A **Bean** is any object managed by the Spring IoC Container.

You declare a Bean using annotations:

| Annotation | Used On | Purpose |
|---|---|---|
| `@Component` | Any class | Generic Spring-managed bean |
| `@Service` | Service class | Business logic layer |
| `@Repository` | DAO class | Data access layer |
| `@Controller` | Web class | Presentation layer (MVC) |
| `@Bean` | Method in `@Configuration` | Manual bean declaration |

```java
@Service                       // tells Spring: manage this class as a Bean
public class UserService { ... }

@Repository                    // tells Spring: manage this class as a Bean
public class UserRepository { ... }
```

Spring scans your classes, finds these annotations, creates the objects,
and wires them together automatically.

---

## The IoC Container Flow

```
Spring starts up
      ↓
Scans all @Component, @Service, @Repository, @Controller...
      ↓
Creates all Bean instances
      ↓
Injects dependencies between Beans (DI)
      ↓
Application is ready
      ↓
Your code runs — no manual object creation needed
```

---

## What Spring Provides (Modules)

| Module | What It Does |
|---|---|
| **Spring Core** | IoC Container, Dependency Injection |
| **Spring MVC** | Web layer — REST API, Server-Side Rendering |
| **Spring Data JPA** | Database access — repositories, queries |
| **Spring Security** | Authentication, Authorization |
| **Spring Transaction** | `@Transactional` — manage DB transactions |
| **Spring AOP** | Aspect-Oriented Programming — cross-cutting concerns |
| **Spring Test** | Testing support with Spring context |
| **Spring Boot** | Auto-configuration, embedded Tomcat, starter packs |

---

## Spring vs Spring MVC vs Spring Boot

```
┌─────────────────────────────────────┐
│             Spring Boot             │  ← Auto-config, embedded Tomcat, starter packs
│  ┌───────────────────────────────┐  │
│  │        Spring Framework       │  │  ← Core IoC, DI, all modules
│  │  ┌─────────┐  ┌───────────┐  │  │
│  │  │Spring   │  │Spring Data│  │  │
│  │  │   MVC   │  │    JPA    │  │  │
│  │  └─────────┘  └───────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

| | What it is |
|---|---|
| **Spring** | The full framework — IoC, DI, and all modules |
| **Spring MVC** | One module of Spring — handles web/HTTP layer |
| **Spring Boot** | Wrapper on Spring — makes setup fast and opinionated |

---

## Spring in the Application Layer Picture

```
┌──────────────────────────────────────┐
│  Presentation Layer                  │  ← Spring MVC (@Controller, @RestController)
├──────────────────────────────────────┤
│  Service Layer                       │  ← @Service, @Transactional
├──────────────────────────────────────┤
│  Repository Layer                    │  ← @Repository, Spring Data JPA
├──────────────────────────────────────┤
│  Database                            │  ← MySQL, PostgreSQL...
└──────────────────────────────────────┘
           ↑ All layers managed by Spring IoC Container
```

---

## AOP — Aspect Oriented Programming

Spring also supports **AOP** — handling cross-cutting concerns without polluting business logic.

Common use cases:

| Concern | Without AOP | With AOP |
|---|---|---|
| Logging | Add log code in every method | One `@Aspect` handles all |
| Transaction | Manage tx in every service | `@Transactional` annotation |
| Security | Check auth in every controller | One aspect intercepts all |

```java
@Aspect
@Component
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint jp) {
        System.out.println("Calling: " + jp.getSignature().getName());
    }
}
```

---

## Key Annotations Summary

| Annotation | Purpose |
|---|---|
| `@Component` | Generic bean declaration |
| `@Service` | Service layer bean |
| `@Repository` | Data access bean |
| `@Controller` | Web MVC controller |
| `@RestController` | REST API controller |
| `@Autowired` | Inject a dependency |
| `@Configuration` | Define configuration class |
| `@Bean` | Declare a bean manually |
| `@Transactional` | Manage database transaction |
| `@Aspect` | Declare an AOP aspect |

---

## One-liner Summary

> **Spring is a Java framework whose core is an IoC Container** — it manages your objects (Beans)
> and their dependencies (DI), so you write less wiring code and focus on business logic.
> Everything else (MVC, Security, Data, Boot) is built on top of this core.
