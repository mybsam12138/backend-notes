# DDD vs Traditional Architecture — Summary with Example

This document summarizes the **core differences between Traditional Web Architecture and Domain‑Driven Design (DDD)**, and provides **a concrete example with directory structure and code**.

---

## 1. Core Difference (One Sentence)

**Traditional architecture puts business rules in services.**  
**DDD puts business rules in the domain.**

Everything else flows from this decision.

---

## 2. Conceptual Comparison

### Traditional Web Architecture

**Mental model**: *Service processes data*

```text
Controller
  → Service        (business rules)
    → Repository   (CRUD)
      → Entity     (data only)
```

Characteristics:
- Entity = data structure
- Service = business logic holder
- Rules scattered across services
- Easy to start, hard to evolve

---

### Domain‑Driven Design (DDD)

**Mental model**: *Domain objects protect business rules*

```text
Controller
  → Application Service   (orchestration / transaction)
    → Domain              (entities + domain services)
      → Repository (interface)
```

Characteristics:
- Entity = behavior + invariants
- Domain Service = cross‑entity rules
- Application Service = invoke, not implement
- Business rules have clear ownership

---

## 3. Responsibility Mapping

| Concern | Traditional | DDD |
|------|-------------|-----|
| Business rules | Service layer | Domain layer |
| Entity | Data holder | Rule enforcer |
| Cross‑entity logic | Service | Domain Service |
| Transaction | Service | Application Service |
| Repository | Infrastructure | Domain abstraction |

---

## 4. Example Business Scenario

**Insurance Policy Purchase**

Rules:
1. Policy can only be purchased when status = `DRAFT`
2. Premium must be calculated during purchase
3. Premium calculation depends on multiple factors

---

## 5. Traditional Architecture Example

### Directory Structure

```text
traditional/
├── controller/
│   └── PolicyController.java
├── service/
│   └── PolicyService.java
├── repository/
│   └── PolicyRepository.java
└── entity/
    └── Policy.java
```

---

### Entity (Anemic Model)

```java
public class Policy {
    private Long id;
    private String status;
    private BigDecimal premium;
}
```

---

### Service (Business Rules Here)

```java
public class PolicyService {

    private final PolicyRepository repository;

    public void purchase(Long policyId) {
        Policy policy = repository.findById(policyId);

        if (!"DRAFT".equals(policy.getStatus())) {
            throw new IllegalStateException("Cannot purchase");
        }

        BigDecimal premium = calculatePremium(policy);
        policy.setPremium(premium);
        policy.setStatus("ACTIVE");

        repository.save(policy);
    }

    private BigDecimal calculatePremium(Policy policy) {
        return new BigDecimal("1000");
    }
}
```

Problems:
- Service becomes a god object
- Entity has no protection
- Rules easy to bypass

---

## 6. DDD Architecture Example

### Directory Structure

```text
ddd/
├── interface/
│   └── PolicyController.java
├── application/
│   └── PolicyApplicationService.java
├── domain/
│   ├── policy/
│   │   ├── Policy.java
│   │   ├── PolicyStatus.java
│   │   └── PolicyRepository.java
│   └── pricing/
│       └── PremiumCalculator.java
└── infrastructure/
    └── persistence/
        └── JpaPolicyRepository.java
```

---

### Domain Entity (Business Rules Inside)

```java
public class Policy {

    private PolicyStatus status;
    private Money premium;

    public void purchase(PremiumCalculator calculator) {
        if (status != PolicyStatus.DRAFT) {
            throw new IllegalStateException("Cannot purchase");
        }
        this.premium = calculator.calculate(this);
        this.status = PolicyStatus.ACTIVE;
    }
}
```

---

### Domain Service (Cross‑Entity / Algorithm)

```java
public class PremiumCalculator {

    public Money calculate(Policy policy) {
        return new Money(new BigDecimal("1000"));
    }
}
```

---

### Repository (Domain Interface)

```java
public interface PolicyRepository {
    Policy find(Long id);
    void save(Policy policy);
}
```

---

### Application Service (Orchestration Only)

```java
public class PolicyApplicationService {

    private final PolicyRepository repository;
    private final PremiumCalculator calculator;

    public void purchase(Long policyId) {
        Policy policy = repository.find(policyId);
        policy.purchase(calculator);
        repository.save(policy);
    }
}
```

---

### Controller (Pure Adapter)

```java
@RestController
public class PolicyController {

    private final PolicyApplicationService appService;

    @PostMapping("/policy/{id}/purchase")
    public void purchase(@PathVariable Long id) {
        appService.purchase(id);
    }
}
```

---

## 7. Key Takeaways

- Traditional architecture centralizes rules in services
- DDD distributes rules to where they belong
- Entities protect invariants
- Domain services handle cross‑entity rules
- Application services only invoke domain behavior

---

## 8. Final Rule of Thumb

> **If changing a business rule forces you to touch many services, you need DDD.**

> **If a rule has no clear owner, introduce a domain service.**

---

End of document.

