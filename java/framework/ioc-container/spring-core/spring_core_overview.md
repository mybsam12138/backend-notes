# Spring Core — Overview & Core Mechanisms

**Spring Core** is the foundation module of the entire Spring Framework.
Every other Spring module (MVC, Data, Security, Boot) is built on top of it.
Its primary job is **managing objects and their dependencies**.

---

## What Spring Core Provides

```
┌──────────────────────────────────────────┐
│              Spring Core                 │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │         IoC Container           │    │  ← manages Beans
│  ├─────────────────────────────────┤    │
│  │     Dependency Injection (DI)   │    │  ← wires Beans together
│  ├─────────────────────────────────┤    │
│  │         Bean Lifecycle          │    │  ← create, init, destroy
│  ├─────────────────────────────────┤    │
│  │         Bean Scope              │    │  ← singleton, prototype...
│  ├─────────────────────────────────┤    │
│  │    Resource & Environment       │    │  ← config, properties
│  ├─────────────────────────────────┤    │
│  │    Expression Language (SpEL)   │    │  ← dynamic expressions
│  ├─────────────────────────────────┤    │
│  │         Event System            │    │  ← publish/listen events
│  └─────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

---

## Core Mechanisms

---

### 1. IoC Container — The Heart

The container that **creates, manages, and destroys** all your objects (Beans).

Two container types:

| Container | Description |
|---|---|
| **BeanFactory** | Basic container, lazy loading, rarely used directly |
| **ApplicationContext** | Full-featured container, always used in practice |

```java
// ApplicationContext — the container itself
ApplicationContext context =
    new AnnotationConfigApplicationContext(AppConfig.class);

// get a bean from the container
UserService service = context.getBean(UserService.class);
```

In Spring Boot — container starts automatically, you never touch it directly.

---

### 2. Bean — The Managed Object

A **Bean** is any object whose lifecycle is managed by the IoC Container.

#### How to Declare Beans

**① Annotation-based (most common)**
```java
@Component      // generic bean
@Service        // service layer
@Repository     // data access layer
@Controller     // web layer
```

**② Java Config**
```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserService();
    }
}
```

**③ XML (legacy)**
```xml
<bean id="userService" class="com.example.UserService"/>
```

---

### 3. Dependency Injection (DI) — Wiring Beans

The mechanism by which the container **automatically injects** dependencies
into a Bean — no manual `new` needed.

#### Three Ways to Inject

**① Constructor Injection (recommended)**
```java
@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo; // injected by container
    }
}
```

**② Field Injection**
```java
@Service
public class UserService {
    @Autowired
    private UserRepository repo; // injected by container
}
```

**③ Setter Injection**
```java
@Service
public class UserService {
    private UserRepository repo;

    @Autowired
    public void setRepo(UserRepository repo) {
        this.repo = repo; // injected by container
    }
}
```

> **Constructor Injection is recommended** — dependencies are explicit,
> immutable (`final`), and easier to unit test.

#### Qualifier — Resolving Ambiguity

When multiple beans of the same type exist:

```java
@Service
public class UserService {
    @Autowired
    @Qualifier("mysqlUserRepository") // tell Spring which one to inject
    private UserRepository repo;
}
```

---

### 4. Bean Lifecycle — Create to Destroy

```
Container Starts
      ↓
Instantiation       → Container creates Bean instance
      ↓
Population          → Dependencies injected (DI)
      ↓
@PostConstruct      → Initialization callback runs
      ↓
Bean In Use         → Application uses the Bean
      ↓
@PreDestroy         → Destruction callback runs
      ↓
Container Shuts Down
```

```java
@Service
public class UserService {

    @PostConstruct
    public void init() {
        // runs after DI is complete
        System.out.println("UserService ready");
    }

    @PreDestroy
    public void cleanup() {
        // runs before container shuts down
        System.out.println("UserService shutting down");
    }
}
```

---

### 5. Bean Scope — How Many Instances

Scope controls **how many instances** of a Bean the container creates.

| Scope | Instances | Use Case |
|---|---|---|
| **singleton** | One per container (default) | Stateless services, repositories |
| **prototype** | New instance every request | Stateful objects |
| **request** | One per HTTP request | Web apps only |
| **session** | One per HTTP session | Web apps only |

```java
@Service
@Scope("singleton")    // default — one shared instance
public class UserService { ... }

@Component
@Scope("prototype")    // new instance every time
public class ReportGenerator { ... }
```

---

### 6. Component Scanning — Auto Bean Discovery

Spring scans your packages for annotated classes and registers them as Beans automatically.

```java
@Configuration
@ComponentScan("com.example")   // scan this package for Beans
public class AppConfig { ... }
```

In Spring Boot — `@SpringBootApplication` already includes component scanning:

```java
@SpringBootApplication   // includes @ComponentScan automatically
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

