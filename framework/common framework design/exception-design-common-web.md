# Exception Design for Common Web Framework (v2)

This document summarizes a **shared enterprise web framework** exception design, with a supplement (补充) for **i18n** and **message arguments**, and an example of exposing **error codes** to the frontend.

---

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

## 3. ErrorCode Abstraction (Updated for i18n)

> The error code defines **identity** and **fallback text**.  
> The **localized** message comes from i18n properties at runtime.

```java
public interface ErrorCode {
    int code();

    /** i18n key, e.g. "error.auth.unauthorized" */
    String i18nKey();

    /** fallback message (recommended: English) */
    String defaultMessage();
}
```

---

## 4. BaseException (Updated with args)

### 4.1 Why args belong in the exception

- Throw-site knows the **context values**
- Handler knows the **locale**
- So the exception carries raw args; handler formats via `MessageSource`

```java
public abstract class BaseException extends RuntimeException {

    private final ErrorCode errorCode;
    private final Object[] args;

    protected BaseException(ErrorCode errorCode) {
        super(errorCode.defaultMessage());
        this.errorCode = errorCode;
        this.args = null;
    }

    protected BaseException(ErrorCode errorCode, Object[] args) {
        super(errorCode.defaultMessage());
        this.errorCode = errorCode;
        this.args = args;
    }

    protected BaseException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.args = null;
    }

    protected BaseException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.args = null;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public Object[] getArgs() {
        return args;
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

## Why `200 OK` makes sense for BizException

### ✅ Use **200** when:

The request is **valid**, processed correctly, and the server is **intentionally returning a business outcome**.

## 7. Key Rule

> **HTTP status reflects system health**  
> **errorCode reflects business outcome**

BizException is a Java exception, but **not** an HTTP error.

---

## 8. 补充：i18n & Message Arguments（参数化消息）

### 8.1 Properties naming (language distinction)

Given a basename like `classpath:i18n/web-errors`, Spring resolves in this order:

- `web-errors_zh_CN.properties`
- `web-errors_zh.properties`
- `web-errors.properties`

So `zh` is a generic fallback for all Chinese locales (including `zh_CN`), unless `zh_CN` is provided.

### 8.2 Message formatting with args

Example i18n:

```properties
error.request.missing_parameter=Missing required parameter: {0}
error.request.invalid_parameter=Invalid parameter {0}: {1}
```

Throw-site:

```java
throw new ValidationException(
    DefaultErrorCodes.MISSING_PARAMETER,
    new Object[]{"userId"}
);
```

Handler-side formatting (via resolver):

```java
String msg = messageSource.getMessage(
    ex.getErrorCode().i18nKey(),
    ex.getArgs(),
    ex.getErrorCode().defaultMessage(),
    LocaleContextHolder.getLocale()
);
```

**Rule:** do NOT store formatted, localized text in exceptions. Store only raw `args`.

---

## 9. Expose error codes to frontend (Controller)

### 9.1 Why provide an endpoint

- Frontend can show a “Help / Error Code Catalog”
- QA and support can search by numeric code
- Useful for admin portals and internal tools

### 9.2 Simple approach (list only DefaultErrorCodes)

```java
@GetMapping("/error-codes/default")
public ApiResponse<List<ErrorCodeView>> listDefault() {
    List<ErrorCodeView> result = Arrays.stream(DefaultErrorCodes.values())
            .sorted(Comparator.comparing(ErrorCode::code))
            .map(ErrorCodeView::from)
            .collect(Collectors.toList());
    return ApiResponse.success(result);
}
```

### 9.3 Extensible approach (registry)

If your framework supports multiple modules registering codes, use a registry:

```java
public interface ErrorCodeRegistry {
    Collection<ErrorCode> getAll();
}
```

Default implementation:

```java
@Component
public class DefaultErrorCodeRegistry implements ErrorCodeRegistry {
    @Override
    public Collection<ErrorCode> getAll() {
        return Arrays.asList(DefaultErrorCodes.values());
    }
}
```

Controller:

```java
@GetMapping("/error-codes")
public ApiResponse<List<ErrorCodeView>> listAll() {
    List<ErrorCodeView> result = errorCodeRegistry.getAll().stream()
            .sorted(Comparator.comparing(ErrorCode::code))
            .map(ErrorCodeView::from)
            .collect(Collectors.toList());
    return ApiResponse.success(result);
}
```

### 9.4 ErrorCodeView example

Expose what the frontend needs (avoid leaking internal details if you want):

```java
public record ErrorCodeView(int code, String key, String defaultMessage) {

    public static ErrorCodeView from(ErrorCode ec) {
        return new ErrorCodeView(ec.code(), ec.i18nKey(), ec.defaultMessage());
    }
}
```

---

## 10. Recommended response body (include code to frontend)

For API responses, include `errorCode` so the frontend can map UI behaviors.

```json
{
  "success": false,
  "code": 1002,
  "message": "Missing required parameter: userId",
  "traceId": "..."
}
```

> The `message` is localized. The `code` is stable and used for programmatic handling.
