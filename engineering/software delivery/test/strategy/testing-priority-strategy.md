# Testing Priority Strategy for Unit Test and Integration Test

## Overview

Writing tests requires effort. Therefore, we must prioritize what to
test based on risk, impact, and system stability.

This document defines a practical priority strategy for:

-   Unit Tests
-   Integration Tests

------------------------------------------------------------------------

# Part 1: Unit Test Priority

Unit tests protect business logic at the smallest level (method/class).

## Highest Priority (Must Test)

These functions represent core business rules and high regression risk.

### 1. Business Decision Logic

-   Conditional branches (if/else)
-   State transitions
-   Permission checks
-   Status changes

Example: - Order status flow - Approval logic - Discount eligibility

------------------------------------------------------------------------

### 2. Calculation Logic

-   Premium calculation
-   Tax calculation
-   Fee aggregation
-   Financial rounding logic

Reason: Money-related bugs are high impact and often subtle.

------------------------------------------------------------------------

### 3. Validation Rules

-   Input validation
-   Boundary value handling
-   Null/empty checks
-   Exception logic

------------------------------------------------------------------------

### 4. Utility Functions with Logic

-   Data transformation
-   Mapping logic
-   Date parsing logic
-   ID masking logic

If a util contains real logic, it should be tested.

------------------------------------------------------------------------

## Medium Priority (Test If Time Allows)

### 5. Complex Data Transformation

-   DTO → Entity conversion
-   Aggregation logic
-   Filtering logic

------------------------------------------------------------------------

## Low Priority (Usually Skip)

### 6. Simple Getters/Setters

### 7. Thin Delegation Methods

Methods that only call another method without logic.

### 8. Framework Configuration

Spring annotations, Lombok, Jackson internal behavior.

------------------------------------------------------------------------

# Part 2: Integration Test Priority

Integration tests verify collaboration within a service.

They should focus on internal wiring and infrastructure behavior.

## Highest Priority

### 1. Controller → Service → Repository Flow

-   Request mapping
-   JSON serialization/deserialization
-   Transaction behavior
-   Database persistence

------------------------------------------------------------------------

### 2. Database Mapping

-   JPA mapping correctness
-   Query correctness
-   Constraint validation

------------------------------------------------------------------------

### 3. Transactional Behavior

-   Rollback scenarios
-   Concurrent update scenarios (if critical)

------------------------------------------------------------------------

## Medium Priority

### 4. Caching (Redis)

-   Cache hit/miss logic
-   Cache invalidation logic

------------------------------------------------------------------------

## Low Priority

### 5. External Services

In standalone integration tests, external services should be mocked.
Cross-service interaction belongs to contract test or system test.

------------------------------------------------------------------------

# Part 3: Practical Priority Order

If time is limited, follow this order:

1.  Core business rule unit tests
2.  Financial calculation unit tests
3.  Status transition unit tests
4.  Integration test for main API flow
5.  Database mapping integration test
6.  Contract tests (if microservice)
7.  E2E tests (only key flows)

------------------------------------------------------------------------

# Final Insight

Testing should be risk-driven, not coverage-driven.

Test what: - Can break easily - Has business impact - Is reused
frequently - Is complex

Avoid testing: - Framework internals - Trivial code - Implementation
details

Unit tests protect logic. Integration tests protect collaboration. Both
are necessary but should be written strategically.
