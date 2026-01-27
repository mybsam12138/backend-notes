# @Configuration and @ConditionalOnClass — Summary

## 1. @Configuration

### What it is
`@Configuration` marks a class as a **Spring configuration class**.

### What it does
- Tells Spring that this class **may define beans**
- Spring will parse it and register:
  - `@Bean` methods
  - imported configurations
  - component scans (if any)

### Important notes
- A `@Configuration` class itself is also a **bean definition**
- It is processed during **context startup**
- If the class is **not loaded**, none of its beans can exist

---

## 2. @ConditionalOnClass

### What it is
`@ConditionalOnClass` is a **Spring Boot conditional annotation**.

### What it checks
- Whether **a specific class is present on the classpath**
- It does **NOT** check:
  - whether the class is a Spring Bean
  - whether the class is already in the container

### Typical usage
```java
@ConditionalOnClass(ObjectMapper.class)
```
Meaning:
> Activate this configuration **only if Jackson is on the classpath**

---

## 3. Class-level vs Method-level Condition

### Class-level condition
```java
@Configuration
@ConditionalOnClass(ObjectMapper.class)
public class WebJacksonAutoConfiguration {
}
```

Result:
- If `ObjectMapper` is **missing from classpath**
  - This configuration class is **NOT registered**
  - It does **NOT exist** in `ApplicationContext`
- If present
  - Configuration class **is registered**
  - Bean methods may be processed

---

### Method-level condition
```java
@Configuration
public class JacksonConfig {

    @Bean
    @ConditionalOnClass(ObjectMapper.class)
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

Result:
- Configuration class **always exists**
- Bean is registered **only if condition passes**

---

## 4. Common Misunderstanding (Very Important)

❌ Wrong:
> As long as the application starts, the configuration class is always in the ApplicationContext

✅ Correct:
> If a **class-level conditional fails**, the configuration class **never enters the ApplicationContext**

---

## 5. Why Spring Boot Uses This Pattern

Spring Boot auto-configuration follows the rule:

> Configure **only what makes sense** in the current environment

Benefits:
- Avoids `ClassNotFoundException`
- Avoids forcing unwanted dependencies
- Allows clean, modular starters

---

## 6. One-sentence Rule (Memorize This)

> **Class-level conditions decide whether a configuration class exists.  
Method-level conditions decide whether individual beans exist.**
