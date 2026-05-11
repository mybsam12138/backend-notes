# Three-Level Utility Framework Summary

## Overview

```
Level 1 — JDK Standard Library     → basics, but verbose and incomplete
Level 2 — Utility Framework         → fills the gaps, cleaner APIs
Level 3 — Company Own Utils         → business rules, team consistency
```

---

## The Three Layers Explained

| Level | Who Provides | Purpose | Limitation |
|---|---|---|---|
| JDK | Oracle / Java | Basic building blocks | Verbose, incomplete for daily tasks |
| Utility Framework | Open source (Apache, Google) | Fill the gaps, cleaner APIs | Generic, no business rules |
| Company Utils | Your team | Unified business-specific behaviour | Must be built and maintained by you |

---

## 1. String Utilities

### Level 1 — JDK
```java
String s = "  hello world  ";
s.trim();                          // "hello world"
s.toUpperCase();                   // "  HELLO WORLD  "
s.replace("world", "java");        // "  hello java  "
s.contains("hello");               // true
String.format("Hi %s", "Alice");   // "Hi Alice"
```

### Level 2 — Apache Commons Lang
```java
StringUtils.isBlank("   ");              // true  (null-safe)
StringUtils.isBlank(null);              // true
StringUtils.capitalize("hello world");  // "Hello world"
StringUtils.truncate("hello world", 5); // "hello"
StringUtils.repeat("ab", 3);           // "ababab"
StringUtils.reverse("hello");          // "olleh"
```

### Level 3 — Company Utils
```java
// Business-specific string rules
CompanyStringUtils.maskPhone("01234567890");     // "012****7890"
CompanyStringUtils.maskEmail("alice@mail.com");  // "ali**@mail.com"
CompanyStringUtils.formatProductCode("abc123");  // "ABC-123" (company format)
CompanyStringUtils.sanitizeInput("<script>xss</script>"); // "" (security rule)
```

---

## 2. Collection / Array Utilities

### Level 1 — JDK
```java
List<Integer> list = Arrays.asList(3, 1, 2);
Collections.sort(list);                        // [1, 2, 3]
Collections.unmodifiableList(list);            // immutable list
list.stream().filter(x -> x > 1).toList();    // [2, 3]
list.stream().map(x -> x * 2).toList();       // [6, 2, 4]
```

### Level 2 — Guava / Apache Commons
```java
// Guava
Lists.partition(list, 3);                     // chunk into batches of 3
Sets.difference(set1, set2);                  // set difference
ImmutableList.of("a", "b", "c");              // immutable list

// Apache Commons
CollectionUtils.isEmpty(list);                // null-safe empty check
CollectionUtils.subtract(list1, list2);       // remove elements
CollectionUtils.union(list1, list2);          // combine unique elements
```

### Level 3 — Company Utils
```java
// Business-specific collection rules
CompanyListUtils.sortByPriority(orders);       // sort by company priority rules
CompanyListUtils.filterActiveUsers(users);     // filter by company "active" definition
CompanyListUtils.paginateForAPI(list, page);   // company standard pagination format
CompanyListUtils.groupByDepartment(employees); // company org structure grouping
```

---

## 3. Date & Time Utilities

### Level 1 — JDK
```java
LocalDate today = LocalDate.now();             // 2026-05-09
LocalDate future = today.plusDays(30);         // 30 days later
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
today.format(fmt);                             // "09/05/2026"
today.isBefore(future);                        // true
```

### Level 2 — Apache Commons Lang
```java
DateUtils.addDays(date, 7);                   // add 7 days
DateUtils.truncate(date, Calendar.MONTH);     // first day of month
DateUtils.isSameDay(date1, date2);            // same day check
DateFormatUtils.format(date, "yyyy-MM-dd");   // format to string
```

### Level 3 — Company Utils
```java
// Business-specific date rules
CompanyDateUtils.isBusinessDay(date);          // excludes weekends + company holidays
CompanyDateUtils.getNextBusinessDay(date);     // next working day
CompanyDateUtils.isWithinFiscalYear(date);     // company fiscal year check
CompanyDateUtils.formatForInvoice(date);       // "May 09, 2026" (company invoice format)
CompanyDateUtils.calculateDeadline(date, 5);   // +5 business days (not calendar days)
```

---

## 4. Type Checking & Validation

### Level 1 — JDK
```java
Objects.isNull(obj);                          // null check
Objects.nonNull(obj);                         // not null check
instanceof check:
  if (obj instanceof String s) { ... }
Integer.parseInt("123");                      // parse string to int
```

