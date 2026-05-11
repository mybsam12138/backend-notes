# Defect Classification by Type

> This guide classifies defects **by defect type** — what kind of problem it is.

---

## Overview of Defect Types

| # | Defect Type | Short Description |
|---|---|---|
| 1 | **Functional Defect** | Feature doesn't work as expected |
| 2 | **UI / Cosmetic Defect** | Visual or layout issue |
| 3 | **Performance Defect** | System is slow or unresponsive |
| 4 | **Security Defect** | Vulnerability or unauthorized access risk |
| 5 | **Data / Logic Defect** | Wrong calculation or incorrect data |
| 6 | **Compatibility Defect** | Doesn't work on certain browser/device/OS |
| 7 | **Integration Defect** | System-to-system connection fails |
| 8 | **Regression Defect** | Previously working feature broke after a change |
| 9 | **Usability Defect** | System works but is hard to use |
| 10 | **Documentation Defect** | Wrong or missing documentation/labels |

---

## 1. Functional Defect
> The system **does not behave** according to functional requirements.

- **Example:** "Submit" button does nothing when clicked
- **Found by:** QA Tester, Business User
- **Severity:** Can be Low → Critical depending on the feature
- **Who fixes:** Developer

---

## 2. UI / Cosmetic Defect
> The system works correctly but **looks wrong** — layout, fonts, colors, alignment, spacing.

- **Example:** Button is misaligned, text is cut off, wrong color on hover
- **Found by:** QA Tester, UX Designer, Business User
- **Severity:** Usually Low
- **Who fixes:** Frontend Developer / UI Developer

---

## 3. Performance Defect
> The system is **too slow, times out, or uses too many resources** under normal or peak load.

- **Example:** Page takes 15 seconds to load, report generation times out
- **Found by:** QA (via performance testing), End Users
- **Severity:** Medium → Critical (especially in production)
- **Who fixes:** Developer, DevOps, Database Admin

---

## 4. Security Defect
> A **vulnerability** that could expose data, allow unauthorized access, or be exploited by attackers.

- **Example:** SQL injection possible on login page, user can access another user's data
- **Found by:** Security Tester, Penetration Tester, Developer (code review)
- **Severity:** High → Critical (always treated with urgency)
- **Who fixes:** Developer, Security Engineer
- **Note:** Often handled as a separate security incident, not just a defect ticket

---

## 5. Data / Logic Defect
> The system produces **incorrect output** due to wrong business logic or bad data handling.

- **Example:** Discount calculated as 10% instead of 15%, total amount rounded incorrectly
- **Found by:** QA Tester, Business User (especially in UAT)
- **Severity:** Medium → Critical (financial impact)
- **Who fixes:** Developer (logic fix), sometimes Database Admin (data fix)

---

## 6. Compatibility Defect
> The system **works in one environment but fails in another** — different browsers, OS, devices, or screen sizes.

- **Example:** Feature works in Chrome but broken in Safari, layout breaks on mobile
- **Found by:** QA Tester (cross-browser/device testing)
- **Severity:** Low → High depending on user base
- **Who fixes:** Frontend Developer

---

## 7. Integration Defect
> **Two or more systems fail to communicate** correctly — APIs, data exchange, or third-party services.

- **Example:** Payment gateway not responding, data sent to external system is in wrong format
- **Found by:** QA Tester (integration testing), System Monitoring
- **Severity:** High → Critical
- **Who fixes:** Developer, Integration Engineer

---

## 8. Regression Defect
> A **previously working feature breaks** after a new code change, update, or deployment.

- **Example:** Login worked fine last sprint, but after a new release it now fails
- **Found by:** QA (regression testing), End Users
- **Severity:** Can be any level — depends on the broken feature
- **Who fixes:** Developer (identify what change caused the regression)
- **Note:** Regression testing is done specifically to catch these defects

---

## 9. Usability Defect
> The system is **technically correct but difficult or confusing to use** — poor UX/UI design.

- **Example:** No error message shown when form validation fails, confusing navigation flow
- **Found by:** Business User (UAT), UX Reviewer
- **Severity:** Usually Low → Medium
- **Who fixes:** UX Designer + Frontend Developer

---

## 10. Documentation Defect
> **Wrong, missing, or misleading** information in user manuals, help text, tooltips, or field labels.

- **Example:** Help text says "Enter amount in USD" but system expects MYR
- **Found by:** Business User, QA Tester
- **Severity:** Usually Low
- **Who fixes:** Business Analyst, Technical Writer, Developer (if in-app text)

---

## Comparison: By Environment vs. By Type

| Classification | Focus | Key Question |
|---|---|---|
| **By Environment** | *When & where* was it found? | Dev / UAT / Production? |
| **By Type** | *What kind* of problem is it? | Functional / Security / Performance / etc.? |

> Both classifications are used **together** in real projects.  
> Example: *"Production Security Defect — P1"* uses environment + type + priority all at once.

---

## Which Roles Care About Which Types?

| Defect Type | QA | Developer | BA / PO | Security | DevOps |
|---|---|---|---|---|---|
| Functional | ✅ | ✅ | ✅ | | |
| UI / Cosmetic | ✅ | ✅ | | | |
| Performance | ✅ | ✅ | | | ✅ |
| Security | ✅ | ✅ | | ✅ | ✅ |
| Data / Logic | ✅ | ✅ | ✅ | | |
| Compatibility | ✅ | ✅ | | | |
| Integration | ✅ | ✅ | | | ✅ |
| Regression | ✅ | ✅ | | | |
| Usability | ✅ | ✅ | ✅ | | |
| Documentation | ✅ | | ✅ | | |

---

## Summary

> When classifying defects by **type**, you are answering:  
> **"What went wrong?"** — not just where or when it was found.

Using both environment-based and type-based classification together gives teams a **complete picture** of every defect, making it easier to assign, prioritize, and resolve issues efficiently.
