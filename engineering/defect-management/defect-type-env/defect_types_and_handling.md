# Defect Types: Development, UAT, and Production
> A comprehensive reference guide on defect classification, handling, and data consistency fixes

---

## 1. Defect Type Definitions

### Dev Defects (Development Defects)
> Defects **discovered and fixed during the development phase** by developers or QA through internal testing, before any business user is involved.

| | Details |
|---|---|
| **When** | During development |
| **Found by** | Developers, QA engineers |
| **Environment** | Development / SIT (System Integration Testing) environment |
| **Severity** | Low to medium |
| **Formally recorded** | Usually not — fixed inline |
| **Fix speed** | Same day or next day |

**Characteristics:**
- Caught before any user sees the system
- Cheapest to fix — no process overhead
- Not tracked in defect management systems (e.g. Jira)
- Part of normal development workflow
- Examples: code logic errors, unit test failures, UI styling issues, broken API responses

```
Developer writes code
      ↓
Finds problem during self-testing
      ↓
Fixes immediately
      ↓
Continues development
(No formal record needed)
```

---

### UAT Defects (User Acceptance Testing Defects)
> Defects **discovered by real business users** during the UAT phase, formally recorded and tracked through a defect management process.

| | Details |
|---|---|
| **When** | UAT phase (before go-live) |
| **Found by** | Business users, UAT testers |
| **Environment** | UAT environment |
| **Severity** | Low to high |
| **Formally recorded** | Yes — mandatory (Jira, Azure DevOps, etc.) |
| **Fix speed** | Days — follows triage and prioritization process |

**Characteristics:**
- Found by users testing real business scenarios
- Must be formally logged, triaged, prioritized, fixed, and re-verified
- User must confirm fix before defect is closed
- Iterative process — fix → retest → close
- Examples: business flow not matching requirements, incorrect calculations, missing validation rules, wrong data displayed

```
User tests system
      ↓
Finds problem → Logs in Jira
      ↓
Dev team triages and prioritizes
      ↓
Developer fixes
      ↓
QA verifies fix
      ↓
User re-tests and confirms
      ↓
Defect closed
```

---

### Production Defects (Live Environment Defects)
> Defects **discovered in the live production environment** by real users or monitoring systems, impacting actual business operations.

| | Details |
|---|---|
| **When** | After go-live (hypercare or BAU) |
| **Found by** | Real users, monitoring alerts, support tickets |
| **Environment** | Production environment |
| **Severity** | Medium to critical |
| **Formally recorded** | Yes — mandatory, with incident report |
| **Fix speed** | Hours — emergency response required |

**Characteristics:**
- Highest urgency and business impact
- Requires immediate triage and escalation
- Fix deployed as hotfix — bypasses normal release cycle
- Post-fix incident report and root cause analysis required
- Examples: system crashes, data loss, critical feature unavailable, performance degradation, security breach

```
User reports issue / Monitoring alert fires
      ↓
Immediate triage and severity assessment
      ↓
Escalate if critical
      ↓
Developer produces hotfix
      ↓
Emergency deployment to production
      ↓
Verify fix in production
      ↓
Incident report and root cause analysis
```

---

## 2. Defect Type Comparison

| | Dev Defect | UAT Defect | Production Defect |
|---|---|---|---|
| **Discovery phase** | Development | UAT | Post go-live |
| **Found by** | Developer / QA | Business user | Real user / monitoring |
| **Environment** | Dev / SIT | UAT | Production |
| **Formally recorded** | No | Yes | Yes |
| **Fix speed** | Same day | Days | Hours |
| **User impact** | None | None | Direct and immediate |
| **Business impact** | None | Low | High |
| **Fix process** | Inline fix | Full defect lifecycle | Hotfix + incident report |
| **Relative fix cost** | $1 | $10 | $100 |

---

## 3. Cost of Defects — Why Early Detection Matters

> The later a defect is found, the more expensive it is to fix.

```
Dev Defect        UAT Defect        Production Defect
    $1        →       $10        →         $100
  Cheapest           Medium              Most expensive
  (fix inline)    (process overhead)   (emergency response +
                                        business disruption +
                                        potential data damage)
```

This is why investing in:
- Good **unit testing** → catches dev defects early
- Thorough **UAT** → prevents production defects
- Strong **monitoring** → detects production defects fast

