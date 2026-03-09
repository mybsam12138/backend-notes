# Insurance Multi-Layer Classification (Extended)

## 1. Overall Classification Structure

```text
Insurance
│
├── Life Insurance
│   ├── Term Life Insurance
│   │   ├── Level Term
│   │   ├── Decreasing Term
│   │   └── Renewable Term
│   │
│   ├── Whole Life Insurance
│   │   ├── Participating Whole Life
│   │   └── Non-Participating Whole Life
│   │
│   ├── Endowment Insurance
│   │   ├── Traditional Endowment
│   │   └── Savings Endowment
│   │
│   └── Annuity
│       ├── Immediate Annuity
│       └── Deferred Annuity
│
└── General Insurance (Non-Life / Property & Casualty)
    │
    ├── Motor Insurance
    │   ├── Private Car Insurance
    │   │   ├── Third Party Liability
    │   │   ├── Third Party + Theft + Fire
    │   │   └── Comprehensive Motor
    │   │
    │   ├── Commercial Vehicle Insurance
    │   │   ├── Truck Insurance
    │   │   └── Bus Insurance
    │   │
    │   └── Fleet Insurance
    │
    ├── Property Insurance
    │   ├── Fire Insurance
    │   │   ├── Standard Fire Policy
    │   │   ├── Fire + Explosion
    │   │   ├── Fire + Natural Disaster
    │   │   └── Industrial All Risk
    │   │
    │   ├── Home Insurance
    │   │   ├── Basic Home Protection
    │   │   └── Premium Home Package
    │   │
    │   └── Burglary Insurance
    │
    ├── Marine Insurance
    │   ├── Marine Cargo
    │   │   ├── Institute Cargo Clause A
    │   │   ├── Institute Cargo Clause B
    │   │   └── Institute Cargo Clause C
    │   │
    │   └── Marine Hull
    │
    ├── Liability Insurance
    │   ├── Public Liability
    │   ├── Product Liability
    │   └── Employer Liability
    │
    ├── Engineering Insurance
    │   ├── Contractor All Risk
    │   ├── Erection All Risk
    │   └── Machinery Breakdown
    │
    ├── Health Insurance
    │   ├── Individual Health Insurance
    │   ├── Group Medical Insurance
    │   └── Critical Illness Insurance
    │
    └── Workers' Compensation Insurance
        ├── Workplace Injury Compensation
        ├── Disability Benefits
        └── Death Compensation
```

---

## 2. Classification Descriptions

## Life Insurance

Insurance that provides financial protection against the death of the insured person. It may also include long-term savings or retirement components.

### Term Life Insurance

Provides coverage for a fixed period of time. If the insured dies during the term, the beneficiaries receive the payout.

- **Level Term** -- Coverage amount remains constant during the entire policy term.
- **Decreasing Term** -- Coverage gradually decreases over time, commonly used for mortgages or loans.
- **Renewable Term** -- Policyholders can renew coverage after the term ends without medical re-evaluation.

### Whole Life Insurance

Permanent life insurance that lasts for the insured's lifetime and often accumulates cash value.

- **Participating Whole Life** -- Policyholders may receive dividends depending on insurer profits.
- **Non-Participating Whole Life** -- Fixed benefits without dividend participation.

### Endowment Insurance

A hybrid product combining insurance protection with savings. The policy pays either when the insured dies or when the policy reaches maturity.

- **Traditional Endowment** -- Provides guaranteed maturity benefit.
- **Savings Endowment** -- Emphasizes investment and savings accumulation.

### Annuity

A financial product designed to provide periodic income, usually during retirement.

- **Immediate Annuity** -- Income payments begin immediately after purchase.
- **Deferred Annuity** -- Payments begin at a future date after an accumulation phase.

---

## General Insurance (Non-Life Insurance)

Covers risks related to property, liability, and other non-life exposures.

### Motor Insurance

Provides financial protection against vehicle damage and liability arising from accidents.

#### Private Car Insurance

Insurance for personally owned vehicles.

- **Third Party Liability** -- Covers damages to other people or property caused by the insured vehicle.
- **Third Party + Theft + Fire** -- Adds protection against theft and fire damage to the insured vehicle.
- **Comprehensive Motor** -- Covers both third-party liabilities and damage to the insured vehicle.

#### Commercial Vehicle Insurance

Insurance for vehicles used in business operations.

- **Truck Insurance** -- Covers logistics and cargo trucks.
- **Bus Insurance** -- Covers passenger transportation vehicles.

#### Fleet Insurance

Allows companies to insure multiple vehicles under a single policy.

### Property Insurance

Provides protection for buildings, equipment, and other physical assets.

#### Fire Insurance

Covers property losses caused by fire and related perils.

- **Standard Fire Policy** -- Basic coverage for fire damage.
- **Fire + Explosion** -- Adds protection against explosion hazards.
- **Fire + Natural Disaster** -- Covers disasters such as earthquakes, storms, or floods.
- **Industrial All Risk** -- Comprehensive property protection for industrial facilities.

#### Home Insurance

Insurance for residential properties and personal belongings.

- **Basic Home Protection** -- Covers essential risks such as fire and limited damage.
- **Premium Home Package** -- Includes extended protection like theft, liability, and disasters.

#### Burglary Insurance

Compensates for losses caused by theft or forced entry.

### Marine Insurance

Protects ships and goods during transportation across sea, air, or land.

#### Marine Cargo

Covers loss or damage to goods being transported.

- **Institute Cargo Clause A** -- All-risk coverage.
- **Institute Cargo Clause B** -- Medium level coverage.
- **Institute Cargo Clause C** -- Basic limited coverage.

#### Marine Hull

Insurance covering the ship itself, including physical damage to the vessel.

### Liability Insurance

Protects individuals or businesses from legal liability arising from injury or property damage to third parties.

- **Public Liability** -- Covers claims from members of the public.
- **Product Liability** -- Covers damages caused by defective products.
- **Employer Liability** -- Covers injuries suffered by employees during work.

### Engineering Insurance

Insurance designed for construction projects and industrial machinery.

- **Contractor All Risk (CAR)** -- Covers construction site risks including accidental damage.
- **Erection All Risk (EAR)** -- Covers installation and assembly of machinery.
- **Machinery Breakdown** -- Covers damage or failure of industrial equipment.

### Health Insurance

Provides coverage for medical expenses, hospitalization, and healthcare services.

- **Individual Health Insurance** -- Coverage purchased by individuals for medical treatment.
- **Group Medical Insurance** -- Employer-provided healthcare coverage for employees.
- **Critical Illness Insurance** -- Pays a lump sum when the insured is diagnosed with specified serious illnesses.

### Workers' Compensation Insurance

Provides compensation to employees who suffer work-related injuries or occupational diseases.

- **Workplace Injury Compensation** -- Covers medical treatment and recovery expenses.
- **Disability Benefits** -- Provides income replacement for disabled workers.
- **Death Compensation** -- Pays benefits to dependents if a worker dies due to work-related incidents.
