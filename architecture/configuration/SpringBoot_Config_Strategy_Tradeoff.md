# Configuration Strategy Tradeoff: Environment Variables vs Spring Profiles

## 1. Problem Overview

When designing a Spring Boot application (with or without Kubernetes),
there are two common configuration strategies:

1.  Multiple profile-based configuration files (`application-dev.yaml`,
    `application-prod.yaml`)
2.  Single `application.yaml` with environment variables injected at
    runtime

This document explains the tradeoffs and recommended usage patterns.

------------------------------------------------------------------------

## 2. Strategy 1 -- Spring Profiles

### Example

Files:

-   application.yaml
-   application-dev.yaml
-   application-prod.yaml

Startup:

    java -jar app.jar --spring.profiles.active=dev

### Advantages

-   Clear grouping of environment configurations
-   Easy local development
-   Good for behavior differences
-   Simple for smaller systems

### Disadvantages

-   Configuration duplication across files
-   Risk of configuration drift
-   Harder to scale across many environments
-   Infrastructure values may be hardcoded inside repo

------------------------------------------------------------------------

## 3. Strategy 2 -- Single YAML + Environment Variables

### Example

application.yaml:

``` yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:3306/insurance
```

Startup:

    DB_HOST=10.1.1.5 java -jar app.jar

### Advantages

-   One configuration file
-   Clean separation of code and environment
-   Aligns with 12-Factor App principles
-   Easier containerization
-   Scales better in cloud-native environments

### Disadvantages

-   Slightly less readable for beginners
-   Requires proper environment management
-   Environment variables must be controlled carefully

------------------------------------------------------------------------

## 4. What Should Use Profiles?

Profiles are best for:

-   Bean activation differences
-   Enabling/disabling features
-   Switching implementation strategy
-   Different logging configuration
-   Local development adjustments

Profiles are best for **behavior differences**, not infrastructure
addresses.

------------------------------------------------------------------------

## 5. What Should Use Environment Variables?

Environment variables are best for:

-   Database host
-   Redis host
-   Kafka address
-   External API endpoints
-   Credentials (with Secret management)
-   Port configuration

Environment variables are best for **environment differences**, not
logic differences.

------------------------------------------------------------------------

## 6. Hybrid Approach (Recommended for Mature Systems)

A balanced architecture typically:

-   Uses a single main application.yaml
-   Uses environment variables for infrastructure-level configuration
-   Uses profiles only for behavior-level configuration

This approach scales well for:

-   Traditional deployments
-   Docker-based systems
-   Kubernetes environments

------------------------------------------------------------------------

## 7. Architectural Principle

Profiles = Behavior difference\
Environment variables = Environment difference

Do not mix them unnecessarily.

------------------------------------------------------------------------

## 8. 12-Factor App Insight

The 12-Factor methodology prefers environment variables because:

-   They separate config from code
-   They avoid rebuilding artifacts per environment
-   They increase portability
-   They improve immutability

This principle applies even outside Kubernetes.

------------------------------------------------------------------------

## 9. Final Recommendation

For modern backend systems:

-   Prefer environment variables for infrastructure configuration
-   Use Spring profiles for logic variation
-   Avoid duplicating large configuration blocks across multiple YAML
    files
-   Keep configuration external and controllable

------------------------------------------------------------------------

End of Document
