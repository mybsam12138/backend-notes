# Stamp Duty (印花税) in Insurance  
## A Standalone Summary for Domain & System Design

---

## 1. Definition

**Stamp duty** is a government tax imposed on **legal documents**, including insurance policies.

In practice, stamp duty is often collected electronically, but historically it was proven by affixing a “stamp,” which is where the name comes from.

---

## 2. Why Stamp Duty Exists

Stamp duty exists because the government provides **legal infrastructure** for contracts:

- The policy is **legally binding**
- It is **enforceable in court**
- It is **recognized by public authorities**

A simple mental model:

> **Stamp duty is the fee/tax for legal certainty and enforceability.**

---

## 3. How It Is Charged

Depending on jurisdiction, stamp duty may be:

- A **fixed amount** per policy
- A **percentage** of premium
- Different by product class in some regions (but typically **broad and uniform**)

---

## 4. Who Receives It

- Insurer collects it at issuance
- It is remitted to the **government treasury**
- It is **not insurer revenue**

---

## 5. Example Calculation

Assume:
- Net premium: 4,350
- Stamp duty rate: 1%

```
Stamp Duty = 4,350 × 1% = 43.50
```

---

## 6. System Design Notes

### Recommended fields
- `stampDutyAmount`
- `stampDutyRate`
- `currency`
- `effectiveDate` (for rate versioning)
- `calculationBase` (net premium, gross premium, fixed, etc.)

### Key rules
- Calculate and display stamp duty **separately** from premium
- Keep it **auditable** and **effective-date controlled**
- Never mix it into risk/technical premium

---

## 7. One-Sentence Summary (Blog-Ready)

> **Stamp duty is a government tax on issuing a legally enforceable insurance contract, charged as a fixed fee or a percentage and remitted to the state.**