### Level 2 — Hibernate Validator / Apache Commons
```java
// Hibernate Validator annotations
@NotNull
@Email
@Size(min = 2, max = 50)
@Pattern(regexp = "^[A-Za-z]+$")

// Apache Commons Validator
EmailValidator.getInstance().isValid("a@b.com");   // true
UrlValidator.getInstance().isValid("https://...");  // true
```

### Level 3 — Company Utils
```java
// Business-specific validation rules
@ValidCompanyEmail        // must be @company.com domain
@ValidProductCode         // must match company SKU format
@ValidEmployeeId          // company employee ID format

CompanyValidator.isValidCustomerId("CUST-123");   // company customer ID format
CompanyValidator.isValidOrderAmount(amount);       // within company allowed range
CompanyValidator.isAllowedFileType(file);          // company allowed file types only
```

---

## 5. Object Utilities

### Level 1 — JDK
```java
Objects.equals(a, b);                         // null-safe equals
Objects.hash(name, age);                      // generate hashCode
Objects.toString(obj, "default");             // null-safe toString
Optional.ofNullable(user)
        .map(User::getAddress)
        .orElse(null);                        // safe nested get
```

### Level 2 — Apache Commons / Javers
```java
// Deep clone
SerializationUtils.clone(user);               // deep copy

// Deep equality
EqualsBuilder.reflectionEquals(u1, u2);       // compare all fields

// Object diffing
Diff diff = javers.compare(before, after);    // what changed?

// BeanUtils
BeanUtils.copyProperties(target, source);     // copy fields
```

### Level 3 — Company Utils
```java
// Business-specific object rules
CompanyObjectUtils.toAuditLog(before, after); // diff + format for audit log
CompanyObjectUtils.sanitize(user);            // remove sensitive fields before logging
CompanyObjectUtils.toPublicDTO(user);         // company standard public response format
CompanyObjectUtils.deepMergeWithRules(a, b);  // merge with company business rules
```

---

## 6. Number & Math Utilities

### Level 1 — JDK
```java
Math.abs(-5);                                 // 5
Math.max(10, 20);                             // 20
Math.min(10, 20);                             // 10
Math.round(3.567);                            // 4
Math.pow(2, 8);                               // 256.0
```

### Level 2 — Apache Commons Math
```java
// Clamping
MathUtils.clamp(150, 0, 100);                // 100

// Number formatting
NumberFormat.getCurrencyInstance(Locale.US)
            .format(1234567.89);             // "$1,234,567.89"

NumberFormat.getPercentInstance()
            .format(0.1234);                 // "12%"

// Safe parse
NumberUtils.toInt("abc", 0);                 // 0 (default, no exception)
NumberUtils.isCreatable("123.45");           // true
```

### Level 3 — Company Utils
```java
// Business-specific number rules
CompanyMoneyUtils.format(1234.5);            // "USD 1,234.50" (company currency format)
CompanyMoneyUtils.roundUp(1234.567);         // 1234.57 (always round up — business rule)
CompanyMoneyUtils.applyTax(amount);          // apply company tax rate
CompanyMoneyUtils.convertCurrency(amount, "USD", "EUR"); // company exchange rate rules
CompanyMathUtils.calculateCommission(sales); // company commission formula
```

---

## 7. Async / Promise Utilities

### Level 1 — JDK
```java
CompletableFuture.supplyAsync(() -> fetchData())
                 .thenApply(data -> process(data))
                 .exceptionally(ex -> fallback());

ExecutorService executor = Executors.newFixedThreadPool(10);
executor.submit(() -> doTask());
```

### Level 2 — Resilience4j / Guava
```java
// Retry logic
RetryConfig config = RetryConfig.custom()
    .maxAttempts(3)
    .waitDuration(Duration.ofMillis(500))
    .build();

Retry retry = Retry.of("fetchData", config);
retry.executeSupplier(() -> fetchFromAPI());

// Rate limiter
RateLimiter limiter = RateLimiter.of("api", config);
limiter.executeSupplier(() -> callExternalAPI());
```

### Level 3 — Company Utils
```java
// Business-specific async rules
CompanyAsyncUtils.retryWithCompanyPolicy(task);  // company standard retry (3x, 1s backoff)
CompanyAsyncUtils.callWithTimeout(task);         // company standard timeout (30s)
CompanyAsyncUtils.executeWithAudit(task);        // run task + auto audit log
CompanyAsyncUtils.batchProcess(list, 100);       // company standard batch size
```

