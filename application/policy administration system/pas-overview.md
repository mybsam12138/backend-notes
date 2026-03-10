# Policy Administration System (PAS) Overview

## 1. What is a PAS System

A **Policy Administration System (PAS)** is a core system used by insurance companies to **manage the entire lifecycle of insurance policies**.

It supports the creation, management, modification, and renewal of insurance policies from the moment a product is defined until the policy expires or is terminated.

A PAS is mainly used by:

- Underwriters
- Insurance operations staff
- Brokers or agents
- Customer service teams

The system records and manages:

- insurance products
- policy information
- client information
- premiums
- policy changes
- renewals
- endorsements

---

## 2. Role of PAS in Insurance Systems

In an insurance company, PAS is one of the **core systems**.

Typical core systems include:

| System | Function |
|------|------|
| PAS | Policy lifecycle management |
| Billing System | Premium collection and payment management |
| Claims System | Claim processing and compensation |
| Reinsurance System | Reinsurance management |
| CRM | Customer relationship management |

PAS focuses on **policy and underwriting operations**.

---

## 3. Policy Lifecycle Managed by PAS

A PAS system manages the entire lifecycle of a policy.

Typical lifecycle:

Product Configuration  
↓  
Quotation  
↓  
Underwriting  
↓  
Policy Issuance  
↓  
Policy Endorsement  
↓  
Policy Renewal  
↓  
Policy Expiry or Cancellation

---

## 4. Core Functions of a PAS System

### 4.1 Product Configuration

Insurance companies must define products before selling them.

Typical product structure:

Product  
└── Plan  
└── Section  
└── Coverage  
└── Benefit

Product configuration includes:

- coverage definitions
- benefit definitions
- policy limits
- deductibles
- rating factors
- premium calculation rules

---

### 4.2 Client Management

PAS maintains customer information.

Typical client information includes:

- personal or corporate information
- contact information
- address
- identification information
- AML screening status
- sanctions check results

Clients can have multiple roles in a policy:

- policyholder
- insured
- beneficiary
- payer

---

### 4.3 Quotation and Underwriting

Underwriters evaluate risks and determine whether the policy can be issued.

Functions include:

- risk information capture
- premium calculation
- risk evaluation
- underwriting decision

The system calculates premiums using:

- rating factors
- rating tables
- underwriting rules

---

### 4.4 Policy Issuance

Once underwriting is approved, the system creates the official policy record.

Policy information includes:

- policy number
- effective date
- expiry date
- insured object
- coverage details
- premium amount

Policy documents may include:

- policy schedule
- policy certificate
- policy wording

---

### 4.5 Policy Endorsement

Policies may change after issuance.

Endorsements record policy changes while keeping historical records.

Examples:

- change insured address
- change coverage limit
- add or remove coverage
- update insured asset value

Endorsements ensure **legal traceability of policy history**.

---

### 4.6 Policy Renewal

Many insurance policies are renewed annually.

The renewal process includes:

- copying previous policy information
- recalculating premiums
- updating risk information
- issuing a new policy period

---

### 4.7 Accumulation and Risk Control

Insurance companies must monitor risk concentration.

Examples:

- multiple properties insured in the same industrial park
- several warehouses located in the same catastrophe zone

The system may:

- display warning messages to underwriters
- block policy issuance
- require special approval

---

## 5. PAS System Users

Typical users include:

### Underwriters

Evaluate risk and approve policy issuance.

### Operations Staff

Manage policy data and perform endorsements.

### Agents or Brokers

Submit insurance applications.

### Customer Service

Handle client inquiries and policy updates.

---

## 6. Typical PAS Architecture

A PAS system usually follows a layered architecture.

Frontend Applications  
↓  
API Layer  
↓  
Business Services  
↓  
Policy Management Module  
Product Management Module  
Client Management Module  
Rating Engine  
↓  
Database

Key modules include:

- product management
- client management
- policy management
- underwriting engine
- premium calculation engine

---

## 7. Example Insurance Products Managed in PAS

PAS systems can manage many insurance types.

### Motor Insurance

Covers:

- vehicle damage
- third-party liability
- theft

### Property Insurance

Covers:

- buildings
- warehouses
- industrial equipment

### Marine Cargo Insurance

Covers goods transported by:

- sea
- air
- land

---

## 8. Summary

A **Policy Administration System (PAS)** is a core insurance platform used to manage insurance policies from product definition to policy expiration.

Key responsibilities include:

- product configuration
- client management
- underwriting
- policy issuance
- policy endorsement
- policy renewal
- risk monitoring

PAS systems enable insurance companies to **efficiently manage policies, control risk, and maintain legal records of insurance contracts**.