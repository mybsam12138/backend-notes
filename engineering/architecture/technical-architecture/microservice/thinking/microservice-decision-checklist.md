# When to Use Microservices --- Decision Checklist

## Core Principle

Microservices are justified when **organizational and domain complexity
exceed the simplicity benefits of a monolith**.

They are not primarily for handling high traffic.\
They are primarily for **organizational scaling and domain autonomy**.

------------------------------------------------------------------------

# 1. Team & Organizational Considerations

## 1.1 Team Size

-   Backend engineers \> 10--15
-   Multiple independent teams working in parallel
-   Frequent merge conflicts
-   Code ownership unclear

If true → Microservices become reasonable.

If team ≤ 8 → Modular monolith is usually better.

------------------------------------------------------------------------

## 1.2 Independent Deployment Requirement

-   Different domains require different release cycles
-   Hotfixes must be deployed without redeploying the entire system
-   Coordination cost between teams is high

If most releases are synchronized anyway → Monolith is sufficient.

------------------------------------------------------------------------

# 2. Domain & Scaling Considerations

## 2.1 Uneven Traffic Distribution

-   One domain consumes 70--80% of traffic
-   One module requires significantly more CPU/memory
-   Scaling ratios differ drastically between domains

Example: - Search → 10 instances - Admin → 2 instances

If traffic scaling is uniform → Microservice scaling benefit is small.

------------------------------------------------------------------------

## 2.2 Different Infrastructure Needs

-   Different domains require different databases
-   GPU requirements for AI services
-   Strong ACID for payment
-   Search engine for search
-   Column store for analytics

If infrastructure needs are homogeneous → Monolith is simpler.

------------------------------------------------------------------------

# 3. Fault Isolation & Risk Management

## 3.1 Fault Isolation Requirement

-   Failure of non-critical domain must not affect core system
-   Controlled blast radius during deployment
-   Partial degradation strategy required

If system restart is acceptable → Monolith may suffice.

------------------------------------------------------------------------

# 4. Data Ownership & Database Strategy

## 4.1 Clear Data Ownership

A true microservice should: - Own its own database - Avoid cross-service
table access - Communicate only via API or events

If services share a database schema → Risk of distributed monolith.

------------------------------------------------------------------------

# 5. Infrastructure Maturity

Microservices require:

-   Strong CI/CD pipelines
-   Observability (metrics, tracing, logging)
-   Container orchestration (e.g., Kubernetes)
-   Distributed tracing
-   Monitoring and alerting
-   DevOps maturity

If infrastructure maturity is low → Microservices introduce high
operational risk.

------------------------------------------------------------------------

# 6. When NOT to Use Microservices

Avoid microservices if:

-   Team is small
-   Domain complexity is low
-   Database is shared
-   No independent deployment need
-   No uneven scaling pattern
-   DevOps capability is limited

Microservices add complexity:

-   Network failures
-   Retry logic
-   Idempotency handling
-   Eventual consistency
-   Version management
-   Deployment orchestration
-   Observability overhead

------------------------------------------------------------------------

# 7. Practical Rule of Thumb

If only 1 condition is true → Do NOT use microservices.

If 2--3 conditions are strongly true → Consider carefully.

If 4+ conditions are clearly true → Microservices are justified.

------------------------------------------------------------------------

# 8. Recommended Evolution Path

1.  Start with modular monolith.
2.  Enforce strict internal domain boundaries.
3.  Prevent cross-module database access.
4.  Establish clear internal API contracts.
5.  Extract microservices only when justified by real pressure.

------------------------------------------------------------------------

# Final Insight

High concurrency alone does NOT justify microservices.

Microservices are a solution for: - Organizational scaling - Domain
autonomy - Independent deployment - Uneven scaling requirements

Choose architecture based on complexity and maturity, not trend.