---

## 8. Error Handling Utilities

### Level 1 — JDK
```java
try {
    doSomething();
} catch (Exception e) {
    e.printStackTrace();
    throw new RuntimeException("Something went wrong", e);
}
```

### Level 2 — Apache Commons / Vavr
```java
// Apache Commons
ExceptionUtils.getRootCause(exception);       // get root cause
ExceptionUtils.getStackTrace(exception);      // stack trace as string

// Vavr — functional error handling
Try.of(() -> Integer.parseInt("abc"))
   .getOrElse(0);                            // 0 instead of exception
```

### Level 3 — Company Utils
```java
// Business-specific error handling
throw new CompanyException(ErrorCode.USER_NOT_FOUND, userId);
throw new CompanyException(ErrorCode.INSUFFICIENT_BALANCE, amount);

// Company standard error response format
CompanyErrorHandler.toAPIResponse(exception);
// { "code": "USER_NOT_FOUND", "message": "...", "traceId": "abc-123" }

// Company error logging with context
CompanyLogger.error("Payment failed", exception, Map.of(
    "userId",  userId,
    "orderId", orderId,
    "amount",  amount
));
```

---

## 9. Logging & Debugging Utilities

### Level 1 — JDK
```java
System.out.println("Debug: " + value);
java.util.logging.Logger logger = Logger.getLogger(MyClass.class.getName());
logger.info("Processing started");
```

### Level 2 — SLF4J / Logback
```java
// Structured logging
Logger log = LoggerFactory.getLogger(MyClass.class);
log.info("User logged in: {}", userId);
log.error("Payment failed for order: {}", orderId, exception);
log.debug("Processing {} items", list.size());
```

### Level 3 — Company Utils
```java
// Business-specific logging rules
CompanyLogger.logAPICall(request, response, duration);    // standard API log format
CompanyLogger.logAudit(userId, action, targetId);         // audit trail format
CompanyLogger.logPerformance("checkout", duration);       // performance tracking
CompanyLogger.logBusinessEvent("ORDER_PLACED", orderId);  // business event tracking

// Auto mask sensitive fields
CompanyLogger.info("User data: {}", user);
// logs: "User data: User{name='Alice', email='ali**@mail.com', password='****'}"
```

---

## Full Picture Summary

```
┌─────────────────────────────────────────────────────────┐
│                  Company Own Utils (Level 3)             │
│  Business rules · Team consistency · Domain-specific     │
├─────────────────────────────────────────────────────────┤
│              Utility Framework (Level 2)                 │
│  Apache Commons · Guava · Lodash · Javers · Resilience4j │
├─────────────────────────────────────────────────────────┤
│               JDK Standard Library (Level 1)             │
│     String · Collections · Math · Date · Optional        │
└─────────────────────────────────────────────────────────┘
```

| Category | JDK | Utility Framework | Company Utils |
|---|---|---|---|
| String | `trim()`, `format()` | `isBlank()`, `truncate()` | `maskPhone()`, `formatProductCode()` |
| Collection | `sort()`, `stream()` | `partition()`, `union()` | `sortByPriority()`, `filterActiveUsers()` |
| Date | `LocalDate`, `plusDays()` | `addDays()`, `isSameDay()` | `isBusinessDay()`, `calculateDeadline()` |
| Validation | `instanceof`, `isNull()` | `@Email`, `@NotNull` | `@ValidCompanyEmail`, `@ValidProductCode` |
| Object | `equals()`, `Optional` | `clone()`, `diff()` | `toAuditLog()`, `toPublicDTO()` |
| Number | `Math.round()`, `Math.max()` | `clamp()`, `format()` | `roundUp()`, `applyTax()` |
| Async | `CompletableFuture` | `Retry`, `RateLimiter` | `retryWithCompanyPolicy()` |
| Error | `try/catch` | `getRootCause()` | `CompanyException`, `toAPIResponse()` |
| Logging | `System.out.println` | `log.info()`, `log.error()` | `logAudit()`, `logAPICall()` |

---

## Key Takeaway

> - **JDK** → gives you the raw tools, but verbose and generic
> - **Utility Framework** → cleaner APIs, fills the gaps, saves time
> - **Company Utils** → enforces **your business rules** and ensures the **whole team behaves consistently**
>
> All three levels work **together** — Company Utils is built **on top of** Utility Frameworks, which are built **on top of** JDK.