---

### 7. Environment & Properties — Externalized Configuration

Spring Core provides an **Environment** abstraction to read
configuration from properties files, environment variables, and system properties.

```properties
# application.properties
app.name=MyApp
app.timeout=30
```

```java
@Service
public class UserService {

    @Value("${app.timeout}")   // inject property value
    private int timeout;
}
```

Or using `@ConfigurationProperties` (Spring Boot):

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int timeout;
    // getters, setters
}
```

---

### 8. Spring Expression Language (SpEL)

A powerful expression language for querying and manipulating objects at runtime.

```java
@Value("#{2 * 10}")                        // math → 20
@Value("#{userService.timeout}")           // bean property
@Value("#{systemProperties['user.name']}") // system property
@Value("${app.name}")                      // property file value
```

Used in: `@Value`, `@ConditionalOnExpression`, Spring Security, Spring Data.

---

### 9. Event System — Publish & Listen

Spring Core has a built-in **event mechanism** for loose coupling between components.

#### Publishing an Event
```java
@Service
public class UserService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void createUser(User user) {
        // ... create user logic
        publisher.publishEvent(new UserCreatedEvent(user)); // publish event
    }
}
```

#### Listening to an Event
```java
@Component
public class EmailListener {
    @EventListener
    public void onUserCreated(UserCreatedEvent event) {
        // send welcome email
        System.out.println("Sending email to: " + event.getUser().getEmail());
    }
}
```

> Components communicate through events without directly depending on each other.

---

### 10. Resource Abstraction

Spring Core provides a unified `Resource` interface to access files
from different locations — classpath, filesystem, URL.

```java
@Autowired
private ResourceLoader resourceLoader;

public void loadFile() {
    Resource resource = resourceLoader.getResource("classpath:data.json");
    InputStream is = resource.getInputStream();
    // read file...
}
```

| Prefix | Location |
|---|---|
| `classpath:` | From classpath (inside JAR) |
| `file:` | From filesystem |
| `https:` | From URL |

---

## Full Picture — Spring Core in the Framework

```
┌──────────────────────────────────────────────┐
│                 Spring Boot                  │
│  ┌────────────────────────────────────────┐  │
│  │           Spring Framework             │  │
│  │  ┌──────────────┐  ┌───────────────┐  │  │
│  │  │ Spring Core  │  │  Spring MVC   │  │  │
│  │  │  IoC, DI     │  │  Web Layer    │  │  │
│  │  │  Lifecycle   │  ├───────────────┤  │  │
│  │  │  Events      │  │ Spring Data   │  │  │
│  │  │  SpEL        │  │  JPA Layer    │  │  │
│  │  │  Resources   │  ├───────────────┤  │  │
│  │  └──────────────┘  │Spring Security│  │  │
│  │   ↑ foundation     └───────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

> Every Spring module depends on Spring Core.
> Without Spring Core, nothing else works.

---

## Key Annotations Summary

| Annotation | Purpose |
|---|---|
| `@Component` | Generic bean declaration |
| `@Service` | Service layer bean |
| `@Repository` | Data access bean |
| `@Controller` | Web layer bean |
| `@Configuration` | Configuration class |
| `@Bean` | Manual bean declaration in config |
| `@Autowired` | Inject a dependency |
| `@Qualifier` | Specify which bean to inject |
| `@Scope` | Set bean scope |
| `@Value` | Inject property or SpEL value |
| `@ComponentScan` | Enable component scanning |
| `@PostConstruct` | Init callback after DI |
| `@PreDestroy` | Cleanup callback before destroy |
| `@EventListener` | Listen to application events |

---

## Core Mechanisms Summary

| # | Mechanism | Role |
|---|---|---|
| 1 | **IoC Container** | Creates and manages all Beans |
| 2 | **Bean** | The managed object unit |
| 3 | **Dependency Injection** | Wires Beans together automatically |
| 4 | **Bean Lifecycle** | Controls create → init → use → destroy |
| 5 | **Bean Scope** | Controls how many instances exist |
| 6 | **Component Scanning** | Auto-discovers and registers Beans |
| 7 | **Environment & Properties** | Externalized configuration management |
| 8 | **SpEL** | Dynamic expressions in configuration |
| 9 | **Event System** | Loose coupling via publish/listen |
| 10 | **Resource Abstraction** | Unified file/resource access |

---

## One-liner Summary

> **Spring Core is the foundation of the entire Spring ecosystem** —
> its IoC Container manages Beans, DI wires them together,
> and surrounding mechanisms (lifecycle, scope, events, properties, SpEL)
> give you a complete infrastructure to build any Java application
> without writing boilerplate wiring code.
