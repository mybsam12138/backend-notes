# Defect Management Summary

## What is Defect Management?

Defect management is a systematic process for identifying, documenting, tracking, and resolving defects (bugs, errors, or flaws) found in software during testing or production. It ensures that issues are captured, prioritized, assigned, and fixed in a controlled and traceable way.

---

## Key Stages of the Defect Life Cycle

| Stage | Description |
|---|---|
| **New** | Defect is discovered and logged for the first time |
| **Assigned** | Defect is assigned to a developer for investigation |
| **Open** | Developer begins analyzing and working on the fix |
| **Fixed** | Developer resolves the defect and marks it fixed |
| **Retest** | QA retests the fix to verify the issue is resolved |
| **Closed** | Defect is confirmed resolved and closed |
| **Reopened** | Defect recurs or the fix is insufficient; cycle restarts |
| **Rejected / Deferred** | Defect is invalid, a duplicate, or postponed to a future release |

---

## Defect Attributes

Every defect report should include:

- **ID** – Unique identifier
- **Title / Summary** – Brief description of the issue
- **Description** – Steps to reproduce, actual vs. expected behavior
- **Severity** – Impact on the system (Critical, High, Medium, Low)
- **Priority** – Urgency of fix (P1–P4)
- **Environment** – OS, browser, version, etc.
- **Assignee** – Developer responsible for the fix
- **Status** – Current stage in the life cycle
- **Attachments** – Screenshots, logs, or videos

---

## Severity vs. Priority

| | **Severity** | **Priority** |
|---|---|---|
| **Definition** | Impact of defect on functionality | Urgency of fixing the defect |
| **Set by** | QA / Tester | Product Owner / Manager |
| **Example** | App crash = Critical severity | Low-traffic feature = Low priority |

> A defect can be **high severity but low priority** (e.g., crash on a rarely used screen) or **low severity but high priority** (e.g., a typo on the homepage).

---

## Defect Management Process

```
Discover → Log → Triage → Assign → Fix → Verify → Close
```

1. **Discover** – Identify the defect during testing, UAT, or production monitoring
2. **Log** – Record all details in a defect tracking tool
3. **Triage** – Review, classify, and prioritize defects (team meeting or async)
4. **Assign** – Route defect to the appropriate developer or team
5. **Fix** – Developer investigates root cause and applies a fix
6. **Verify** – QA retests in the appropriate environment
7. **Close** – Confirmed resolved; defect is closed with notes

---

## Common Defect Tracking Tools

| Tool | Best For |
|---|---|
| **Jira** | Enterprise teams, agile workflows |
| **Azure DevOps** | Microsoft-centric teams |
| **Bugzilla** | Open-source projects |
| **GitHub Issues** | Developer-led projects |
| **TestRail** | QA-centric with test case management |
| **Linear** | Modern, fast-paced product teams |

---

## Best Practices

- **Log early and often** – Don't wait; capture defects as soon as discovered
- **Be specific** – Include exact steps to reproduce, environment, and evidence
- **Avoid duplicates** – Search before logging a new defect
- **Use consistent severity/priority definitions** – Align across the whole team
- **Track defect trends** – Use metrics to identify recurring patterns
- **Root cause analysis** – Don't just fix symptoms; address the underlying cause
- **Regression testing** – After fixes, retest related areas to prevent regressions
- **Close the loop** – Always verify and close defects; don't leave them open indefinitely

---

## Key Metrics

| Metric | What It Measures |
|---|---|
| **Defect Density** | Defects per unit of code (e.g., per KLOC) |
| **Defect Discovery Rate** | Number of defects found over time |
| **Defect Resolution Time** | Average time from open to close |
| **Escape Rate** | Defects found in production vs. testing |
| **Reopen Rate** | Percentage of defects reopened after closure |
| **Fix Rate** | Defects fixed vs. defects raised |

---

## Summary

Effective defect management reduces risk, improves software quality, and keeps development teams aligned. A well-defined process — combined with good tooling and clear communication — ensures defects are resolved efficiently and don't recur.
