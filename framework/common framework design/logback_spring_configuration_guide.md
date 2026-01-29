# Logback + SLF4J + Spring Boot: Configuration Guide

This document explains **how SLF4J, Logback, and Spring Boot work together**, and provides a **structured explanation** of a typical `logback-spring.xml` configuration, including:

- `springProperty`
- console & file appenders
- log patterns
- rolling policy
- `root` vs `logger`
- how this config is used as a **common / shared logging config**

---

## 1. SLF4J, Logback, and Spring Boot Relationship

### 1.1 SLF4J (API)

- **SLF4J** is a *logging facade*
- Application code depends on SLF4J only:

```java
private static final Logger log = LoggerFactory.getLogger(MyClass.class);
```

- No logging implementation logic lives here

---

### 1.2 Logback (Implementation)

- **Logback** is the concrete logging implementation
- Provides:
  - appenders
  - encoders
  - rolling policies
  - filtering

SLF4J calls → Logback executes.

---

### 1.3 Spring Boot (Integration Layer)

Spring Boot:

- Brings SLF4J + Logback by default
- Bootstraps Logback **early in application startup**
- Provides:
  - property resolution (`springProperty`)
  - profile awareness
  - environment integration

➡ This is why **`logback-spring.xml`** is preferred over `logback.xml`.

---

## 2. Why `logback-spring.xml`

Using `logback-spring.xml` allows:

- Access to Spring Environment
- Use of:
  - `spring.application.name`
  - `spring.profiles.active`
  - `application.yaml` properties

Plain `logback.xml` **cannot** do this.

---

## 3. Configuration File Lifecycle

```text
JVM start
  ↓
Spring Boot initializes Environment
  ↓
Logback loads logback-spring.xml
  ↓
Properties resolved
  ↓
Appenders created
  ↓
Logging active
```

---

## 4. Configuration Scan (`scan="true"`)

```xml
<configuration scan="true">
```

Meaning:

- Logback periodically checks the config file
- If changed → reloads configuration

Notes:

- Useful in local / dev environments
- Not recommended for high-throughput production systems

---

## 5. `springProperty`: Bridging Spring → Logback

Example:

```xml
<springProperty scope="context"
                name="APP_NAME"
                source="spring.application.name"
                defaultValue="demo-app"/>
```

Explanation:

| Field | Meaning |
|----|-------|
| `scope=context` | Resolve from Spring Environment |
| `name` | Logback variable name |
| `source` | Spring property key |
| `defaultValue` | Fallback if missing |

This allows logging to stay **environment-aware but decoupled**.

---

## 6. Log Pattern (`CONSOLE_PATTERN`)

```xml
<property name="CONSOLE_PATTERN"
          value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %X{traceId} %logger{36} - %msg%n"/>
```

Key components:

| Token | Meaning |
|----|--------|
| `%d{}` | Timestamp |
| `%thread` | Thread name |
| `%-5level` | Log level (fixed width) |
| `%X{traceId}` | MDC value (request tracing) |
| `%logger{36}` | Logger name (shortened) |
| `%msg` | Log message |

This pattern is reused by both console and file appenders.

---

## 7. Console Appender

```xml
<appender name="CONSOLE"
          class="ch.qos.logback.core.ConsoleAppender">
```

Purpose:

- Logs to stdout / stderr
- Used for:
  - local development
  - container stdout (Docker / K8s)

Encoder:

```xml
<encoder>
  <pattern>${CONSOLE_PATTERN}</pattern>
  <charset>UTF-8</charset>
</encoder>
```

Notes:

- Explicit UTF-8 avoids terminal / container issues
- Independent of JVM default encoding

---

## 8. File Appender + Rolling Policy

### 8.1 RollingFileAppender

```xml
<appender name="FILE"
          class="ch.qos.logback.core.rolling.RollingFileAppender">
```

Writes logs to disk.

Active file:

```xml
<file>${LOG_PATH}/app.log</file>
```

---

### 8.2 TimeBasedRollingPolicy

```xml
<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
  <fileNamePattern>${LOG_PATH}/app.%d{yyyy-MM-dd}.log</fileNamePattern>
  <maxHistory>30</maxHistory>
</rollingPolicy>
```

Behavior:

- One log file per day
- Retains last 30 days
- Older files are deleted automatically

This is the **most common and safest rolling strategy**.

---

## 9. Root Logger

```xml
<root level="INFO">
  <appender-ref ref="CONSOLE"/>
  <appender-ref ref="FILE"/>
</root>
```

Meaning:

- Default log level = INFO
- Applies to all loggers unless overridden
- Sends logs to:
  - console
  - file

---

## 10. Framework Noise Control

```xml
<logger name="org.springframework" level="WARN"/>
<logger name="org.hibernate" level="WARN"/>
<logger name="org.apache.catalina" level="WARN"/>
```

Purpose:

- Suppress framework INFO/DEBUG noise
- Keep application logs readable

These loggers **inherit appenders from root**.

---

## 11. Application Logger (`additivity=false`)

```xml
<logger name="com.github.mybsam12138"
        level="INFO"
        additivity="false">
```

Meaning:

- Applies only to your application packages
- `additivity=false`:
  - Prevents duplicate logging
  - Stops propagation to parent loggers

This logger explicitly controls where application logs go.

---

## 12. Using This as a Common Logback Configuration

### Recommended usage

- Place this file in a **common module** (e.g. `demo-common-web`)
- Name it:
  - `logback-spring.xml`

### Application usage

- Each Spring Boot app:
  - Depends on the common module
  - Optionally overrides:
    - `LOG_PATH`
    - log levels

No duplication. Central control.

---

## 13. Final Takeaways

- SLF4J = API
- Logback = implementation
- Spring Boot = integration & environment bridge

Best practices applied here:

- Explicit UTF-8 encoding
- Centralized patterns
- Daily rolling logs
- Noise control
- Spring-aware configuration

This configuration is **production-grade and reusable**.

