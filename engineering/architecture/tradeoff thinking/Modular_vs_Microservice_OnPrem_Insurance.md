# Modular Reuse vs Microservice Reuse in On-Prem Insurance Systems

## 1. Background

Insurance software vendors often serve multiple clients. Many financial
clients require **on-premise (private) deployment**, meaning:

-   Each client runs an isolated environment
-   Systems are deployed inside client infrastructure
-   No shared SaaS runtime
-   High security and compliance requirements

This creates an architectural dilemma:

Should we use microservices for reuse, or just copy & paste code?

------------------------------------------------------------------------

## 2. Deployment Model vs Architecture Model

These two decisions are independent:

  Dimension            Meaning
  -------------------- --------------------------
  Deployment Model     On-Prem vs SaaS
  Architecture Model   Monolith vs Microservice

On-Prem does NOT automatically mean "no microservice". Microservice does
NOT automatically mean "shared cloud only".

------------------------------------------------------------------------

## 3. The Real Risk: Code Forking

If each client has:

-   Slightly modified premium calculation logic
-   Slightly different workflow logic
-   Separate code branches

Over time:

-   Multiple diverging versions
-   Bug fixes must be applied many times
-   Upgrade becomes nearly impossible

Copy & paste is not a sustainable product strategy.

------------------------------------------------------------------------

## 4. Recommended Pattern for On-Prem Insurance Vendors

### Modular Monolith (Extraction-Ready)

Single codebase with clear module boundaries:

    insurance-core/
      ├── premium-module
      ├── product-module
      ├── workflow-module
      ├── commission-module
      ├── auth-module
      └── web-app

Characteristics:

-   One unified repository
-   One deployment package
-   Modules separated at code level
-   Client differences controlled by configuration
-   No duplicated business logic

------------------------------------------------------------------------

## 5. Two Types of Reuse

### 1️⃣ Code-Level Reuse (Module JAR)

System A → imports premium-core module\
System B → imports premium-core module

Advantages:

-   Simple
-   High performance
-   No network overhead
-   Easy debugging

Best for:

-   On-Prem deployment
-   Product-style architecture
-   Moderate team size

------------------------------------------------------------------------

### 2️⃣ Service-Level Reuse (API-Based)

System A → calls premium-service API\
System B → calls premium-service API

Advantages:

-   Independent deployment
-   Independent scaling
-   Strong governance potential
-   Cross-system capability reuse

Costs:

-   Network latency
-   Version management complexity
-   DevOps overhead
-   Distributed tracing and monitoring

Best for:

-   SaaS platforms
-   Large teams
-   Shared runtime environments

------------------------------------------------------------------------

## 6. Key Architectural Principle

> Reuse should first be achieved at the code boundary level, not at the
> distributed system level.

Distributed systems introduce significant operational complexity. Use
microservices only when independence is truly required.

------------------------------------------------------------------------

## 7. When Microservice Makes Sense (Even for Insurance)

Consider microservice only if:

-   Independent scaling is required
-   Separate teams own different capabilities
-   SaaS version exists
-   Platform-level capability is shared across systems
-   Operational maturity supports distributed architecture

Otherwise:

Modular monolith is usually the better strategic choice.

------------------------------------------------------------------------

## 8. Mature Strategy for Insurance Software Vendors

For On-Prem clients:

-   One unified product codebase
-   Configuration-driven differentiation
-   Clean module boundaries
-   Single deployment package

For Future SaaS evolution:

-   Extract platform capabilities (e.g., premium engine)
-   Expose stable APIs
-   Add governance and versioning

------------------------------------------------------------------------

## 9. Final Conclusion

For multi-client on-prem insurance systems:

-   Microservice is NOT mandatory
-   Modular architecture IS mandatory
-   Code forking is dangerous
-   Configuration-driven design is critical
-   Clean boundaries matter more than distribution

Architectural maturity is about boundary clarity, not about how many
services you deploy.
