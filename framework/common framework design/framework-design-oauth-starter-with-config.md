# Designing an Extensible OAuth Framework in Spring Boot  
## Configuration‑Driven Framework Design in `justauth-oauth-spring-boot-starter`

> Category: **Framework Design**  
> Project: justauth-oauth-spring-boot-starter  
> Author: Sam  
> Git: https://github.com/mybsam12138/justauth-oauth-spring-boot-starter.git   
> Maven Package: https://github.com/mybsam12138/justauth-oauth-spring-boot-starter/packages/2795604
---

## 1. What This Blog Focuses On

This article focuses on **framework design**, not OAuth usage.

Specifically, it explains how this project combines:

- Strategy Pattern
- Template Method
- Factory
- Spring Boot Configuration Binding

to build a **configuration‑driven, extensible OAuth framework**.

---

## 2. Framework Design Goals

The framework is designed to:

- Allow adding OAuth providers without modifying core code
- Separate protocol logic (OAuth1 / OAuth2) from provider logic
- Centralize strategy selection
- Drive behavior entirely from Spring Boot configuration

In short:

> **Code defines extension points, configuration defines behavior.**

---

## 3. High‑Level Architecture

```
Spring Boot Configuration (YAML)
        ↓
OAuthProperties (Configuration Binding)
        ↓
Auto‑Configuration
        ↓
OAuthStrategyFactory
        ↓
OAuthCommonService
        ↑
AbstractOauthService (Template)
        ↑
AbstractOauth1Service / AbstractOauth2Service
        ↑
Concrete Provider Services
```

This structure clearly separates **configuration**, **framework**, and **extension logic**.

---

## 4. Configuration as the Entry Point

### 4.1 Spring Boot Configuration

All provider information is externalized in `application.yml`:

```yaml
justauth:
  oauth:
    google:
      client-id: xxx
      client-secret: xxx
      redirect-uri: /oauth/callback/google
    github:
      client-id: xxx
      client-secret: xxx
      redirect-uri: /oauth/callback/github
```

Key idea:
- No hard‑coded provider configuration
- No recompilation required
- Same framework, different environments

---

### 4.2 Configuration Binding (SRP)

Configuration is bound into a dedicated properties class:

```java
@ConfigurationProperties(prefix = "justauth.oauth")
public class OAuthProperties {
    private Map<String, OAuthProviderConfig> providers;
}
```

**Responsibility**:
- Only holds configuration
- No business logic
- One reason to change → config structure change

This strictly follows **SRP**.

---

## 5. Auto‑Configuration: Wiring the Framework

### 5.1 Why Auto‑Configuration Matters

Framework users should not manually wire beans.

Auto‑configuration is responsible for:

- Reading configuration
- Creating provider services
- Registering them into Spring context

---

### 5.2 Conditional Bean Creation

```java
@Configuration
@EnableConfigurationProperties(OAuthProperties.class)
public class OAuthAutoConfiguration {
}
```

Benefits:
- Framework activates only when config is present
- Providers can be enabled/disabled via config
- Clean starter experience

---

## 6. From Configuration to Strategy

### 6.1 Provider Services Consume Configuration

Each concrete provider service:

- Receives its config via constructor injection
- Builds its JustAuth request internally
- Knows nothing about other providers

```java
public class GoogleOauthService extends AbstractOauth2Service {

    public GoogleOauthService(GoogleOAuthConfig config) {
        super(config);
    }
}
```

This ensures:
- Provider logic is isolated
- Configuration is injected, not queried globally

---

### 6.2 Strategy Registration

All provider services are registered as Spring beans.

The framework does **not** manually manage lifecycle.

Spring does.

---

## 7. OAuthStrategyFactory: Configuration‑Driven Resolution

The factory builds a **strategy map** from Spring context:

```java
@Component
public class OAuthStrategyFactory {

    private final Map<String, OAuthCommonService> serviceMap;

    public OAuthStrategyFactory(List<OAuthCommonService> services) {
        this.serviceMap = services.stream()
            .collect(Collectors.toMap(
                OAuthCommonService::getProvider,
                Function.identity()
            ));
    }
}
```

Key framework insight:

> **Configuration decides which beans exist,  
> Factory decides which bean is used.**

---

## 8. Open/Closed Principle at Framework Level

### Adding a New Provider

Steps:

1. Add configuration
2. Create new service extending abstract template
3. Register as bean

What does **not** change:

- Factory
- Controller
- Existing providers
- Core framework

This is **true OCP enforced by framework structure**, not by convention.

---

## 9. SRP Across the Framework

| Component | Responsibility |
|--------|----------------|
Configuration Properties | Config binding |
Auto‑Configuration | Bean wiring |
Factory | Strategy selection |
Template | OAuth flow |
Protocol Template | OAuth1 / OAuth2 logic |
Concrete Service | Provider specifics |

Each component has **one clear responsibility**.

---

## 10. Why This Is Real Framework Design

This design:

- Treats OAuth as a **pluggable capability**
- Uses Spring Boot as a configuration engine
- Prevents misuse through template enforcement
- Encourages extension instead of modification

This is how **shared infrastructure libraries** should be designed.

---

## 11. Conclusion

`justauth-oauth-spring-boot-starter` is designed as a **configuration‑driven OAuth framework**.

- Configuration defines *what exists*
- Templates define *what must happen*
- Strategies define *how it happens*
- Factory defines *which strategy is used*

Together, they form a stable, extensible framework foundation.

---

## Author

Sam  
Java / Spring Boot Engineer  
Framework & Platform‑Oriented Developer
