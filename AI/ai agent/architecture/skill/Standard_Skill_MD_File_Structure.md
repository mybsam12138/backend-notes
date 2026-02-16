# Standard Structure of a Skill Markdown File

## Overview

A Skill Markdown file defines a reusable reasoning and execution module
for an AI agent.\
It is not model training. It is structured runtime intelligence that can
be retrieved and injected into context.

A well-designed Skill file answers four core questions:

1.  When should this skill be used?
2.  What inputs are required?
3.  What structured steps should be followed?
4.  What common mistakes should be avoided?

------------------------------------------------------------------------

## Recommended Skill File Template

``` md
# Skill: <Skill Name>

## 1. Purpose
Brief description of what this skill does.

## 2. When to Use
Describe triggering conditions.
- Scenario A
- Scenario B
- Scenario C

## 3. Inputs Required
List required data or context.
- Input 1
- Input 2
- Input 3

## 4. Step-by-Step Process
Provide structured reasoning or execution steps.

1. Step one
2. Step two
3. Step three
4. Step four

## 5. Decision Logic (Optional)
If the skill involves branching logic, describe it clearly.

IF condition A:
    → Do X

ELSE IF condition B:
    → Do Y

ELSE:
    → Do Z

## 6. Output Format
Define the expected result format.
- Structured explanation
- JSON output
- Code snippet
- Diagnostic summary

## 7. Common Failure Modes
Describe typical mistakes or pitfalls.
- Misconfiguration
- Missing inputs
- Incorrect assumptions

## 8. Best Practices
List practical recommendations.
- Follow principle X
- Validate input before execution
- Log key steps

## 9. Example
Provide a realistic usage example.
```

------------------------------------------------------------------------

## Explanation of Each Section

### 1. Purpose

Clarifies the scope and boundary of the skill.\
Prevents misuse or overextension.

### 2. When to Use

Defines trigger conditions.\
Helps retrieval systems determine when to load this skill.

### 3. Inputs Required

Ensures all necessary context is available before execution.

### 4. Step-by-Step Process

The core reasoning or execution playbook.\
Must be structured, deterministic, and clear.

### 5. Decision Logic

Useful for conditional reasoning skills.\
Encodes strategy patterns explicitly.

### 6. Output Format

Standardizes responses for integration with tools or pipelines.

### 7. Common Failure Modes

Improves robustness by anticipating errors.

### 8. Best Practices

Encodes engineering discipline and quality control.

### 9. Example

Grounds the skill in practical reality and improves clarity.

------------------------------------------------------------------------

## Design Principles for Skill Files

A high-quality Skill file should be:

-   Structured
-   Deterministic
-   Triggerable
-   Context-efficient
-   Version-controlled
-   Domain-specific

------------------------------------------------------------------------

## Conceptual Summary

A Skill file is:

-   A reasoning playbook
-   A structured capability module
-   A reusable intelligence block
-   A context-injectable engineering asset

It defines how an AI agent should think and act in a specific domain
scenario.

In short:

Skills define structured thinking. Tools define actions. Memory defines
history. Protocols like MCP define orchestration.
