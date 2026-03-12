# Workflow-Driven UI Design (Policy Example)

## Goal

The workflow system should control:

- which actions (buttons) a user can perform
- which role can perform them
- how the business state changes

Example actions:

- Submit
- Approve
- Reject
- Issue Policy
- Cancel

These actions depend on:

- current workflow state
- user role

---

# Core Idea

The UI buttons are **not hardcoded**.

Instead, they are generated from the **workflow transition configuration**.

Flow:

Frontend loads page  
↓  
Backend returns current workflow state  
↓  
Backend calculates available actions  
↓  
Frontend renders buttons

---

# Example Policy Workflow

States:

```
Draft
Submitted
Underwriting Review
Approved
Issued
Rejected
```

Transitions:

```
Draft → Submit → Submitted
Submitted → Review → Underwriting Review
Underwriting Review → Approve → Approved
Underwriting Review → Reject → Rejected
Approved → Issue → Issued
```

---

# Workflow Transition Table

Example table:

```
workflow_transition
```

| from_state | action | to_state | role_required |
|-----------|--------|---------|---------------|
| Draft | submit | Submitted | AGENT |
| Submitted | review | Underwriting Review | UNDERWRITER |
| Underwriting Review | approve | Approved | UNDERWRITER |
| Underwriting Review | reject | Rejected | UNDERWRITER |
| Approved | issue | Issued | OPERATIONS |

---

# Policy Table

```
policy
```

| field | description |
|------|------|
| policy_id | primary key |
| policy_no | policy number |
| client_id | client |
| premium | premium |
| status | workflow state |

Example:

```
status = Submitted
```

---

# Backend API Design

## 1 Get Policy

```
GET /policy/{id}
```

Response:

```
{
  "policyId": 1001,
  "status": "Submitted"
}
```

---

## 2 Get Available Actions

```
GET /workflow/actions
```

Request:

```
{
  "businessType": "POLICY",
  "businessId": 1001,
  "state": "Submitted"
}
```

Backend logic:

```
1 read current state
2 check workflow_transition table
3 check user role
4 return allowed actions
```

Response:

```
{
  "actions": [
    "review"
  ]
}
```

---

# Frontend Button Rendering

Example:

User role = UNDERWRITER  
Policy state = Submitted

Frontend receives:

```
actions = ["review"]
```

UI renders:

```
[Review]
```

---

Example:

User role = UNDERWRITER  
Policy state = Underwriting Review

Actions returned:

```
["approve","reject"]
```

UI:

```
[Approve] [Reject]
```

---

Example:

User role = OPERATIONS  
Policy state = Approved

Actions returned:

```
["issue"]
```

UI:

```
[Issue Policy]
```

---

# Action Execution

When user clicks a button:

Example:

```
POST /workflow/action
```

Request:

```
{
  "businessType": "POLICY",
  "businessId": 1001,
  "action": "approve"
}
```

Backend process:

```
1 validate current state
2 validate role permission
3 find transition
4 update state
5 create workflow log
```

State change:

```
Underwriting Review → Approved
```

---

# Workflow History Table

Example:

```
workflow_history
```

| field | description |
|------|------|
| id | log id |
| business_type | POLICY |
| business_id | policy id |
| action | approve |
| from_state | Underwriting Review |
| to_state | Approved |
| user_id | approver |
| action_time | timestamp |

---

# Final UI Effect

Example policy page:

```
Policy Status: Underwriting Review

Actions:

[Approve] [Reject]
```

Another user:

```
Policy Status: Approved

Actions:

[Issue Policy]
```

Buttons automatically change based on:

- workflow state
- user role

---

# Advantages

- no hardcoded button logic
- flexible workflow configuration
- role-based action control
- full approval history
- easy to extend

---

# Summary

Workflow-driven UI works by:

1. storing workflow states
2. configuring transitions
3. checking user roles
4. returning allowed actions
5. rendering buttons dynamically

This allows enterprise systems like PAS to support **flexible approval processes without hardcoding UI logic**.