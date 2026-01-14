# Extracting Common Dependencies, Version Control, and Spring Boot Starters  
*A practical Maven architecture journey*

## Background

As a Java / Spring Boot developer, when a project grows beyond a single application, **dependency chaos** quickly appears:

- Different modules use different dependency versions
- Plugin versions drift silently
- Common configuration is duplicated
- Business applications directly depend on infra libraries

To solve this, I extracted **a parent POM + reusable Spring Boot starters**, forming a clean, scalable Maven architecture.

This article documents the **process, rules, and final structure**.

---

## Step 1: Introduce a Parent POM (`demo-parent`)

### Purpose of `demo-parent`

`demo-parent` is **not an application**, but a **platform-level parent**.

It is responsible for:

- Centralized `dependencyManagement`
- Centralized `pluginManagement`
- Unified Java / Spring Boot versions
- Build consistency across all modules

### What belongs in `demo-parent`

```text
- Spring Boot version
- Java version
- Maven plugin versions
- BOM imports
- Encoding / compiler rules
```

### What does NOT belong here

- Business dependencies
- Application-specific configs
- Auto-configuration logic

This separation ensures **version control without coupling**.

---

## Step 2: Extract a Base Spring Boot Starter (`demo-base-spring-boot-starter`)

### Why a base starter is needed

Many applications share:

- Logging setup
- Common utilities
- Default configuration
- Infrastructure beans

Instead of copy-pasting, I extracted them into a **base Spring Boot starter**.

### Key rules

- It **uses `demo-parent` as its parent**
- It exposes auto-configuration
- It contains **no business logic**
- It can be reused by any Spring Boot application

```text
demo-base-spring-boot-starter
  └── parent → demo-parent
```

---

## Step 3: Extract Feature Starters (`justauth-oauth-spring-boot-starter`)

### Why feature starters

Some functionality is **cross-application but domain-specific**, such as:

- OAuth login
- Third-party integrations
- Authentication strategies

These deserve their own **feature-level starter**.

### Example: OAuth starter

`justauth-oauth-spring-boot-starter`:

- Encapsulates OAuth login logic
- Uses Strategy + Template Method patterns
- Exposes clean Spring Boot auto-configuration

Rules:

- Parent: `demo-parent`
- No dependency on applications
- Optional dependency on base starter (only if truly infra)

---

## Step 4: Keep the Application Thin (`web-demo-backend`)

### Role of the application module

`web-demo-backend` is a **real business application**.

It should:

- Contain only business logic
- Depend on starters, not infra details
- Avoid version declarations

### Dependency usage

```xml
<dependency>
  <groupId>io.github.mybsam12138</groupId>
  <artifactId>demo-base-spring-boot-starter</artifactId>
</dependency>

<dependency>
  <groupId>io.github.mybsam12138</groupId>
  <artifactId>justauth-oauth-spring-boot-starter</artifactId>
</dependency>
```

Versions are inherited from **`demo-parent`**, not declared here.

---

## Final Architecture Overview

```text
                demo-parent
                     ↑
     ┌───────────────┼────────────────┐
     │               │                │
demo-base-     justauth-oauth-    web-demo-
spring-boot-   spring-boot-       backend
starter        starter
     │               │
     └───────────────┴──────────────┐
                                     │
                           web-demo-backend
```

This structure ensures:

- No dependency cycles
- Clear ownership
- Easy upgrades
- Reusable components

---

## Key Maven Rules Learned

### 1. Parent POM controls versions, not behavior
- Use `dependencyManagement` and `pluginManagement`
- Avoid `<plugins>` in parent

### 2. Starters depend on parent, not on applications
- Application is always the leaf node

### 3. Applications declare **what**, parent controls **how**
- App declares dependencies
- Parent controls versions

### 4. Avoid implicit Maven behavior
- Always be explicit with parent resolution
- Do not rely on default `../pom.xml` guessing

---

## Conclusion

By extracting:

- A **parent POM** for version control
- **Reusable Spring Boot starters** for shared logic
- A **thin application layer**

I achieved:

- Clean dependency management
- Strong architectural boundaries
- Easy scalability for future projects

This structure closely follows **Spring Boot / Spring Cloud / OSS best practices** and is suitable for both **internal platforms and open-source frameworks**.

---

*This article documents a real refactoring process and can serve as a reference template for building a scalable Maven + Spring Boot ecosystem.*
