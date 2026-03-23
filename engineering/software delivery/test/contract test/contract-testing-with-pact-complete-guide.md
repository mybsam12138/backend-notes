
# Contract Testing in Microservices (Pact) – Complete Guide

## 1. What is Contract Testing?

Contract testing ensures that two microservices agree on the structure of their API communication.

In microservices, there is no shared compiler across services. A breaking change in one service can silently break another service.

Pact acts as a compatibility verifier between services before deployment.

It does NOT:
- Run in production
- Intercept runtime traffic
- Replace integration tests

It DOES:
- Verify API compatibility during CI
- Enforce consumer-defined expectations
- Prevent breaking changes

---

## 2. Example Architecture

We use:

- Order Service (Consumer)
- Payment Service (Provider)

Order calls Payment via HTTP:

POST /payments

Expected Response:

{
  "paymentId": "pay-001",
  "status": "SUCCESS"
}

---

## 3. Workflow Overview

Step 1 – Consumer (Order) Generates Pact File

Order runs consumer contract tests.
Pact:
- Starts a mock HTTP server
- Verifies request structure
- Returns predefined response
- Generates pact JSON file

Example output:

target/pacts/orderService-paymentService.json

This file becomes the contract.

---

Step 2 – Pact File is Shared

Option A – Commit JSON file (small teams)

Option B – Pact Broker (Recommended)

Example publish command:

pact-broker publish target/pacts \
  --broker-base-url=http://broker \
  --consumer-app-version=1.0.0

---

Step 3 – Provider (Payment) Verifies Contract

Payment CI pipeline:
- Pulls pact file from broker
- Starts real Payment service
- Pact sends real HTTP request
- Verifies actual response matches contract
- Fails build if mismatch

---

## 4. Consumer Side Example (Order Service)

Maven Dependency:

<dependency>
  <groupId>au.com.dius.pact.consumer</groupId>
  <artifactId>junit5</artifactId>
  <version>4.6.10</version>
  <scope>test</scope>
</dependency>

PaymentClient:

public class PaymentClient {

    private final String baseUrl;
    private final RestTemplate restTemplate = new RestTemplate();

    public PaymentClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public PaymentResponse pay(String orderId, double amount) {
        PaymentRequest request = new PaymentRequest(orderId, amount);

        return restTemplate.postForObject(
                baseUrl + "/payments",
                request,
                PaymentResponse.class
        );
    }
}

Consumer Contract Test:

@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "PaymentService", port = "8081")
class OrderPaymentContractTest {

    @Pact(consumer = "OrderService")
    public RequestResponsePact paymentPact(PactDslWithProvider builder) {
        return builder
                .given("Payment service is available")
                .uponReceiving("Create payment request")
                .method("POST")
                .path("/payments")
                .body("{\"orderId\":\"123\",\"amount\":100.50}")
                .willRespondWith()
                .status(200)
                .body("{\"paymentId\":\"pay-001\",\"status\":\"SUCCESS\"}")
                .toPact();
    }

    @Test
    void shouldCallPayment(MockServer mockServer) {
        PaymentClient client = new PaymentClient(mockServer.getUrl());

        PaymentResponse response = client.pay("123", 100.50);

        assertEquals("pay-001", response.getPaymentId());
        assertEquals("SUCCESS", response.getStatus());
    }
}

---

## 5. Provider Side Example (Payment Service)

Maven Dependency:

<dependency>
  <groupId>au.com.dius.pact.provider</groupId>
  <artifactId>junit5</artifactId>
  <version>4.6.10</version>
  <scope>test</scope>
</dependency>

Real Controller:

@RestController
public class PaymentController {

    @PostMapping("/payments")
    public PaymentResponse create(@RequestBody PaymentRequest request) {
        return new PaymentResponse("pay-001", "SUCCESS");
    }
}

Provider Verification Test:

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Provider("PaymentService")
@PactFolder("pacts")
class PaymentContractVerificationTest {

    @LocalServerPort
    int port;

    @BeforeEach
    void before(PactVerificationContext context) {
        context.setTarget(new HttpTestTarget("localhost", port));
    }

    @TestTemplate
    @ExtendWith(PactVerificationInvocationContextProvider.class)
    void verifyPact(PactVerificationContext context) {
        context.verifyInteraction();
    }

    @State("Payment service is available")
    void setupState() {
        // Prepare DB if necessary
    }
}

---

## 6. CI/CD Pipeline Example

Order CI:
1. Run tests
2. Generate pact file
3. Publish to broker

Payment CI:
1. Pull pact file from broker
2. Start Payment service
3. Verify contract
4. Fail build if mismatch

---

## 7. What Contract Testing Protects

Prevents:
- Field renaming
- Type changes
- Removing required fields
- Status code changes

Detects breaking changes BEFORE deployment.

---

## 8. What Contract Testing Does NOT Do

It does NOT:
- Replace unit tests
- Replace integration tests
- Replace end-to-end tests
- Validate business logic correctness

It only verifies API compatibility.

---

## 9. Final Architecture View

Order Service:
- Unit tests
- Integration tests
- Pact consumer tests

Payment Service:
- Unit tests
- Integration tests
- Pact provider verification tests

Pact ensures safe independent deployment in microservice environments.

---

## 10. Key Takeaway

The pact file is:

A consumer-defined API contract that providers must satisfy before deployment.

It acts like a distributed interface compiler for microservices.
