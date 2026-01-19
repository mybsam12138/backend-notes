# Day 3 — Tool Abstraction & Tool Registry (Type-Safe Agent Actions)

> **Series:** Building an AI Agent from First Principles (Java)  
> **Day:** 3  
> **Theme:** Tool abstraction & function calling  
> **Key focus:** Type safety, bounded execution, production-grade agent design

---

## What We Have After Day 2

By the end of Day 2, we already built a *real* agent:

- A deterministic **agent loop**
- An **LLM as a policy** (decision maker)
- A mutable **AgentState**
- A clear **termination condition**

Conceptually, the flow looked like this:

```
AgentLoop → LLM → Action → execute → update state → loop
```

This proves an important point:

> **An agent is a control loop, not a framework feature.**

However, the Day-2 design still has a major limitation.

---

## The Limitation of Day 2

In Day 2, actions were usually modeled as an `enum`:

```java
enum Action {
    PRINT,
    FINISH
}
```

This approach has problems:

1. Actions cannot carry parameters
2. Execution logic is hidden in `switch` statements
3. The LLM is not constrained in a structured way
4. The system is hard to extend safely

Real agents need **structured, validated, executable actions**.

That is exactly what Day 3 introduces.

---

## Day 3 Goal

**Day 3 answers one question:**

> How can an LLM request *real operations* in a safe, explicit, and type-safe way?

The answer is:

- Tool abstraction
- Tool registry (allowlist)
- Structured tool calls

---

## Core Idea: Action → ToolCall

Instead of returning an enum, the LLM now returns a **ToolCall**:

```java
ToolCall(
    name = "print",
    arguments = { "message": "Hello" }
)
```

This separates responsibilities cleanly:

- **LLM** decides *what tool to use*
- **AgentLoop** validates and executes
- **Tool** performs side effects
- **AgentState** is updated explicitly

---

## ToolCall Model

```java
public record ToolCall(
        String name,
        Map<String, Object> arguments
) {}
```

This structure is:

- Serializable
- Validatable
- Vendor-agnostic
- Compatible with function-calling APIs

---

## Tool Abstraction

Each tool implements a common interface:

```java
public interface Tool {

    String name();

    String execute(Map<String, Object> arguments, AgentState state);
}
```

Key properties:

- Tools are **explicit**
- Tools are **replaceable**
- Tools own **side effects**
- Tools update `AgentState`

The LLM never executes code directly.

---

## Tool Registry (Allowlist)

The registry defines **which tools are allowed**:

```java
@Component
public class ToolRegistry {

    private final Map<String, Tool> tools;

    public ToolRegistry(List<Tool> toolList) {
        this.tools = toolList.stream()
                .collect(Collectors.toMap(Tool::name, Function.identity()));
    }

    public Tool getRequired(String name) {
        Tool tool = tools.get(name);
        if (tool == null) {
            throw new IllegalArgumentException("Unknown tool: " + name);
        }
        return tool;
    }
}
```

This registry is a **security boundary**:

- The LLM cannot call arbitrary code
- Only registered tools are executable
- Tool surface is auditable and testable

---

## Example Tools

### Print Tool

```java
@Component
public class PrintTool implements Tool {

    @Override
    public String name() {
        return "print";
    }

    @Override
    public String execute(Map<String, Object> args, AgentState state) {
        String message = String.valueOf(args.get("message"));
        System.out.println(message);
        state.setObservation("printed: " + message);
        return state.getObservation();
    }
}
```

### Finish Tool

```java
@Component
public class FinishTool implements Tool {

    @Override
    public String name() {
        return "finish";
    }

    @Override
    public String execute(Map<String, Object> args, AgentState state) {
        state.finish();
        state.setObservation("finished");
        return "finished";
    }
}
```

---

## Updating the Agent Loop

The agent loop does **not change structurally**.

Only the execution logic evolves:

```java
ToolCall call = llmClient.decide(state);
Tool tool = toolRegistry.getRequired(call.name());
tool.execute(call.arguments(), state);
```

The loop still:

- Controls execution
- Owns state transitions
- Defines termination

---

## Updated Control Flow

```
AgentLoop
  → LLM decides ToolCall
  → ToolRegistry validates
  → Tool executes
  → AgentState updated
  → Loop continues or stops
```

This is a **production-grade agent execution model**.

---

## What Day 3 Teaches

Day 3 is not about prompts or vendors.

It teaches:

- LLMs should act as **planners**, not executors
- Execution must be **bounded and explicit**
- Type safety matters for AI systems
- Tools are the foundation for memory, RAG, and retries

---

## Why Tool Registry Is Critical

Without a tool registry:

- The LLM can request arbitrary behavior
- Execution becomes unsafe
- Debugging becomes impossible

With a tool registry:

- The execution surface is explicit
- The system is auditable
- Behavior is deterministic and testable

---

## How Day 3 Enables Later Days

| Day | Built on Tool Registry |
|----|------------------------|
| Day 4 | Memory as a tool |
| Day 5 | RAG as a read-only tool |
| Day 6 | Retry & error-handling tools |
| Day 7 | Metrics & tracing tools |
| Day 8 | Framework comparison |
| Day 9 | Refactoring & abstraction |
| Day 10 | When not to use agents |

Day 3 is the **keystone** of the entire series.

---

## Summary

- Day 2 proves *what an agent is*
- Day 3 makes it **safe and extensible**
- Tool abstraction separates thinking from acting
- Tool registry enforces boundaries
- The agent loop remains simple and explicit

> **An AI agent is a control loop where the LLM selects tools,  
but the system controls execution.**
