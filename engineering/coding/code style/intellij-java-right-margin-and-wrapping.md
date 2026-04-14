# IntelliJ Java Code Style – Right Margin & Wrapping Strategy

## Recommended Default

This setup balances **readability**, **compact diffs**, and **formatter stability**.  
It is suitable for most Java backend teams.

---

## 1. Right Margin

**Value:** `120` columns

- `100` → often too tight, causes unnecessary wrapping  
- `140` → acceptable but easier to abuse  
- `120` → best balance, widely used in real projects

Right margin is a **soft readability boundary**, not a hard rule.

---

## 2. Core Wrapping Philosophy

> **Wrap only if long, and never exceed the right margin**

This means:
- Short code stays on one line
- Long code wraps automatically
- Formatter works *with* the developer, not against them

Avoid:
- Always wrap (too verbose, noisy diffs)
- Never wrap (horizontal scrolling, unreadable lines)

---

## 3. IntelliJ Settings Mapping

Path:
```
Settings → Editor → Code Style → Java → Wrapping and Braces
```

### Common Rules (Recommended)

For **most constructs** (method calls, parameters, enums):

- **Wrap if long**
- ✅ Do not exceed right margin
- ❌ Keep existing line breaks
- ❌ Align when multiline (optional, but usually off)

---

## 4. Enum-Specific Notes

Enum constants use **separate formatting rules** in IntelliJ.

Ensure:

- Enum constants → Wrap if long
- Enum constant arguments → Wrap if long
- Do not exceed right margin → ✅
- Keep existing line breaks → ❌

Example:

```java
SYSTEM_ERROR(500, "error.system", "System error"),
```

Automatically wraps only when necessary:

```java
SYSTEM_ERROR(
    500,
    "error.system.with.very.long.namespace",
    "System error with extended description"
),
```

---

## 5. Important IntelliJ Behavior

- **Do not wrap** = do not introduce *new* line breaks  
- It does **not** automatically collapse existing multiline code
- To collapse once:
```
Join Lines → Ctrl / Cmd + Shift + J
```

After that, normal reformatting will keep one-line style.

---

## 6. Final Recommendation (TL;DR)

- Right margin: **120**
- Wrapping: **Wrap if long**
- Enforce margin: **Yes**
- Preserve old line breaks: **No**

This is a **safe, senior-level default** suitable for team-wide standards.
