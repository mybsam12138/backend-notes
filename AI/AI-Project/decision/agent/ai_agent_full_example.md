# AI Agent Example — End-to-End (LLM + Tool Calling + Java Backend)

## 🎯 Goal

Demonstrate a complete, usable AI Agent flow:

- LLM always returns JSON when calling tools
- Backend executes tools (Java example)
- Context is enriched step-by-step
- Loop continues until final answer

---

## 🧠 Core Idea

Agent loop:

1. Send prompt to LLM
2. LLM decides:
   - call tool (JSON)
   - or return final answer
3. Backend executes tool
4. Append result to context
5. Repeat

---

## 📦 Tool Definitions

```text
calculatePremium(userId)
getRiskLevel(premium)
```

---

## 🧾 System Prompt (VERY IMPORTANT)

Force LLM to return JSON for tool calls:

```text
You are an AI assistant.

You MUST follow these rules:

1. If you need to call a tool, return ONLY JSON:
{
  "tool": "<tool_name>",
  "args": { ... }
}

2. If you want to give final answer, return:
{
  "final": "your answer"
}

Available tools:
- calculatePremium(userId)
- getRiskLevel(premium)

Do NOT return anything outside JSON.
```

---

## 🧩 User Request

```text
What is the premium for user 123 and is it high risk?
```

---

# 🔁 Iteration 1

## Prompt to LLM

```text
[System]
...

[User]
What is the premium for user 123 and is it high risk?
```

## LLM Response

```json
{
  "tool": "calculatePremium",
  "args": { "userId": 123 }
}
```

---

## Java Backend Execution

```java
public class PremiumService {

    public Map<String, Object> calculatePremium(int userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("baseRate", 100);
        result.put("riskFactor", 1.5);
        result.put("finalPremium", 150);
        return result;
    }
}
```

---

## Tool Result (sent back to LLM)

```json
{
  "baseRate": 100,
  "riskFactor": 1.5,
  "finalPremium": 150
}
```

---

# 🔁 Iteration 2

## Prompt to LLM

```text
[System]
...

[User]
What is the premium for user 123 and is it high risk?

[Assistant]
{"tool":"calculatePremium","args":{"userId":123}}

[Tool Result]
{
  "baseRate": 100,
  "riskFactor": 1.5,
  "finalPremium": 150
}
```

---

## LLM Response

```json
{
  "tool": "getRiskLevel",
  "args": { "premium": 150 }
}
```

---

## Java Backend Execution

```java
public class RiskService {

    public Map<String, Object> getRiskLevel(int premium) {
        Map<String, Object> result = new HashMap<>();
        if (premium > 120) {
            result.put("riskLevel", "HIGH");
        } else {
            result.put("riskLevel", "LOW");
        }
        return result;
    }
}
```

---

## Tool Result

```json
{
  "riskLevel": "HIGH"
}
```

---

# 🔁 Iteration 3 (Final)

## Prompt to LLM

```text
[System]
...

[User]
What is the premium for user 123 and is it high risk?

[Assistant]
{"tool":"calculatePremium","args":{"userId":123}}

[Tool Result]
{
  "baseRate": 100,
  "riskFactor": 1.5,
  "finalPremium": 150
}

[Assistant]
{"tool":"getRiskLevel","args":{"premium":150}}

[Tool Result]
{
  "riskLevel": "HIGH"
}
```

---

## LLM Final Response

```json
{
  "final": "The premium for user 123 is 150. The user is classified as HIGH risk."
}
```

---

# 🔁 Java Agent Loop (Simplified)

```java
while (true) {
    String response = callLLM(context);

    if (response.contains("tool")) {
        ToolCall toolCall = parse(response);
        Object result = executeTool(toolCall);
        context.add(result);
    } else if (response.contains("final")) {
        return response;
    }
}
```

---

# 🧠 Key Design Points

## 1. Force JSON output
- Use strong system prompt
- Reject invalid responses if needed

## 2. Context grows each iteration
- Include all previous steps
- Or summarize if too long

## 3. Backend controls execution
- LLM NEVER executes code directly

## 4. Tool result must be JSON
- Clean
- Structured 
- Minimal

---

# 🎯 One-Sentence Summary

An AI agent works by repeatedly asking the LLM what to do next, executing tools in the backend, and feeding results back until a final answer is produced.
