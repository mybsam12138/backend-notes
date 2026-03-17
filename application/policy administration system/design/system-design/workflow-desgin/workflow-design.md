# Workflow Engine Design for Enterprise Systems (PAS)

## Problem

Insurance business processes involve multiple roles and approval steps.

Typical roles:

- Agents
- Underwriters
- Operations staff
- Finance staff

Example process:

Quotation  
→ Underwriting approval  
→ Policy issuance  
→ Finance confirmation

Technical difficulties:

- Implementing approval workflows
- Supporting role-based permissions
- Managing process states
- Handling multi-step approvals
- Allowing workflow configuration without code changes

A **workflow engine** solves these problems.

---

# Goal

Build a **configurable workflow system** that can:

- manage approval processes
- track workflow state
- assign tasks to roles or users
- support multi-step approvals
- allow configuration instead of code changes

---

# Core Concept

A workflow represents a **state machine**.

Example:

Draft  
→ Submitted  
→ Underwriting Review  
→ Approved  
→ Issued

Each step is called a **state**.

Transitions define how the workflow moves between states.

---

# Architecture

User Action  
↓  
Service Layer  
↓  
Workflow Engine  
↓  
State Transition  
↓  
Create Approval Task  
↓  
Assigned User / Role

---

# Core Workflow Components

## 1 Workflow Definition

Defines the workflow structure.

Example:

```
Quotation Workflow

Draft
↓
Submitted
↓
Underwriting Review
↓
Approved
↓
Issued
```

---

## 2 State

Represents the current status of the process.

Example states:

```
Draft
Submitted
Reviewing
Approved
Rejected
Issued
```

Stored in business tables:

```
policy_status
quotation_status
```

---

## 3 Transition

Defines allowed state changes.

Example:

```
Draft → Submit
Submit → Underwriting Review
Review → Approved
Review → Rejected
```

---

## 4 Approval Task

When a state requires approval, a task is created.

Example table:

```
workflow_task
```

| field | description |
|------|------|
| task_id | task id |
| business_type | policy / quotation |
| business_id | policy_id |
| state | workflow state |
| assigned_role | approver role |
| assigned_user | specific user |
| status | pending / completed |
| created_time | creation time |

---

## 5 Role Assignment

Tasks can be assigned by:

- role
- user
- department

Example:

```
Underwriting Review
→ role = UNDERWRITER
```

The system finds users with this role.

---

# Workflow Definition Table Design

Example table:

```
workflow_definition
```

| field | description |
|------|------|
| id | workflow id |
| workflow_code | workflow name |
| business_type | policy / quotation |
| version | workflow version |

---

# Workflow State Table

```
workflow_state
```

| field | description |
|------|------|
| state_code | state identifier |
| state_name | display name |
| is_terminal | final state |

---

# Workflow Transition Table

```
workflow_transition
```

| field | description |
|------|------|
| from_state | start state |
| to_state | next state |
| action | submit / approve / reject |
| role_required | required role |

---

# Workflow Instance Table

Tracks runtime workflow instances.

```
workflow_instance
```

| field | description |
|------|------|
| instance_id | instance id |
| business_type | policy / quotation |
| business_id | record id |
| current_state | current workflow state |
| created_time | start time |

---

# Example Workflow

Quotation approval process:

```
Draft
↓ submit
Submitted
↓ approve
Underwriting Review
↓ approve
Approved
↓ issue
Policy Issued
```

---

# Example Approval Flow

Agent submits quotation

↓

Workflow state changes:

```
Draft → Submitted
```

↓

Create underwriting task:

```
Task
role = UNDERWRITER
status = pending
```

↓

Underwriter approves

↓

State transition:

```
Submitted → Approved
```

---

# Integration with Business Tables

Business table example:

```
quotation
```

| field | description |
|------|------|
| quotation_id | id |
| client_id | client |
| premium | premium |
| status | workflow state |

Workflow engine updates the **status field**.

---

# Advantages

- Flexible approval workflows
- Role-based task assignment
- Easy to extend
- Supports complex business processes
- Reduces hard-coded workflow logic

---

# Advanced Features

Optional improvements:

- parallel approvals
- approval escalation
- SLA time limits
- workflow visualization
- audit trail integration

---

# Summary

A workflow engine manages **business processes as configurable state machines**.

Key components:

- workflow definition
- states
- transitions
- approval tasks
- workflow instances

This allows enterprise systems such as PAS to support **complex approval workflows without hard-coded logic**.