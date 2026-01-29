# Annotation Search Summary (Graph / DFS / BFS)

## 1. Core Idea (One Page)

Annotation resolution in Spring-style AOP is a **graph search problem**.

- **Graph**: Java type hierarchy
- **Nodes**: Class / Interface
- **Edges**:
  - `extends` → superclass
  - `implements` / `extends interface` → interfaces
- **Search strategy**: **DFS**
- **Why not BFS**: semantic priority matters more than distance

Spring does **not** pre-build a graph.
The graph is **generated dynamically** during traversal using reflection.

---

## 2. What Is Searched (Complete Set)

When resolving an annotation on a class or method, the search space includes:

1. The **current element**
2. Its **declared annotations**
3. **Meta-annotations** (annotations on annotations)
4. **Interfaces** (and their parents)
5. **Superclass** (and its hierarchy)
6. Repeated recursively

This forms a **cyclic graph**, not a tree.

---

## 3. Why DFS Is Used

DFS guarantees:
- Closest / most specific semantics win
- Override rules are respected
- Deterministic resolution order

BFS would:
- Mix unrelated hierarchy levels
- Break override expectations
- Return semantically wrong annotations

---

## 4. Unified DFS Pseudocode (Framework-Level)

This pseudocode covers:
- superclass
- interfaces
- meta-annotations
- loop protection

```java
Annotation findAnnotation(Element start, Class<Annotation> targetAnno) {

    Stack<Element> stack = new Stack<>();
    Set<Element> visited = new HashSet<>();

    stack.push(start);

    while (!stack.isEmpty()) {
        Element current = stack.pop();

        if (current == null || visited.contains(current)) {
            continue;
        }
        visited.add(current);

        // 1. Direct annotation check
        if (current.isAnnotatedWith(targetAnno)) {
            return current.getAnnotation(targetAnno);
        }

        // 2. Meta-annotation DFS
        for (Annotation anno : current.getDeclaredAnnotations()) {
            stack.push(anno.annotationType());
        }

        // 3. Type hierarchy DFS
        if (current instanceof Class<?>) {
            Class<?> clazz = (Class<?>) current;

            // interfaces first (semantic priority)
            for (Class<?> iface : clazz.getInterfaces()) {
                stack.push(iface);
            }

            // then superclass
            stack.push(clazz.getSuperclass());
        }
    }

    return null;
}
```

---

## 5. Loop Avoidance (Why It Is Mandatory)

Loops exist because:
- Interfaces extend interfaces
- Meta-annotations can reference each other
- Proxies introduce synthetic types

Rule:
> **Every visited node must be recorded before expanding neighbors**

Without `visited`, DFS or BFS may never terminate.

---

## 6. BFS Comparison (Why It Is Rejected)

BFS would look like:

```java
Queue<Element> queue;
Set<Element> visited;
```

But BFS resolves:
- by *distance*
- not by *semantic meaning*

Therefore:
- ❌ Not used for annotation resolution
- ✅ Only suitable for shortest-path problems

---

## 7. Final Mental Model

> **Java reflection checks one node**  
> **Spring annotation resolution walks the graph (DFS)**

This applies to:
- `@Transactional`
- `@Async`
- `@Cacheable`
- Security / AOP annotations
