# Spring, From First Principles

> This document explains Spring **step by step**, following the *natural way a developer starts thinking*, while quietly leading toward how Spring actually works internally.
>
> No prior assumptions. No buzzwords. Just reasoning.

---

## 1. Why Does a Backend Application Become Hard to Manage?

At the beginning, a Java application is simple:

- You create objects with `new`
- You call methods directly
- Everything is explicit

This works — until the system grows.

Problems start to appear:

- Objects depend on many other objects
- Construction logic spreads everywhere
- Changing one implementation forces changes in many places
- Testing becomes difficult because dependencies are hard‑wired

At this point, the core problem is **not syntax**.

The real problem is:

> *Who is responsible for creating objects, and how are they connected?*

---

## 2. Separating "Using an Object" from "Creating an Object"

A key realization:

- Business code should **use** objects
- Infrastructure code should **create and connect** objects

When these two concerns are mixed, systems become rigid.

Spring is built on one foundational idea:

> *Object creation should be centralized and controlled.*

This idea leads directly to **Inversion of Control (IoC)**.

---

## 3. Inversion of Control: What Is Actually Inverted?

Traditionally:

- Your code decides *when* and *how* objects are created

With IoC:

- The framework decides
- Your code only declares *what it needs*

So the inversion is not about control flow — it is about **ownership**.

> Ownership of object creation moves from application code to the container.

Spring is that container.

---

## 4. Dependency Injection Is a Result, Not the Goal

Once Spring owns object creation, a question naturally follows:

> How does an object get the dependencies it needs?

The answer is **Dependency Injection**.

Spring injects dependencies:

- Through constructors (preferred)
- Through setters
- Or, less ideally, through fields

Important insight:

> Dependency Injection exists *because* IoC exists.

DI is a mechanism. IoC is the design principle.

---

## 5. What Is a Bean, Really?

In Spring, not every object is special.

A **Bean** is simply:

> An object whose **entire lifecycle** is managed by Spring.

This includes:

- Creation
- Dependency wiring
- Initialization
- Destruction

Spring does not just create beans — it **remembers how they were created**.

That memory is stored as metadata.

---

## 6. Bean Definitions: Spring Thinks in Metadata

Before Spring creates any object, it first builds a description:

- What class to instantiate
- What dependencies are required
- What scope it belongs to
- How it should be initialized

This description is called a **BeanDefinition**.

Spring works in two phases:

1. **Analyze and register definitions**
2. **Create objects based on definitions**

Understanding this separation explains many Spring behaviors later.

---

## 7. Application Context: The Real Container

Spring’s core runtime is the **ApplicationContext**.

It is responsible for:

- Holding all BeanDefinitions
- Creating beans on demand or eagerly
- Managing lifecycle callbacks
- Publishing application events

In practice:

> The ApplicationContext is the running Spring application.

Everything else plugs into it.

---

## 8. Lifecycle Awareness: Objects Can React to the Container

Some objects need to know *where they live*.

Spring allows beans to:

- Be aware of their name
- Access the ApplicationContext
- React after all dependencies are set

This is done through **callback interfaces** and lifecycle hooks.

The key idea:

> Spring is not just a factory — it is an environment.

---

## 9. Why Proxies Exist in Spring

Certain features require behavior *around* method calls:

- Transactions
- Logging
- Security

Spring solves this by **wrapping beans** instead of modifying them.

These wrappers are called **proxies**.

Important consequence:

> The object you inject may not be the original class, but a controlled wrapper.

This design keeps business code clean while enabling cross‑cutting behavior.

---

## 10. Configuration: Declaring Intent, Not Process

Spring favors **declaration over execution**.

You declare:

- What components exist
- How they relate
- Under what conditions they apply

Spring decides:

- When to create them
- In what order
- Whether to create them at all

This philosophy enables flexibility without sacrificing structure.

---

## 11. Where Spring Boot Fits In (Without Taking Over)

Spring Boot does not change Spring’s core ideas.

It builds on them by:

- Pre‑registering common BeanDefinitions
- Adding conditional logic
- Providing sensible defaults

Spring defines **how the system works**.
Spring Boot defines **how fast you get there**.

---

## 12. The Mental Model to Keep

If one idea should remain, it is this:

> Spring is a lifecycle‑driven object container with well‑defined extension points.

Annotations, starters, and configuration files are only *ways to describe intent*.

The container does the rest.

---

## 13. Final Perspective

When reading or debugging Spring code, always ask:

- Is this about **definition time** or **runtime**?
- Is this about **creation**, **wiring**, or **behavior enhancement**?
- Is this Spring core, or a convenience layered on top?

Those questions scale — from simple applications to complex systems.

---

**End of document**

