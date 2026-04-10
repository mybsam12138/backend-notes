# Prompt Engineering – Summary

## What is Prompt Engineering?

**Prompt engineering is the practice of designing and refining inputs (prompts) to guide a language model to produce the desired output.**

> It is essentially **programming with natural language instead of code**.

---

## Core Idea

- You **do not change the model**
- You **control behavior through input design**
- The better the prompt → the better the output

---

## Basic Structure of a Good Prompt

A well-designed prompt usually includes:

### 1. Role (Who the model is)
```
You are a professional translator.
```

### 2. Task (What to do)
```
Translate English to Chinese.
```

### 3. Rules (Constraints)
```
- Be concise
- Use formal tone
```

### 4. Examples (Few-shot ⭐)
```
Hello → 你好  
Good night → 晚安
```

### 5. Input (User content)
```
Translate: Good afternoon
```

---

## Common Techniques to Optimize Prompts

### 1. Be Clear and Specific

❌ Bad:
```
Explain this
```

✅ Good:
```
Explain this concept in simple terms for beginners, in under 100 words.
```

---

### 2. Use Structured Format

Use sections instead of messy text:

```
TASK:
...

RULES:
...

INPUT:
...
```

---

### 3. Use Few-shot Examples ⭐

Provide examples to guide behavior:

```
Input: 2+2 → Output: 4  
Input: 3+5 → Output: 8  
Input: 6+7 → Output:
```

---

### 4. Define Output Format

Tell the model exactly how to respond:

```
Return the result in JSON format:
{
  "answer": "",
  "reason": ""
}
```

---

### 5. Add Constraints

Limit ambiguity:

```
- Do not explain
- Only return the final answer
- Use one sentence
```

---

## One-Line Takeaway

**Prompt engineering is the skill of controlling AI behavior through well-designed input.**
