# Cloud Desktop Java Microservices Test Architecture (4-Environment Model)

## 1. Overview

This document defines a practical testing architecture for cloud desktop backend Java Spring Boot microservices, including:

- WI (Web Interface)
- HDC Service
- Desktop Management Service (DMS)
- Authentication Service

The architecture follows a **4-environment model**:

- Dev (Unit Test Only)
- Test (Integration Testing)
- Staging (Manual / Pre-production)
- Production

This design balances:
- Test coverage
- System complexity
- CI/CD efficiency
- Infrastructure cost

---

## 2. Environment Design

### 2.1 Dev Environment

**Purpose:**
- Fast feedback for developers

**Testing Type:**
- Unit Test only

**Characteristics:**
- No deployment required
- DB mocked or in-memory (H2)
- External services mocked (Mockito)

**Scope:**
- Service logic
- Business rules
- Controller/service layer

---

### 2.2 Test Environment (Integration Testing)

**Purpose:**
- Validate inter-service behavior and system logic

**Services Deployed:**
- WI
- HDC
- DMS
- Auth

---

#### 2.2.1 Mock-based Integration Mode

- External services: partially mocked
- Database: real (MySQL/Testcontainers)

**Validates:**
- Service logic
- Service invocation behavior
- API contract correctness
- Error handling

---

#### 2.2.2 Full Integration Mode

- All services real
- Database: real with test dataset

**Validates:**
- Service-to-service communication
- API gateway / routing
- Data consistency
- Transaction correctness

---

#### Implementation Strategy

Use configuration-based switching:

```
mock.enabled=true/false
```

---

### 2.3 Staging Environment (Manual / Pre-production)

**Purpose:**
- Final validation before production

**Characteristics:**
- Production-like deployment
- Full service topology
- Real infrastructure (LB, network)

**Testing Type:**
- Manual testing
- E2E testing
- Acceptance testing

**Validates:**
- User login/authentication flow
- Desktop allocation logic (via DMS)
- API interactions across services
- Stability and error scenarios

---

### 2.4 Production Environment

**Purpose:**
- Serve real users

**Characteristics:**
- High availability deployment
- Real user data
- Strict access control
- Monitoring and alerting enabled

---

## 3. CI/CD Pipeline Design

### 3.1 Service Pipeline (Per Microservice)

Each service has its own pipeline:

```
Code → Build → Unit Test → Package → Docker Image
```

---

### 3.2 Integration Pipeline

```
Deploy services → Test Environment
               ↓
Run Integration Tests
```

Supports:
- Partial deployment (only updated service)
- Mock/full mode switching

---

### 3.3 Release Pipeline

```
Deploy → Staging
        ↓
Manual Approval
        ↓
Deploy → Production
```

---

## 4. Database Strategy

| Environment | Strategy |
|------------|---------|
| Dev | Mock / H2 |
| Test | Real DB (Testcontainers/MySQL) |
| Staging | Production-like DB (sanitized data) |
| Prod | Production DB |

---

## 5. Kubernetes Deployment Strategy

### 5.1 Namespace Design

```
test
staging
prod
```

(Dev handled locally or CI)

---

### 5.2 Test Environment

- Small-scale deployment
- All core services deployed
- Configurable mock mode

---

### 5.3 Staging Environment

- Same topology as production
- Includes:
  - Load Balancer
  - Full service deployment
  - Redis + DB

---

## 6. Key Design Principles

### 6.1 Progressive Testing

```
Unit → Integration → Staging → Production
```

---

### 6.2 Partial Deployment

- Only deploy changed service in Test
- Other services remain stable

---

### 6.3 Configuration-driven Testing

- Switch mock/real dependencies via config

---

### 6.4 Cost Optimization

- Avoid duplicate environments
- Merge integration layers

---

## 7. Summary

This architecture:

- Uses 4 environments for clarity and efficiency
- Separates fast unit testing from real integration testing
- Supports microservices independently
- Enables scalable CI/CD pipelines

---

**Key takeaway:**

> Use fewer environments with stronger testing layers instead of many redundant environments.
