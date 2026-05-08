# What is an Opinionated Framework?

## One Line

> An opinionated framework **makes decisions for you** so you can focus on writing business logic.

---

## The Core Idea

A framework has two approaches:

| | Non-Opinionated | Opinionated |
|---|---|---|
| **Decisions** | You decide everything | Framework decides for you |
| **Flexibility** | Very high | Constrained to its defaults |
| **Setup time** | Long | Minimal |
| **Learning curve** | Steep | Gentle |
| **Example** | Spring Framework | Spring Boot |

---

## Real World Analogy

You walk into a restaurant:

- **Non-opinionated** → Full menu, you pick every ingredient, every cooking method, every combination
- **Opinionated** → Chef's set meal, already decided for you, just eat

Both give you food. One makes you decide, the other decides for you.

---

## What "Opinionated" Means in Practice

When you add JPA to Spring Boot:

```
You add one dependency
       ↓
Spring Boot assumes:
- You need an EntityManager        → auto-configured
- You need a TransactionManager    → auto-configured
- You need a DataSource            → auto-configured
- You need a connection pool       → HikariCP chosen for you
```

You made zero decisions. Spring Boot had its own opinion about what you need.

---

## The Trade-off

| | Benefit | Cost |
|---|---|---|
| **Opinionated** | Fast to start, less decision fatigue | Harder to customize outside its opinions |
| **Non-opinionated** | Full control over every decision | You must configure everything yourself |

---

## Summary

> **Opinionated = the framework has its own preferences and applies them automatically.**
> You follow its conventions, it handles the setup.
> Break from its conventions, you're on your own.
