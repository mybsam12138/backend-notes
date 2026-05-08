# IoC Container — Overview

The **IoC Container** is the heart of the Spring Framework.
It creates, configures, manages, and destroys your objects (Beans)
so you don't have to do it manually.

---

## What is IoC (Inversion of Control)?

Normally **you** are in control of object creation:

```java
// Traditional — you create everything manually
UserRepository repo = new UserRepository();
UserService service = new UserService(repo);
UserController controller = new UserController(service);
```

With IoC — **Spring is in control**:

```java
// IoC — you just declare, Spring creates and wires
@Repository
public class UserRepository { ... }

@Service
public class UserService {
    @Autowired
    private UserRepository repo; // Spring injects this
}

@RestController
public class UserController {
    @Autowired
    private UserService service; // Spring injects this
}
```

> Control of object creation is **inverted** from you → to Spring.
> That is why it is called **Inversion of Control**.

---

## What the IoC Container Does

| Responsibility | Description |
|---|---|
| **Create Beans** | Instantiates your objects |
| **Configure Beans** | Sets properties, injects dependencies |
| **Wire Beans** | Connects objects that depend on each other |
| **Manage Lifecycle** | Controls when beans are created and destroyed |
| **Provide Beans** | Gives you beans when requested |

---

## Two Main IoC Container Types

### 1. BeanFactory
- Basic container — bare minimum
- Lazy loads beans (creates only when requested)
- Rarely used directly today

### 2. ApplicationContext
- Extended container — builds on BeanFactory
- Eager loads beans by default (creates all at startup)
- Adds extra features:
  - Event publishing
  - Internationalization (i18n)
  - AOP integration
  - Environment & property management
- **This is what you always use in practice**

```
BeanFactory  (basic)
     ↑
ApplicationContext  (full-featured) ← always use this
     ↑
  ┌──────────────────────────────────┐
  │ AnnotationConfigApplicationContext  ← Java config |
  │ ClassPathXmlApplicationContext      ← XML config  |
  │ WebApplicationContext               ← Web apps    |
  └──────────────────────────────────┘
```

---

## How the IoC Container Works

```
Spring Application Starts
        ↓
IoC Container initializes
        ↓
Scans for Bean definitions
(@Component, @Service, @Repository, @Controller, @Bean)
        ↓
Creates Bean instances
        ↓
Injects dependencies between Beans (DI)
        ↓
Beans are ready to use
        ↓
Application runs
        ↓
Application shuts down → Container destroys Beans
```

---

## Bean Definition — How to Declare Beans

### ① Annotation-based (most common)

```java
@Component      // generic bean
@Service        // service layer bean
@Repository     // data access bean
@Controller     // web layer bean
```

```java
@Service
public class UserService { ... } // IoC container manages this
```

### ② Java Config

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService() {
        return new UserService(); // IoC container manages this
    }
}
```

### ③ XML Config (legacy)

```xml
<bean id="userService" class="com.example.UserService"/>
```

---

## Bean Lifecycle

```
Instantiation      → Container creates the Bean object
        ↓
Population         → Dependencies injected (DI)
        ↓
Initialization     → @PostConstruct method runs
        ↓
In Use             → Bean is available for the application
        ↓
Destruction        → @PreDestroy method runs on shutdown
```

```java
@Service
public class UserService {

    @PostConstruct
    public void init() {
        // runs after bean is created and dependencies injected
        System.out.println("UserService initialized");
    }

    @PreDestroy
    public void destroy() {
        // runs before bean is destroyed on shutdown
        System.out.println("UserService destroyed");
    }
}
```

---

## Bean Scope

Scope defines **how many instances** of a Bean the container creates.

| Scope | Description | Default? |
|---|---|---|
| **singleton** | One instance per container | ✅ Yes |
| **prototype** | New instance every time requested | No |
| **request** | One instance per HTTP request (web) | No |
| **session** | One instance per HTTP session (web) | No |

```java
@Service
@Scope("singleton")   // default — one shared instance
public class UserService { ... }

@Component
@Scope("prototype")   // new instance every time
public class ReportGenerator { ... }
```

---

## Dependency Injection (DI) — How Container Wires Beans

The container injects dependencies automatically in three ways:

### ① Constructor Injection (recommended)
```java
@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) { // container injects here
        this.repo = repo;
    }
}
```

### ② Field Injection
```java
@Service
public class UserService {
    @Autowired
    private UserRepository repo; // container injects here
}
```

### ③ Setter Injection
```java
@Service
public class UserService {
    private UserRepository repo;

    @Autowired
    public void setRepo(UserRepository repo) { // container injects here
        this.repo = repo;
    }
}
```

> **Constructor Injection is recommended** — dependencies are explicit,
> immutable (`final`), and easier to test.

---

## ApplicationContext in Code

```java
// Manually getting beans from container (rarely needed)
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

UserService service = context.getBean(UserService.class);
service.doSomething();
```

In Spring Boot — the container starts automatically, you never touch it directly.

---

## IoC Container in the Big Picture

```
┌──────────────────────────────────────────┐
│           IoC Container                  │
│                                          │
│  Bean: UserController                    │
│         ↓ depends on                     │
│  Bean: UserService                       │
│         ↓ depends on                     │
│  Bean: UserRepository                    │
│         ↓ depends on                     │
│  Bean: DataSource (DB connection)        │
│                                          │
│  Container wires all of these together   │
└──────────────────────────────────────────┘
```

---

## Key Annotations Summary

| Annotation | Purpose |
|---|---|
| `@Component` | Declare a generic bean |
| `@Service` | Declare a service layer bean |
| `@Repository` | Declare a data access bean |
| `@Controller` | Declare a web layer bean |
| `@Configuration` | Declare a configuration class |
| `@Bean` | Declare a bean manually in a config class |
| `@Autowired` | Inject a dependency |
| `@Scope` | Set the bean scope |
| `@PostConstruct` | Run method after bean initialization |
| `@PreDestroy` | Run method before bean destruction |

---

## One-liner Summary

> The **IoC Container** is Spring's core engine — it reads your Bean declarations,
> creates all objects, injects their dependencies, manages their lifecycle,
> and destroys them on shutdown. You declare **what** you need;
> the container figures out **how** to wire it all together.
