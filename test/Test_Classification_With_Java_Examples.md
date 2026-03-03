# Software Test Classification (with Java Examples and Purpose)

------------------------------------------------------------------------

# 1. Unit Test

## Purpose

Test the smallest unit of code (usually a single method or class).
Ensure logic correctness in isolation.

## Example

### Production Code

``` java
public class Calculator {

    public int add(int a, int b) {
        return a + b;
    }

    public int divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Cannot divide by zero");
        }
        return a / b;
    }
}
```

### Unit Test (JUnit 5)

``` java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    @Test
    void testAdd() {
        Calculator calculator = new Calculator();
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    void testDivide() {
        Calculator calculator = new Calculator();
        assertEquals(2, calculator.divide(4, 2));
    }

    @Test
    void testDivideByZero() {
        Calculator calculator = new Calculator();
        assertThrows(IllegalArgumentException.class,
                () -> calculator.divide(4, 0));
    }
}
```

------------------------------------------------------------------------

# 2. Integration Test

## Purpose

Test multiple components working together. Verify interaction between
layers (Controller → Service → Repository → DB).

## Example (Spring Boot)

``` java
@SpringBootTest
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Test
    void testCreateUser() {
        User user = userService.createUser("Sam");
        assertNotNull(user.getId());
        assertEquals("Sam", user.getName());
    }
}
```

------------------------------------------------------------------------

# 3. End-to-End (E2E) Test

## Purpose

Test the full system workflow from user perspective. Includes UI,
backend, and database.

## Example (SpringBootTest with WebEnvironment)

``` java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testUserApi() {
        ResponseEntity<User> response =
            restTemplate.postForEntity("/users", "Sam", User.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Sam", response.getBody().getName());
    }
}
```

------------------------------------------------------------------------

# 4. Regression Test

## Purpose

Ensure that new changes do not break existing functionality. Usually
runs automatically in CI pipeline.

Regression tests are often a collection of: - Unit tests - Integration
tests - E2E tests

No special code type --- it's about *when and why* you run them.

------------------------------------------------------------------------

# 5. Performance Test

## Purpose

Measure system performance under load: - Throughput - Response time -
Memory usage

## Example (Simple timing test)

``` java
@Test
void performanceTest() {
    Calculator calculator = new Calculator();
    long start = System.currentTimeMillis();

    for (int i = 0; i < 1_000_000; i++) {
        calculator.add(i, i);
    }

    long end = System.currentTimeMillis();
    System.out.println("Time used: " + (end - start) + " ms");
}
```

(Real-world performance testing uses tools like JMeter or Gatling.)

------------------------------------------------------------------------

# 6. Security Test

## Purpose

Detect vulnerabilities such as: - SQL injection - XSS - Authorization
bypass

## Example (Basic validation test)

``` java
@Test
void testInvalidInput() {
    UserService service = new UserService();

    assertThrows(IllegalArgumentException.class,
            () -> service.createUser(null));
}
```

------------------------------------------------------------------------

# Summary Table

  -----------------------------------------------------------------------------
  Test Type                 Scope                             Purpose
  ------------------------- --------------------------------- -----------------
  Unit Test                 Single method/class               Validate logic
                                                              correctness

  Integration Test          Multiple components               Verify
                                                              collaboration
                                                              between modules

  E2E Test                  Full system                       Validate user
                                                              workflow

  Regression Test           Entire existing system            Prevent breaking
                                                              old features

  Performance Test          System under load                 Measure speed and
                                                              stability

  Security Test             System robustness                 Detect
                                                              vulnerabilities
  -----------------------------------------------------------------------------

------------------------------------------------------------------------

# Key Insight

Testing is layered.

Unit tests ensure correctness. Integration tests ensure collaboration.
E2E tests ensure business workflow. Performance tests ensure
scalability. Security tests ensure protection.

Together they form a complete testing strategy.
