# AI Skill: Definition and Usage

## What is a Skill?

A **Skill** is a reusable, high-level capability that defines **how to
accomplish a specific task** using an AI agent.

> Skill = structured workflow + strategy + tool orchestration

It represents **business-level logic**, not just a single action.

------------------------------------------------------------------------

## Skill vs Tool
```
  Aspect           Skill                     Tool
  ---------------- ------------------------- -------------------------
  Level            High-level                Low-level
  Purpose          Solve a complete task     Execute a single action
  Nature           Workflow / strategy       Function / API
  Example          summarize_document        read_pdf
  Composition      Uses multiple tools       Standalone
  Responsibility   Decision + flow control   Execution only
```
------------------------------------------------------------------------

## Example

### Skill

summarize_document: - read document - split into chunks - summarize
chunks - combine result

### Tools used

-   read_pdf
-   split_text
-   summarize_chunk

------------------------------------------------------------------------

## How Skill is Used in Agent Loop

### Step 1: User Input

User provides a goal: "Summarize this PDF"

------------------------------------------------------------------------

### Step 2: Skill Selection

System selects a skill: summarize_document

------------------------------------------------------------------------

### Step 3: Inject Skill into Prompt

Agent prompt includes: - goal - selected skill (strategy) - available
tools

------------------------------------------------------------------------

### Step 4: Agent Loop Execution

Loop: 1. LLM decides next action 2. Call tool 3. Get result
(observation) 4. Update context 5. Repeat

------------------------------------------------------------------------

### Step 5: Complete Task

Skill defines: - when task is done - what output should look like

------------------------------------------------------------------------

## Key Insight

> Tool = "do something"\
> Skill = "how to solve the task"

------------------------------------------------------------------------

## Best Practice

-   Design skills as **complete business capabilities**
-   Each skill can use **multiple tools**
-   Usually **one skill per task**
-   Avoid over-splitting skills into tool-level granularity

------------------------------------------------------------------------

## One Sentence Summary

> A skill is a structured, reusable strategy that allows an AI agent to
> complete a task by orchestrating multiple tools within an iterative
> loop.
