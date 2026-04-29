# Gateway Overview

## 1. What is a Gateway?

A **Gateway** is a system component that acts as an entry point between two different systems, layers, or networks.  
It controls, routes, and manages communication between clients and backend services.

> In simple terms: A gateway is a “door” that all requests must go through.

---

## 2. Types of Gateways

### 2.1 API Gateway
Handles API requests in microservices architecture.

Responsibilities:
- Routing
- Authentication (JWT)
- Authorization (RBAC)
- Rate limiting
- Logging and tracing

Examples:
- Spring Cloud Gateway
- Kong

---

### 2.2 Edge Gateway (Traffic Layer)
Handles incoming internet traffic.

Responsibilities:
- TLS/HTTPS termination
- Load balancing
- DDoS protection
- Basic rate limiting

Examples:
- Nginx
- Cloud Load Balancer

---

### 2.3 Protocol Gateway
Converts between different communication protocols.

Examples:
- HTTP ↔ gRPC
- MQTT ↔ HTTP

---

### 2.4 Data Gateway
Controls access to data systems.

Examples:
- GraphQL Gateway
- Data Federation Layer

---

## 3. Why Gateway is Needed

Without Gateway:

Client → Service A  
Client → Service B  
Client → Service C  

Problems:
- Tight coupling
- Hard to manage
- Security issues

With Gateway:

Client → Gateway → Services  

Benefits:
- Centralized control
- Improved security
- Simplified client interaction
- Better scalability

---

## 4. Two-Level Gateway Architecture

Client  
↓  
Edge Gateway (Traffic Layer)  
↓  
API Gateway (Business Layer)  
↓  
Microservices  

---

## 5. When to Use Two-Level Gateway

- Public internet-facing systems
- High traffic environments
- Complex authentication and authorization
- Need separation of concerns
- Cloud-native architectures

---

## 6. Key Design Principles

- Separate traffic handling and business logic
- Use JWT for stateless authentication
- Avoid direct database access in gateway
- Keep services focused on business logic

---

## 7. Summary

- Gateway = unified entry point
- API Gateway = handles API logic
- Edge Gateway = handles traffic
- Two-level gateway = best practice for scalable systems

---

## 8. Interview Summary

A gateway is a centralized entry point that manages communication between clients and services. In modern systems, we often use a two-level gateway architecture: an edge gateway for traffic handling and an API gateway for business logic such as authentication and authorization.
