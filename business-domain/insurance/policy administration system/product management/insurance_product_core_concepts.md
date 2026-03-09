# Insurance Core Concepts (Product → Coverage Structure)

This document explains several core insurance system concepts commonly
used in a PAS (Policy Administration System):

-   Product
-   Plan
-   Section
-   Coverage
-   Benefit
-   Risk / Peril
-   Deductible
-   Limit

A **Motor Insurance** example is used to illustrate how these concepts
relate to each other.

------------------------------------------------------------------------

# 1. Product

**Product** is the top-level insurance offering sold by the insurance
company.

It defines the overall type of insurance.

Examples:

-   Motor Insurance
-   Fire Insurance
-   Travel Insurance
-   Health Insurance

Example:

Product: **Motor Insurance**

Purpose: Protect vehicle owners against risks such as accidents, theft,
and liability.

------------------------------------------------------------------------

# 2. Plan

A **Plan** is a specific version or package under a Product.

Different plans usually offer different levels of protection or pricing.

Example:

Product: Motor Insurance

Plans:

  Plan            Description
--------------- ---------------------
  Basic Plan      Basic protection
  Standard Plan   Balanced protection
  Premium Plan    Full protection

------------------------------------------------------------------------

# 3. Section

A **Section** groups related coverages together.

It represents a logical module of protection.

Example Sections in Motor Insurance:

  Section                     Description
--------------------------- ----------------------------------------
  Liability Section           Damage to other people or property
  Own Damage Section          Damage to the insured vehicle
  Theft Section               Protection against vehicle theft
  Personal Accident Section   Driver and passenger accident coverage

------------------------------------------------------------------------

# 4. Coverage

A **Coverage** is the smallest unit of protection.

It defines exactly **what risk the insurer will pay for**.

Example coverages in Motor Insurance:

  Coverage                      Description
----------------------------- -------------------------------------
  Collision Damage              Vehicle damaged in collision
  Fire Damage                   Vehicle damaged by fire
  Theft                         Vehicle stolen
  Third Party Bodily Injury     Injury caused to another person
  Third Party Property Damage   Damage to another person's property

Example structure:

Motor Insurance\
→ Premium Plan\
→ Own Damage Section\
→ Collision Coverage

------------------------------------------------------------------------

# 5. Benefit

A **Benefit** defines the **type of compensation** the insured receives.

It describes *how the insurer pays the claim*.

Examples:

  Benefit Type        Description
------------------- -------------------------------------
  Repair Cost         Insurance pays for vehicle repair
  Replacement         Insurance replaces the damaged item
  Cash Compensation   Fixed amount paid to insured

Example:

Collision Coverage\
Benefit: Pay repair cost of damaged vehicle.

------------------------------------------------------------------------

# 6. Risk / Peril

**Risk / Peril** represents the **cause of loss**.

Peril answers the question:

"What event caused the damage?"

Examples:

  Peril       Example
----------- ----------------
  Collision   Vehicle crash
  Fire        Fire damage
  Theft       Vehicle stolen
  Flood       Water damage
  Storm       Storm damage

Example:

Peril: Collision\
Coverage: Collision Damage

------------------------------------------------------------------------

# 7. Deductible

**Deductible** is the amount the insured must pay before the insurer
pays.

Example:

Damage cost: 5,000\
Deductible: 500

Insurance pays:

5,000 − 500 = 4,500

------------------------------------------------------------------------

# 8. Limit

**Limit** is the maximum amount the insurer will pay for a coverage.

Example:

Coverage: Collision Damage

  Item             Amount
---------------- ---------
  Damage           120,000
  Coverage Limit   100,000

Insurance pays: **100,000 (maximum limit)**

------------------------------------------------------------------------

# 9. Full Example (Motor Insurance)

Complete structure example:

Motor Insurance (Product)

Plan: Premium Plan

Sections:

1.  Liability Section
    -   Third Party Bodily Injury Coverage\
    -   Third Party Property Damage Coverage
2.  Own Damage Section
    -   Collision Coverage\
    -   Fire Coverage
3.  Theft Section
    -   Vehicle Theft Coverage

Example Coverage Configuration:

Coverage: Collision Damage

Peril: Collision

Benefit: Vehicle repair cost

Deductible: 500

Limit: 100,000

------------------------------------------------------------------------

# 10. Simplified Relationship

### Explanation

| Element             | Meaning                                                      |
| ------------------- | ------------------------------------------------------------ |
| Product             | The insurance product offered by the insurer (e.g., Motor Insurance). |
| Plan                | A specific version or package of the product (e.g., Basic Plan, Premium Plan). |
| Section             | A logical grouping of related coverages.                     |
| Coverage            | The specific protection against a defined risk.              |
| Peril               | The cause of loss that triggers the coverage (e.g., fire, collision, theft). |
| Benefit             | What the insurer will pay when the coverage is triggered.    |
| Limit / Sum Insured | The maximum amount the insurer will pay for the coverage.    |
| Deductible          | The amount the insured must pay before the insurer pays.     |

Product
└─ Plan
   └─ Section
      └─ Coverage
         ├─ Peril
         ├─ Benefit
         ├─ Limit / Sum Insured
         └─ Deductible

