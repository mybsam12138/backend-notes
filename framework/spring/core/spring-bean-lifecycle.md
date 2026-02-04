# Spring Bean Creation Lifecycle (Spring Framework / Spring Boot)

> Focus: **how a bean is created, initialized, used, and destroyed** inside the Spring IoC container.

---

## 0) When does Spring create beans?

- **Singleton (default scope)**: typically created during container startup (pre-instantiation), unless marked **lazy**.
- **Prototype**: created **each time** you request it (`getBean` / injection point resolution).
- **Web scopes** (`request`, `session`, etc.): created when that scope becomes active.

---

## 1) High-level lifecycle flow

```text
BeanDefinition loaded
    ↓
Bean instantiation (constructor / factory method)
    ↓
Dependency injection (populate properties / autowire)
    ↓
Aware callbacks (BeanNameAware, BeanFactoryAware, ...)
    ↓
BeanPostProcessor#postProcessBeforeInitialization
    ↓
Initialization callbacks
    - @PostConstruct
    - InitializingBean#afterPropertiesSet
    - custom init-method
    ↓
BeanPostProcessor#postProcessAfterInitialization
    ↓
Bean ready for use
    ↓
(when container shuts down / scope ends)
Destruction callbacks
    - @PreDestroy
    - DisposableBean#destroy
    - custom destroy-method
```

---

## 2) Detailed step-by-step (creation + initialization)

### Step A — Load definitions
Spring reads configuration and creates **BeanDefinition** objects from:
- `@Configuration` + `@Bean`
- component scanning (`@Component`, `@Service`, ...)
- XML, Java config, etc.

### Step B — Instantiate the bean
Spring creates the bean instance via one of these:
- **Constructor** (typical for `@Component` + constructor injection)
- **Factory method** (`@Bean` method, static factory, instance factory)
- **FactoryBean** (special type that produces another object)

> This step is mainly handled by `InstantiationStrategy` / `BeanFactory` internals.

### Step C — Populate properties (DI / autowire)
Spring injects dependencies:
- `@Autowired`, `@Qualifier`
- `@Value`
- setter injection / field injection
- resolves dependencies (and may create those dependency beans first)

> During this stage, Spring may expose an “early reference” for **singleton circular dependencies**
> (field/setter injection can sometimes work; constructor circular dependencies generally cannot).

### Step D — *Aware* callbacks (optional)
If the bean implements these, Spring calls them so the bean can “know” container info:
- `BeanNameAware#setBeanName`
- `BeanClassLoaderAware#setBeanClassLoader`
- `BeanFactoryAware#setBeanFactory`
- `ApplicationContextAware#setApplicationContext`
- many others (`EnvironmentAware`, `ResourceLoaderAware`, ...)

### Step E — Before-initialization post-processing
Spring calls:
- `BeanPostProcessor#postProcessBeforeInitialization(bean, beanName)`

Common examples:
- `AutowiredAnnotationBeanPostProcessor` (wiring support)
- annotation-driven processors
- custom `BeanPostProcessor`s you implement

### Step F — Initialization callbacks (in order)
1. `@PostConstruct` (JSR-250)
2. `InitializingBean#afterPropertiesSet()`
3. Custom `init-method` (e.g., `@Bean(initMethod="init")` or XML `init-method`)

### Step G — After-initialization post-processing
Spring calls:
- `BeanPostProcessor#postProcessAfterInitialization(bean, beanName)`

Important: **AOP proxies** are often created here.
- If AOP applies, Spring may return a **proxy** instead of the raw bean.
- That proxy is what gets injected into other beans.

---

## 3) Bean usage phase
After initialization, the bean is **fully usable**. For singleton scope, it lives until the container closes.
For other scopes, it lives until the scope ends.

---

## 4) Destruction lifecycle (shutdown / scope end)

### When does destruction happen?
- Application shutdown (Spring `ApplicationContext#close`, JVM shutdown hook)
- Scope ends (e.g., request/session ends)

### Destruction callbacks (typical order)
1. `@PreDestroy`
2. `DisposableBean#destroy()`
3. Custom `destroy-method` (e.g., `@Bean(destroyMethod="close")`)

> Note: **prototype beans are not destroyed automatically** by the container (you manage cleanup yourself).

---

## 5) Quick checklist: common lifecycle hooks

### Annotation-based
- `@PostConstruct` ✅ init
- `@PreDestroy` ✅ destroy

### Interface-based
- `InitializingBean#afterPropertiesSet()` ✅ init
- `DisposableBean#destroy()` ✅ destroy

### Config-based
- `@Bean(initMethod="...", destroyMethod="...")`
- XML `init-method`, `destroy-method`

### Container extension points
- `BeanPostProcessor` (per-bean before/after init)
- `BeanFactoryPostProcessor` (modify BeanDefinitions **before** any beans instantiate)
- `ApplicationListener` (react to context events)

---

## 6) Common interview-style “gotchas”

- **AOP proxy creation** typically happens in `postProcessAfterInitialization`.
- **Circular deps**: setter/field injection may be resolved via early singleton exposure; constructor cycles usually fail.
- **prototype beans**: created on demand; container does **not** manage full destruction.
- **FactoryBean**: `getBean("&name")` returns the `FactoryBean` itself; `getBean("name")` returns the produced object.

---

## 7) Minimal example: init & destroy hooks

```java
@Component
public class DemoBean {

    @PostConstruct
    public void init() {
        // called after dependencies injected
    }

    @PreDestroy
    public void shutdown() {
        // called on context close
    }
}
```

---

If you want, tell me your Spring version (Boot 2.x vs 3.x) and whether you use AOP / transactions heavily,
and I can add a “real request path” diagram showing where proxies and transactions wrap calls.
