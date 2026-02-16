# Skills and MCP in AI Agents

## 1. What Are "Skills" in AI Agents?

In AI agent systems, **skills** are structured capability modules that
help the model handle specific types of problems.

A skill is not model training or fine-tuning.\
It is a **reusable knowledge and reasoning playbook** that can be
dynamically loaded into the model's context.

Think of a skill as:

> "When situation X appears, follow this structured method to solve it."

### Example: Kubernetes Debugging Skill

``` md
# Skill: Kubernetes Pod CrashLoopBackOff Debugging

## When to Use
- Pod keeps restarting
- Liveness probe failing
- OOMKilled errors

## Diagnostic Steps
1. kubectl describe pod <pod-name>
2. kubectl logs --previous <pod-name>
3. Check resource limits
4. Check readiness/liveness probes

## Common Causes
- Port misconfiguration
- Memory limit too low
- Dependency service not ready
```

This markdown file acts as a **skill module**.\
When an AI agent detects a related issue, it retrieves and injects this
skill into context.

------------------------------------------------------------------------

## 2. Why Skills Are Often Stored in Markdown (MD)

Markdown is commonly used because it is:

-   Structured (headings, lists, sections)
-   Human-readable
-   Easy to version-control (Git)
-   Easy to chunk and embed for retrieval (RAG systems)
-   Ideal for dynamic context injection

Skills are typically organized like:

    skills/
     ├── k8s-debugging.md
     ├── springboot-performance.md
     ├── insurance-premium-calculation.md
     ├── postmortem-writing.md

Each file represents a reusable capability.

------------------------------------------------------------------------

## 3. Important Clarification: Skills ≠ Model Training

Skills do NOT:

-   Modify model weights
-   Retrain the model
-   Change its neural parameters

Instead, skills work through:

1.  Retrieval (via embeddings / vector search)
2.  Context injection
3.  Structured prompting

The AI appears smarter because it reads structured domain knowledge at
runtime.

------------------------------------------------------------------------

## 4. What Is MCP (Model Context Protocol)?

**MCP (Model Context Protocol)** is a standardized way to provide:

-   Context
-   Tools
-   Memory
-   Capabilities (skills)

to a language model.

MCP defines how an AI agent exposes:

-   Tools (APIs, shell, database queries)
-   Skills (reasoning playbooks)
-   Memory (conversation history, logs)
-   External knowledge

It is essentially a **coordination layer** between the model and its
environment.

------------------------------------------------------------------------

## 5. Relationship Between Skills and MCP

  Component   Role
  ----------- -----------------------------------------------------------
  Skill       Structured reasoning capability
  Tool        Executable action (API, DB, CLI)
  Memory      Stored conversation or system history
  MCP         Standard protocol to organize and expose all of the above

MCP makes it possible for an AI agent to dynamically select:

-   Which skill to load
-   Which tool to call
-   What memory to reference

------------------------------------------------------------------------

## 6. Full Example: Insurance Premium Calculation Agent

### Skill File

``` md
# Skill: Premium Calculation Logic

## Inputs
- Age
- Coverage amount
- Risk level
- Policy type

## Steps
1. Determine base rate
2. Apply age factor
3. Apply risk multiplier
4. Apply discount rules
```

### Tool

-   Call backend API: `/calculate-premium`
-   Query actuarial database

### Memory

-   Previous calculation results
-   Client risk history

### MCP Layer

MCP organizes:

-   The premium calculation skill
-   The API tool
-   The client memory

The model then:

1.  Loads the premium skill
2.  Uses memory for client context
3.  Calls tool for real data
4.  Generates final explanation

------------------------------------------------------------------------

## 7. Conceptual Comparison

  Software Engineering   AI Agent
  ---------------------- -------------------
  Spring Boot Starter    Skill Module
  Strategy Pattern       Skill Selection
  Dependency Injection   Context Injection
  External API           Tool
  System Log             Memory
  Service Registry       MCP Coordination

------------------------------------------------------------------------

## 8. Summary

-   **Skills** are structured reasoning modules stored as reusable
    knowledge (often in markdown).
-   They improve AI performance through runtime context injection.
-   They do not retrain the model.
-   **MCP** is the protocol that organizes how skills, tools, and memory
    are exposed to the model.
-   Together, they form the foundation of modern AI agents.

In short:

> Skills define how the AI thinks.\
> Tools define how the AI acts.\
> Memory defines what the AI remembers.\
> MCP defines how everything connects.
