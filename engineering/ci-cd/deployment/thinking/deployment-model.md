# Deployment Model Overview

## 1. What is Deployment Model?

Deployment Model describes:

> **Where the system is deployed and hosted**

It defines the **infrastructure environment** used to run the application.

---

## 2. Difference from Deployment Strategy

| Aspect | Deployment Model | Deployment Strategy |
|------|----------------|-------------------|
| Focus | Where system runs | How system runs |
| Examples | Public Cloud, On-Prem | Active-Active, Active-Standby |
| Concern | Infrastructure | Availability / Traffic |

---

## 3. Types of Deployment Models

### 3.1 On-Premises (On-Prem)

**Definition:**
- System runs in company’s own data center

**Characteristics:**
- Full control over infrastructure
- High security
- Requires hardware maintenance

**Suitable for:**
- Banks
- Insurance systems (PAS)
- Government systems

---

### 3.2 Public Cloud

**Definition:**
- System hosted on cloud providers

**Examples:**
- AWS
- Azure
- Alibaba Cloud
- Huawei Cloud

**Characteristics:**
- Pay-as-you-go
- Highly scalable
- No hardware management

**Suitable for:**
- Startups
- Internet applications
- Rapid scaling systems

---

### 3.3 Private Cloud

**Definition:**
- Cloud infrastructure dedicated to one organization

**Implementation:**
- OpenStack
- VMware

**Characteristics:**
- More control than public cloud
- Better isolation
- Higher cost than public cloud

**Suitable for:**
- Enterprises with strict compliance
- Financial institutions

---

### 3.4 Hybrid Cloud

**Definition:**
- Combination of On-Prem + Public Cloud

**Example:**
- Core system → On-Prem
- Web/API → Public Cloud

**Characteristics:**
- Flexible
- Balance between security and scalability

**Suitable for:**
- Large enterprises
- Gradual cloud migration

---

### 3.5 Multi-Cloud

**Definition:**
- Using multiple cloud providers

**Example:**
- AWS + Azure

**Characteristics:**
- Avoid vendor lock-in
- High availability across providers

**Challenges:**
- Complex management
- Higher operational cost

---

## 4. Comparison Summary

| Model | Control | Cost | Scalability | Complexity |
|------|--------|------|------------|-----------|
| On-Prem | High | High (CapEx) | Low | Medium |
| Public Cloud | Low | Pay-as-you-go | High | Low |
| Private Cloud | High | High | Medium | High |
| Hybrid Cloud | Medium | Medium | High | High |
| Multi-Cloud | Medium | High | High | Very High |

---

## 5. How to Choose

### Choose On-Prem if:
- Strong data security requirements
- Internal enterprise system

### Choose Public Cloud if:
- Need fast deployment
- Traffic is unpredictable

### Choose Private Cloud if:
- Need cloud flexibility + high control

### Choose Hybrid Cloud if:
- Need both security and scalability

### Choose Multi-Cloud if:
- Want high availability across vendors
- Avoid vendor lock-in

---

## 6. Example (PAS System)

> A typical PAS system can use:

- **Deployment Model:** On-Prem or Hybrid Cloud
- **Application Layer:** Active-Active
- **Database Layer:** Active-Standby

---

## 7. Key Takeaway

> Deployment Model = **Where the system runs**  
> Deployment Strategy = **How the system runs**