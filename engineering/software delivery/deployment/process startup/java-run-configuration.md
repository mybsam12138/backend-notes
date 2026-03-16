# Run Configuration Fields Explained

This document summarizes the differences between **VM Options**, **Program Arguments**, **Working Directory**, and **Environment Variables** in Java / Spring Boot run configurations, with **Spring Boot–specific examples**.

---

## 1. VM Options

**Scope:** JVM (Java Virtual Machine)  
**Used by:** Java runtime  
**Purpose:** Configure how the JVM itself runs

### Typical usage
- Memory allocation
- Garbage collection
- JVM system properties

### Examples
```
-Xms512m
-Xmx2g
-Dspring.profiles.active=prod
-Dfile.encoding=UTF-8
```

### Spring Boot notes
- `-Dspring.profiles.active=prod` sets the active Spring profile
- JVM options are read **before** the application starts
- Best for JVM tuning, not business configuration

---

## 2. Program Arguments

**Scope:** Application  
**Used by:** `main(String[] args)`  
**Purpose:** Pass arguments directly to the application

### Typical usage
- Feature switches
- Temporary overrides
- CLI-style parameters

### Examples
```
--spring.profiles.active=dev
--server.port=8081
```

### Spring Boot notes
- Program arguments have **highest priority**
- Useful for local development or debugging
- Not recommended for production usage

---

## 3. Working Directory

**Scope:** Operating system / file system  
**Used by:** OS and application  
**Purpose:** Define the base directory for relative paths

### Typical usage
- Reading config files
- Writing logs
- Loading resources via relative paths

### Example
```
Working directory: /app
File read: config/application.yml → /app/config/application.yml
```

### Spring Boot notes
- Affects relative file paths only
- Does NOT affect Spring profiles or environment resolution

---

## 4. Environment Variables

**Scope:** Operating system  
**Used by:** JVM, Spring Boot, application  
**Purpose:** Provide external configuration values

### Typical usage
- Environment identification (dev / test / prod)
- Secrets and credentials
- Infrastructure configuration

### Examples
```
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
DB_HOST=localhost
DB_PASSWORD=secret
```

### Spring Boot mapping rules
```
SPRING_PROFILES_ACTIVE  → spring.profiles.active
SERVER_PORT            → server.port
DB_PASSWORD            → db.password
```

### application.yml example
```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE}

server:
  port: ${SERVER_PORT:8080}

db:
  password: ${DB_PASSWORD}
```

### Notes
- Recommended way to configure Spring Boot environments
- Works perfectly with Docker, Jenkins, and Kubernetes
- Best choice for production deployments

---

## Comparison Table

| Item | Scope | Used For | Spring Boot Example | Recommended Use |
|----|----|----|----|----|
| VM Options | JVM | JVM tuning | `-Dspring.profiles.active=prod` | Memory, GC |
| Program Arguments | App | App behavior | `--spring.profiles.active=dev` | Local testing |
| Working Directory | OS | File paths | `/app/config/*` | Resource loading |
| Environment Variables | OS → App | Environment config | `SPRING_PROFILES_ACTIVE=prod` | Production, CI/CD |

---

## Best Practice Summary

- Use **Environment Variables** to define Spring Boot environments and secrets
- Use **VM Options** only for JVM-level configuration
- Use **Program Arguments** for temporary overrides or debugging
- Keep `application.yml` as a template, not environment-specific

---

## Recommended Production Pattern (Spring Boot)

```
SPRING_PROFILES_ACTIVE=prod
DB_PASSWORD=******
```

```
java -jar app.jar
```

Spring Boot will automatically load:
```
application.yml
application-prod.yml
```

---
