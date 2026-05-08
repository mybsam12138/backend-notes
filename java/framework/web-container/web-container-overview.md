# Web Container Overview

## What is a Web Container?

A **web container** (also called a **servlet container**) is a runtime environment that:
- Receives HTTP requests
- Routes them to the correct handler (Servlet)
- Returns HTTP responses

> It is the bridge between the **network** and your **application code**.

---

## The Core Job

```
Client (Browser)
      ↓  HTTP Request
Web Container
      ↓  routes to
Your Application Code (Servlet / Controller)
      ↓  returns response
Web Container
      ↓  HTTP Response
Client (Browser)
```

Without a web container, your Java code has no way to receive HTTP requests.

---

## What a Web Container Manages

| Responsibility | Description |
|---|---|
| **HTTP parsing** | Reads raw HTTP request, converts to `HttpServletRequest` object |
| **Thread management** | Creates a thread per request to handle concurrency |
| **Servlet lifecycle** | Creates, initializes, and destroys Servlets |
| **Session management** | Manages `HttpSession` for stateful interactions |
| **URL mapping** | Routes incoming URL to the correct Servlet |
| **Response writing** | Converts your response back to raw HTTP |

---

## Servlet — The Core Unit

A **Servlet** is a Java class that handles HTTP requests. The web container calls it.

```java
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.getWriter().write("Hello World");
    }
}
```

The web container:
1. Receives HTTP GET request
2. Finds the matching Servlet
3. Calls `doGet()`
4. Sends the response back

---

## Servlet Lifecycle

The web container fully controls the Servlet lifecycle:

```
Container starts
      ↓
init()       ← called once, Servlet is created
      ↓
service()    ← called on every request (routes to doGet, doPost, etc.)
      ↓
destroy()    ← called once, when container shuts down
```

---

## Common Web Containers

| Container | Description |
|---|---|
| **Tomcat** | Most popular, default in Spring Boot |
| **Jetty** | Lightweight, good for embedded use |
| **Undertow** | High performance, used in WildFly |
| **GlassFish** | Full Java EE server |
| **WildFly** | Full Java EE server (formerly JBoss) |

---

## Web Container vs Application Server

| | Web Container | Application Server |
|---|---|---|
| **Handles** | HTTP / Servlets only | HTTP + EJB + JMS + JTA + more |
| **Weight** | Lightweight | Heavy |
| **Example** | Tomcat, Jetty | WildFly, GlassFish |
| **Use case** | Most web apps | Enterprise Java EE apps |

> Spring Boot apps typically only need a **web container** — not a full application server.

---

## How Spring Boot Uses It

Before Spring Boot, you had to:
1. Install Tomcat separately
2. Build a WAR file
3. Deploy WAR to Tomcat
4. Start Tomcat

With Spring Boot:
```
Tomcat is embedded inside your JAR
        ↓
java -jar app.jar
        ↓
Tomcat starts automatically
        ↓
Your app is running
```

Spring Boot registers a single **`DispatcherServlet`** into the embedded container, which routes all requests to your `@Controller` classes.

---

## The Full Picture with Spring Boot

```
HTTP Request
      ↓
Tomcat (Web Container)   ← receives and parses request
      ↓
DispatcherServlet        ← Spring's front controller (one Servlet)
      ↓
@Controller / @RestController  ← your code
      ↓
Response
      ↓
Tomcat                   ← writes HTTP response back to client
```

---

## Summary

| Concept | Description |
|---|---|
| **Web Container** | Runtime that receives HTTP and routes to Servlets |
| **Servlet** | Java class that handles a specific HTTP request |
| **Servlet Lifecycle** | `init()` → `service()` → `destroy()` |
| **Tomcat** | Most common web container, embedded in Spring Boot |
| **DispatcherServlet** | Spring's single Servlet that routes to your controllers |
