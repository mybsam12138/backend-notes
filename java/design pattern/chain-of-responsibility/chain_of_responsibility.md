# Chain of Responsibility (CoR) Design Pattern

## 1. What is Chain of Responsibility?

Chain of Responsibility is a behavioral design pattern where a request is passed along a chain of handlers.  
Each handler decides:

- Whether to process the request
- Whether to pass it to the next handler

---

## 2. Core Idea

Instead of:

Client → One big handler ❌

We use:

Client → Handler1 → Handler2 → Handler3 → ...

Each handler:
- Handles part of the logic
- Delegates to the next handler if needed

---

## 3. Classic Structure

```java
abstract class Handler {
    protected Handler next;

    public void setNext(Handler next) {
        this.next = next;
    }

    public void handle(Request request) {
        if (next != null) {
            next.handle(request);
        }
    }
}
```

---

## 4. Key Features

- Loose coupling between handlers
- Flexible ordering
- Easy to add/remove handlers
- Supports early termination

---

## 5. Example: Servlet Filter (Real-world CoR)

### Filter Interface

```java
void doFilter(request, response, FilterChain chain);
```

### Example Filter

```java
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(request, response, chain) {
        System.out.println("Before");

        chain.doFilter(request, response); // pass to next

        System.out.println("After");
    }
}
```

---

## 6. How Filter Implements CoR

- Each Filter = a handler
- FilterChain = manages execution order
- Request flows through filters one by one
- Each filter can:
  - Continue (`chain.doFilter`)
  - Stop (not calling it)

Execution order:

```
FilterA BEFORE
  FilterB BEFORE
    Controller
  FilterB AFTER
FilterA AFTER
```

---

## 7. Why Filter is Different from Classic CoR

| Aspect | Classic CoR | Filter |
|------|------------|--------|
| next pointer | Inside handler | Managed by FilterChain |
| execution | linear | nested (stack-based) |
| after logic | not natural | supported |

---

## 8. Why Not Use a for Loop?

### For Loop Example

```java
for (Handler h : handlers) {
    h.process(request);
}
```

### Problems:

- No natural "after" execution
- Cannot reverse execution order
- Hard to support early termination cleanly
- No nested structure

---

## 9. FilterChain vs for Loop

| Feature | for loop | FilterChain |
|--------|---------|-------------|
| before execution | ✔ | ✔ |
| after execution | ❌ | ✔ |
| execution model | linear | recursive (stack) |
| early termination | manual | natural |
| flexibility | low | high |

---

## 10. Key Insight

> for loop = external control  
> Chain of Responsibility = internal control

---

## 11. Final Summary

Chain of Responsibility allows:

- Decoupled processing steps
- Dynamic execution flow
- Flexible control over request propagation

Servlet Filter is a practical implementation of CoR using a pipeline + nested execution model.
