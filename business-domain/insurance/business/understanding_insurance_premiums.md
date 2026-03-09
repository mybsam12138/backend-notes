# Understanding Insurance Premiums  
## A Complete Mental Model for Premium Computation

---

## 1. Why Premium Concepts Matter

Insurance pricing is **not a single number**.  
Different premiums exist to deliberately separate:

- Risk measurement
- Underwriting judgment
- Policy duration effects
- Business and regulatory charges

This separation is essential for:
- Correct underwriting decisions
- Clean system architecture
- Accurate accounting and reporting

---

## 2. Risk Premium (Pure / Technical Premium)

### Definition

> **Risk Premium is the expected cost of risk itself.**

It answers:
> *How much does this risk cost the insurer on average?*

---

### How It Is Calculated

```
Risk Premium = Exposure × Risk Rate
```

Where:
- **Exposure** represents how much risk exists
- **Risk Rate** represents how risky that exposure is

Examples:
- Property: `TSI × Rate`
- Motor: `Base Exposure × Final Risk Multiplier`

---

### What It Includes
- Expected claim frequency
- Expected claim severity

### What It Excludes
- Expenses
- Commission
- Profit margin
- Taxes

---

## 3. Technical Premium (Terminology Note)

In many organizations:
- **Risk Premium** and **Technical Premium** are treated as the same

In some pricing frameworks:
- Technical premium may include a small safety margin

Key idea:
> **Technical premium is still risk-focused, not customer-facing.**

---

## 4. Underwriting Adjusted Premium

### Definition

> **Underwriting Adjusted Premium is the risk premium after underwriting judgment is applied.**

Underwriters may:
- Apply loadings (increase)
- Apply discretionary discounts (decrease)
- Enforce minimum premiums

---

### Formula

```
Underwriting Adjusted Premium =
  Risk Premium × Underwriting Factor
```

Where:
- Underwriting factor is derived from controlled loadings and discounts

---

## 5. Time-Adjusted Premium (Prorata / Short-Period)

### Definition

> **Time-Adjusted Premium is the underwriting adjusted premium applied to the actual coverage period.**

It reflects **how long the insurer is on risk**, not how risky the policy is.

This premium is derived using:
- **Prorata** (linear time proportion), or
- **Short-period** factors (non-linear, penalty-based)

---

### Formula

```
Time-Adjusted Premium =
  Underwriting Adjusted Premium × Time Factor
```

Where the time factor is:
- `coverageDays / policyTermDays` (prorata), or
- a predefined short-period factor

---

### Key Characteristics

- Applied **after underwriting judgment**
- Independent of rating and risk factors
- Used for:
  - Mid-term inception
  - Cancellation
  - Endorsements

---

### Purpose

> Separate **risk pricing** from **policy duration effects**, ensuring clean underwriting logic and accurate premium adjustments.

---

## 6. Net Premium

### Definition

> **Net Premium is the premium retained by the insurer after commission, before tax.**

It represents:
- Insurer revenue available to pay claims and expenses

It excludes:
- Taxes
- Regulatory levies

---

## 7. Gross / Final Premium

### Definition

> **Gross (Final) Premium is the amount actually paid by the customer.**

It includes:
- Net premium
- Taxes
- Stamp duties
- Regulatory charges

This is the number shown on:
- Invoices
- Payment screens
- Policy documents

---

## 8. Relationship Between Premium Concepts

```
Risk Premium
   ↓ underwriting judgment
Underwriting Adjusted Premium
   ↓ prorata / short-period
Time-Adjusted Premium
   ↓ commission handling
Net Premium
   ↓ taxes & charges
Gross / Final Premium
```

Each step has:
- Different owners (actuary, underwriter, operations, finance)
- Different audit and compliance requirements

---

## 9. System Design: Why Premium Separation Matters

Well-designed insurance systems **must treat each premium as a distinct domain concept**.

---

### Recommended Premium Layers

```
riskPremium
underwritingAdjustedPremium
timeAdjustedPremium
netPremium
grossPremium
```

---

### Design Principles

1. **Single Responsibility**  
   Risk pricing, time adjustment, and billing must never be mixed.

2. **Auditability**  
   Underwriting decisions must be explainable without billing or tax noise.

3. **Endorsement Safety**  
   Time-adjusted premium enables correct mid-term recalculation and refunds.

4. **Extensibility**  
   New short-period tables or regulatory rules can be added without breaking pricing logic.

---

### Role-Based Premium Visibility

| Role | Primary Premium |
|----|----------------|
| Underwriter | Underwriting Adjusted Premium |
| Policy Admin | Time-Adjusted Premium |
| Finance / Actuarial | Net Premium |
| Customer / Agent | Gross Premium |

---

### Critical Rule

> **Never apply prorata or short-period directly to risk or underwriting factors.**

Time adjustment must always occur **after underwriting is finalized**.

---

## 10. Final Takeaway

> **Insurance systems do not calculate one premium — they assemble it layer by layer.**

This layered model is the foundation of correct insurance pricing and robust system design.

