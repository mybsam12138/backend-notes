# Spring Web I18n Design Guide

This document describes a **clean and extensible i18n (internationalization) design**
based on Spring `MessageSource`, with clear responsibility separation between
**backend framework**, **application**, and **frontend**.

It is suitable for common backend frameworks, shared web modules,
and finance / enterprise systems.

---

## 1. Design Goals

- Centralized i18n message management
- Framework-level default messages
- Application-level override capability
- Clear frontend–backend contract
- No business logic mixed into i18n
- Easy extension and maintenance

---

## 2. Core Design Idea

### Key principle

> **i18n is a cross-cutting concern at the Web boundary, not a business concern.**

Therefore:
- i18n is resolved **before controller logic**
- Domain logic should never depend on locale
- Frontend decides *language preference*
- Backend decides *message resolution*

---

## 3. MessageSource Architecture

### Layered MessageSource Design

```
Application MessageSource (optional override)
            ↓
DelegatingMessageSource
            ↓
Framework / Common MessageSource
            ↓
i18n resource files (classpath:i18n)
```

This ensures:
- Framework provides default messages
- Application can override any key explicitly
- No duplication of base messages

---

## 4. Configuration Explained

### 4.1 Framework-level MessageSource

```java
@Bean
public MessageSource webCommonMessageSource() {
    ReloadableResourceBundleMessageSource ms =
            new ReloadableResourceBundleMessageSource();
    ms.setBasename("classpath:i18n");
    ms.setDefaultEncoding("UTF-8");
    ms.setFallbackToSystemLocale(false);
    return ms;
}
```

#### Responsibilities

- Load messages from `classpath:i18n`
- Provide default framework-level messages
- Disable system locale fallback for consistency

#### Resource structure example

```
resources/
└── i18n/
    ├── messages.properties
    ├── messages_en_US.properties
    └── messages_zh_CN.properties
```

---

### 4.2 Delegating MessageSource (Override Bridge)

```java
@Bean
public MessageSource messageSource(
        MessageSource webCommonMessageSource) {

    DelegatingMessageSource delegating =
            new DelegatingMessageSource();
    delegating.setParentMessageSource(
            webCommonMessageSource
    );
    return delegating;
}
```

#### Why DelegatingMessageSource?

- Acts as the **primary MessageSource**
- Allows application to define its own `messageSource` bean
- Application messages override framework messages **by key**
- Framework remains reusable and non-invasive

---

## 5. Locale Resolution (How language is chosen)

### 5.1 Frontend Responsibility

Frontend **must explicitly convey language preference**.

#### Recommended HTTP header

```
Accept-Language: zh-CN
Accept-Language: en-US
```

This is:
- Standard
- Stateless
- Cache-friendly
- Compatible with browsers and mobile apps

---

### 5.2 Backend Locale Resolution

Spring resolves locale automatically via:

```
Accept-Language header
        ↓
LocaleResolver
        ↓
MessageSource
```

Default behavior:
- Uses `Accept-Language`
- No session required
- Thread-safe

Optional customization:
- `LocaleChangeInterceptor` (query param)
- Custom `LocaleResolver`

For APIs, **header-based locale is strongly recommended**.

---

## 6. Typical Usage in Code

### 6.1 Using MessageSource directly

```java
@Autowired
private MessageSource messageSource;

public String getMessage(String key) {
    return messageSource.getMessage(
            key,
            null,
            LocaleContextHolder.getLocale()
    );
}
```

---

### 6.2 Exception & Error Code Integration

```java
throw new BizException(
    "error.premium.invalid",
    messageSource.getMessage(
        "error.premium.invalid",
        null,
        LocaleContextHolder.getLocale()
    )
);
```

**Recommended**
- Exception carries message key
- Message resolved at boundary layer
- Domain remains language-agnostic

---

## 7. Frontend–Backend Contract

### Frontend must guarantee

- Always send `Accept-Language`
- Do not hardcode backend messages
- Treat message as display-only

### Backend guarantees

- Stable message keys
- Consistent fallback behavior
- No locale-dependent business logic

---

## 8. What NOT to Do

❌ Store locale in database  
❌ Put locale logic in domain model  
❌ Hardcode language in backend  
❌ Mix i18n with business rules  

---

## 9. Recommended Message Key Style

```text
error.auth.failed
error.premium.invalid
error.policy.not_found
common.validation.required
```

Rules:
- Dot-separated
- Stable keys
- No language in key name

---

## 10. Summary

- `MessageSource` is the core of Spring i18n
- Use layered MessageSource for reuse and override
- Frontend controls locale via `Accept-Language`
- Backend resolves messages, domain stays clean
- i18n belongs to **Web / Interface layer**

---

## 11. One-Sentence Principle

> **Frontend decides language, backend resolves message, domain stays invariant.**
