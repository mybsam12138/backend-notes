# Configuration-Driven Risk Factor System Design

This document explains a practical architecture for implementing **risk factor configuration** in an insurance PAS system.

The goal is:

- Different products use different risk factors
- Risk factors can be configured without code changes
- Rating rules are configurable
- Quotation UI is generated dynamically

---

# 1 System Architecture

```
Product Configuration
        ↓
Risk Factor Definition
        ↓
Rating Rule Configuration
        ↓
Quotation UI Generator
        ↓
Rating Engine
        ↓
Premium Calculation
```

Flow example:

```
Product selected
→ Load configured risk factors
→ Generate UI fields
→ User inputs factor values
→ Rating engine evaluates rules
→ Premium calculated
```

---

# 2 Database Structure

## 2.1 Product Table

```
product
```

| column | description |
|------|-------------|
| product_id | product id |
| product_code | product code |
| product_name | product name |
| status | active / inactive |

Example:

| product_id | product_code | product_name |
|---|---|---|
| 1 | MOTOR | Motor Insurance |
| 2 | FIRE | Fire Insurance |

---

# 2.2 Risk Factor Definition

Defines reusable risk factors.

```
risk_factor_definition
```

| column | description |
|------|-------------|
| factor_id | factor id |
| factor_code | factor code |
| factor_name | display name |
| data_type | number/string/select |
| ui_type | input/select/dropdown |
| required | boolean |

Example:

| factor_id | factor_code | factor_name | type |
|---|---|---|---|
| 1 | DRIVER_AGE | Driver Age | number |
| 2 | VEHICLE_TYPE | Vehicle Type | select |
| 3 | VEHICLE_AGE | Vehicle Age | number |
| 4 | BUILDING_MATERIAL | Building Material | select |

---

# 2.3 Product Risk Factor Mapping

Defines which factors belong to each product.

```
product_risk_factor
```

| column | description |
|------|-------------|
| id | primary key |
| product_id | product |
| factor_id | risk factor |
| display_order | UI order |
| required | required |

Example:

| product_id | factor_id |
|---|---|
| MOTOR | DRIVER_AGE |
| MOTOR | VEHICLE_TYPE |
| MOTOR | VEHICLE_AGE |
| FIRE | BUILDING_MATERIAL |

---

# 2.4 Factor Value Table (For dropdown)

```
risk_factor_option
```

| option_id | factor_id | option_value | option_label |
|---|---|---|---|
| 1 | VEHICLE_TYPE | sedan | Sedan |
| 2 | VEHICLE_TYPE | sports | Sports |
| 3 | BUILDING_MATERIAL | wood | Wood |
| 4 | BUILDING_MATERIAL | concrete | Concrete |

---

# 2.5 Rating Rule Table

Stores rating logic.

```
rating_rule
```

| column | description |
|------|-------------|
| rule_id | rule id |
| product_id | product |
| factor_id | risk factor |
| condition_operator | operator |
| condition_value | condition value |
| factor_value | multiplier |

Example:

| product_id | factor | condition | value | multiplier |
|---|---|---|---|---|
| MOTOR | DRIVER_AGE | < | 25 | 1.2 |
| MOTOR | VEHICLE_TYPE | = | sports | 1.3 |
| FIRE | BUILDING_MATERIAL | = | wood | 1.5 |

---

# 3 Example Product Configuration

## Motor Insurance

Risk factors:

```
Driver Age
Vehicle Type
Vehicle Age
```

Rules:

```
IF driver_age < 25 → factor 1.2
IF vehicle_type = sports → factor 1.3
IF vehicle_age > 10 → factor 1.1
```

---

## Fire Insurance

Risk factors:

```
Building Material
Building Age
Location
```

Rules:

```
IF building_material = wood → factor 1.5
IF building_age > 30 → factor 1.2
```

---

# 4 Dynamic Quotation UI

When user selects product:

```
SELECT * 
FROM product_risk_factor
WHERE product_id = MOTOR
```

System loads factors:

```
Driver Age
Vehicle Type
Vehicle Age
```

Generated UI:

```
Driver Age: [ input ]
Vehicle Type: [ dropdown ]
Vehicle Age: [ input ]
```

UI is generated automatically from configuration.

---

# 5 Runtime Rating Calculation

Example input:

```
Driver Age = 22
Vehicle Type = sports
Vehicle Age = 5
```

Rating process:

```
base premium = 1000

driver_age < 25 → ×1.2
vehicle_type = sports → ×1.3

premium = 1000 × 1.2 × 1.3 = 1560
```

---

# 6 Rating Engine Implementation

Pseudo code:

```
premium = base_premium

for each factor in product_factors:
    value = input[factor]

    rule = find_matching_rule(product_id, factor, value)

    if rule:
        premium *= rule.multiplier
```

---

# 7 Quotation Data Storage

Example table:

```
policy_risk_data
```

| policy_id | factor_code | factor_value |
|---|---|---|
| 1001 | DRIVER_AGE | 22 |
| 1001 | VEHICLE_TYPE | sports |

This allows flexible storage of risk attributes.

---

# 8 Advantages

This design provides:

- configurable products
- dynamic UI
- flexible rating rules
- no code change for new factors
- reusable risk factor library

---

# 9 Performance Optimization

Common improvements:

- cache factor configuration
- cache rating rules
- precompile rule expressions
- use rating table instead of rule evaluation

---

# 10 Summary

A configuration-driven risk factor system consists of:

Core configuration:

- product
- risk_factor_definition
- product_risk_factor

Rating configuration:

- rating_rule

Runtime components:

- dynamic UI generator
- rating engine
- policy risk data storage

This architecture allows new products and rating factors to be launched **without changing system code**.
