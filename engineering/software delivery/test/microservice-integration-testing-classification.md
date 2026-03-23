# Microservice Integration Testing Classification

## Overview

In microservice architecture, integration testing is typically divided
into two major categories:

1.  **Single-Service (Standalone) Integration Test**
2.  **Multi-Service Integration Test**

This separation helps maintain clarity of responsibility, test speed,
and system reliability.

------------------------------------------------------------------------

## 1. Single-Service Integration Test

### Purpose

Test internal collaboration within one microservice.

### Scope

-   Controller
-   Service
-   Repository
-   Database (real or Testcontainers)
-   Spring Context
-   Transaction behavior
-   Validation and AOP

### Characteristics

-   Uses `@SpringBootTest` or slice tests (`@WebMvcTest`,
    `@DataJpaTest`)
-   External services are mocked or stubbed
-   Focuses on correctness of the service in isolation

### Question It Answers

> "Does this microservice work correctly by itself?"

------------------------------------------------------------------------

## 2. Multi-Service Integration Test

### Purpose

Test interaction between multiple microservices.

### Scope

-   Real HTTP communication between services
-   Real message queue (Kafka/RabbitMQ)
-   Real databases
-   Network serialization/deserialization
-   Retry and timeout behavior

### Typical Setup

-   Docker Compose
-   Testcontainers (multiple services)
-   Kubernetes test environment

### Question It Answers

> "Does the system work correctly when services communicate?"

------------------------------------------------------------------------

## 3. Additional Layer: Contract Testing

Between single-service and full multi-service integration, many teams
introduce:

### Contract Tests (e.g., Pact)

Purpose: - Verify API compatibility between services - Avoid heavy
multi-service test environments - Detect breaking changes early

Question it answers: \> "Is the API contract between services
compatible?"

------------------------------------------------------------------------

## 4. Recommended Testing Pyramid in Microservices

  -----------------------------------------------------------------------
  Test Level                   Scope              Purpose
  ---------------------------- ------------------ -----------------------
  Unit Test                    Single class       Test pure logic

  Service Integration          Single             Verify internal
                               microservice       collaboration

  Contract Test                Between two        Ensure API
                               services           compatibility

  Multi-Service Integration    Multiple services  Verify distributed
                                                  interaction

  End-to-End (E2E)             Full system        Validate business
                                                  workflow
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Key Architectural Principle

-   Unit tests verify business logic.
-   Single-service integration tests verify framework wiring within one
    service.
-   Contract tests protect service boundaries.
-   Multi-service integration tests verify distributed system
    correctness.
-   E2E tests validate real user journeys.

------------------------------------------------------------------------

## Conclusion

In microservice architecture, integration testing is naturally divided
into:

1.  Standalone service integration testing
2.  Multi-service system integration testing

This layered approach ensures faster feedback, clearer responsibility,
and better long-term maintainability.
