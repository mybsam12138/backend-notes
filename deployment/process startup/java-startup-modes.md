# Java Application Startup Modes (Linux)

This document summarizes common ways to start a Java application on Linux,
focusing on **foreground**, **background**, and **nohup-based** execution.
It explains how **process lifecycle**, **shell session**, and **environment variables**
behave in each case.

---

## 1. Foreground Startup 

### Command

```bash
java -jar app.jar
```

### Characteristics

- Java process runs in the **foreground**
- Tied to the current **shell session**
- Standard input/output attached to terminal

### Behavior

- Closing the terminal or SSH session:
  - Java process receives `SIGHUP`
  - Process terminates
- Environment variables:
  - Inherited from shell at startup
  - Valid only while the process is running

### Use Case

- Local development
- Debugging
- Short-lived tasks

---

## 2. Background Startup Using `&` 

### Command

```bash
java -jar app.jar &
```

### Characteristics

- Java process runs in the **background**
- Still a child process of the shell
- Output still associated with the terminal

### Behavior

- Closing the terminal or SSH session:
  - Java process usually receives `SIGHUP`
  - Process often terminates unless handled explicitly
- Environment variables:
  - Inherited at startup
  - Not affected by shell exit, but process may die

### Use Case

- Temporary background execution
- Not recommended for production

---

## 3. Background Startup Using `nohup` 

### Command

```bash
nohup java -jar app.jar &
```

or with inline environment variable:

```bash
SPRING_PROFILES_ACTIVE=prod nohup java -jar app.jar &
```

### Characteristics

- Java process is **detached from shell session**
- Ignores `SIGHUP`
- Output redirected to `nohup.out` by default

### Behavior

- Closing terminal or SSH session:
  - Java process continues running
- Environment variables:
  - Captured at process start
  - Remain effective for the lifetime of the process

### Use Case

- Simple production deployments
- Servers without process managers
- Quick-and-dirty long-running services

---

## 4. Comparison Table

| Mode        | Shell Session Required | Survives Logout | Production Ready |
|------------|------------------------|-----------------|------------------|
| Foreground | Yes                    | No              | No               |
| `&`        | Yes                    | Usually No      | No               |
| `nohup`    | No                     | Yes             | Limited          |

---

## 5. Key Takeaways

- Environment variables are copied **at process creation time**
- Java does **not** depend on shell session after startup
- Process survival depends on **signal handling**, not variables
- For production-grade systems, prefer:
  - `systemd`
  - Docker
  - Kubernetes

---

## 6. Recommended Production Alternatives

- **systemd service**
- **Docker container**
- **Kubernetes Pod**

These solutions manage process lifecycle, logging, restart, and environment
in a more reliable and observable way.
