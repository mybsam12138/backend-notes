# Exception Design for Common Web Framework

## 1. Design Goals

This exception system is designed for a **shared enterprise web framework**, not a single application.

Goals:
- Clear separation between **business logic** and **HTTP semantics**
- Stable and extensible **error code system**
- Centralized and configurable **HTTP mapping policy**
- Safe usage across **REST APIs, async jobs, MQ consumers, batch tasks**
- Avoid coupling exceptions to Spring Web annotations

---

## 2. Core Principles

### 2.1 Exception ≠ HTTP Error

- Exceptions represent **control flow and failure semantics inside the system**
- HTTP status represents **transport-level execution result**
- Mapping between them must be **centralized**, not scattered

> Exceptions describe *what happened*  
> HTTP describes *how the request was processed*

---

### 2.2 Error Code Is First-Class

- Every exception must carry an **ErrorCode**
- Frontend and monitoring systems rely on **numeric codes**, not messages
- Messages are descriptive, not authoritative

---

### 2.3 Numeric, Range-Based Error Codes

Error codes are numeric and partitioned by responsibility.

| Range | Responsibility |
|------|----------------|
| 0–999 | System / unknown |
| 1000–1999 | Web / validation |
| 2000–2999 | Auth / security |
| 3000–3999 | Infrastructure |
| 4000+ | Business modules |

Ranges are architectural contracts and must remain stable.

---

## 3. ErrorCode Abstraction

```java
public interface ErrorCode {
    int code();
    String message();
}
```

---

## 4. BaseException

```java
public abstract class BaseException extends RuntimeException {

    private final ErrorCode errorCode;

    protected BaseException(ErrorCode errorCode) {
        super(errorCode.message());
        this.errorCode = errorCode;
    }

    protected BaseException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    protected BaseException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
```

---

## 5. Exception Categories

### 5.1 BizException
Business rule rejection (expected outcome).

### 5.2 ValidationException
Client input error.

### 5.3 AuthException
Authentication / authorization failure.

### 5.4 InfraException
Infrastructure failure with mandatory cause.

---

## 6. Default Mapping Policy

| Exception | HTTP Status |
|---------|-------------|
| ValidationException | 400 |
| BizException | 200 |
| AuthException | 401 / 403 |
| InfraException | 500 |

---

## 7. Key Rule

> **HTTP status reflects system health**  
> **errorCode reflects business outcome**

BizException is a Java exception, but **not** an HTTP error.