---

## 4. Handling the Same Problem Across Different Phases

> The same underlying bug is handled very differently depending on **when it is discovered**.

### Example Scenario
> **Bug:** A discount calculation is wrong — it applies 10% discount instead of 15%, causing incorrect order totals.

---

### If Found as a Dev Defect
**Situation:** Developer notices wrong discount during self-testing

**How to handle:**
1. Fix the calculation logic directly in code
2. Update unit tests to cover the correct discount rate
3. Verify fix locally
4. Continue development — no formal process needed

**Impact:** Zero — no data affected, no users involved

**Effort:** Low — 1-2 hours

---

### If Found as a UAT Defect
**Situation:** Business user tests checkout flow and notices wrong discount applied

**How to handle:**
1. User logs defect in Jira with steps to reproduce
2. Dev team triages — confirms bug, assigns priority
3. Developer fixes calculation logic
4. QA runs regression test on checkout flow
5. User re-tests and confirms fix
6. Defect closed in Jira

**Impact:** Low — UAT environment data, no real users affected

**Data fix needed:** Reset UAT test data if needed — straightforward

**Effort:** Medium — 1-3 days including process

---

### If Found as a Production Defect
**Situation:** Real customers have been placing orders with wrong discount for 3 days

**How to handle:**

#### Step 1 — Immediate Response (Hours)
- Stop the bleeding — disable discount feature or block affected orders if possible
- Assess scope — how many orders affected? What is the financial impact?
- Escalate to management and business stakeholders
- Communicate to affected users if necessary

#### Step 2 — Fix the Code (Hotfix)
- Developer produces emergency hotfix for calculation logic
- Minimal testing but focused on the critical path
- Emergency deployment to production
- Verify fix is working in production

#### Step 3 — Fix the Data (Critical)
- Identify all affected records — orders placed during the affected period
- Calculate the correct discount for each affected order
- Decide on remediation approach with business:
  - Reprocess all affected orders with correct discount?
  - Issue refunds / credits to affected customers?
  - Accept the loss and move forward?
- Execute data fix carefully — with backup first
- Verify data integrity after fix

#### Step 4 — Post-Incident (Days after)
- Write incident report — what happened, when, impact, how fixed
- Root cause analysis — why was this not caught in UAT?
- Preventive measures — add test cases, improve monitoring

**Impact:** High — real customer data affected, financial impact, reputation risk

**Effort:** Very high — emergency response, data remediation, incident reporting

---

## 5. Data Consistency Defects — Special Handling

> Data consistency defects are the **most dangerous type of production defect** because they silently corrupt data over time, making them hard to detect and expensive to fix.

### What is a Data Consistency Defect?
A defect that causes **data to become incorrect, incomplete, or out of sync** across the system — often without any visible error to the user.

**Common examples:**
- A transaction completes but the balance is not updated
- An order is created but inventory is not deducted
- A record is deleted in one table but related records remain in another
- Calculation errors accumulate over many records silently
- Concurrent transactions cause race conditions and duplicate records

---

### Why Data Consistency Defects Are Special

| | Regular Defect | Data Consistency Defect |
|---|---|---|
| **Visibility** | Usually obvious — error shown | Often silent — no error message |
| **Detection** | User reports immediately | May go unnoticed for days/weeks |
| **Scope** | Single operation affected | Many records affected over time |
| **Fix complexity** | Fix the code | Fix code + fix all corrupted data |
| **Risk** | Low to medium | High — data may be unrecoverable |
| **Business impact** | Functional disruption | Financial loss, compliance risk |

---

### How to Handle Data Consistency Defects

#### Phase 1 — Detect and Contain
```
1. Identify the defect and understand root cause
2. Determine when the problem started (exact timestamp)
3. Estimate scope — how many records are affected?
4. STOP further damage — disable the feature or block affected operations
5. Take a full database backup IMMEDIATELY before any fix
```

#### Phase 2 — Assess the Damage
```
1. Query the database to identify all affected records
   Example: SELECT * FROM orders WHERE created_at >= [defect_start_time]
            AND discount_applied != expected_discount

2. Calculate the correct values for each affected record

3. Determine the business impact:
   - Financial impact (wrong amounts?)
   - Compliance impact (regulatory reporting affected?)
   - Customer impact (how many users affected?)

4. Present findings to business stakeholders for decision
```

