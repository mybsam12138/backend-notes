# Strategy Design Pattern (Java)

## Overview

The **Strategy Pattern** is a behavioral design pattern that allows you to define a family of algorithms, encapsulate each one, and make them interchangeable.

It lets the algorithm vary independently from the clients that use it.

---

## When to Use

Use Strategy Pattern when:

- You have multiple ways to perform a task
- You want to avoid large `if-else` or `switch` statements
- You want to change behavior at runtime
- You want to follow **Open/Closed Principle**

---

## Core Idea

Instead of:

```java
if (type == "A") {
    // logic A
} else if (type == "B") {
    // logic B
}
```

👉 Use:

- interface (strategy)
- multiple implementations
- context to delegate behavior

---

## Structure

- **Strategy Interface**
- **Concrete Strategies**
- **Context**

---

## Example: Payment Strategy

### 1. Strategy Interface

```java
public interface PaymentStrategy {
    void pay(int amount);
}
```

---

### 2. Concrete Strategies

```java
public class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using Credit Card");
    }
}
```

```java
public class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using PayPal");
    }
}
```

---

### 3. Context

```java
public class PaymentContext {

    private PaymentStrategy strategy;

    public PaymentContext(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void executePayment(int amount) {
        strategy.pay(amount);
    }
}
```

---

### 4. Usage

```java
public class Main {
    public static void main(String[] args) {

        PaymentContext context = new PaymentContext(new CreditCardPayment());
        context.executePayment(100);

        context.setStrategy(new PayPalPayment());
        context.executePayment(200);
    }
}
```

---

## Advantages

- Removes complex conditional logic
- Easy to add new algorithms
- Follows Open/Closed Principle
- Promotes composition over inheritance
- Allows runtime behavior change

---

## Disadvantages

- Increases number of classes
- Client must understand different strategies
- Slight overhead of object creation

---

## Real-World Examples

- Payment methods (Credit Card, PayPal, Crypto)
- Sorting algorithms (QuickSort, MergeSort)
- Compression strategies (ZIP, RAR)
- Discount calculation (VIP, Normal, Seasonal)

---

## Strategy vs If-Else

| Aspect | If-Else | Strategy Pattern |
|--------|--------|------------------|
| Scalability | Poor | Good |
| Maintainability | Hard | Easy |
| Extension | Modify code | Add new class |
| Readability | Decreases | Clear structure |

---

## Strategy vs Factory

- **Strategy** → defines behavior
- **Factory** → creates objects

👉 Often used together

---

## Best Practice

- Combine with **Dependency Injection** (e.g., Spring)
- Use when behavior changes frequently
- Avoid overusing for simple logic

---

## Final Summary

The Strategy Pattern allows you to:

- encapsulate algorithms
- switch behavior at runtime
- eliminate complex conditional logic

It is one of the most practical and commonly used design patterns in real-world systems.
