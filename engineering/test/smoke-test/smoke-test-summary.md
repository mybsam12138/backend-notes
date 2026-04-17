# Smoke Test Summary

## What is Smoke Test?

Smoke testing is a **quick and basic test** performed after deployment to verify that the **core functions of a system are working**.

> It answers: "Is the system alive and usable?"

---

## Purpose

- Detect critical failures early
- Ensure system is stable enough for further testing or use
- Avoid wasting time on deeper testing if basic functions are broken

---

## When to Perform

- After deployment (e.g., after release to staging or production)
- After major build or integration

---

## Scope

Smoke test focuses on **key business flows**, not all features.

Examples:
- User login works
- API is reachable
- Core function (e.g., purchase / submit) works

---

## Example (Insurance System)

- User can log in
- Product list loads
- Premium calculation API returns result
- Policy purchase flow works (basic path)

---

## Characteristics

- Fast (usually minutes)
- Shallow (not detailed)
- High-level validation
- Covers critical paths only

---

## Smoke Test vs Other Tests

| Type | Purpose | Depth |
|------|--------|------|
| Smoke Test | Basic system check | Low |
| Functional Test | Validate features | Medium |
| Regression Test | Ensure no break after change | High |

---

## Failure Handling

If smoke test fails:
- Stop further testing
- Rollback or fix immediately

---

## One-Line Summary

> Smoke test is a quick check to ensure the system is basically working after deployment.
