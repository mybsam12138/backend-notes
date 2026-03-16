# Accumulation Management Feature (Insurance PAS)

## 1. Overview

Accumulation management controls **risk concentration** in an insurance system.  
It ensures the insurer does not insure too much exposure in the same location, asset group, or risk category.

Typical situations include:

- Too many insured properties in the same building
- Too many cargo shipments on the same vessel
- Too many policies exposed to the same catastrophe zone

If accumulation exceeds the defined limit, the system may:

- Display warning messages to underwriters
- Block policy issuance
- Require special approval

---

# 2. Business Purpose

Insurance companies must control **catastrophic exposure**.

Example:

If an insurer covers:

- 100 apartments in the same building
- each insured for **$1,000,000**

A single fire could produce **$100,000,000 loss**.

Accumulation management prevents such excessive concentration of risk.

---

# 3. Accumulation Dimensions

Accumulation can be tracked using different dimensions.

## 3.1 Location Accumulation

Exposure grouped by **physical location**.

Examples:

- Building address
- Industrial park
- Warehouse location

## 3.2 Policy Accumulation

Exposure grouped by **policies belonging to the same client or related risks**.

Examples:

- Multiple policies issued to the same corporate group
- Several policies covering related assets

## 3.3 Catastrophe Zone Accumulation

Exposure grouped by **geographic catastrophe zones**.

Examples:

- Flood zones
- Earthquake zones
- Hurricane regions

---

# 4. Key Features

## 4.1 Define Accumulation Units

The system should allow defining accumulation units such as:

- Location
- Vessel
- Warehouse
- Catastrophe zone
- Client group

---

## 4.2 Configure Accumulation Limits

Users can configure maximum exposure limits.

Example configuration:

| Dimension | Limit |
|-----------|------|
| Building | 50,000,000 |
| Warehouse | 80,000,000 |
| Flood Zone | 200,000,000 |

---

## 4.3 Exposure Calculation

The system automatically calculates exposure based on:

- Sum insured
- Active policies
- Endorsements
- Renewals

Formula:

Total Exposure = Sum of all insured amounts within the same accumulation unit.

---

## 4.4 Real-Time Accumulation Check

When issuing or updating a policy, the system must:

1. Identify the accumulation unit
2. Calculate current exposure
3. Add the new policy exposure
4. Compare with accumulation limit

If the limit is exceeded:

- Warning message is triggered
- Underwriter approval may be required
- Policy issuance may be blocked

---

## 4.5 Accumulation Monitoring Dashboard

The system may provide dashboards showing:

- Top high-risk locations
- Exposure by catastrophe zone
- Exposure by product line
- Total accumulated insured value

---

# 5. Example Workflow

Example underwriting process:

1. Underwriter creates a property insurance policy.
2. System identifies the **building address**.
3. System calculates the current **total exposure for the building**.
4. The new policy sum insured is added.
5. System compares exposure with the configured limit.

If the limit is exceeded:

- Warning appears
- Manual approval may be required

---

# 6. Related Modules

Accumulation management interacts with:

- Product Management
- Policy Management
- Risk Rating
- Underwriting Rules
- Reinsurance Management

---

# 7. Summary

Accumulation management is a **risk control mechanism** used by insurers to prevent excessive exposure in one location or risk category.

Core capabilities include:

- Exposure tracking
- Accumulation limit configuration
- Real-time underwriting checks
- Risk concentration monitoring