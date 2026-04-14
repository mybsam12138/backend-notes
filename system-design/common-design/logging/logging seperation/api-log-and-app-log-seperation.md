# API Log and Application Log Separation (Logback)

## 1. Goal

This document explains **how to separate API access logs from application logs**
using **Logback + SLF4J logger topics**.

Key idea:

> **Log separation is implemented by SLF4J logger name (topic), not by package or class.**

---

## 2. Why API Logs Must Be Isolated

API logs have very different characteristics from application logs:

| Dimension | API Log | Application Log |
|---------|--------|----------------|
| Nature | Infrastructure / access | Business & framework |
| Volume | High | Medium |
| Retention | Short | Long |
| Meaning | Request trace | System behavior |
| Audience | Ops / Observability | Developers |

Mixing them causes:
- noisy `app.log`
- poor signal-to-noise ratio
- difficult troubleshooting

---

## 3. Core Mechanism: SLF4J Logger Topic

### 3.1 SLF4J Logger Is a **Topic**

In SLF4J:

```java
Logger log = LoggerFactory.getLogger("api.log");
```

- `"api.log"` is **not a class**
- it is a **logical logging channel (topic)**
- Logback routes logs **by logger name prefix match**

This is the foundation of log separation.

---

## 3.2 API Log Usage Pattern (Recommended)

```java
@Slf4j(topic="API_LOG")
public class ApiLogFilter implements Filter {
}
```

Key points:
- API logging never uses class-based logger
- All API logs go through the same topic
- Routing is 100% deterministic

---

## 4. Logback Configuration Strategy

### 4.1 Dedicated API Appender

```xml
<appender name="API_FILE"
          class="ch.qos.logback.core.rolling.RollingFileAppender">

    <file>${LOG_PATH}/api.log</file>

    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>${LOG_PATH}/api.%d{yyyy-MM-dd}.log</fileNamePattern>
        <maxHistory>14</maxHistory>
    </rollingPolicy>

    <encoder>
        <pattern>
            %d{yyyy-MM-dd HH:mm:ss.SSS}
            %X{traceId}
            %msg%n
        </pattern>
        <charset>UTF-8</charset>
    </encoder>
</appender>
```

---

### 4.2 API Logger Definition (Critical)

```xml
<logger name="API_LOG"
        level="INFO"
        additivity="false">
    <appender-ref ref="API_FILE"/>
</logger>
```

Why `additivity="false"` matters:

- prevents propagation to root logger
- avoids duplication into `app.log` and console
- ensures strict isolation

---

## 5. Application Log Routing (Unchanged)

Application logs continue to use:
- package-based loggers
- root logger
- console + app.log

Example:

```java
@Slf4j
public class OrderService {
    log.info("create order");
}
```

These logs:
- **do NOT** enter `api.log`
- remain clean and meaningful

---

## 6. Environment-Level Control

API log level can be adjusted **without code change**:

```yaml
logging:
  level:
    api.log: INFO
```

or disabled entirely:

```yaml
logging:
  level:
    api.log: OFF
```

This is especially important in high-QPS systems.

---

## 7. Mental Model

```
SLF4J Logger Name (Topic)
        ↓
Logback Logger Match
        ↓
Appender Selection
        ↓
Physical Log File
```

Separation is achieved by **choosing the correct logger name at log call site**.

---

## 8. Final Rules (Framework-Level)

1. API logs must use a **fixed SLF4J topic**
2. API logs must not rely on class-based loggers
3. API logger must set `additivity=false`
4. API logs must have independent retention
5. Application logs must remain untouched

---

## 9. One-Sentence Summary

> **API log separation is implemented by SLF4J logger topic + Logback routing,
not by package structure or class hierarchy.**
