# Tool in AI Systems

## 📌 Definition

A **Tool** is:

> A callable function or external capability that an AI (LLM/Agent) can invoke to perform a specific action or retrieve data.

---

## 🧠 Key Characteristics

- Atomic → does one thing well  
- Deterministic → same input → same output  
- Executable → can be called by system (API / code / service)  
- External to LLM → extends AI capability  

---

## 🧩 Role in AI System

Agent (decision)
   ↓
Tool (execution)
   ↓
External system (DB / API / service)

---

## 🏗 Types of Tools

### 1️⃣ API Tool

Call backend service or external API

```java
public class PolicyService {
    public Policy getPolicyById(String policyId) {
        return new Policy(policyId, "Life Insurance", 1200);
    }
}
```

---

### 2️⃣ Database Tool

Retrieve or store structured data

```java
public class PolicyRepository {
    public Policy findById(String policyId) {
        return new Policy(policyId, "Car Insurance", 800);
    }
}
```

---

### 3️⃣ Calculation Tool

Perform computation or logic

```java
public class PremiumCalculator {
    public double calculate(double base, int age) {
        if (age > 50) {
            return base * 1.5;
        }
        return base;
    }
}
```

---

### 4️⃣ Search Tool (RAG-related)

Search documents or vector database

```java
public class DocumentSearchTool {
    public List<String> search(String query) {
        return List.of(
            "Policy covers accidents",
            "Premium depends on age"
        );
    }
}
```

---

### 5️⃣ File Tool

Read or write files

```java
import java.nio.file.*;

public class FileTool {
    public String readFile(String path) throws Exception {
        return Files.readString(Path.of(path));
    }
}
```

---

### 6️⃣ External Integration Tool

Interact with third-party systems

```java
public class EmailTool {
    public void sendEmail(String to, String content) {
        System.out.println("Send email to " + to + ": " + content);
    }
}
```

---

### 7️⃣ System Tool

Interact with system environment

```java
public class SystemTool {
    public String getCurrentTime() {
        return java.time.LocalDateTime.now().toString();
    }
}
```

---

## 🎯 Final Summary

Tool = Atomic executable capability used by AI to interact with systems
