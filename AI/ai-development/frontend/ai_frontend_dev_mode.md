# AI-Native Frontend Development (Vue 3 + TypeScript)

This document mirrors the **backend AI-native mode**, but is tailored for **frontend development**.
It focuses on **Vue 3 + TypeScript** and how teams practically use AI to generate UI code
that still matches team standards and UX expectations.

Goal:
> Let AI generate frontend code that already follows **your UI patterns, state rules, and API contracts**.

---

## 1. The new frontend development mode (simple and real)

### Old mode
```
Requirement
 → human designs UI
   → human writes components, state, API calls
     → review
```

### New AI-assisted mode
```
Requirement
 → write a clear UI feature spec
   → AI reads fixed frontend docs + prompt
     → AI writes standard components + state + API calls
       → human verifies UX and edge cases
```

Key shift:

> **AI writes structure and repetition.  
> Humans decide UX, interaction, and edge cases.**

---

## 2. Minimal `/docs` structure for frontend (don’t overdo it)

Start with **5 files only**, just like backend:

```
/docs/frontend
  01-frontend-rules.md
  02-api-contract.md
  03-code-style.md
  04-feature-spec-template.md
  05-task-prompt.md
```

This is enough for most Vue projects.

---

## 3. What each doc does (with examples)

---

### 3.1 `01-frontend-rules.md`
**Purpose:** tell AI *how UI logic is split*

Prevents messy components and duplicated logic.

Example:

```md
# Frontend Rules

## Responsibilities
- Page components: layout + orchestration only
- Components: reusable UI pieces, no API calls
- Store (Pinia): state + async logic
- API layer: HTTP calls only

## State Rules
- No API calls inside Vue components
- All async logic goes through store or api layer
- Components consume reactive state only

## UX Rules
- Always handle: loading / empty / error states
- No silent failures
```

Think of this as:
> “Frontend architecture laws”.

---

### 3.2 `02-api-contract.md`
**Purpose:** stop AI from guessing backend APIs

This is the frontend equivalent of a data dictionary.

Example:

```md
# API Contract (Frontend View)

## POST /api/policies/{id}/renew

Request:
- graceDays: number (required)

Response:
- success: boolean
- data:
  - policyId: string
  - status: string

Errors:
- POLICY_NOT_RENEWABLE
- POLICY_NOT_FOUND
```

Rules:
- API names must match backend OpenAPI
- Do not invent endpoints
- Error codes must be handled explicitly

---

### 3.3 `03-code-style.md`
**Purpose:** make AI-generated Vue code look like your team wrote it

Example:

```md
# Frontend Code Style (Vue + TypeScript)

## File Structure
- pages/: route-level pages
- components/: reusable components
- stores/: Pinia stores
- api/: API clients
- types/: shared types

## Naming
- Components: PascalCase
- Stores: useXxxStore
- API functions: verbNoun (fetchPolicy, renewPolicy)

## Composition API
- Use <script setup lang="ts">
- Avoid Options API

## Error Handling
- Centralized error toast utility
- No alert() calls
```

---

### 3.4 `04-feature-spec-template.md`
**Purpose:** give AI a UI task it can execute correctly

Example template:

```md
# Feature: Policy Renewal Page

## Page / Route
- /policies/:id/renew

## Business Goal
Allow user to renew a policy with a grace period.

## UI Elements
- Input: grace days (number)
- Button: Renew

## States
- Loading: disable form
- Success: show confirmation
- Error: show error message

## Permissions
- Only visible to ROLE_ADMIN

## Acceptance Criteria
- Validation errors shown inline
- API errors mapped to user-friendly messages
```

This replaces vague Jira tickets.

---

### 3.5 `05-task-prompt.md`
**Purpose:** the stable frontend AI execution prompt

This is the entry point for AI.

Example:

```md
# Frontend Task Prompt

You are implementing frontend code in a Vue 3 + TypeScript project.

You MUST read and follow:
- /docs/frontend/01-frontend-rules.md
- /docs/frontend/02-api-contract.md
- /docs/frontend/03-code-style.md

Rules:
- Do not invent APIs
- Do not put async logic in components
- Reuse existing components and utilities
- Always implement loading / empty / error states
- Keep UI consistent with existing pages

Process:
1. Summarize the feature in your own words
2. List files to create or modify
3. Implement code step by step
4. If UX behavior is unclear, state assumptions
```

This file should be reused for every frontend task.

---

## 4. The FINAL prompt you actually send to AI

This is the real, practical prompt.

### Example final prompt

```text
Read the following frontend docs carefully:
- /docs/frontend/01-frontend-rules.md
- /docs/frontend/02-api-contract.md
- /docs/frontend/03-code-style.md
- /docs/frontend/05-task-prompt.md

Then implement the feature described here:
- /docs/features/FE-101-policy-renewal.md

Follow the process defined in 05-task-prompt.md.
Start by summarizing the feature and proposing a file-level plan.
Do NOT generate code until the plan is confirmed.
```

No tricks.
No magic words.
Just structure.

---

## 5. Why this works (short explanation)

- Rules docs = long-term memory
- Task prompt = execution engine
- Feature spec = input
- AI = code generator
- Human = UX judge

Frontend complexity is **managed, not eliminated**.

---

## 6. What to add later (only if needed)

After this works smoothly:
- UI component catalog
- error code → message mapping doc
- accessibility rules
- visual reference pages
- E2E testing rules

But don’t start there.

---

## 7. One-sentence takeaway

> **Frontend prompts are not “instructions”.  
> They are UI architecture encoded as text.**

Commit them.
Review them.
Evolve them.

That’s the new frontend development mode.
