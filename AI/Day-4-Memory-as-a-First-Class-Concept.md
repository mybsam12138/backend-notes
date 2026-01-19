# Day 4 — Memory as a First-Class Concept in an AI Agent

> **Series:** Building an AI Agent from First Principles (Java)  
> **Day:** 4  
> **Theme:** Memory (agent-owned, selective, explicit)  
> **Key idea:** Memory is not a log. Memory is a decision.

---

## What Changed from Day 3

By the end of Day 3, our agent already had:

- A deterministic **agent loop**
- An **LLM as policy**, not executor
- **Tool abstraction** and a **tool registry**
- Clear ownership of execution and state transitions

However, the agent was still **stateless across steps**.

Every decision was made only from the *current observation*.

Day 4 introduces the missing piece:

> **Memory — the ability for an agent to remember what matters.**

---

## What Memory Is (and Is Not)

### Memory is NOT:
- A full log of everything that happened
- A database
- A vector store
- RAG or document retrieval

### Memory IS:
- Agent-owned state
- Selective and intentional
- Explicitly written
- Explicitly read

> **Memory stores what mattered, not everything that happened.**

---

## Observation vs Memory

This distinction is critical.

### Observation
- Transient
- Changes every loop
- Feeds immediate decisions
- Often noisy

### Memory
- Durable (for the agent lifetime)
- Sparse and curated
- Chosen intentionally
- Used for future reasoning

If you store every observation as memory, the agent becomes worse, not better.

---

## Memory as an Abstraction

We introduce a minimal abstraction:

```java
public interface Memory {
    void remember(String entry);
    List<String> entries();
}
```

Design choices:
- **Verb** for mutation (`remember`)
- **Noun** for state view (`entries`)
- No persistence assumptions
- No ordering guarantees beyond insertion order

---

## In-Memory Implementation

```java
public class InMemoryMemory implements Memory {

    private final List<String> entries = new ArrayList<>();

    @Override
    public void remember(String entry) {
        entries.add(entry);
    }

    @Override
    public List<String> entries() {
        return List.copyOf(entries);
    }
}
```

This is sufficient to prove the concept.

Persistence can be added later without changing the agent loop.

---

## Memory Lives in AgentState

Memory is **owned by the agent**, not by tools or the loop.

```java
public class AgentState {

    private final String goal;
    private final Memory memory = new InMemoryMemory();

    private String observation;
    private boolean finished;

    public void remember(String entry) {
        memory.remember(entry);
    }

    public List<String> memoryEntries() {
        return memory.entries();
    }
}
```

This makes memory:
- Part of the agent's identity
- Accessible to both tools and the LLM
- Easy to reason about

---

## Writing Memory Is a Tool Decision

Memory is **not written automatically**.

Instead, the LLM chooses when to remember:

```java
ToolCall("remember", Map.of("text", "..."));
```

This mirrors human behavior:
- We do not remember everything
- We remember conclusions, decisions, and important facts

Making memory explicit avoids accidental noise accumulation.

---

## Recall: Reading Memory Intentionally

To use memory, the agent must **recall** it.

Recall means:
> Reading stored memory and injecting it into the current reasoning context.

In practice, recall:
- Reads memory entries
- Projects them into `observation`
- Allows the next decision to reason over the past

Recall is modeled as a tool to keep control explicit.

---

## Why Memory Is Not Automatically Injected

If memory were always visible:
- Every decision would look the same
- There would be no notion of relevance
- Cost and complexity would grow unbounded

By making recall explicit:
- The agent controls when history matters
- Later, relevance and summarization can be added
- RAG becomes a natural extension

---

## A Minimal Day-4 Policy

A simple decision policy might be:

1. Print a message
2. Remember the result
3. Recall memory once
4. Finish

This demonstrates:
- Tool composition
- Selective memory
- Memory influencing later decisions

The exact policy is less important than the structure.

---

## What Day 4 Teaches

Day 4 introduces several important principles:

- Memory is **selective**, not exhaustive
- Observation and memory must remain separate
- Memory belongs to the agent, not the framework
- Writing memory is a decision, not a side effect

These principles prevent many common agent design mistakes.

---

## How Day 4 Enables the Future

With memory in place:

| Next Step | Built on Day 4 |
|----------|----------------|
| Day 5 | RAG as a read-only memory tool |
| Day 6 | Error and retry memory |
| Day 7 | Metrics and trace memory |
| Real systems | Memory pruning, summarization |

Day 4 is the foundation for all long-term reasoning.

---

## Summary

- Day 3 made actions safe and explicit
- Day 4 makes agents **stateful and intentional**
- Memory is not a log
- Memory is a decision
- The agent loop remains unchanged

> **An agent that remembers everything is noisy.  
An agent that remembers selectively is intelligent.**
