# AI-Native Backend Development (Java / Spring Boot)

This document describes a **simple, practical backend-only AI development mode**.
It focuses on *how teams really work with AI*, not theory.

The goal:
> Let AI generate backend code that already follows **your architecture, rules, and style**.

---

## 1. The new backend development mode (plain language)

### Old mode
```
Requirement
 → human interprets
   → human writes code
     → review
```

### New AI-assisted mode
```
Requirement
 → write a clear feature spec
   → AI reads fixed backend docs + prompt
     → AI writes standard backend code
       → human verifies business correctness
```

Key mindset shift:

> **AI does execution. Humans keep decision authority.**

---

## 2. Minimal `/docs` structure for backend (start here)

You do NOT need a big framework.

Start with just **5 files**:

```
/docs/backend
  01-backend-rules.md
  02-data-dictionary.md
  03-code-style.md
  04-feature-spec-template.md
  05-task-prompt.md
```

These files together act like:
- a “backend constitution”
- a stable prompt input for AI

---

## 3. What each doc does (with examples)

---

### 3.1 `01-backend-rules.md`
**Purpose:** tell AI *where logic is allowed to live*

This prevents architecture drift.

Example:

```md
# Backend Rules

## Layering
- Controller: request/response only
- Service: business rules and decisions
- Repository: DB access only
- No business logic in controller or repository

## Decision Authority
- PolicyService owns policy status changes
- BillingService may read policy data, but must not modify it

## Transactions
- Transactions are defined at service layer
- Controllers must not start transactions
```

Think of this as:
> Architectural laws AI must obey.

---

### 3.2 `02-data-dictionary.md`
**Purpose:** make database fields unambiguous

This is your “field description strategy”.

Example:

```md
# Data Dictionary

## Table: policy

| Field | Type | Nullable | Meaning | Owner | Rules |
|------|------|----------|---------|-------|------|
| id | bigint | N | primary key | system | auto |
| policy_no | varchar | N | policy number | system | unique |
| status | varchar | N | policy status | PolicyService | enum only |
| expiry_date | date | N | policy expiry date | PolicyService | must be future |
```

Why this helps AI:
- AI knows who is allowed to set each field
- AI won’t invent constraints

---

### 3.3 `03-code-style.md`
**Purpose:** make AI write code that “looks like your team”

Example:

```md
# Backend Code Style (Java)

## Packages
- controller: REST only
- service: business logic
- repository: DB access
- model/entity: persistence model
- dto: request/response objects

## Naming
- Service classes end with Service
- DTOs end with Req / Resp

## Exceptions
- Use BizException for business rule violations
- Do not throw RuntimeException directly

## Validation
- Use javax/jakarta validation on DTOs
- Service must re-check critical rules
```

This prevents:
- wrong class names
- wrong exception usage
- inconsistent structure

---

### 3.4 `04-feature-spec-template.md`
**Purpose:** give AI a clean, repeatable feature description

Example template:

```md
# Feature: <feature name>

## Business Goal
Why this feature exists.

## Business Rules
- Rule 1
- Rule 2

## DB Changes
- Table: policy
  - Add field: grace_days (int)

## API Changes
- POST /policies/{id}/renew

## Edge Cases
- Policy already expired
- Duplicate requests

## Acceptance Criteria
- What must be true after implementation
```

Think of this as:
> Jira ticket, but AI-readable.

---

### 3.5 `05-task-prompt.md`
**Purpose:** the stable prompt every backend dev uses

This is the most important file.

Example:

```md
# Backend Task Prompt

You are implementing backend code in a production Java project.

You MUST read and follow:
- /docs/backend/01-backend-rules.md
- /docs/backend/02-data-dictionary.md
- /docs/backend/03-code-style.md

Rules:
- Do not invent new utilities or frameworks
- Follow existing project structure
- Put business logic only in service layer
- Add validation and meaningful errors
- Do not break existing APIs unless specified

Process:
1. Summarize the feature in your own words
2. List files you will create or modify
3. Generate code step by step
4. If something is unclear, state assumptions explicitly
```

This file **is the backend AI entry point**.

---

## 4. The FINAL prompt you actually send to AI

This is what you type into Cursor / ChatGPT / IDE AI.

### Example: real final prompt

```text
Read the following backend docs carefully:
- /docs/backend/01-backend-rules.md
- /docs/backend/02-data-dictionary.md
- /docs/backend/03-code-style.md
- /docs/backend/05-task-prompt.md

Then implement the feature described here:
- /docs/features/BE-101-policy-renewal.md

Follow the process defined in 05-task-prompt.md.
Start by summarizing the feature and proposing a file-level plan.
Do NOT generate code until the plan is confirmed.
```

That’s it.

No magic wording.
No “prompt engineering tricks”.

---

## 5. Why this works (important but short)

- Docs = **long-term memory**
- Task prompt = **execution rules**
- Feature spec = **input**
- AI = **code generator**
- Human = **judge**

You are no longer “talking to AI”.
You are **running a backend execution pipeline**.

---

## 6. What to add later (optional)

Only after this works well:

- testing strategy doc
- error code catalog
- example reference feature
- DB migration rules

But do NOT start there.

---

## 7. One-sentence takeaway

> **Prompts are not chat text.  
> Prompts are backend infrastructure.**

Commit them. Review them. Improve them.

That’s the new development mode.