#### Phase 3 — Fix the Code First
```
1. Fix the root cause in code — ALWAYS fix code before data
2. Deploy hotfix to production
3. Verify new transactions are now correct
4. Only then proceed to fix historical data
```

> **Critical rule: Never fix data before fixing the code. If the code is still broken, your data fix will be undone by the next transaction.**

#### Phase 4 — Fix the Data
```
1. Always work on a backup/copy first to validate your fix script
2. Write a data remediation script:
   - Identify affected records precisely
   - Calculate correct values
   - Update records with correct values
   - Log every change made (audit trail)

3. Run script in UAT/staging environment first
4. Verify results in UAT — confirm data looks correct
5. Get business sign-off on remediated data in UAT
6. Run script in production during low-traffic window
7. Verify production data after fix
8. Keep full audit log of all changes made
```

#### Phase 5 — Verify and Close
```
1. Run data reconciliation checks:
   - Total counts match expected?
   - Sums and totals correct?
   - No orphaned records?
   - No duplicate records?

2. Have business team spot-check affected records
3. Monitor system for 24-48 hours after fix
4. Write incident report with full timeline
5. Add monitoring/alerting to detect this type of issue in future
```

---

### Data Fix Script Best Practices

```sql
-- ALWAYS start with a backup
-- ALWAYS use a transaction so you can rollback if needed
-- ALWAYS log what you changed

BEGIN TRANSACTION;

-- Step 1: Preview what will be changed (run SELECT first, never UPDATE first)
SELECT order_id, current_discount, correct_discount
FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-01-15'
AND discount_applied = 0.10  -- wrong value
AND correct_discount = 0.15; -- expected value

-- Step 2: Only after confirming the SELECT looks right, run the UPDATE
UPDATE orders
SET discount_applied = 0.15,
    updated_at = GETDATE(),
    updated_by = 'DATA_FIX_2024_01_15',  -- audit trail
    fix_note = 'Corrected discount rate from 10% to 15%'
WHERE created_at BETWEEN '2024-01-01' AND '2024-01-15'
AND discount_applied = 0.10;

-- Step 3: Verify the update
SELECT COUNT(*) as fixed_records FROM orders
WHERE fix_note = 'Corrected discount rate from 10% to 15%';

-- Step 4: If everything looks correct, commit. Otherwise rollback.
COMMIT;
-- ROLLBACK;  ← use this if anything looks wrong
```

---

### Key Rules for Data Consistency Fixes

| Rule | Why |
|---|---|
| **Backup before anything** | Safety net if fix goes wrong |
| **Fix code before data** | Prevent re-corruption |
| **SELECT before UPDATE** | Verify scope before changing anything |
| **Use transactions** | Ability to rollback if needed |
| **Add audit trail** | Track every change made |
| **Test in UAT first** | Validate fix before touching production |
| **Fix during low traffic** | Minimize impact on live users |
| **Get business sign-off** | Confirm fix is correct before production |
| **Monitor after fix** | Ensure no further corruption |

---

## 6. Defect Severity Levels

| Severity | Definition | Response Time | Example |
|---|---|---|---|
| **Critical (P1)** | System down, data loss, no workaround | Immediate — within hours | System crash, data corruption |
| **High (P2)** | Major feature broken, workaround exists | Same day | Payment fails, login broken |
| **Medium (P3)** | Feature partially broken, workaround exists | 2-3 days | Report shows wrong data |
| **Low (P4)** | Minor issue, cosmetic, minimal impact | Next sprint | Wrong label, UI alignment |

---

## 7. Summary — The Golden Rules of Defect Management

1. **Find defects early** — dev defects cost $1, production defects cost $100
2. **Always formally record** UAT and production defects — no exceptions
3. **Prioritize by business impact** — not by what is easiest to fix
4. **For production defects** — contain first, fix code second, fix data third
5. **For data consistency defects** — backup always, SELECT before UPDATE always
6. **Never fix data before fixing code** — you will re-corrupt the data
7. **Always test data fix in UAT** before running in production
8. **Always write an incident report** for production defects — learn from it
9. **Add monitoring** after every production defect — detect it faster next time

---

*Reference guide based on industry-standard defect management and data remediation practices.*
