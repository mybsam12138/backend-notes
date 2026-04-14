# IntelliJ IDEA Code Style (Java) — How to Understand and Use It

This document explains **what Code Style in IntelliJ IDEA really does**, how it is **meant to be used**,  
and whether you should **keep the default style or adopt an existing famous one**.

This is a *conceptual guide*, not a settings manual.

---

## 1. What “Code Style” in IntelliJ IDEA Really Is

IntelliJ Code Style is **not just formatting**. It combines three different concerns:

### 1.1 Structural Formatting (Hard Rules)
These rules decide **where line breaks and indentation are allowed**.

Examples:
- How method arguments wrap
- How enum constants are formatted
- How binary expressions (`+`, `&&`) wrap
- Brace placement

These rules are applied automatically by **Reformat Code**.

---

### 1.2 Readability Constraints (Soft Rules)
These rules define **when formatting should change**.

Examples:
- Right margin (100 / 120 / 140)
- “Do not exceed right margin”
- “Wrap if long”

They act as *triggers*, not strict laws.

---

### 1.3 Preservation Rules (Human Intent)
These rules tell IntelliJ **what it must not destroy**.

Examples:
- Keep existing line breaks
- Keep simple blocks in one line
- Preserve comments

These exist to respect **manual, intentional formatting**.

---

## 2. How IntelliJ Formatter Actually Thinks

The formatter follows this simplified logic:

1. Try to keep code on one line
2. If it exceeds the right margin → try wrapping *inside* expressions
3. If still too long → wrap the surrounding structure
4. If “keep existing line breaks” is enabled → do nothing

Important:
> IntelliJ does **not understand meaning**, only syntax.

It cannot know which argument is “more important” or “heavier”.

---

## 3. How Code Style Is Meant to Be Used

### Correct mindset

- Formatter handles **mechanical consistency**
- Humans handle **semantic emphasis**
- Manual line breaks are **signals**, not mistakes

Good teams do **not** expect the formatter to express intent.

---

## 4. Should You Use the Default IntelliJ Style?

### Short answer: **Yes, usually.**

Reasons:
- IntelliJ defaults are conservative and stable
- Optimized for minimal diff noise
- Well-tested across many Java projects

Most Java teams:
- Start with IntelliJ default
- Make **small, targeted adjustments**
- Do not replace everything

---

## 5. Should You Adopt an Existing “Famous” Style?

### 5.1 Google Java Style

**Popularity:** ⭐⭐⭐⭐⭐

Pros:
- Widely known
- Strict and consistent
- Works well with Checkstyle

Cons:
- Right margin = 100 (tight)
- Very vertical, verbose
- Often feels restrictive in backend code

Used by:
- Google
- Some large enterprises

---

### 5.2 Oracle / Sun Java Style

**Popularity:** ⭐⭐⭐⭐

Pros:
- Traditional Java style
- Balanced, readable

Cons:
- Not strictly defined
- Rarely enforced by tooling

Mostly historical today.

---

### 5.3 Spring / Apache Style

**Popularity:** ⭐⭐⭐⭐⭐

Pros:
- Pragmatic
- Similar to IntelliJ default
- Friendly to backend frameworks

Cons:
- Not formally documented as a strict style

This is what **most Spring Boot teams implicitly follow**.

---

## 6. What Most Real Java Teams Actually Do

Reality:

- IntelliJ default style
- Right margin adjusted to **120**
- “Wrap if long” everywhere
- Minimal alignment
- Manual formatting for complex expressions

This matches:
- Spring
- Apache projects
- Most backend teams

---

## 7. Recommended Strategy (Practical)

If you are an individual or small team:

1. Start with **IntelliJ default**
2. Change only:
   - Right margin → 120
   - Disable “keep existing line breaks”
3. Document a few **human rules**

Avoid:
- Over-customizing formatter
- Trying to encode meaning into rules

---

## 8. Final Advice

> Code style exists to reduce friction, not to express creativity.

A good formatter:
- Is boring
- Is predictable
- Never surprises reviewers

IntelliJ default (slightly tuned) already achieves this.

---

## 9. One-Sentence Conclusion

**Use IntelliJ default Java style, tune lightly, and rely on humans for intent.**
