# Applying Strategy & Template Method Patterns in an OAuth Framework

> Category: **Design Patterns**  
> Project Context: justauth-oauth-spring-boot-starter  
> Author: Sam   
> Git: https://github.com/mybsam12138/justauth-oauth-spring-boot-starter.git  
> Maven Package: https://github.com/mybsam12138/justauth-oauth-spring-boot-starter/packages/2795604

---

## 1. Why This Blog Focuses on Design Patterns

This article focuses **purely on design patterns**, not on OAuth itself.

The goal is to explain **how classic object-oriented design patterns are applied together in real code**, instead of isolated textbook examples.

Patterns covered:

- Strategy Pattern
- Template Method Pattern
- Factory (as a supporting pattern)

---

## 2. Strategy Pattern: OAuth Provider as Strategy

### 2.1 Problem

OAuth providers differ in:
- Protocol (OAuth1 vs OAuth2)
- Token exchange
- User info format

But the **intent is the same**:
> Authenticate a user and return normalized user info.

---

### 2.2 Strategy Abstraction

All providers implement a common abstraction:

```java
public interface OAuthCommonService {

    String getAuthorizeUrl(String state);

    OAuthUser callback(String code, String state);

    String getProvider();
}
```

Each implementation represents **one OAuth algorithm**.

This is a **true Strategy Pattern**:
- Same interface
- Different behavior
- Interchangeable at runtime

---

### 2.3 Concrete Strategies

Examples:
- GoogleOauthService
- GithubOauthService
- TwitterOauthService

Each class encapsulates:
- Provider-specific configuration
- Provider-specific JustAuth client usage

They do **not** know about controllers or other providers.

---

## 3. Strategy Selection via Factory

### 3.1 Why Strategy Needs a Factory

Strategy Pattern answers *how to vary behavior*  
Factory answers *how to select the behavior*

Strategy selection is centralized in:

```
OAuthStrategyFactory
```

---

### 3.2 Factory Responsibility

```java
public class OAuthStrategyFactory {

    public OAuthCommonService getStrategy(String provider) {
        // return matching OAuth service
    }
}
```

Key point:
- No if/else in controllers
- No provider logic leakage

The factory has **one job only** → SRP-compliant.

---

## 4. Template Method: Enforcing OAuth Flow

### 4.1 Why Template Method Is Needed

OAuth flow structure is fixed:
1. Validate state
2. Exchange token
3. Fetch user info
4. Convert result

But **details vary** per protocol/provider.

---

### 4.2 Abstract Template

```java
public abstract class AbstractOauthService
        implements OAuthCommonService {

    @Override
    public final OAuthUser callback(String code, String state) {
        validateState(state);
        Object token = obtainAccessToken(code);
        Object user = obtainUserInfo(token);
        return convertUser(user);
    }
}
```

This:
- Fixes algorithm order
- Prevents incorrect overrides
- Pushes variation into hooks

---

## 5. OAuth1 / OAuth2 as Specialized Templates

- AbstractOauth1Service → OAuth1 mechanics
- AbstractOauth2Service → OAuth2 mechanics

Concrete providers extend **one correct template only**.

This avoids duplicated logic and enforces correctness.

---

## 6. Pattern Composition (Key Insight)

This project combines patterns:

| Pattern | Role |
|------|------|
Strategy | Provider behavior |
Template Method | Algorithm skeleton |
Factory | Strategy resolution |

This is how patterns work **in real systems**.

---

## 7. Takeaway

Design patterns are not isolated tools.

When combined correctly, they:
- Remove conditional logic
- Enforce correctness
- Improve extensibility

This OAuth framework is a real-world example of **pattern composition done right**.
