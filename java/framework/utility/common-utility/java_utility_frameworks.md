# Common Java Utility Frameworks Cheat Sheet

---

## 1. Object Diffing
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Javers** | `org.javers:javers-core` | Audit logs, track entity changes over time, history comparison |
| **java-object-diff** | `de.danielbechler:java-object-diff` | Deep object comparison, generate diff reports |

---

## 2. String Utils (Trim / Pad / Truncate)
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Apache Commons Lang** | `org.apache.commons:commons-lang3` | Trim, pad, abbreviate, check blank/empty, capitalize |
| **Guava** | `com.google.guava:guava` | Joining, splitting, padding, null-safe string ops |
| **JDK Built-in** | JDK 11+ ✅ | `strip()`, `isBlank()`, `repeat()`, `indent()` |

---

## 3. Path Joining & Normalization
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **java.nio.file.Paths** | JDK built-in ✅ | Join, normalize, resolve, get parent/filename — modern standard |
| **Apache Commons IO** | `commons-io:commons-io` | Extra utils: get extension, force mkdir, wildcard filtering |

---

## 4. MIME Type Detection
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Apache Tika** | `org.apache.tika:tika-core` | Detect from actual file content (not just extension) — most accurate |
| **URLConnection** | JDK built-in ✅ | Quick extension-based detection, no extra dependency |

---

## 5. Retry with Backoff
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Resilience4j** | `io.github.resilience4j:resilience4j-retry` | Production-grade retry, integrates with circuit breaker & timeout |
| **Spring Retry** | `org.springframework.retry:spring-retry` | Spring Boot projects, annotation-based `@Retryable` |
| **Failsafe** | `dev.failsafe:failsafe` | Lightweight, fluent API, no Spring dependency needed |

---

## 6. Debounce & Throttle
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **RxJava** | `io.reactivex.rxjava3:rxjava` | Event streams, search input debounce, scroll throttle |
| **Project Reactor** | `io.projectreactor:reactor-core` | Same as RxJava but fits Spring WebFlux ecosystem |

---

## 7. Timeout Wrapper
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **CompletableFuture** | JDK 9+ built-in ✅ | Simple async timeout with `orTimeout()`, no extra dependency |
| **Resilience4j TimeLimiter** | `io.github.resilience4j:resilience4j-timelimiter` | Combine timeout with retry and circuit breaker in one pipeline |

---

## 8. Parallel / Sequential Execution
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **CompletableFuture** | JDK 8+ built-in ✅ | `allOf`, `anyOf`, async chaining — most common choice |
| **Project Reactor** | `io.projectreactor:reactor-core` | Non-blocking reactive pipelines, backpressure support |
| **ExecutorService** | JDK built-in ✅ | Manual thread pool management, batch job processing |

---

## 9. Sleep Helper
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Thread.sleep()** | JDK built-in ✅ | Simple blocking pause — retry delays, rate limiting, polling |
| **ScheduledExecutorService** | JDK built-in ✅ | Non-blocking delayed/periodic task execution |
| **Awaitility** | `org.awaitility:awaitility` | Tests only — wait for async condition without manual sleep loops |

---

## 10. Custom Error Classes
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Java Built-in** | JDK built-in ✅ | Extend `RuntimeException` for business errors with custom fields |
| **Zalando Problem** | `org.zalando:problem-spring-web` | RFC 7807 standard error format, structured JSON errors for REST APIs |
| **Spring @ResponseStatus** | Spring Web ✅ | Map exception to HTTP status code with a single annotation |

---

## 11. Safe Try/Catch Wrappers
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Vavr** | `io.vavr:vavr` | Functional `Try`, `Either`, `Option` — chain success/failure without try/catch blocks |
| **Custom wrapper** | JDK built-in ✅ | Simple project-specific needs, no extra dependency |

---

## 12. Error Serialization (JSON)
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Jackson** | `com.fasterxml.jackson.core:jackson-databind` | Most popular — serialize errors to JSON for HTTP responses |
| **Gson** | `com.google.code.gson:gson` | Lightweight alternative, simpler setup, less config |

---

## 13. Structured Loggers
| Library | Dependency | Use Case |
|-----------|-----------|---------|
| **SLF4J + Logback** | `ch.qos.logback:logback-classic` | Most popular combo — flexible config, supports MDC |
| **Log4j2** | `org.apache.logging.log4j:log4j-core` | High performance, async logging, better for high-throughput systems |
| **Logstash Encoder** | `net.logstash.logback:logstash-logback-encoder` | Output JSON logs — required when shipping to ELK / Datadog / Splunk |
| **MDC** | SLF4J built-in ✅ | Auto-attach requestId / userId to every log line in a request |

---

## 14. Pretty-Printers
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **Jackson** | `com.fasterxml.jackson.core:jackson-databind` | Pretty-print any object as formatted JSON — good for debug logging |
| **Lombok @ToString** | `org.projectlombok:lombok` | Auto-generate `toString()` at compile time, exclude sensitive fields |
| **Apache Commons Lang** | `org.apache.commons:commons-lang3` | `ReflectionToStringBuilder` — pretty print without modifying the class |

---

## 15. Performance Timers / Benchmarks
| Library | Dependency | Use Case |
|---------|-----------|---------|
| **System.nanoTime()** | JDK built-in ✅ | Quick one-off timing, most accurate for elapsed time |
| **Spring StopWatch** | `org.springframework:spring-core` | Multi-step profiling, prints breakdown per step |
| **Micrometer** | `io.micrometer:micrometer-core` | Production metrics — export to Prometheus, Datadog, CloudWatch |
| **JMH** | `org.openjdk.jmh:jmh-core` | Scientific microbenchmarking — compare algorithms accurately |

---

## Quick Reference

| Utility | Recommended | Alternative |
|---------|------------|-------------|
| Object Diff | Javers | java-object-diff |
| String Utils | Apache Commons Lang | Guava |
| Path Utils | java.nio (built-in) | Apache Commons IO |
| MIME Detection | Apache Tika | URLConnection (built-in) |
| Retry | Resilience4j | Spring Retry / Failsafe |
| Debounce/Throttle | RxJava | Project Reactor |
| Timeout | CompletableFuture (built-in) | Resilience4j TimeLimiter |
| Parallel | CompletableFuture (built-in) | Project Reactor |
| Try Wrapper | Vavr | Custom |
| JSON Serialize | Jackson | Gson |
| Logging | SLF4J + Logback | Log4j2 |
| Pretty Print | Jackson + Lombok | Commons Lang |
| Benchmarks | JMH | Spring StopWatch |
