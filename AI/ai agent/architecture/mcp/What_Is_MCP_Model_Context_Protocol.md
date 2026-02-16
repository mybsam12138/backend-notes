# What Is MCP (Model Context Protocol)?

## 1. Definition

**MCP (Model Context Protocol)** is a standardized way for AI models to
interact with external tools, APIs, and systems.

It defines:

-   Tool name
-   Parameter schema
-   Input format
-   Output format
-   Calling mechanism

In simple terms:

> MCP is the interface contract that allows an AI model to safely and
> structurally call external capabilities.

------------------------------------------------------------------------

## 2. Why MCP Exists

Large Language Models (LLMs) generate text, but real-world applications
require:

-   Accessing databases
-   Calling APIs
-   Performing calculations
-   Executing code
-   Searching documents
-   Booking services

Without structure, tool calling would be ambiguous and unsafe.

MCP solves this by providing:

-   Clear schema definitions
-   Structured parameter validation
-   Deterministic tool interfaces
-   Predictable response formats

------------------------------------------------------------------------

## 3. MCP vs Workflow

It is important to distinguish:

-   **Workflow** = The orchestration logic (what steps happen and in
    what order)
-   **MCP** = The tool interface definition (how tools are exposed and
    called)

Example:

Workflow: 1. Analyze user intent\
2. Call flight search tool\
3. Compare results\
4. Return recommendation

MCP: - Defines the `searchFlight` tool - Specifies required parameters -
Specifies response structure

Workflow controls *process*.\
MCP defines *capability contract*.

------------------------------------------------------------------------

## 4. Backend Analogy

For backend engineers:

-   MCP ≈ OpenAPI specification
-   MCP ≈ FeignClient interface contract
-   Workflow ≈ Service layer orchestration

Just like OpenAPI defines how services communicate,\
MCP defines how models communicate with tools.

------------------------------------------------------------------------

## 5. Core Components of MCP

### 1. Tool Declaration

Each tool has:

-   Name
-   Description
-   Parameter schema (JSON Schema)
-   Return schema

Example:

``` json
{
  "name": "searchFlight",
  "description": "Search available flights",
  "parameters": {
    "type": "object",
    "properties": {
      "from": {"type": "string"},
      "to": {"type": "string"},
      "date": {"type": "string"}
    },
    "required": ["from", "to", "date"]
  }
}
```

------------------------------------------------------------------------

### 2. Structured Invocation

The model generates:

``` json
{
  "tool": "searchFlight",
  "arguments": {
    "from": "Shenzhen",
    "to": "Wuhan",
    "date": "2026-02-01"
  }
}
```

The system then executes the real API.

------------------------------------------------------------------------

### 3. Tool Response Handling

The external system returns structured data:

``` json
{
  "flights": [
    {"flightNo": "CZ1234", "price": 850},
    {"flightNo": "MU5678", "price": 920}
  ]
}
```

The model then continues reasoning using this result.

------------------------------------------------------------------------

## 6. Why MCP Is Important

MCP enables:

-   Reliable tool integration
-   Reduced hallucination
-   Clear boundary between model and system
-   Safe execution environment
-   Modular agent design

It is one of the foundational layers of modern AI agents.

------------------------------------------------------------------------

## 7. Architectural Position

    User
      ↓
    Workflow / Agent Orchestrator
      ↓
    LLM
      ↓
    MCP Tool Interface
      ↓
    External APIs / Databases / Services

MCP sits between the model and real-world systems.

------------------------------------------------------------------------

## 8. One-Sentence Summary

> MCP is the standardized protocol that allows AI models to call
> structured external tools safely and predictably.
