# Spring Boot Core Mechanisms

## Overview

Spring Boot's "opinionated" behavior is powered by 3 core mechanisms working together:

```
@SpringBootApplication
        ↓
Component Scan + Auto-Configuration + Starter POMs
        ↓
Production-ready application, zero manual setup
```

---

## 1. Auto-Configuration

The heart of Spring Boot. It **detects what's on your classpath** and automatically configures the right beans for you.

### How it works
- Spring Boot ships with hundreds of `@Configuration` classes
- On startup, it checks conditions (is this class present? is this property set?)
- If conditions match → applies that configuration automatically

### Example
You add `spring-boot-starter-data-jpa` →  Spring Boot detects Hibernate on classpath → automatically creates:
- `DataSource`
- `EntityManagerFactory`
- `JpaTransactionManager`

You wrote zero configuration.

### Key Annotation
```java
@EnableAutoConfiguration  // triggers auto-configuration scanning
```

### Under the Hood
Spring Boot reads from:
```
META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
```
This file lists all auto-configuration classes to evaluate on startup.

---

## 2. Starter POMs

Curated **dependency bundles** that pull in everything needed for a feature — with compatible versions.

### The Problem They Solve
Without starters, you manually find and match compatible versions of 10+ dependencies. Wrong version = runtime errors.

### How it works
One starter → pulls in all required dependencies at the right versions.

```xml
<!-- You add ONE dependency -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Boot pulls in automatically -->
<!-- spring-webmvc, tomcat, jackson, validation, logging... -->
```

### Common Starters

| Starter | What it includes |
|---|---|
| `spring-boot-starter-web` | Spring MVC, Tomcat, Jackson |
| `spring-boot-starter-data-jpa` | Hibernate, Spring Data, JDBC |
| `spring-boot-starter-security` | Spring Security |
| `spring-boot-starter-test` | JUnit, Mockito, AssertJ |

---

## 3. Embedded Server

Spring Boot **ships with a web server built-in**. No need to deploy a WAR to an external Tomcat.

### Before Spring Boot
```
Build WAR → Deploy to Tomcat → Configure Tomcat → Start Tomcat
```

### With Spring Boot
```
Build JAR → java -jar app.jar → Done
```

### How it works
The embedded server (Tomcat by default) is just another dependency in your JAR. Spring Boot starts it programmatically on application startup.

### Switch servers easily
```xml
<!-- Exclude Tomcat, use Undertow instead -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

---

## 4. `@SpringBootApplication`

A single annotation that activates everything.

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

It is a shortcut for 3 annotations combined:

| Annotation | Role |
|---|---|
| `@SpringBootConfiguration` | Marks this as a configuration class |
| `@EnableAutoConfiguration` | Triggers auto-configuration |
| `@ComponentScan` | Scans for `@Component`, `@Service`, `@Repository`, etc. in the package |

---

## 5. `application.properties` / `application.yml`

A single file to **override any auto-configured default** without touching code.

```properties
# Override defaults easily
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.jpa.hibernate.ddl-auto=update
```

Spring Boot binds these properties directly to the auto-configured beans — no manual wiring needed.

---

## How All 3 Core Mechanisms Work Together

```
You write:  @SpringBootApplication + application.properties

                    ↓

@ComponentScan      → finds your beans (@Service, @Controller...)
@EnableAutoConfiguration → detects classpath, applies configurations
Starter POMs        → ensure right dependencies at right versions
Embedded Server     → starts Tomcat, your app is running

                    ↓

Production-ready app with zero manual configuration
```

---

## Summary

| Mechanism | Purpose |
|---|---|
| **Auto-Configuration** | Detects classpath, configures beans automatically |
| **Starter POMs** | Bundles compatible dependencies into one import |
| **Embedded Server** | Ships Tomcat inside the JAR, no external server needed |
| **`@SpringBootApplication`** | Single entry point that activates all mechanisms |
| **`application.properties`** | Override any default without touching code |
