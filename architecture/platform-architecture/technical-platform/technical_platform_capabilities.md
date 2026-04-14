# Technical Platform (Middle Platform) Capability Classification

## 1. Definition

A Technical Platform (Middle Platform) provides reusable, standardized
infrastructure capabilities that support multiple business systems. It
focuses on reducing duplication, improving consistency, and accelerating
development.

------------------------------------------------------------------------

## 2. Core Characteristics

-   Reusable across multiple subsystems
-   Independent from specific business logic
-   Standardized interfaces and models
-   Configurable and extensible
-   Improves development efficiency and system consistency

------------------------------------------------------------------------

## 3. Capability Classification

### 3.1 Identity & Access Management

-   Authentication (SSO, OAuth2, JWT)
-   Authorization (RBAC, ABAC)
-   User and role management
-   Multi-tenant support

------------------------------------------------------------------------

### 3.2 Data & Configuration Platform

-   Dynamic dropdown / dictionary service
-   Configuration management
-   Metadata-driven UI
-   Form and field configuration

------------------------------------------------------------------------

### 3.3 Audit & Logging Platform

-   Audit trail (data change tracking)
-   Operation logs
-   Application logs
-   API logs
-   Trace ID / request tracing

------------------------------------------------------------------------

### 3.4 Workflow & Process Engine

-   Approval workflows
-   Process orchestration
-   State machine / lifecycle management
-   Rule-driven workflows

------------------------------------------------------------------------

### 3.5 Messaging & Notification Platform

-   Email / SMS / push notifications
-   Internal messaging
-   Event-driven architecture
-   Message queues (Kafka, RabbitMQ)

------------------------------------------------------------------------

### 3.6 Reporting & Analytics Platform

-   Report generation
-   BI dashboards
-   Data visualization
-   Export (PDF, Excel)

------------------------------------------------------------------------

### 3.7 System Infrastructure Capabilities

-   Configuration center
-   API gateway
-   Service discovery
-   Rate limiting / circuit breaking
-   Monitoring and observability

------------------------------------------------------------------------

### 3.8 File & Storage Platform

-   File upload and management
-   Object storage (OSS, MinIO)
-   Media processing

------------------------------------------------------------------------

### 3.9 AI & Intelligent Capabilities

-   LLM integration
-   Prompt management
-   AI agents
-   Code generation and review

------------------------------------------------------------------------

## 4. Layered View

    Application Layer
            ↑
    Business Systems
            ↑
    Technical Platform (Middle Platform)
            ↑
    Infrastructure Layer (Cloud / OS / Network)

------------------------------------------------------------------------

## 5. Design Principles

-   Decouple from business modules
-   Provide unified APIs
-   Support configuration-driven behavior
-   Ensure scalability and extensibility
-   Maintain consistency across systems

------------------------------------------------------------------------

## 6. Summary

Technical platform capabilities are reusable infrastructure-level
services that standardize core technical functions such as
authentication, audit, configuration, workflow, messaging, and
analytics, enabling efficient development and consistent system behavior
across multiple subsystems.
