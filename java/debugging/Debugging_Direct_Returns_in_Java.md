# Debugging Direct Returns in Java (Expression-Based Debugging)

## Core Idea

Modern Java code often prefers **direct returns**:

```java
return service.compute(x, y);
```

instead of assigning to a local variable first.

This improves **clarity, conciseness, and intent**, but it changes **how you debug**.

---

## Key Rule (Important)

> **If there is no variable, you debug the *expression*.**

A direct `return` creates **no observable local state**.  
Once the method returns, the stack frame is gone — the debugger cannot show the value.

This is expected behavior, not a tooling bug.

---

## Why Direct Returns Are Preferred

- Less boilerplate
- Clear intent: “this method returns the result of X”
- Fewer meaningless locals
- Encourages expression-oriented code
- Common in framework / library / infra code

Debuggability is *not* the primary goal of production code — clarity is.

---

## The Correct Debugging Techniques

### 1. Evaluate Expression (Primary Tool)

When stopped on:

```java
return messageSource.getMessage(key, args, locale);
```

**Do NOT step yet.**

Use:
- **Evaluate Expression** (`Alt + F8`)

Evaluate:

```java
messageSource.getMessage(key, args, locale)
```

This shows the exact return value.

---

### 2. Step Into (Debug “Why”, Not Just “What”)

Use **Step Into** (`F7`) when you want to understand:
- How logic is executed
- How frameworks resolve values
- Why a result is unexpected

Example: Spring i18n lookup, fallback order, locale matching.

---

### 3. Temporary Assignment Is Acceptable (During Debugging)

For deeper inspection, it is **okay to temporarily refactor**:

```java
String message = messageSource.getMessage(key, args, locale);
return message;
```

Debug → understand → revert.

This is normal engineering practice.

---

## What Does NOT Work

- Stepping over and expecting to see the return value
- Watching variables that do not exist
- Inspecting after the stack frame has returned

---

## When You SHOULD Assign to a Variable

Assignment is justified when the value has **semantic meaning**:

```java
Locale locale = LocaleContextHolder.getLocale();
String message = messageSource.getMessage(key, args, locale);
```

Use locals when they:
- Explain intent
- Are reused
- Are validated or logged

Avoid locals that exist *only* for debugging.

---

## Expression Debugging Is a Skill

Expression-based debugging is required for:
- Direct returns
- Streams
- Lambdas
- Fluent APIs

Example:

```java
return users.stream()
    .filter(User::active)
    .map(this::toDto)
    .toList();
```

You debug **expressions**, not intermediate variables.

---

## Final Takeaway

> Clean code optimizes for human readers.  
> Debugging optimizes for tools.  
> When using direct returns, **debug expressions — not variables**.

This is the intended and professional debugging model in modern Java.
