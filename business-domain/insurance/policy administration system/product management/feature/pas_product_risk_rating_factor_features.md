# PAS Product Management - Risk Rating Factor Configuration

This document summarizes the **Risk Rating Factor Configuration** feature in the **Product Management** module of a Policy Administration System (PAS).

Examples use **Motor Insurance** and **Fire Insurance** products.

---

# 1. Purpose

Risk rating factor configuration is used to define **which risk attributes affect premium calculation** for an insurance product.

It allows the product team or actuarial team to define:

- rating factors
- factor values
- rating tables
- rating rules
- plan-level adjustments
- coverage-level pricing logic

These definitions are later used by the **rating engine** during policy issuance, endorsement, and renewal.

---

# 2. Position in PAS

Typical relationship:

```text
Product
 └ Plan
    └ Section
       └ Coverage
          ├ Base Premium
          ├ Rating Factors
          ├ Discounts
          └ Surcharges
```

In most general insurance products:

- **rating factors are mainly defined at coverage level**
- **plan premium is calculated by summing coverage premiums**
- **optional plan-level adjustments can also exist**

---

# 3. Feature: Risk Rating Factor Definition

This feature defines **what factors influence premium**.

### Tasks

- Create rating factor
- Define factor code and name
- Define factor type
- Define factor source
- Enable / disable factor
- Maintain factor description

### Common factor types

- numeric factor
- range factor
- categorical factor
- boolean factor

### Examples

Motor Insurance:

- Driver Age
- Vehicle Usage
- Vehicle Value
- Vehicle Type
- Region

Fire Insurance:

- Building Age
- Construction Type
- Occupancy Type
- Fire Protection
- Location Risk Zone

---

# 4. Feature: Rating Table Configuration

This feature defines **how each factor value maps to a premium multiplier or rate**.

### Tasks

- Create rating table
- Define value bands or categories
- Define multiplier or loading
- Set effective date
- Maintain rating versions

### Example: Driver Age

```text
Driver Age < 25      -> 1.30
Driver Age 25 - 60   -> 1.00
Driver Age > 60      -> 1.20
```

### Example: Vehicle Usage

```text
Private Use      -> 1.00
Commercial Use   -> 1.20
```

### Example: Construction Type

```text
Concrete   -> 1.00
Steel      -> 1.05
Wood       -> 1.40
```

---

# 5. Feature: Factor Source Mapping

This feature links each rating factor to the **risk information collected during policy issuance**.

### Tasks

- Map factor to risk field
- Define data source
- Validate source field type
- Maintain mapping rules

### Example

```text
Rating Factor: Driver Age
Source Field: PolicyRisk.DriverAge
```

```text
Rating Factor: Construction Type
Source Field: PropertyRisk.ConstructionType
```

This allows the system to automatically read risk information and select the correct factor value.

---

# 6. Feature: Coverage Rating Rule Configuration

This feature defines **which rating factors apply to each coverage**.

### Tasks

- Assign rating factors to coverage
- Define factor sequence
- Define mandatory / optional usage
- Maintain coverage pricing formula

### Motor Insurance Example

```text
Collision Coverage
- Driver Age
- Vehicle Value
- Vehicle Usage
```

```text
Theft Coverage
- Region
- Vehicle Type
```

### Fire Insurance Example

```text
Building Fire Coverage
- Construction Type
- Building Age
- Fire Protection
- Location Risk Zone
```

---

# 7. Feature: Base Premium Configuration

This feature defines the **starting premium before rating factors are applied**.

### Tasks

- Configure base premium
- Configure rate basis
- Maintain effective date
- Maintain product version

### Example

```text
Collision Coverage Base Premium = 800
Theft Coverage Base Premium = 200
Third Party Liability Base Premium = 300
```

---

# 8. Feature: Discount and Surcharge Configuration

This feature defines premium reductions and additional charges.

### Tasks

- Create discount rule
- Create surcharge rule
- Define percentage or fixed amount
- Define applicability conditions

### Examples

Discounts:

- No-claim discount
- Renewal discount
- Multi-policy discount

Surcharges:

- Young driver surcharge
- High-risk area surcharge
- Commercial usage surcharge

---

# 9. Feature: Plan-Level Rating Adjustment

Although most rating factors are defined at **coverage level**, some adjustments may apply to the **whole plan or policy**.

### Tasks

- Define plan-level factor
- Define adjustment formula
- Apply overall discount or loading
- Maintain effective date

### Example

```text
Plan Premium
= Sum of Coverage Premiums
- Renewal Discount
+ Installment Surcharge
```

Typical plan-level adjustments:

- policy term factor
- installment loading
- renewal discount
- portfolio discount

---

# 10. Example: Premium Calculation Flow

Motor Insurance example:

```text
Plan: Private Car Plan

Coverages:
- Collision
- Theft
- Third Party Liability
```

### Collision Premium

```text
Base Premium = 800
Driver Age Factor = 1.30
Vehicle Value Factor = 1.10

Collision Premium = 800 × 1.30 × 1.10 = 1144
```

### Theft Premium

```text
Base Premium = 200
Region Factor = 1.20

Theft Premium = 200 × 1.20 = 240
```

### Liability Premium

```text
Base Premium = 300
Usage Factor = 1.10

Liability Premium = 300 × 1.10 = 330
```

### Plan Premium

```text
Plan Premium = 1144 + 240 + 330 = 1714
```

### Plan-Level Adjustment

```text
Renewal Discount = 10%

Final Premium = 1714 × 0.90 = 1542.6
```

---

# 11. Example Product Design Structure

```text
Product
 └ Plan
    └ Section
       └ Coverage
          ├ Base Premium
          ├ Rating Factors
          ├ Rating Tables
          ├ Discounts
          └ Surcharges
```

Optional extension:

```text
Plan
 └ Plan-Level Adjustments
    ├ Renewal Discount
    ├ Installment Surcharge
    └ Term Factor
```

---

# 12. Summary

Risk rating factor configuration is a key feature of **Product Management** in a PAS.

Core capabilities include:

- rating factor definition
- rating table configuration
- factor source mapping
- coverage rating rule configuration
- base premium configuration
- discount and surcharge configuration
- optional plan-level adjustment

In most general insurance systems:

- **risk rating factors are mainly configured under coverage**
- **risk information is collected during policy issuance**
- **the rating engine applies product rules automatically**
- **plan premium is usually the sum of coverage premiums**

These configurations are later used by the **Policy Management** and **Rating Engine** modules to calculate premium automatically.
