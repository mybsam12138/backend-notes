
# How to Choose Test Types by System and Scenario

## Overview

Different systems require different testing strategies.

There is no universal rule like:
"Always write integration tests" or
"Only API tests are enough."

Testing strategy should be chosen based on:

- System complexity
- Business criticality
- Architecture style
- Team size
- Deployment model
- Risk tolerance

This document provides practical guidance for choosing:

- Unit Test
- Integration Test
- API Test
- Contract Test
- E2E Test

---

# 1. Unit Test

## Best For

- Business rule logic
- Financial calculation
- Status transitions
- Validation rules
- Complex branching logic
- Utility functions with logic

## Required In

- Any system with business rules
- Long-term maintained systems
- Systems with frequent refactoring

## May Be Reduced In

- Simple CRUD-only applications
- Very short-lived prototypes

## Primary Goal

Protect logic from regression and enable safe refactoring.

---

# 2. Integration Test

## Best For

- Controller → Service → Repository flow
- JPA mapping validation
- Transaction behavior
- Serialization/deserialization
- Caching behavior

## Required In

- Systems with database complexity
- Systems using ORM
- Systems with transaction-sensitive logic

## May Be Reduced In

- Very simple CRUD services
- Thin API gateway services

## Primary Goal

Verify internal component collaboration inside one service.

---

# 3. API Test (Deployed Service)

## Best For

- Verifying deployment configuration
- Testing authentication and authorization
- Testing environment-specific configuration
- Validating real HTTP stack behavior

## Required In

- Systems deployed via CI/CD
- Microservices with gateway/proxy
- Systems with complex environment configuration

## Primary Goal

Verify deployed service behaves correctly in runtime environment.

---

# 4. Contract Test

## Best For

- Microservices architecture
- Independent service deployment
- Preventing breaking API changes

## Required In

- Systems with multiple microservices
- Teams deploying independently
- Distributed systems with API dependency

## Not Needed In

- Monolithic systems
- Single-service applications

## Primary Goal

Ensure API compatibility between services.

---

# 5. End-to-End (E2E) Test

## Best For

- Critical business workflows
- Cross-service orchestration
- User journey validation
- Compliance-critical flows

## Required In

- Systems with multiple services interacting
- Financial/payment workflows
- Customer-facing systems

## Should Be Limited To

- Main happy path
- High-risk scenarios

## Primary Goal

Validate real user workflow across the whole system.

---

# Scenario-Based Recommendations

## Scenario A: Simple CRUD Microservice

Recommended:
- Unit Test (basic logic)
- API Test (deployment validation)

Optional:
- Minimal Integration Test

Not Required:
- Contract Test (if standalone)
- Heavy E2E

---

## Scenario B: Business-Critical Single Service (Monolith)

Recommended:
- Strong Unit Tests
- Integration Tests
- API Tests (for deployment)

Optional:
- Limited E2E

Not Required:
- Contract Test

---

## Scenario C: Microservices with Independent Deployment

Recommended:
- Strong Unit Tests
- Integration Tests
- Contract Tests
- API Tests
- Limited E2E

This is the most common enterprise architecture.

---

## Scenario D: Financial / Insurance / Payment System

Recommended:
- Strong Unit Tests (calculation-heavy)
- Integration Tests (DB & transaction critical)
- Contract Tests (microservices)
- API Tests (deployment validation)
- Carefully designed E2E tests (workflow critical)

High risk systems require layered protection.

---

# Decision Principles

When choosing test type, ask:

1. What risk am I trying to reduce?
2. What layer can detect this failure fastest?
3. What is the business impact if this breaks?
4. How often does this code change?

---

# Layer Responsibility Summary

| Test Type | Protects | Speed | Scope |
|------------|----------|--------|--------|
| Unit | Logic | Very Fast | Method/Class |
| Integration | Internal wiring | Fast | Single Service |
| Contract | Service boundary | Fast | Between Services |
| API | Deployment environment | Medium | Running Service |
| E2E | Business workflow | Slow | Full System |

---

# Final Strategy Advice

1. Use Unit Tests for depth.
2. Use Integration Tests for internal confidence.
3. Use Contract Tests for microservice boundaries.
4. Use API Tests for deployment verification.
5. Use E2E Tests sparingly for critical workflows.

Do not aim for maximum coverage.

Aim for maximum risk reduction with minimal redundancy.

---

# Final Insight

Testing strategy should match architecture maturity.

Small systems → fewer layers.
Complex distributed systems → layered protection.

Testing is not about quantity.
It is about risk control.
